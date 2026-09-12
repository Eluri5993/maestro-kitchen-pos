const fs = require('fs');

const menuContent = fs.readFileSync('../menu.js', 'utf-8');
const finalMenuContent = fs.readFileSync('./build_final_menu.js', 'utf-8');

// parse data
const dataMatch = finalMenuContent.match(/const data = (\[[\s\S]*?\]);\n/);
let data;
eval('data = ' + dataMatch[1]);

const priceMap = {};
data.forEach(cat => {
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
      priceMap[name.toLowerCase()] = price;
      
      if (variant === "") {
        priceMap[item.name.toLowerCase()] = price;
      }
    });
  });
});

const manualMap = {
  "egg omlet": priceMap["egg omelette"],
  "veg kaju manchuria": priceMap["kaju veg manchuria"],
  "chicken lollypop": 229,
  "chicken majestic": priceMap["majestic chicken"],
  "special chicken biryani (single)": priceMap["special biryani (single)"],
  "special chicken biryani (full)": priceMap["special biryani (full)"],
  "gongura chicken biryani (single)": priceMap["gongura biryani (single)"],
  "gongura chicken biryani (full)": priceMap["gongura biryani (full)"],
  "chicken fry piece biryani (single)": priceMap["fry piece biryani (single)"],
  "chicken fry piece biryani (full)": priceMap["fry piece biryani (full)"],
  "prawns biryani (single)": priceMap["prawns biryani (single)"] || 205,
  "mushroom biryani (single)": priceMap["mushroom biryani (single)"] || 169,
  "paneer biryani (single)": priceMap["paneer biryani (single)"] || 169,
  "sweet corn soup (veg)": priceMap["sweet corn (veg)"],
  "sweet corn soup (non-veg)": priceMap["sweet corn (non-veg)"],
  "hot & sour soup (veg)": priceMap["hot & sour (veg)"],
  "hot & sour soup (non-veg)": priceMap["hot & sour (non-veg)"],
  "manchow soup (veg)": priceMap["manchow (veg)"],
  "manchow soup (non-veg)": priceMap["manchow (non-veg)"],
  "lemon coriander soup (veg)": priceMap["lemon & coriander (veg)"],
  "lemon coriander soup (non-veg)": priceMap["lemon & coriander (non-veg)"],
  "clear soup (veg)": 125,
};

Object.assign(priceMap, manualMap);

const lines = menuContent.split('\n');
const newLines = lines.map(line => {
  const match = line.match(/{.*?name:\s*"([^"]+)".*?price:\s*(\d+)/);
  if (match) {
    const name = match[1];
    const oldPrice = parseInt(match[2], 10);
    const lowerName = name.toLowerCase();
    
    let newPrice = oldPrice;
    if (priceMap[lowerName]) {
      newPrice = priceMap[lowerName];
    } else if (lowerName.includes('soup')) {
       const noSoup = lowerName.replace(' soup', '');
       if (priceMap[noSoup]) newPrice = priceMap[noSoup];
    }
    
    if (newPrice !== oldPrice && newPrice) {
      console.log(`Updated ${name}: ${oldPrice} -> ${newPrice}`);
      return line.replace(`price: ${oldPrice}`, `price: ${newPrice}`);
    }
  }
  return line;
});

fs.writeFileSync('../menu.js', newLines.join('\n'));
console.log("Prices updated in menu.js");
