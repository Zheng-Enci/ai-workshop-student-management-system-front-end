const fs = require('fs');
const path = process.argv[2];
let content = fs.readFileSync(path, 'utf8');

// Match class selectors in CSS - handles .classname followed by { or , or space or :
content = content.replace(/\.([a-zA-Z][a-zA-Z0-9_-]*)(\s*[,>~+:\s]\s*|\s*\{)/g, (match, className, suffix) => {
    // Skip if already has prefix
    if (className.startsWith('profile-page-mobile-')) {
        return match;
    }
    return `.profile-page-mobile-${className}${suffix}`;
});

fs.writeFileSync(path, content, 'utf8');
console.log('Done!');
