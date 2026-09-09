import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { invitations } from '../src/invitations/registry';

const distDir = resolve(import.meta.dirname, '../dist');
const template = readFileSync(resolve(distDir, 'index.html'), 'utf-8');

const ogUrlMatch = template.match(/<meta property="og:url" content="([^"]*)"/);
const siteOrigin = new URL(ogUrlMatch?.[1] ?? 'https://convite.smsoluciones.online/').origin;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setMetaContent(html: string, selector: RegExp, content: string) {
  return html.replace(selector, `$1${escapeHtml(content)}$2`);
}

for (const [slug, { meta }] of Object.entries(invitations)) {
  const pageUrl = `${siteOrigin}/i/${slug}`;
  const ogImageUrl = `${siteOrigin}${meta.ogImage}`;

  let html = template.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  html = setMetaContent(html, /(<meta name="description" content=")[^"]*(")/, meta.description);
  html = setMetaContent(html, /(<meta name="robots" content=")[^"]*(")/, 'noindex, nofollow');
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${escapeHtml(pageUrl)}$2`);
  html = setMetaContent(html, /(<meta property="og:title" content=")[^"]*(")/, meta.title);
  html = setMetaContent(html, /(<meta property="og:description" content=")[^"]*(")/, meta.description);
  html = setMetaContent(html, /(<meta property="og:image" content=")[^"]*(")/, ogImageUrl);
  html = setMetaContent(html, /(<meta property="og:url" content=")[^"]*(")/, pageUrl);
  html = setMetaContent(html, /(<meta name="twitter:title" content=")[^"]*(")/, meta.title);
  html = setMetaContent(html, /(<meta name="twitter:description" content=")[^"]*(")/, meta.description);
  html = setMetaContent(html, /(<meta name="twitter:image" content=")[^"]*(")/, ogImageUrl);

  const outDir = resolve(distDir, 'i', slug);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, 'index.html'), html);
}

console.log(`Prerendered ${Object.keys(invitations).length} invitation page(s) with per-invitation meta tags.`);
