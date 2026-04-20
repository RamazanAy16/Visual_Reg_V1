const fs = require('fs');
const path = require('path');

module.exports = async function globalSetup() {
  const dirs = [
    path.join(__dirname, 'test-results'),
    path.join(__dirname, 'tests', '__snapshots__'),
  ];

  for (const dir of dirs) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }

  console.log('  Onceki test sonuclari temizlendi.\n');
};
