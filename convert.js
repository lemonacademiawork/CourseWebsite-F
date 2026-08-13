const fs = require('fs');
const path = require('path');
const https = require('https');

const transcriptPath = path.join(
  'C:', 'Users', 'manis', '.gemini', 'antigravity-ide', 'brain',
  '8deed620-41b3-4285-9576-8971c6c1f02c', '.system_generated', 'logs', 'transcript_full.jsonl'
);

const appDir = path.join(__dirname, 'app');

function toCamelCase(str) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function cleanFilename(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function htmlToReact(html) {
  let jsx = html
    .replace(/class="/g, 'className="')
    .replace(/for="/g, 'htmlFor="')
    .replace(/<!--(.*?)-->/g, '{/*$1*/}')
    .replace(/<br>/g, '<br />')
    .replace(/<hr>/g, '<hr />')
    .replace(/<img([^>]*?[^\/])>/g, '<img$1 />')
    .replace(/<input([^>]*?[^\/])>/g, '<input$1 />')
    .replace(/<link([^>]*?[^\/])>/g, '<link$1 />')
    .replace(/<meta([^>]*?[^\/])>/g, '<meta$1 />')
    .replace(/\bviewbox="/ig, 'viewBox="')
    .replace(/\bpreserveaspectratio="/ig, 'preserveAspectRatio="')
    .replace(/\bonclick="/ig, 'onClick="')
    .replace(/\bchecked="checked"/ig, 'checked={true}')
    .replace(/\bdisabled="disabled"/ig, 'disabled={true}')
    .replace(/\bchecked=""/ig, 'checked={true}')
    .replace(/\bdisabled=""/ig, 'disabled={true}')
    .replace(/\bchecked="true"/ig, 'checked={true}')
    .replace(/\brequired="required"/ig, 'required={true}')
    .replace(/\bmultiple="multiple"/ig, 'multiple={true}')
    .replace(/\bstroke-width="/ig, 'strokeWidth="')
    .replace(/\bstroke-linecap="/ig, 'strokeLinecap="')
    .replace(/\bstroke-linejoin="/ig, 'strokeLinejoin="')
    .replace(/\bfill-rule="/ig, 'fillRule="')
    .replace(/\bclip-rule="/ig, 'clipRule="')
    .replace(/\bx-data="[^"]*"/ig, '')
    .replace(/\b@click="[^"]*"/ig, '')
    .replace(/style="([^"]*)"/g, (match, p1) => {
        // Convert inline styles crudely
        const styles = p1.split(';').filter(Boolean).map(s => {
            const [k, v] = s.split(':').map(x => x.trim());
            if (!k || !v) return '';
            const camelK = k.replace(/-([a-z])/g, g => g[1].toUpperCase());
            return `"${camelK}": "${v.replace(/"/g, "'")}"`;
        }).filter(Boolean).join(',');
        return `style={{${styles}}}`;
    });
    const bodyMatch = jsx.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      jsx = bodyMatch[1];
    }
  return jsx;
}

async function downloadHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync(transcriptPath)) {
    console.error("Transcript not found.");
    return;
  }
  
  if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir, { recursive: true });
  }

  const fileContent = fs.readFileSync(transcriptPath, 'utf8');
  const screens = new Map();

  // The responses might be escaped strings inside the jsonl, so just regex globally
  const regex = /\\"name\\":\\"(projects\/4834601856507706051\/screens\/[^\\"]+)\\".*?\\"title\\":\\"([^\\"]+)\\".*?\\"htmlCode\\":\{\\"name\\":\\"[^\\"]+\\",\\"downloadUrl\\":\\"([^\\"]+)\\"/g;
  
  let match;
  while ((match = regex.exec(fileContent)) !== null) {
    screens.set(match[1], {
      title: match[2],
      url: match[3]
    });
  }
  
  // also try unescaped just in case
  const regex2 = /"name":"(projects\/4834601856507706051\/screens\/[^"]+)".*?"title":"([^"]+)".*?"htmlCode":\{"name":"[^"]+","downloadUrl":"([^"]+)"/g;
  while ((match = regex2.exec(fileContent)) !== null) {
    screens.set(match[1], {
      title: match[2],
      url: match[3]
    });
  }

  console.log(`Found ${screens.size} screens.`);
  let indexLinks = [];

  for (const [name, screen] of screens) {
    console.log(`Processing: ${screen.title}`);
    try {
      const html = await downloadHTML(screen.url);
      const jsx = htmlToReact(html);
      
      const componentName = toCamelCase(cleanFilename(screen.title) || 'Screen');
      const folderName = cleanFilename(screen.title) || 'screen';
      
      const targetDir = path.join(appDir, folderName);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      const pageCode = `export default function ${componentName}() {
  return (
    <div className="min-h-screen">
      ${jsx}
    </div>
  );
}
`;
      fs.writeFileSync(path.join(targetDir, 'page.tsx'), pageCode);
      indexLinks.push(`<li><a href="/${folderName}" style={{color: 'blue', textDecoration: 'underline'}}>${screen.title}</a></li>`);
      
    } catch (err) {
      console.error(`Failed to process ${screen.title}:`, err);
    }
  }

  if (indexLinks.length > 0) {
    const indexCode = `export default function Home() {
  return (
    <div style={{padding: '2rem', fontFamily: 'sans-serif'}}>
      <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem'}}>Lemon Academy Screens</h1>
      <ul>
        ${indexLinks.join('\n        ')}
      </ul>
    </div>
  );
}
`;
    fs.writeFileSync(path.join(appDir, 'page.tsx'), indexCode);
  }
  
  console.log("Done.");
}

main();
