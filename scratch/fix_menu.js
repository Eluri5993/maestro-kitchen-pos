const fs = require('fs');

let menuContent = fs.readFileSync('../menu.js', 'utf-8');

// Use a regex to find all object literals inside DEFAULT_MENU and add available: true
// A safer way is to just add it before the closing brace of each item if it doesn't exist.
const updatedContent = menuContent.replace(/isVeg:\s*(true|false)\s*\}/g, (match, isVeg) => {
    return `isVeg: ${isVeg}, available: true, discountPercent: 0, image: "" }`;
});

fs.writeFileSync('../menu.js', updatedContent);
console.log("Fixed menu items to include available: true");
