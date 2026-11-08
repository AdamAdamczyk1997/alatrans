import type { APIRoute } from 'astro';
import { navigation, site } from '../data/site';
export const GET: APIRoute = () => new Response(
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['/', ...navigation.map(item => item.href)].map(path => `  <url><loc>${site.url}${path}</loc></url>`).join('\n')}\n</urlset>\n`,
  { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
);
