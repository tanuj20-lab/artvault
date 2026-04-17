const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.css') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const originalContent = content;
      
      // Old gold to new gold
      content = content.replace(/rgba\(201,\s*168,\s*76,/g, 'rgba(212, 175, 55,');
      content = content.replace(/#c9a84c/gi, '#d4af37');

      // Old crimson to new plum
      content = content.replace(/rgba\(155,\s*35,\s*53,/g, 'rgba(90, 24, 70,');
      content = content.replace(/#9b2335/gi, '#5a1846');
      
      // Old background to new background, just in case
      content = content.replace(/#07060f/gi, '#050505');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'client', 'src'));
console.log('Finished updating colors across the project.');
