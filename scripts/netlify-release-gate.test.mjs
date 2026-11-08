import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { delimiter, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryDirectory = fileURLToPath(new URL('../', import.meta.url));
const gatePath = join(repositoryDirectory, 'scripts/netlify-release-gate.mjs');
const artifactsDirectory = join(repositoryDirectory, '.artifacts');
mkdirSync(artifactsDirectory, { recursive: true });
const fixtureDirectory = mkdtempSync(join(artifactsDirectory, 'netlify-release-gate-tests-'));
const binDirectory = join(fixtureDirectory, 'bin');
mkdirSync(binDirectory);

// The fixture records real subprocess arguments and environment without running a build.
writeFileSync(join(binDirectory, 'npm'), `#!${process.execPath}
import { appendFileSync } from 'node:fs';
const args = process.argv.slice(2);
const step = args[0] === 'run' ? args[1] : args[0];
appendFileSync(process.env.ALATRANS_GATE_TEST_LOG, JSON.stringify({
  args,
  cwd: process.cwd(),
  context: process.env.CONTEXT ?? null,
  previewNoindex: process.env.PREVIEW_NOINDEX ?? null,
  sentinel: process.env.ALATRANS_GATE_TEST_SENTINEL,
}) + '\\n');
if (step === process.env.ALATRANS_GATE_TEST_FAIL_STEP) {
  if (process.env.ALATRANS_GATE_TEST_SIGNAL) process.kill(process.pid, 'SIGTERM');
  else process.exit(Number(process.env.ALATRANS_GATE_TEST_EXIT_CODE));
}
`, { mode: 0o755 });

function runGate({ context, previewNoindex, failStep, exitCode, signal, missingNpm = false } = {}) {
  const directory = mkdtempSync(join(fixtureDirectory, 'case-'));
  const logPath = join(directory, 'commands.jsonl');
  const distPath = join(directory, 'dist', 'accepted-output.txt');
  mkdirSync(join(directory, 'dist'));
  writeFileSync(distPath, 'Previously accepted build\n');
  writeFileSync(logPath, '');
  /** @type {NodeJS.ProcessEnv} */
  const env = {
    ...process.env,
    PATH: missingNpm ? directory : `${binDirectory}${delimiter}${process.env.PATH ?? ''}`,
    ALATRANS_GATE_TEST_LOG: logPath,
    ALATRANS_GATE_TEST_SENTINEL: 'preserve-original-environment',
  };
  for (const key of [
    'CONTEXT', 'PREVIEW_NOINDEX', 'ALATRANS_GATE_TEST_FAIL_STEP',
    'ALATRANS_GATE_TEST_EXIT_CODE', 'ALATRANS_GATE_TEST_SIGNAL',
  ]) delete env[key];
  if (context !== undefined) env.CONTEXT = context;
  if (previewNoindex !== undefined) env.PREVIEW_NOINDEX = previewNoindex;
  if (failStep !== undefined) env.ALATRANS_GATE_TEST_FAIL_STEP = failStep;
  if (exitCode !== undefined) env.ALATRANS_GATE_TEST_EXIT_CODE = String(exitCode);
  if (signal) env.ALATRANS_GATE_TEST_SIGNAL = 'true';
  const result = spawnSync(process.execPath, [gatePath], {
    cwd: directory,
    env,
    encoding: 'utf8',
    timeout: 10_000,
  });
  assert.equal(result.error, undefined, result.error?.message);
  assert.equal(result.signal, null, `Gate terminated by ${result.signal}`);
  assert.equal(readFileSync(distPath, 'utf8'), 'Previously accepted build\n');
  const events = readFileSync(logPath, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
  for (const event of events) {
    assert.equal(event.cwd, directory);
    assert.equal(event.context, context ?? null);
    assert.equal(event.previewNoindex, previewNoindex ?? null);
    assert.equal(event.sentinel, 'preserve-original-environment');
  }
  return { ...result, events, output: result.stdout + result.stderr };
}

const productionCommands = [['run', 'check'], ['run', 'build'], ['test']];
const previewCommands = [['run', 'check'], ['run', 'build'], ['test', '--', '--preview']];

describe('Netlify release gate subprocess contract', { skip: process.platform === 'win32' }, () => {
  for (const scenario of [
    { name: 'production with an unset flag', context: 'production' },
    { name: 'production with an explicit false flag', context: 'production', previewNoindex: 'false' },
    { name: 'deploy-preview', context: 'deploy-preview', previewNoindex: 'true' },
    { name: 'branch-deploy', context: 'branch-deploy', previewNoindex: 'true' },
  ]) {
    it(`runs every required command in order for ${scenario.name}`, () => {
      const result = runGate(scenario);
      assert.equal(result.status, 0, result.output);
      const expected = scenario.context === 'production' ? productionCommands : previewCommands;
      assert.deepEqual(result.events.map(event => event.args), expected);
    });
  }

  for (const scenario of [
    { name: 'production with true', context: 'production', previewNoindex: 'true' },
    { name: 'production with an empty flag', context: 'production', previewNoindex: '' },
    { name: 'production with an invalid flag', context: 'production', previewNoindex: 'FALSE' },
    { name: 'deploy-preview without a flag', context: 'deploy-preview' },
    { name: 'deploy-preview with false', context: 'deploy-preview', previewNoindex: 'false' },
    { name: 'deploy-preview with an empty flag', context: 'deploy-preview', previewNoindex: '' },
    { name: 'deploy-preview with an invalid flag', context: 'deploy-preview', previewNoindex: 'TRUE' },
    { name: 'branch-deploy without a flag', context: 'branch-deploy' },
    { name: 'branch-deploy with false', context: 'branch-deploy', previewNoindex: 'false' },
    { name: 'branch-deploy with an invalid flag', context: 'branch-deploy', previewNoindex: 'TRUE' },
    { name: 'an unset context' },
    { name: 'an unset context with a preview flag', previewNoindex: 'true' },
    { name: 'an empty context', context: '' },
    { name: 'an unknown context', context: 'unexpected', previewNoindex: 'true' },
    { name: 'the unsupported dev context', context: 'dev', previewNoindex: 'true' },
  ]) {
    it(`rejects ${scenario.name} before running any command`, () => {
      const result = runGate(scenario);
      assert.notEqual(result.status, 0, result.output);
      assert.match(result.output, /CONTEXT|PREVIEW_NOINDEX/, 'Expected a configuration diagnostic');
      assert.deepEqual(result.events, []);
    });
  }

  for (const [index, step, exitCode] of [[0, 'check', 17], [1, 'build', 23], [2, 'test', 31]]) {
    it(`propagates the ${step} exit code and stops subsequent commands`, () => {
      const result = runGate({ context: 'production', failStep: step, exitCode });
      assert.equal(result.status, exitCode, result.output);
      assert.deepEqual(result.events.map(event => event.args), productionCommands.slice(0, index + 1));
    });
  }

  it('rejects a child process terminated by a signal and stops subsequent commands', () => {
    const result = runGate({ context: 'production', failStep: 'check', signal: true });
    assert.notEqual(result.status, 0, result.output);
    assert.deepEqual(result.events.map(event => event.args), [['run', 'check']]);
    assert.match(result.output, /SIGTERM|signal/i);
  });

  it('fails when npm cannot be started', () => {
    const result = runGate({ context: 'production', missingNpm: true });
    assert.notEqual(result.status, 0, result.output);
    assert.deepEqual(result.events, []);
    assert.match(result.output, /npm|ENOENT/);
  });
});
