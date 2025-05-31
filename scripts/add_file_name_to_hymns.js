// This script adds a "file_name" property to each hymn in hymns.json based on the hymn's id and name, matching the audio file naming convention.
const fs = require('fs');
const path = require('path');

const hymnsPath = path.join(__dirname, '../data/hymns.json');
const hymns = require(hymnsPath);

function padId(id) {
  return id.toString().padStart(3, '0');
}

function sanitizeName(name) {
  // Remove characters that are not allowed in filenames and normalize spaces/dashes
  return name.replace(/[^a-zA-Z0-9\s\-']/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*\-\s*/g, ' – ')
    .trim();
}

const updatedHymns = hymns.map(hymn => {
  const fileName = `${padId(hymn.id)} – ${sanitizeName(hymn.name)}.mp3`;
  return { ...hymn, file_name: fileName };
});

fs.writeFileSync(hymnsPath, JSON.stringify(updatedHymns, null, 2));
console.log('Added file_name property to each hymn.');
