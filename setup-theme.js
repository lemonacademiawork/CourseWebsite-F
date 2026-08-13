const fs = require('fs');
const yaml = require('js-yaml');

const content = fs.readFileSync('design-utf8.md', 'utf8');
const yamlPart = content.split('---')[1];
const data = yaml.load(yamlPart);

let themeCSS = `@import "tailwindcss";\n\n@theme {\n`;

// Colors
for (const [key, value] of Object.entries(data.colors)) {
  themeCSS += `  --color-${key}: ${value};\n`;
}

// Typography
// Stitch uses font-* for family and text-* for size/line-height/weight
for (const [key, config] of Object.entries(data.typography)) {
  if (config.fontFamily) {
    themeCSS += `  --font-${key}: '${config.fontFamily}', sans-serif;\n`;
  }
  if (config.fontSize) {
    themeCSS += `  --text-${key}: ${config.fontSize};\n`;
  }
  if (config.lineHeight) {
    themeCSS += `  --text-${key}--line-height: ${config.lineHeight};\n`;
  }
  if (config.fontWeight) {
    themeCSS += `  --text-${key}--font-weight: ${config.fontWeight};\n`;
  }
  if (config.letterSpacing) {
    themeCSS += `  --text-${key}--letter-spacing: ${config.letterSpacing};\n`;
  }
}

// Rounded
for (const [key, value] of Object.entries(data.rounded)) {
  if (key === 'DEFAULT') {
    themeCSS += `  --radius: ${value};\n`;
  } else {
    themeCSS += `  --radius-${key}: ${value};\n`;
  }
}

// Spacing
for (const [key, value] of Object.entries(data.spacing)) {
  themeCSS += `  --spacing-${key}: ${value};\n`;
}

themeCSS += `}\n\n`;
themeCSS += `@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}\n`;

fs.writeFileSync('app/globals.css', themeCSS, 'utf8');
console.log('globals.css updated with full theme!');
