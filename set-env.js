const fs = require('fs');
const path = require('path');

// Grab Razorpay key from Vercel / OS environment variables
const rzpKey = (
  process.env.RZP_KEY ||
  process.env.RAZORPAY_KEY_ID ||
  process.env.RAZORPAY_KEY ||
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
  ''
).trim();

if (rzpKey && rzpKey !== 'RZP_KEY') {
  const prodEnvPath = path.join(__dirname, 'src', 'environments', 'environment.ts');
  const devEnvPath = path.join(__dirname, 'src', 'environments', 'environment.development.ts');

  [prodEnvPath, devEnvPath].forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/razorpayKeyId:\s*['"`].*?['"`]/, `razorpayKeyId: '${rzpKey}'`);
      fs.writeFileSync(filePath, content, 'utf8');
    }
  });

  console.log('[set-env] Successfully injected Razorpay key from Vercel environment variables into environment.ts');
} else {
  console.log('[set-env] No external Razorpay environment variable found, using current environment.ts settings.');
}

