const fs = require('fs');
const path = require('path');

const boolAttrs = ['checked', 'disabled', 'selected', 'required', 'readOnly', 'multiple', 'autoFocus', 'autoPlay', 'controls', 'loop', 'muted', 'open', 'hidden'];

function fixDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixDir(fullPath);
        } else if (file.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const original = content;
            
            for (const attr of boolAttrs) {
                // Fix attr="" (empty string)
                content = content.replace(new RegExp(' ' + attr + '=""', 'g'), ' ' + attr);
                // Fix attr="attr" (e.g. checked="checked")
                content = content.replace(new RegExp(' ' + attr + '="' + attr + '"', 'g'), ' ' + attr);
            }
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed:', fullPath);
            }
        }
    }
}

fixDir(path.join(__dirname, 'app'));
console.log('Done');
