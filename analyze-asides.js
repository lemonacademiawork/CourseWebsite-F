const fs = require('fs');
const cheerio = require('cheerio');
const https = require('https');

const rawData = fs.readFileSync(
    'C:/Users/manis/.gemini/antigravity-ide/brain/8deed620-41b3-4285-9576-8971c6c1f02c/.system_generated/steps/733/output.txt',
    'utf8'
);
const screens = JSON.parse(rawData).screens;

function getHtml(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', err => reject(err));
    });
}

async function analyze() {
    for (const screen of screens) {
        if (!screen.htmlCode || !screen.htmlCode.downloadUrl) continue;
        const html = await getHtml(screen.htmlCode.downloadUrl);
        const $ = cheerio.load(html);
        const asides = $('aside');
        if (asides.length > 0) {
            asides.each((i, el) => {
                const className = $(el).attr('class') || '';
                const text = $(el).text().substring(0, 150).replace(/\s+/g, ' ');
                console.log(`SCREEN: "${screen.title}"`);
                console.log(`  ASIDE class: "${className}"`);
                console.log(`  ASIDE text: "${text}"\n`);
            });
        }
    }
}

analyze();
