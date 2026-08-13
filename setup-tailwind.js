const fs = require('fs');

const designMd = fs.readFileSync('design.md', 'utf8');

// Extremely simple parser for colors in this specific yaml format
const colors = {};
let inColors = false;
for (const line of designMd.split('\n')) {
  if (line.startsWith('colors:')) {
    inColors = true;
    continue;
  }
  if (inColors) {
    if (!line.startsWith('  ') && line.trim() !== '') {
      inColors = false;
    } else {
      const match = line.match(/^\s+([^:]+):\s*'([^']+)'/);
      if (match) {
        colors[match[1]] = match[2];
      }
    }
  }
}

const config = `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 8).replace(/\}$/, '      }')}
    },
  },
  plugins: [],
};
export default config;
`;

fs.writeFileSync('tailwind.config.ts', config);

const postcss = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

fs.writeFileSync('postcss.config.js', postcss);

const globals = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
`;

fs.writeFileSync('app/globals.css', globals);

console.log('Tailwind config generated!');
