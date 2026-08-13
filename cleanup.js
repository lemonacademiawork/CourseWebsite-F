const fs = require('fs');
const path = require('path');

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fullPath.includes('-old')) {
            console.log('Deleting', fullPath);
            fs.rmSync(fullPath, { recursive: true, force: true });
            continue;
        }
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file === 'page.tsx') {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Fix style quotes: style={{backgroundImage: 'url('https...')'}} -> style={{backgroundImage: "url('https...')"}}
            const styleRegex = /style=\{\{([^}]+)\}\}/g;
            let newContent = content.replace(styleRegex, (match, p1) => {
                let inner = p1.replace(/'url\('([^']+)'\)'/g, '"url(\'$1\')"');
                return `style={{${inner}}}`;
            });
            
            // Fix unclosed br tags with classes
            newContent = newContent.replace(/<br([^>]*?[^\/])>/g, '<br$1 />');
            
            // Fix SVG attributes
            newContent = newContent.replace(/stroke-width/g, 'strokeWidth');
            newContent = newContent.replace(/vector-effect/g, 'vectorEffect');
            newContent = newContent.replace(/stroke-linecap/g, 'strokeLinecap');
            newContent = newContent.replace(/stroke-linejoin/g, 'strokeLinejoin');
            newContent = newContent.replace(/fill-rule/g, 'fillRule');
            newContent = newContent.replace(/clip-rule/g, 'clipRule');

            // Fix fontVariationSettings inside style
            newContent = newContent.replace(/'FILL' 1/g, '"FILL" 1');

            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log('Fixed', fullPath);
            }
        }
    }
}

processDir(path.join(__dirname, 'app'));
