const fs = require('fs');
const path = require('path');

function fix(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fix(fullPath);
        } else if (file === 'page.tsx') {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            
            content = content.replace(/rows="(\d+)"/gi, 'rows={$1}');
            content = content.replace(/maxlength="(\d+)"/gi, 'maxLength={$1}');
            content = content.replace(/onClick="[^"]*"/gi, 'onClick={() => {}}');
            content = content.replace(/selected=""/gi, 'selected={true}');
            content = content.replace(/checked="true"/gi, 'checked={true}');
            content = content.replace(/disabled="true"/gi, 'disabled={true}');
            content = content.replace(/checked="false"/gi, 'checked={false}');
            content = content.replace(/required="required"/gi, 'required={true}');
            content = content.replace(/required="true"/gi, 'required={true}');

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed', fullPath);
            }
        }
    }
}

fix(path.join(__dirname, 'app'));
