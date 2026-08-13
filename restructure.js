const fs = require('fs');
const path = require('path');

const routeMap = {
  "admin-coupon-management-dashboard": "admin/coupons",
  "admin-course-management": "admin/courses-old",
  "admin-course-management-updated": "admin/courses",
  "admin-create-configure-coupon": "admin/coupons/create",
  "admin-creative-content-management": "admin/content",
  "admin-dashboard-overview": "admin/dashboard",
  "admin-dashboard-updated-navigation": "admin/dashboard-alt",
  "admin-excel-import-wizard": "admin/import-old",
  "admin-excel-import-wizard-updated": "admin/import",
  "admin-review-trainer-application": "admin/applications/review",
  "admin-student-management": "admin/students-old",
  "admin-student-management-updated": "admin/students",
  "admin-trainer-applications-dashboard": "admin/applications",
  "admin-upload-schedule-creative": "admin/content/upload",
  "become-a-trainer-introduction": "trainer/become-a-trainer",
  "community-gallery-student-creations": "gallery/student-creations",
  "community-gallery-updated": "gallery",
  "explore-courses-lemon-academy": "courses-old",
  "explore-courses-lemon-academy-updated": "courses",
  "lemon-academy-home": "home-old",
  "lemon-academy-prototype": "prototype",
  "lippan-art-learning-module-updated": "courses/lippan-art/learning",
  "lippan-art-module-1-introduction": "courses/lippan-art/module-1",
  "student-dashboard-become-a-trainer-promo": "student/dashboard/promo",
  "student-dashboard-welcome": "student/dashboard",
  "the-art-of-lippan-course-details": "courses/lippan-art",
  "trainer-application-portfolio-upload": "trainer/application",
  "trainer-course-content-editor": "trainer/editor-old",
  "trainer-course-content-editor-updated": "trainer/editor",
  "trainer-dashboard-overview": "trainer/dashboard"
};

const appDir = path.join(__dirname, 'app');

// 1. Move directories
for (const [oldName, newName] of Object.entries(routeMap)) {
  const oldPath = path.join(appDir, oldName);
  const newPath = path.join(appDir, newName);
  
  if (fs.existsSync(oldPath)) {
    fs.mkdirSync(path.dirname(newPath), { recursive: true });
    // If we're renaming a folder to a new location
    try {
        fs.renameSync(oldPath, newPath);
        console.log(`Moved ${oldName} -> ${newName}`);
    } catch (e) {
        console.log(`Failed to move ${oldName}:`, e.message);
    }
  }
}

// 2. Map links based on text content
const linkRules = [
    { text: 'Home', href: '/' },
    { text: 'Courses', href: '/courses' },
    { text: 'Explore Courses', href: '/courses' },
    { text: 'Dashboard', href: '/admin/dashboard' }, // Default to admin dashboard for now, or student depending on context
    { text: 'Gallery', href: '/gallery' },
    { text: 'Community', href: '/gallery' },
    { text: 'Students', href: '/admin/students' },
    { text: 'Trainers', href: '/admin/applications' },
    { text: 'Coupons', href: '/admin/coupons' },
    { text: 'The Art of Lippan', href: '/courses/lippan-art' },
    { text: 'Start Learning', href: '/courses/lippan-art/module-1' },
    { text: 'Become a Trainer', href: '/trainer/become-a-trainer' }
];

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file === 'page.tsx') {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Simple heuristic replacing <a ... href="#">Text</a>
            let currentIndex = 0;
            while ((currentIndex = content.indexOf('href="#"', currentIndex)) !== -1) {
                const endA = content.indexOf('</a>', currentIndex);
                if (endA !== -1) {
                    const snippet = content.substring(currentIndex, endA + 4);
                    let matched = false;
                    for (const rule of linkRules) {
                        if (snippet.includes(rule.text)) {
                            content = content.substring(0, currentIndex) + snippet.replace('href="#"', `href="${rule.href}"`) + content.substring(endA + 4);
                            modified = true;
                            matched = true;
                            break;
                        }
                    }
                    if (!matched) {
                        currentIndex += 8; // skip past href="#"
                    }
                } else {
                    break;
                }
            }

            // Also fix the CSS import warning in page.tsx if any, though it's in globals.css
            
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated links in ${fullPath}`);
            }
        }
    }
}

processDir(appDir);
