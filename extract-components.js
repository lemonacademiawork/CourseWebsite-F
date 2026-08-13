const fs = require('fs');
const path = require('path');

function removeTags(content) {
    // We will parse out <nav ... > ... </nav> and <aside ... > ... </aside>
    let newContent = '';
    let i = 0;
    while (i < content.length) {
        if (content.substr(i, 4) === '<nav' || content.substr(i, 6) === '<aside') {
            const tagName = content.substr(i, 4) === '<nav' ? 'nav' : 'aside';
            // find matching closing tag
            let stack = 1;
            let j = i + tagName.length + 1;
            while (j < content.length && stack > 0) {
                if (content.substr(j, tagName.length + 2) === `</${tagName}>`) {
                    stack--;
                    j += tagName.length + 2;
                } else if (content.substr(j, tagName.length + 1) === `<${tagName}`) {
                    // check if it's followed by space or >
                    const nextChar = content[j + tagName.length + 1];
                    if (nextChar === ' ' || nextChar === '>') {
                        stack++;
                    }
                    j++;
                } else {
                    j++;
                }
            }
            // skip the whole block!
            // also skip preceding comment if any
            // Actually, we'll just skip the block. The preceding comment can be stripped separately
            i = j;
        } else {
            newContent += content[i];
            i++;
        }
    }
    
    // Clean up comments like {/* TopNavBar */}
    newContent = newContent.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
    
    return newContent;
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file === 'page.tsx') {
            const content = fs.readFileSync(fullPath, 'utf8');
            const stripped = removeTags(content);
            if (content !== stripped) {
                fs.writeFileSync(fullPath, stripped, 'utf8');
                console.log('Stripped layout from:', fullPath);
            }
        }
    }
}

processDir(path.join(__dirname, 'app'));
