const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');

const requiredFiles = [
    'index.html',
    '404.html',
    'CNAME',
    'assets/img/app-icon.png',
    'assets/img/app-mockup.png',
    'assets/img/header-icons/chat.png',
    'assets/img/header-icons/contact.png',
    'assets/img/header-icons/email.png',
    'assets/img/header-icons/instagram.png',
    'assets/img/header-icons/question.png',
    'assets/img/screenshots/chapters-fa.png',
    'assets/img/screenshots/daily-challenge-fa.png',
    'assets/img/screenshots/leaderboard-fa.png',
    'assets/img/screenshots/lucky-wheel-fa.png',
    'assets/img/store-badges/app-store-badge.png',
    'assets/img/store-badges/cafe-bazaar-badge.png',
    'assets/img/store-badges/myket-badge.png',
    'assets/css/style.css',
    'assets/js/chat-widget.js',
    'assets/js/screenshot-gallery.js',
    'apple-touch-icon.png',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png',
    'chat-config.js',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'favicon-96x96.png',
    'favicon.ico',
    'favicon.svg',
    'safari-pinned-tab.svg',
    'site.webmanifest'
];

const missingFiles = requiredFiles.filter((fileName) => !fs.existsSync(path.join(distDir, fileName)));

if (missingFiles.length > 0) {
    console.error('dist/ is missing required production files:');
    for (const fileName of missingFiles) {
        console.error(`- ${fileName}`);
    }
    process.exit(1);
}

console.log('dist/ contains the required production files.');
