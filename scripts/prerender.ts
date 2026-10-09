import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { invitations, type InvitationEntry } from '../src/invitations/registry';

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

function renderPage(pageUrl: string, title: string, description: string, ogImageUrl: string) {
  let html = template.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = setMetaContent(html, /(<meta name="description" content=")[^"]*(")/, description);
  html = setMetaContent(html, /(<meta name="robots" content=")[^"]*(")/, 'noindex, nofollow');
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${escapeHtml(pageUrl)}$2`);
  html = setMetaContent(html, /(<meta property="og:title" content=")[^"]*(")/, title);
  html = setMetaContent(html, /(<meta property="og:description" content=")[^"]*(")/, description);
  html = setMetaContent(html, /(<meta property="og:image" content=")[^"]*(")/, ogImageUrl);
  html = setMetaContent(html, /(<meta property="og:url" content=")[^"]*(")/, pageUrl);
  html = setMetaContent(html, /(<meta name="twitter:title" content=")[^"]*(")/, title);
  html = setMetaContent(html, /(<meta name="twitter:description" content=")[^"]*(")/, description);
  html = setMetaContent(html, /(<meta name="twitter:image" content=")[^"]*(")/, ogImageUrl);
  return html;
}

function writePage(relativeDir: string, html: string) {
  const outDir = resolve(distDir, relativeDir);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, 'index.html'), html);
}

let printCards = 0;

for (const [slug, { meta, PrintCard }] of Object.entries<InvitationEntry>(invitations)) {
  const pageUrl = `${siteOrigin}/i/${slug}`;
  const ogImageUrl = `${siteOrigin}${meta.ogImage}`;

  writePage(`i/${slug}`, renderPage(pageUrl, meta.title, meta.description, ogImageUrl));

  if (PrintCard) {
    const title = `Tarjeta impresa — ${meta.title}`;
    writePage(`i/${slug}/tarjeta`, renderPage(`${pageUrl}/tarjeta`, title, meta.description, ogImageUrl));
    printCards++;
  }
}

console.log(
  `Prerendered ${Object.keys(invitations).length} invitation page(s) and ${printCards} print card page(s) with per-invitation meta tags.`,
);
