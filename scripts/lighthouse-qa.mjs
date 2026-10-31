import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';

const url = process.env.QA_URL || 'http://127.0.0.1:4321/';
const port = Number(process.env.LIGHTHOUSE_PORT || 9223);
const browser = await chromium.launch({ headless: true, args: [`--remote-debugging-port=${port}`] });
try {
  const results = [];
  for (let run = 1; run <= 3; run++) {
    const { lhr } = await lighthouse(url, { port, output: 'json', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], logLevel: 'error' });
    const result = {
      run, lighthouseVersion: lhr.lighthouseVersion, fetchTime: lhr.fetchTime,
      userAgent: lhr.userAgent, environment: lhr.environment, settings: lhr.configSettings,
      categories: Object.fromEntries(Object.entries(lhr.categories).map(([key, value]) => [key, value.score])),
      metrics: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time', 'speed-index'].map(key => [key, { value: lhr.audits[key].numericValue, display: lhr.audits[key].displayValue }])),
      failedAudits: Object.entries(lhr.audits).filter(([, audit]) => audit.score !== null && audit.score < 1).map(([id, audit]) => ({ id, title: audit.title, score: audit.score, description: audit.description })),
    };
    results.push(result);
    console.log(`Lighthouse mobile ${run}: ${JSON.stringify(result.categories)}`);
  }
  writeFileSync('docs/qa-lighthouse.json', `${JSON.stringify({ target: url, method: '3 sequential mobile simulated-throttling runs, local static Astro preview; no concurrent browser QA; laboratory data, not field CWV or measured INP', results }, null, 2)}\n`);
  assert(results.every(result => result.categories.performance >= .9 && result.categories.accessibility >= .9), 'Cel audytowy: Performance i Accessibility >=90 w każdym z 3 przebiegów. Sprawdź raport i obciążenie hosta.');
} finally {
  await browser.close();
}
