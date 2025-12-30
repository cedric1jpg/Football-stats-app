const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const dataDir = path.join(__dirname, '..', 'data');
const publicParsedDir = path.join(__dirname, '..', 'public', 'parsed');

// Ensure output directory exists
if (!fs.existsSync(publicParsedDir)) {
  fs.mkdirSync(publicParsedDir, { recursive: true });
}

const csvFiles = ['clubs.csv', 'players.csv', 'competitions.csv', 'seasons.csv'];

csvFiles.forEach(file => {
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`File ${file} not found, skipping.`);
    return;
  }

  const csvContent = fs.readFileSync(filePath, 'utf8');
  const parsed = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    console.error(`Errors parsing ${file}:`, parsed.errors);
    return;
  }

  const jsonFile = file.replace('.csv', '.json');
  const jsonPath = path.join(publicParsedDir, jsonFile);
  fs.writeFileSync(jsonPath, JSON.stringify(parsed.data, null, 2));
  console.log(`Parsed ${file} to ${jsonPath}`);
});

console.log('CSV parsing complete.');