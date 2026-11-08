import { spawnSync } from 'node:child_process';
import { constants } from 'node:os';

function refuse(message, code = 1) {
  console.error(`[release-gate] ${message}`);
  return code;
}

function releaseGate() {
  const { CONTEXT: context, PREVIEW_NOINDEX: previewNoindex } = process.env;
  let preview;

  switch (context) {
    case 'production':
      if (previewNoindex !== undefined && previewNoindex !== 'false') {
        return refuse('CONTEXT=production requires PREVIEW_NOINDEX to be unset or exactly "false".');
      }
      preview = false;
      break;
    case 'deploy-preview':
    case 'branch-deploy':
      if (previewNoindex !== 'true') {
        return refuse(`CONTEXT=${context} requires PREVIEW_NOINDEX="true".`);
      }
      preview = true;
      break;
    default:
      return refuse('Missing or unsupported CONTEXT. Expected production, deploy-preview or branch-deploy.');
  }

  const commands = [
    ['run', 'check'],
    ['run', 'build'],
    preview ? ['test', '--', '--preview'] : ['test'],
  ];

  for (const args of commands) {
    const command = `npm ${args.join(' ')}`;
    console.log(`[release-gate] ${command}`);
    const result = spawnSync('npm', args, { stdio: 'inherit', env: process.env });

    if (result.error) {
      return refuse(`Cannot start ${command}: ${result.error.message}`);
    }
    if (result.signal) {
      const signalNumber = constants.signals[result.signal];
      return refuse(`${command} terminated by ${result.signal}.`, signalNumber ? 128 + signalNumber : 1);
    }
    if (result.status !== 0) {
      return refuse(`${command} failed with exit code ${result.status ?? 'unknown'}.`, result.status ?? 1);
    }
  }

  console.log(`[release-gate] PASS: ${context}, check, build and ${preview ? 'preview' : 'production'} contracts.`);
  return 0;
}

process.exitCode = releaseGate();
