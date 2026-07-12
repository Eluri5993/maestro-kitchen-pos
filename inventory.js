// Inventory and recipe management module for Maestro Kitchen POS
export const DEFAULT_INVENTORY = [
  { id: "basmati-rice", name: "Basmati Rice", stock: 15000, unit: "g", minStock: 3000 },
  { id: "noodles-raw", name: "Raw Noodles", stock: 10000, unit: "g", minStock: 2000 },
  { id: "chicken-raw", name: "Raw Chicken", stock: 12000, unit: "g", minStock: 2500 },
  { id: "paneer-raw", name: "Paneer", stock: 6000, unit: "g", minStock: 1500 },
  { id: "eggs", name: "Eggs", stock: 150, unit: "pcs", minStock: 30 },
  { id: "prawns-raw", name: "Raw Prawns", stock: 5000, unit: "g", minStock: 1000 },
  { id: "fish-raw", name: "Raw Fish", stock: 5000, unit: "g", minStock: 1000 },
  { id: "mushrooms", name: "Mushrooms", stock: 4000, unit: "g", minStock: 1000 },
  { id: "baby-corn", name: "Baby Corn", stock: 4000, unit: "g", minStock: 1000 },
  { id: "gobi-raw", name: "Cauliflower (Gobi)", stock: 8000, unit: "g", minStock: 2000 },
  { id: "kaju", name: "Cashew Nuts (Kaju)", stock: 2000, unit: "g", minStock: 500 },
  { id: "cooking-oil", name: "Cooking Oil", stock: 20000, unit: "ml", minStock: 4000 },
  { id: "mojito-syrup-mint", name: "Mint Syrup", stock: 2000, unit: "ml", minStock: 500 },
  { id: "mojito-syrup-strawberry", name: "Strawberry Syrup", stock: 2000, unit: "ml", minStock: 500 },
  { id: "mojito-syrup-watermelon", name: "Watermelon Syrup", stock: 2000, unit: "ml", minStock: 500 },
  { id: "mojito-syrup-blueberry", name: "Blueberry Syrup", stock: 2000, unit: "ml", minStock: 500 },
  { id: "mojito-syrup-greenapple", name: "Green Apple Syrup", stock: 2000, unit: "ml", minStock: 500 },
  { id: "mojito-syrup-kiwi", name: "Kiwi Syrup", stock: 2000, unit: "ml", minStock: 500 },
  { id: "soda", name: "Soda Water", stock: 15000, unit: "ml", minStock: 3000 },
  { id: "lemons", name: "Lemons", stock: 80, unit: "pcs", minStock: 15 },
  { id: "mint-leaves", name: "Fresh Mint Leaves", stock: 1000, unit: "g", minStock: 200 },
  { id: "onions", name: "Onions", stock: 15000, unit: "g", minStock: 3000 },
  { id: "garlic", name: "Garlic", stock: 5000, unit: "g", minStock: 1000 },
  { id: "ginger", name: "Ginger", stock: 5000, unit: "g", minStock: 1000 },
];

// Recipe mapping: menuItemID -> array of { ingredientId, qty }
export const DEFAULT_RECIPES = {
  // Chinese Soups (Veg / Non-veg patterns)
  "soup-hot-sour-veg": [
    { ingredientId: "cooking-oil", qty: 10 },
    { ingredientId: "garlic", qty: 10 },
    { ingredientId: "ginger", qty: 5 }
  ],
  "soup-hot-sour-nonveg": [
    { ingredientId: "cooking-oil", qty: 10 },
    { ingredientId: "garlic", qty: 10 },
    { ingredientId: "ginger", qty: 5 },
    { ingredientId: "chicken-raw", qty: 40 },
    { ingredientId: "eggs", qty: 0.5 }
  ],
  "soup-manchow-veg": [
    { ingredientId: "cooking-oil", qty: 10 },
    { ingredientId: "garlic", qty: 12 },
    { ingredientId: "ginger", qty: 6 }
  ],
  "soup-manchow-nonveg": [
    { ingredientId: "cooking-oil", qty: 10 },
    { ingredientId: "garlic", qty: 12 },
    { ingredientId: "ginger", qty: 6 },
    { ingredientId: "chicken-raw", qty: 40 },
    { ingredientId: "eggs", qty: 0.5 }
  ],

  // Starters
  "starter-veg-manchuria": [
    { ingredientId: "cooking-oil", qty: 30 },
    { ingredientId: "gobi-raw", qty: 100 },
    { ingredientId: "onions", qty: 30 },
    { ingredientId: "garlic", qty: 15 }
  ],
  "starter-gobi-manchuria": [
    { ingredientId: "cooking-oil", qty: 35 },
    { ingredientId: "gobi-raw", qty: 150 },
    { ingredientId: "onions", qty: 30 }
  ],
  "starter-paneer-65": [
    { ingredientId: "cooking-oil", qty: 40 },
    { ingredientId: "paneer-raw", qty: 150 }
  ],
  "starter-egg-omlet": [
    { ingredientId: "eggs", qty: 2 },
    { ingredientId: "onions", qty: 20 },
    { ingredientId: "cooking-oil", qty: 10 }
  ],
  "starter-chicken-65": [
    { ingredientId: "cooking-oil", qty: 50 },
    { ingredientId: "chicken-raw", qty: 200 }
  ],
  "starter-garlic-chicken": [
    { ingredientId: "cooking-oil", qty: 40 },
    { ingredientId: "chicken-raw", qty: 200 },
    { ingredientId: "garlic", qty: 25 }
  ],
  "starter-chilly-fish": [
    { ingredientId: "cooking-oil", qty: 40 },
    { ingredientId: "fish-raw", qty: 180 }
  ],
  "starter-loose-prawns": [
    { ingredientId: "cooking-oil", qty: 50 },
    { ingredientId: "prawns-raw", qty: 180 }
  ],

  // Veg Rice & Noodles
  "rice-veg-fried": [
    { ingredientId: "basmati-rice", qty: 150 },
    { ingredientId: "cooking-oil", qty: 20 },
    { ingredientId: "onions", qty: 30 }
  ],
  "noodles-veg": [
    { ingredientId: "noodles-raw", qty: 120 },
    { ingredientId: "cooking-oil", qty: 20 },
    { ingredientId: "onions", qty: 30 }
  ],
  "rice-paneer-fried": [
    { ingredientId: "basmati-rice", qty: 150 },
    { ingredientId: "paneer-raw", qty: 60 },
    { ingredientId: "cooking-oil", qty: 25 },
    { ingredientId: "onions", qty: 30 }
  ],
  "noodles-paneer": [
    { ingredientId: "noodles-raw", qty: 120 },
    { ingredientId: "paneer-raw", qty: 60 },
    { ingredientId: "cooking-oil", qty: 25 }
  ],

  // Non Veg Rice & Noodles
  "rice-egg-fried": [
    { ingredientId: "basmati-rice", qty: 150 },
    { ingredientId: "eggs", qty: 2 },
    { ingredientId: "cooking-oil", qty: 20 }
  ],
  "rice-chicken-fried": [
    { ingredientId: "basmati-rice", qty: 150 },
    { ingredientId: "chicken-raw", qty: 80 },
    { ingredientId: "cooking-oil", qty: 25 },
    { ingredientId: "onions", qty: 30 }
  ],
  "noodles-chicken": [
    { ingredientId: "noodles-raw", qty: 120 },
    { ingredientId: "chicken-raw", qty: 80 },
    { ingredientId: "cooking-oil", qty: 25 }
  ],

  // Biryani (Single / Full portions)
  "biryani-chicken-dum-single": [
    { ingredientId: "basmati-rice", qty: 180 },
    { ingredientId: "chicken-raw", qty: 150 },
    { ingredientId: "cooking-oil", qty: 30 },
    { ingredientId: "onions", qty: 40 }
  ],
  "biryani-chicken-dum-full": [
    { ingredientId: "basmati-rice", qty: 300 },
    { ingredientId: "chicken-raw", qty: 280 },
    { ingredientId: "cooking-oil", qty: 50 },
    { ingredientId: "onions", qty: 70 }
  ],
  "biryani-chicken-fry-single": [
    { ingredientId: "basmati-rice", qty: 180 },
    { ingredientId: "chicken-raw", qty: 150 },
    { ingredientId: "cooking-oil", qty: 35 }
  ],
  "biryani-chicken-fry-full": [
    { ingredientId: "basmati-rice", qty: 300 },
    { ingredientId: "chicken-raw", qty: 280 },
    { ingredientId: "cooking-oil", qty: 60 }
  ],
  "biryani-paneer-single": [
    { ingredientId: "basmati-rice", qty: 180 },
    { ingredientId: "paneer-raw", qty: 80 },
    { ingredientId: "cooking-oil", qty: 30 }
  ],
  "biryani-paneer-full": [
    { ingredientId: "basmati-rice", qty: 300 },
    { ingredientId: "paneer-raw", qty: 150 },
    { ingredientId: "cooking-oil", qty: 50 }
  ],

  // Mojitos
  "mojito-mint": [
    { ingredientId: "mojito-syrup-mint", qty: 30 },
    { ingredientId: "soda", qty: 250 },
    { ingredientId: "lemons", qty: 0.5 },
    { ingredientId: "mint-leaves", qty: 10 }
  ],
  "mojito-strawberry": [
    { ingredientId: "mojito-syrup-strawberry", qty: 30 },
    { ingredientId: "soda", qty: 250 },
    { ingredientId: "lemons", qty: 0.5 },
    { ingredientId: "mint-leaves", qty: 5 }
  ],
  "mojito-watermelon": [
    { ingredientId: "mojito-syrup-watermelon", qty: 30 },
    { ingredientId: "soda", qty: 250 },
    { ingredientId: "lemons", qty: 0.5 },
    { ingredientId: "mint-leaves", qty: 5 }
  ],
  "mojito-blueberry": [
    { ingredientId: "mojito-syrup-blueberry", qty: 30 },
    { ingredientId: "soda", qty: 250 },
    { ingredientId: "lemons", qty: 0.5 },
    { ingredientId: "mint-leaves", qty: 5 }
  ],
  "mojito-greenapple": [
    { ingredientId: "mojito-syrup-greenapple", qty: 30 },
    { ingredientId: "soda", qty: 250 },
    { ingredientId: "lemons", qty: 0.5 },
    { ingredientId: "mint-leaves", qty: 5 }
  ],
  "mojito-kiwi": [
    { ingredientId: "mojito-syrup-kiwi", qty: 30 },
    { ingredientId: "soda", qty: 250 },
    { ingredientId: "lemons", qty: 0.5 },
    { ingredientId: "mint-leaves", qty: 5 }
  ],
};

export function getLocalInventory() {
  const local = localStorage.getItem("maestro_inventory");
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Error parsing local inventory", e);
    }
  }
  return DEFAULT_INVENTORY;
}

export function saveInventoryToLocal(inventory) {
  localStorage.setItem("maestro_inventory", JSON.stringify(inventory));
}

export function getLocalRecipes() {
  const local = localStorage.getItem("maestro_recipes");
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Error parsing local recipes", e);
    }
  }
  return DEFAULT_RECIPES;
}

export function saveRecipesToLocal(recipes) {
  localStorage.setItem("maestro_recipes", JSON.stringify(recipes));
}

/**
 * Deduct ingredients stock based on list of checked-out items
 * @param {Array} cartItems - Array of { menuId, qty }
 * @param {Array} currentInventory - Array of current ingredients
 * @param {Object} recipes - Current recipe map
 * @returns {Array} Updated inventory list
 */
export function deductStockForOrder(cartItems, currentInventory, recipes = getLocalRecipes()) {
  const inventoryMap = new Map(currentInventory.map(item => [item.id, { ...item }]));

  cartItems.forEach(cartItem => {
    const recipe = recipes[cartItem.menuId];
    if (recipe) {
      recipe.forEach(recItem => {
        if (inventoryMap.has(recItem.ingredientId)) {
          const invItem = inventoryMap.get(recItem.ingredientId);
          invItem.stock = Math.max(0, invItem.stock - (recItem.qty * cartItem.qty));
          inventoryMap.set(recItem.ingredientId, invItem);
        }
      });
    }
  });

  return Array.from(inventoryMap.values());
}

/**
 * Validate if there is enough stock to place an order
 * @param {Array} cartItems 
 * @param {Array} currentInventory 
 * @param {Object} recipes 
 * @returns {Array} - List of warning messages or empty if stock is OK
 */
export function validateStockForOrder(cartItems, currentInventory, recipes = getLocalRecipes()) {
  const inventoryMap = new Map(currentInventory.map(item => [item.id, item.stock]));
  const requiredStock = {};

  cartItems.forEach(cartItem => {
    const recipe = recipes[cartItem.menuId];
    if (recipe) {
      recipe.forEach(recItem => {
        const totalNeeded = recItem.qty * cartItem.qty;
        requiredStock[recItem.ingredientId] = (requiredStock[recItem.ingredientId] || 0) + totalNeeded;
      });
    }
  });

  const warnings = [];
  Object.keys(requiredStock).forEach(ingId => {
    const currentVal = inventoryMap.get(ingId) || 0;
    const needed = requiredStock[ingId];
    if (needed > currentVal) {
      const ingName = currentInventory.find(i => i.id === ingId)?.name || ingId;
      warnings.push(`Insufficient stock for ${ingName}. Needed: ${needed}, Available: ${currentVal}`);
    }
  });

  return warnings;
}
