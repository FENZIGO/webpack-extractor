const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("Usage: node extract.js <source-map-file.js.map>");
  process.exit(1);
}

const mapFile = args[0];

const map = JSON.parse(fs.readFileSync(mapFile, 'utf8'));

if (!map.sources || !map.sourcesContent) {
  console.error("This source map does not contain embedded sourcesContent.");
  process.exit(1);
}

map.sources.forEach((src, i) => {
  const content = map.sourcesContent[i];
  if (!content) return;

  let filePath = src.replace(/^webpack:\/\//, '');
  if (filePath.startsWith('/')) filePath = filePath.slice(1);

  const outPath = path.join('extracted_sources', filePath);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content, 'utf8');

  console.log(`Extracted: ${outPath}`);
});
