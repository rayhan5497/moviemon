import fs from 'fs';
import path from 'path';
import process from 'process';

const siteUrl = process.env.VITE_SITE_URL || 'https://moviemon.netlify.app';
const routes = [
  '/landing',
  '/',
  '/privacy',
  '/terms',
  '/agreements',
  '/search',
  '/discover/movie',
  '/discover/tv',
  '/trending/all/day',
  '/movie/popular',
  '/tv/popular',
];

const now = new Date().toISOString().split('T')[0];
const urlset = routes
  .map((route) => {
    const loc = `${siteUrl}${route}`;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${
      route === '/landing' ? '1.0' : '0.7'
    }</priority>\n  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`;

const outputPath = path.resolve(process.cwd(), 'dist', 'sitemap.xml');
fs.writeFileSync(outputPath, xml, 'utf8');
console.log(`Generated sitemap: ${outputPath}`);
