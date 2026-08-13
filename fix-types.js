const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const original = content;

    // Fix boolean attributes: checked="checked" -> checked
    // Also disabled="disabled", selected="selected", required="required", readOnly="readOnly", multiple="multiple"
    const boolAttrs = ['checked', 'disabled', 'selected', 'required', 'readOnly', 'multiple', 'autoFocus', 'autoPlay', 'controls', 'loop', 'muted', 'open', 'hidden'];
    for (const attr of boolAttrs) {
        // Replace attr="attr" or attr="true" with just attr
        const regex = new RegExp(`\\b${attr}="${attr}"`, 'g');
        content = content.replace(regex, attr);
        const regex2 = new RegExp(`\\b${attr}="true"`, 'g');
        content = content.replace(regex2, attr);
    }

    // Fix numeric attributes that should be {number} not "number"
    // rows="5" -> rows={5}, cols="10" -> cols={10}, etc.
    const numAttrs = ['rows', 'cols', 'rowSpan', 'colSpan', 'size', 'maxLength', 'minLength', 'tabIndex', 'span', 'start'];
    for (const attr of numAttrs) {
        const regex = new RegExp(`\\b${attr}="(\\d+)"`, 'g');
        content = content.replace(regex, `${attr}={$1}`);
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed:', filePath);
        return true;
    }
    return false;
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.tsx')) {
            fixFile(fullPath);
        }
    }
}

processDir(path.join(__dirname, 'app'));
console.log('Done fixing TypeScript type errors');
