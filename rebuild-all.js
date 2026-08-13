const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const https = require('https');

// Map Stitch screen titles to route files
const routeMapping = {
    'Lemon Academy - Home': 'app/page.tsx',
    'Explore Courses - Lemon Academy': 'app/courses/page.tsx',
    'The Art of Lippan - Course Details': 'app/courses/lippan-art/page.tsx',
    'Lippan Art - Module 1: Introduction': 'app/courses/lippan-art/module-1/page.tsx',
    'Admin Dashboard - Overview': 'app/admin/dashboard/page.tsx',
    'Admin Dashboard - Updated Navigation': 'app/admin/dashboard-alt/page.tsx',
    'Admin - Course Management': 'app/admin/courses/page.tsx',
    'Admin - Student Management': 'app/admin/students/page.tsx',
    'Admin - Creative Content Management': 'app/admin/content/page.tsx',
    'Admin - Upload & Schedule Creative': 'app/admin/content/upload/page.tsx',
    'Admin - Review Trainer Application': 'app/admin/applications/review/page.tsx',
    'Admin - Trainer Applications Dashboard': 'app/admin/applications/page.tsx',
    'Admin - Create & Configure Coupon': 'app/admin/coupons/create/page.tsx',
    'Admin - Coupon Management Dashboard': 'app/admin/coupons/page.tsx',
    'Admin - Excel Import Wizard': 'app/admin/import/page.tsx',
    'Student Dashboard - Welcome': 'app/student/dashboard/page.tsx',
    'Student Dashboard - Become a Trainer Promo': 'app/student/dashboard/promo/page.tsx',
    'Trainer Dashboard - Overview': 'app/trainer/dashboard/page.tsx',
    'Trainer - Course Content Editor': 'app/trainer/editor/page.tsx',
    'Become a Trainer - Introduction': 'app/trainer/become-a-trainer/page.tsx',
    'Trainer Application - Portfolio Upload': 'app/trainer/application/page.tsx',
    'Community Gallery - Student Creations': 'app/gallery/student-creations/page.tsx',
    'Lemon Academy Prototype': 'app/prototype/page.tsx'
};

// Files that need "use client" because they have interactive elements
const needsUseClient = new Set([
    'app/admin/content/upload/page.tsx',
    'app/admin/coupons/create/page.tsx',
    'app/trainer/editor/page.tsx',
    'app/trainer/application/page.tsx'
]);

function downloadHtml(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', err => reject(err));
    });
}

function htmlToJsx(html) {
    // Use cheerio to parse and extract just the <main> content (no nav/aside)
    const $ = cheerio.load(html);
    $('nav').remove();
    // Only remove asides that are side navigation sidebars (not filters/content asides)
    $('aside').not('.flex-shrink-0').remove();

    // Get the body content
    let bodyHtml = $('body').html() || '';
    
    // If there's a <main>, just get the main content
    const $main = $('main');
    let mainHtml;
    if ($main.length > 0) {
        mainHtml = $.html($main);
    } else {
        mainHtml = `<main>${bodyHtml}</main>`;
    }

    let jsx = mainHtml;

    // === HTML attribute to JSX conversions ===
    jsx = jsx.replace(/\bclass="/g, 'className="');
    jsx = jsx.replace(/\bfor="/g, 'htmlFor="');
    jsx = jsx.replace(/\btabindex="/g, 'tabIndex="');
    jsx = jsx.replace(/\bmaxlength="/g, 'maxLength="');
    jsx = jsx.replace(/\bminlength="/g, 'minLength="');
    jsx = jsx.replace(/\breadonly/g, 'readOnly');
    jsx = jsx.replace(/\bautocomplete="/g, 'autoComplete="');
    jsx = jsx.replace(/\bautofocus/g, 'autoFocus');
    jsx = jsx.replace(/\bcrossorigin="/g, 'crossOrigin="');

    // Remove HTML comments
    jsx = jsx.replace(/<!--[\s\S]*?-->/g, '');

    // === Self-closing void tags ===
    // Handle input, img, br, hr etc with or without attributes
    jsx = jsx.replace(/<(input|img|br|hr|source|embed|track|wbr|area|col)(\s[^>]*?)\s*(?<!\/)>/gi, '<$1$2 />');
    // Also handle plain tags
    jsx = jsx.replace(/<br\s*>/gi, '<br />');
    jsx = jsx.replace(/<hr\s*>/gi, '<hr />');

    // === SVG attribute conversions ===
    jsx = jsx.replace(/\bstroke-width=/g, 'strokeWidth=');
    jsx = jsx.replace(/\bstroke-linecap=/g, 'strokeLinecap=');
    jsx = jsx.replace(/\bstroke-linejoin=/g, 'strokeLinejoin=');
    jsx = jsx.replace(/\bstroke-dasharray=/g, 'strokeDasharray=');
    jsx = jsx.replace(/\bstroke-dashoffset=/g, 'strokeDashoffset=');
    jsx = jsx.replace(/\bstroke-miterlimit=/g, 'strokeMiterlimit=');
    jsx = jsx.replace(/\bstroke-opacity=/g, 'strokeOpacity=');
    jsx = jsx.replace(/\bfill-rule=/g, 'fillRule=');
    jsx = jsx.replace(/\bfill-opacity=/g, 'fillOpacity=');
    jsx = jsx.replace(/\bclip-rule=/g, 'clipRule=');
    jsx = jsx.replace(/\bclip-path=/g, 'clipPath=');
    jsx = jsx.replace(/\bvector-effect=/g, 'vectorEffect=');
    jsx = jsx.replace(/\bcolor-interpolation-filters=/g, 'colorInterpolationFilters=');
    jsx = jsx.replace(/\bflood-opacity=/g, 'floodOpacity=');
    jsx = jsx.replace(/\bflood-color=/g, 'floodColor=');
    jsx = jsx.replace(/\bstop-color=/g, 'stopColor=');
    jsx = jsx.replace(/\bstop-opacity=/g, 'stopOpacity=');
    jsx = jsx.replace(/\bfont-family=/g, 'fontFamily=');
    jsx = jsx.replace(/\bfont-size=/g, 'fontSize=');
    jsx = jsx.replace(/\btext-anchor=/g, 'textAnchor=');
    jsx = jsx.replace(/\bdominant-baseline=/g, 'dominantBaseline=');
    jsx = jsx.replace(/\bpreserveAspectRatio=/g, 'preserveAspectRatio=');
    jsx = jsx.replace(/\bviewBox=/g, 'viewBox=');
    jsx = jsx.replace(/xmlns:xlink=/g, 'xmlnsXlink=');

    // === Convert inline style strings to JSX objects ===
    jsx = jsx.replace(/\bstyle="([^"]*)"/g, (match, styleStr) => {
        const props = styleStr.split(';').filter(s => s.trim());
        const jsxProps = [];
        for (const prop of props) {
            const colonIdx = prop.indexOf(':');
            if (colonIdx === -1) continue;
            let key = prop.substring(0, colonIdx).trim();
            let val = prop.substring(colonIdx + 1).trim();
            
            // Convert CSS property name to camelCase
            key = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
            
            // Handle url() values - escape quotes properly
            if (val.includes("url(")) {
                // Replace url('...') or url("...") or url(...)
                val = val.replace(/url\((['"]?)([^)]*)\1\)/g, (m, q, url) => {
                    return `url(${url})`;
                });
                jsxProps.push(`${key}: \`${val}\``);
            } else {
                // Escape any single quotes in the value
                val = val.replace(/'/g, "\\'");
                jsxProps.push(`${key}: '${val}'`);
            }
        }
        return `style={{${jsxProps.join(', ')}}}`;
    });

    // === Fix font-variation-settings inside style objects ===
    // Pattern: 'FILL' 1 inside style={{}} needs to be "FILL" 1
    jsx = jsx.replace(/'FILL'\s*(\d)/g, '"FILL" $1');

    // === Remove event handler attributes ===
    jsx = jsx.replace(/\s+on[A-Z][a-zA-Z]*="[^"]*"/g, '');
    jsx = jsx.replace(/\s+onclick="[^"]*"/gi, '');
    jsx = jsx.replace(/\s+onchange="[^"]*"/gi, '');
    jsx = jsx.replace(/\s+onsubmit="[^"]*"/gi, '');
    jsx = jsx.replace(/\s+oninput="[^"]*"/gi, '');

    // === Remove md:ml-64 since LayoutWrapper handles this ===
    jsx = jsx.replace(/md:ml-64\s?/g, '');

    return jsx;
}

async function main() {
    const rawData = fs.readFileSync(
        'C:/Users/manis/.gemini/antigravity-ide/brain/8deed620-41b3-4285-9576-8971c6c1f02c/.system_generated/steps/733/output.txt',
        'utf8'
    );
    const screens = JSON.parse(rawData).screens;
    
    let recovered = 0;
    let skipped = 0;

    for (const screen of screens) {
        const title = screen.title;
        const targetPath = routeMapping[title];
        
        if (!targetPath) {
            console.log(`SKIP (no mapping): ${title}`);
            skipped++;
            continue;
        }

        console.log(`Recovering: ${title} -> ${targetPath}`);
        
        try {
            const html = await downloadHtml(screen.htmlCode.downloadUrl);
            const jsxContent = htmlToJsx(html);
            
            const funcName = title.replace(/[^a-zA-Z0-9]/g, '');
            const useClient = needsUseClient.has(targetPath) ? '"use client";\n' : '';
            
            const fileContent = `${useClient}export default function ${funcName}() {
    return (
        ${jsxContent}
    );
}
`;
            const fullPath = path.join(__dirname, targetPath);
            fs.mkdirSync(path.dirname(fullPath), { recursive: true });
            fs.writeFileSync(fullPath, fileContent, 'utf8');
            recovered++;
            console.log(`  ✓ Written ${targetPath}`);
        } catch (err) {
            console.error(`  ✗ Error: ${err.message}`);
        }
    }

    // Also need gallery/page.tsx and courses/lippan-art/learning/page.tsx
    // These don't have direct Stitch screen matches, let's create proper placeholders
    // Gallery - use the "Community Gallery - Student Creations" screen as base
    // Learning - needs a proper page

    console.log(`\nRecovered ${recovered} screens, skipped ${skipped}`);
}

main();
