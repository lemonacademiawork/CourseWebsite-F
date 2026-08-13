const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const https = require('https');

const routeMapping = {
    'Lemon Academy - Home': 'app/page.tsx',
    'Lemon Academy - Home - Logged In': 'app/home-old/page.tsx', // guessing
    'Explore Courses - Lemon Academy': 'app/courses/page.tsx',
    'Explore Courses - Lemon Academy - Logged In': 'app/courses-old/page.tsx', // guessing
    'The Art of Lippan - Course Details': 'app/courses/lippan-art/page.tsx',
    'The Art of Lippan - Course Learning': 'app/courses/lippan-art/learning/page.tsx', // guessing
    'Lippan Art - Module 1: Introduction': 'app/courses/lippan-art/module-1/page.tsx',
    'Admin Dashboard - Overview': 'app/admin/dashboard/page.tsx',
    'Admin Dashboard - Updated Navigation': 'app/admin/dashboard-alt/page.tsx',
    'Admin - Course Management': 'app/admin/courses/page.tsx',
    'Admin - Course Management - Logged In': 'app/admin/courses-old/page.tsx', // guessing
    'Admin - Student Management': 'app/admin/students/page.tsx',
    'Admin - Student Management - Logged In': 'app/admin/students-old/page.tsx', // guessing
    'Admin - Creative Content Management': 'app/admin/content/page.tsx',
    'Admin - Upload & Schedule Creative': 'app/admin/content/upload/page.tsx',
    'Admin - Review Trainer Application': 'app/admin/applications/review/page.tsx',
    'Admin - Trainer Applications Dashboard': 'app/admin/applications/page.tsx',
    'Admin - Create & Configure Coupon': 'app/admin/coupons/create/page.tsx',
    'Admin - Coupon Management Dashboard': 'app/admin/coupons/page.tsx',
    'Admin - Excel Import Wizard': 'app/admin/import/page.tsx',
    'Admin - Excel Import Wizard - Logged In': 'app/admin/import-old/page.tsx', // guessing
    'Student Dashboard - Welcome': 'app/student/dashboard/page.tsx',
    'Student Dashboard - Become a Trainer Promo': 'app/student/dashboard/promo/page.tsx',
    'Trainer Dashboard - Overview': 'app/trainer/dashboard/page.tsx',
    'Trainer - Course Content Editor': 'app/trainer/editor/page.tsx',
    'Trainer - Course Content Editor - Updated': 'app/trainer/editor-old/page.tsx', // guessing
    'Become a Trainer - Introduction': 'app/trainer/become-a-trainer/page.tsx',
    'Trainer Application - Portfolio Upload': 'app/trainer/application/page.tsx',
    'Community Gallery': 'app/gallery/page.tsx', // guessing
    'Community Gallery - Student Creations': 'app/gallery/student-creations/page.tsx',
    'Lemon Academy Prototype': 'app/prototype/page.tsx'
};

function downloadHtml(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', err => reject(err));
    });
}

async function recover() {
    const rawData = fs.readFileSync('C:/Users/manis/.gemini/antigravity-ide/brain/8deed620-41b3-4285-9576-8971c6c1f02c/.system_generated/steps/513/output.txt', 'utf8');
    const screens = JSON.parse(rawData).screens;

    for (const screen of screens) {
        const title = screen.title;
        const targetPath = routeMapping[title];
        if (!targetPath) {
            console.log(`Missing mapping for: ${title}`);
            continue;
        }

        console.log(`Recovering ${title} -> ${targetPath}`);
        const html = await downloadHtml(screen.htmlCode.downloadUrl);
        
        const $ = cheerio.load(html);
        
        // Remove nav and aside
        $('nav').remove();
        $('aside').remove();

        // Get the inner body content or main content
        let mainContent = $('main').length > 0 ? $('main').html() : $('body').html();
        if (!mainContent) continue;
        
        // Strip md:ml-64 from main if it exists
        // actually since we just took html() of main, we just wrap it in a <main> again
        
        let jsx = `<main className="min-h-screen ${targetPath.includes('/admin') || targetPath.includes('/student') || targetPath.includes('/trainer') ? 'p-margin-mobile md:p-margin-desktop' : ''}">
            ${mainContent}
        </main>`;

        // Convert to JSX
        jsx = jsx
            .replace(/class="/g, 'className="')
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/<br>/g, '<br />')
            .replace(/<hr>/g, '<hr />')
            .replace(/<input([^>]*?[^\/])>/g, '<input$1 />')
            .replace(/<img([^>]*?[^\/])>/g, '<img$1 />')
            .replace(/<path([^>]*?[^\/])>/g, '<path$1 />')
            .replace(/<circle([^>]*?[^\/])>/g, '<circle$1 />')
            .replace(/<rect([^>]*?[^\/])>/g, '<rect$1 />')
            .replace(/<line([^>]*?[^\/])>/g, '<line$1 />')
            .replace(/<polygon([^>]*?[^\/])>/g, '<polygon$1 />')
            .replace(/<polyline([^>]*?[^\/])>/g, '<polyline$1 />')
            .replace(/style="([^"]*)"/g, (match, p1) => {
                const styles = p1.split(';').filter(s => s.trim());
                let jsxStyles = [];
                styles.forEach(s => {
                    let [key, val] = s.split(':');
                    if (key && val) {
                        key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
                        val = val.trim();
                        jsxStyles.push(`${key}: '${val}'`);
                    }
                });
                return `style={{${jsxStyles.join(', ')}}}`;
            });

        // Write file
        const functionName = title.replace(/[^a-zA-Z0-9]/g, '');
        const fullContent = `export default function ${functionName}() {
    return (
        ${jsx}
    );
}`;

        fs.writeFileSync(path.join(__dirname, targetPath), fullContent, 'utf8');
    }
}

recover().then(() => console.log('Recovery complete!'));
