// Build script: genereert per taal een statische pagina uit template.html + locales/*.json
// Gebruik: node build.js  ->  output in dist/
const fs = require('fs');
const path = require('path');

const CANON = 'https://dekrachtvanouwehoeren.nl';
const LOCALES = ['nl', 'en', 'de', 'fr', 'es'];

const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
const locales = {};
for (const l of LOCALES) {
  locales[l] = JSON.parse(fs.readFileSync(path.join(__dirname, 'locales', l + '.json'), 'utf8'));
}

function get(obj, dotPath) {
  return dotPath.split('.').reduce((o, k) => (o === undefined || o === null) ? undefined : o[k], obj);
}

function hreflangTags() {
  const lines = LOCALES.map(l => `<link rel="alternate" hreflang="${l}" href="${CANON}${locales[l].dir}">`);
  lines.push(`<link rel="alternate" hreflang="x-default" href="${CANON}/">`);
  return lines.join('\n');
}

function langSwitcher(current) {
  return LOCALES.map(l =>
    `<a href="${locales[l].dir}"${l === current ? ' class="cur"' : ''}>${locales[l].short}</a>`
  ).join('');
}

fs.rmSync(path.join(__dirname, 'dist'), { recursive: true, force: true });

for (const l of LOCALES) {
  const loc = locales[l];
  let html = template;
  html = html.replace(/\{\{DATA_JSON\}\}/g, JSON.stringify(loc.data));
  html = html.replace(/\{\{LANG_PATH_JSON\}\}/g, JSON.stringify(loc.dir));
  html = html.replace(/\{\{hreflangTags\}\}/g, hreflangTags());
  html = html.replace(/\{\{langSwitcher\}\}/g, langSwitcher(l));
  html = html.replace(/\{\{canonUrl\}\}/g, CANON + loc.dir);
  html = html.replace(/\{\{lang\}\}/g, loc.lang);
  html = html.replace(/\{\{([\w.]+)\}\}/g, (m, p) => {
    const v = get(loc, p);
    if (v === undefined) { throw new Error(`Ontbrekende sleutel "${p}" in locale "${l}"`); }
    return v;
  });
  const outDir = path.join(__dirname, 'dist', loc.dir === '/' ? '' : loc.dir);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  console.log(`gebouwd: ${loc.dir} (${(html.length / 1024).toFixed(1)} kB)`);
}
console.log('Klaar.');
