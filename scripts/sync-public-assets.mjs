import { mkdir, readFile, writeFile } from 'node:fs/promises';

// Source files stay outside public/ so Astro can process them independently.
// This explicit list preserves legacy URLs without publishing archived JPGs/cards.
const copies = [
  ...Array.from({ length: 7 }, (_, index) => {
    const file = `laweta_car_${index + 1}.webp`;
    return [`photos/${file}`, `public/photos/${file}`];
  }),
  ['photos/logo.png', 'public/photos/logo.png'],
  ...['16x16', '32x32', '48x48', '64x64', '128x128', '256x256'].map(size => {
    const file = `favicon-${size}.png`;
    return [`favicon/${file}`, `public/favicon/${file}`];
  }),
  ['favicon/favicon.ico', 'public/favicon/favicon.ico'],
];

const projectRoot = new URL('../', import.meta.url);

// Read every source before writing: a missing source fails the hook immediately.
const assets = await Promise.all(copies.map(async ([source, target]) => ({
  target: new URL(target, projectRoot),
  content: await readFile(new URL(source, projectRoot)),
})));

let updated = 0;
for (const { target, content } of assets) {
  const existing = await readFile(target).catch(error => {
    if (error.code !== 'ENOENT') throw error;
    return null;
  });
  if (existing?.equals(content)) continue;
  await mkdir(new URL('./', target), { recursive: true });
  await writeFile(target, content);
  updated++;
}

console.log(`Zasoby publiczne: ${assets.length} zgodnych kopii, ${updated} zapisanych.`);
