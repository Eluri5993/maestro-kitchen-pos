const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf-8');
const lines = content.split('\n');
const matchLines = lines.filter(l => l.includes('available'));
console.log(matchLines.join('\n'));
