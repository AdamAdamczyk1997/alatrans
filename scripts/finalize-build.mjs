import { writeFile, rm } from 'node:fs/promises';

const preview = process.env.PREVIEW_NOINDEX === 'true' || ['deploy-preview', 'branch-deploy'].includes(process.env.CONTEXT ?? '');
if (preview) {
  await writeFile('dist/_headers', '/*\n  X-Robots-Tag: noindex, nofollow\n');
  await writeFile('dist/robots.txt', 'User-agent: *\nDisallow: /\n\nSitemap: https://alatrans.pl/sitemap.xml\n');
} else {
  await rm('dist/_headers', { force: true });
}
console.log(`Indeksowanie: ${preview ? 'preview — meta, robots.txt i X-Robots-Tag blokują indeksowanie' : 'produkcja — indeksowanie dozwolone'}.`);
