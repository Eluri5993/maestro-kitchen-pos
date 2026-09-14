const fs = require('fs');

const finalMenuContent = fs.readFileSync('./build_final_menu.js', 'utf-8');
const dataMatch = finalMenuContent.match(/const data = (\[[\s\S]*?\]);\n/);
let data;
eval('data = ' + dataMatch[1]);

const categoriesToAdd = [
  "👑 Signature Chicken Specials",
  "🍤 Fish & Prawns Starters",
  "🍢 Kebabs & Tandoor",
  "🫓 Roti, Naan & Paratha",
  "🥘 Veg Curries",
  "🍛 Chicken Curries",
  "🍳 Egg Curries",
  "🐐 Mutton Curries",
  "🐟 Fish & Prawns Curries"
];

let newItemsJS = '';
let newCategoriesList = [];

function generateId(cat, name, variant) {
    let cleanName = (name + (variant ? ` ${variant}` : '')).toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    let cleanCat = cat.replace(/[^a-zA-Z]/g, '').toLowerCase().substring(0, 5);
    return `${cleanCat}-${cleanName}`;
}

data.forEach(cat => {
    if (!categoriesToAdd.includes(cat.category)) return;
    
    // Clean category name (remove emojis)
    let cleanCatName = cat.category.replace(/^[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]\s*/u, '').trim();
    newCategoriesList.push(cleanCatName);
    
    let isVeg = false;
    if (cleanCatName.includes("Veg") || cleanCatName.includes("Roti")) {
        isVeg = true;
    }
    if (cleanCatName.includes("Non-Veg") || cleanCatName.includes("Chicken") || cleanCatName.includes("Egg") || cleanCatName.includes("Mutton") || cleanCatName.includes("Fish") || cleanCatName.includes("Kebabs")) {
        isVeg = false;
    }
    
    cat.items.forEach(item => {
        Object.keys(item.prices).forEach(variant => {
            let priceStr = item.prices[variant].replace('₹', '');
            let price = parseInt(priceStr, 10);
            
            let name = item.name;
            if (variant !== "" && variant !== "Single" && variant !== "Full") {
                name = `${item.name} (${variant})`;
            } else if (variant === "Single") {
                name = `${item.name} (Single)`;
            } else if (variant === "Full") {
                name = `${item.name} (Full)`;
            }
            
            let id = generateId(cleanCatName, item.name, variant);
            
            newItemsJS += `  { id: "${id}", name: "${name}", category: "${cleanCatName}", price: ${price}, isVeg: ${isVeg} },\n`;
        });
    });
});

let menuContent = fs.readFileSync('../menu.js', 'utf-8');

// Append items before the end of DEFAULT_MENU array
menuContent = menuContent.replace(/\n\];/, `\n\n  // NEWLY ADDED CATEGORIES\n${newItemsJS}];`);

// Append categories
let catMatch = menuContent.match(/export const CATEGORIES = \[\s*([\s\S]*?)\s*\];/);
if (catMatch) {
    let existingCats = catMatch[1];
    let newCatsStr = newCategoriesList.map(c => `  "${c}"`).join(',\n');
    let replacement = `export const CATEGORIES = [\n${existingCats},\n${newCatsStr}\n];`;
    menuContent = menuContent.replace(catMatch[0], replacement);
}

fs.writeFileSync('../menu.js', menuContent);
console.log("Successfully appended new categories and items!");
