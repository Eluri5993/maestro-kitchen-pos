// Menu database module for Maestro Kitchen POS
export const DEFAULT_MENU = [
  // CHINESE SOUPS
  { id: "soup-hot-sour-veg", name: "Hot & Sour Soup (Veg)", category: "Chinese Soups", price: 99, isVeg: true },
  { id: "soup-hot-sour-nonveg", name: "Hot & Sour Soup (Non-Veg)", category: "Chinese Soups", price: 109, isVeg: false },
  { id: "soup-manchow-veg", name: "Manchow Soup (Veg)", category: "Chinese Soups", price: 99, isVeg: true },
  { id: "soup-manchow-nonveg", name: "Manchow Soup (Non-Veg)", category: "Chinese Soups", price: 109, isVeg: false },
  { id: "soup-lemon-coriander-veg", name: "Lemon Coriander Soup (Veg)", category: "Chinese Soups", price: 99, isVeg: true },
  { id: "soup-lemon-coriander-nonveg", name: "Lemon Coriander Soup (Non-Veg)", category: "Chinese Soups", price: 109, isVeg: false },
  { id: "soup-clear-veg", name: "Clear Soup (Veg)", category: "Chinese Soups", price: 99, isVeg: true },
  { id: "soup-clear-nonveg", name: "Clear Soup (Non-Veg)", category: "Chinese Soups", price: 109, isVeg: false },
  { id: "soup-sweet-corn-veg", name: "Sweet Corn Soup (Veg)", category: "Chinese Soups", price: 99, isVeg: true },
  { id: "soup-sweet-corn-nonveg", name: "Sweet Corn Soup (Non-Veg)", category: "Chinese Soups", price: 109, isVeg: false },

  // VEG STARTERS
  { id: "starter-veg-manchuria", name: "Veg Manchuria", category: "Veg Starters", price: 129, isVeg: true },
  { id: "starter-gobi-manchuria", name: "Gobi Manchuria", category: "Veg Starters", price: 129, isVeg: true },
  { id: "starter-gobi-65", name: "Gobi 65", category: "Veg Starters", price: 139, isVeg: true },
  { id: "starter-gobi-chilly", name: "Gobi Chilly", category: "Veg Starters", price: 139, isVeg: true },
  { id: "starter-mushroom-manchuria", name: "Mushroom Manchuria", category: "Veg Starters", price: 139, isVeg: true },
  { id: "starter-mushroom-65", name: "Mushroom 65", category: "Veg Starters", price: 149, isVeg: true },
  { id: "starter-mushroom-chilly", name: "Mushroom Chilly", category: "Veg Starters", price: 149, isVeg: true },
  { id: "starter-baby-corn-manchuria", name: "Baby Corn Manchuria", category: "Veg Starters", price: 139, isVeg: true },
  { id: "starter-baby-corn-65", name: "Baby Corn 65", category: "Veg Starters", price: 149, isVeg: true },
  { id: "starter-baby-corn-chilly", name: "Baby Corn Chilly", category: "Veg Starters", price: 149, isVeg: true },
  { id: "starter-crispy-corn", name: "Crispy Corn", category: "Veg Starters", price: 139, isVeg: true },
  { id: "starter-corn-salt-pepper", name: "Corn Salt & Pepper", category: "Veg Starters", price: 149, isVeg: true },
  { id: "starter-veg-kaju-manchuria", name: "Veg Kaju Manchuria", category: "Veg Starters", price: 169, isVeg: true },
  { id: "starter-paneer-manchuria", name: "Paneer Manchuria", category: "Veg Starters", price: 159, isVeg: true },
  { id: "starter-paneer-65", name: "Paneer 65", category: "Veg Starters", price: 169, isVeg: true },
  { id: "starter-paneer-chilly", name: "Paneer Chilly", category: "Veg Starters", price: 169, isVeg: true },
  { id: "starter-kaju-paneer-manchuria", name: "Kaju Paneer Manchuria", category: "Veg Starters", price: 189, isVeg: true },

  // NON-VEG STARTERS
  { id: "starter-egg-omlet", name: "Egg Omlet", category: "Non-Veg Starters", price: 59, isVeg: false },
  { id: "starter-egg-manchuria", name: "Egg Manchuria", category: "Non-Veg Starters", price: 119, isVeg: false },
  { id: "starter-egg-chilly", name: "Egg Chilly", category: "Non-Veg Starters", price: 139, isVeg: false },
  { id: "starter-egg-65", name: "Egg 65", category: "Non-Veg Starters", price: 139, isVeg: false },
  { id: "starter-chicken-manchuria", name: "Chicken Manchuria", category: "Non-Veg Starters", price: 169, isVeg: false },
  { id: "starter-chicken-65", name: "Chicken 65", category: "Non-Veg Starters", price: 179, isVeg: false },
  { id: "starter-garlic-chicken", name: "Garlic Chicken", category: "Non-Veg Starters", price: 179, isVeg: false },
  { id: "starter-pepper-chicken", name: "Pepper Chicken", category: "Non-Veg Starters", price: 179, isVeg: false },
  { id: "starter-chilly-chicken", name: "Chilly Chicken", category: "Non-Veg Starters", price: 179, isVeg: false },
  { id: "starter-chicken-lollypop", name: "Chicken Lollypop", category: "Non-Veg Starters", price: 189, isVeg: false },
  { id: "starter-chicken-majestic", name: "Chicken Majestic", category: "Non-Veg Starters", price: 189, isVeg: false },
  { id: "starter-chicken-555", name: "Chicken 555", category: "Non-Veg Starters", price: 189, isVeg: false },
  { id: "starter-dragon-chicken", name: "Dragon Chicken", category: "Non-Veg Starters", price: 209, isVeg: false },
  { id: "starter-royal-chicken", name: "Royal Chicken", category: "Non-Veg Starters", price: 219, isVeg: false },
  { id: "starter-kaju-nut-chicken", name: "Kaju Nut Chicken", category: "Non-Veg Starters", price: 219, isVeg: false },
  { id: "starter-chilly-fish", name: "Chilly Fish", category: "Non-Veg Starters", price: 239, isVeg: false },
  { id: "starter-apollo-fish", name: "Apollo Fish", category: "Non-Veg Starters", price: 239, isVeg: false },
  { id: "starter-prawns-manchuria", name: "Prawns Manchuria", category: "Non-Veg Starters", price: 259, isVeg: false },
  { id: "starter-prawns-chilly", name: "Prawns Chilly", category: "Non-Veg Starters", price: 269, isVeg: false },
  { id: "starter-pepper-prawns", name: "Pepper Prawns", category: "Non-Veg Starters", price: 269, isVeg: false },
  { id: "starter-loose-prawns", name: "Loose Prawns", category: "Non-Veg Starters", price: 269, isVeg: false },
  { id: "starter-golden-fry-prawns", name: "Golden Fry Prawns", category: "Non-Veg Starters", price: 279, isVeg: false },

  // VEG RICE
  { id: "rice-veg-fried", name: "Veg Fried Rice", category: "Veg Rice", price: 99, isVeg: true },
  { id: "rice-veg-schezwan-fried", name: "Veg Schezwan Fried Rice", category: "Veg Rice", price: 119, isVeg: true },
  { id: "rice-veg-manchurian", name: "Veg Manchurian Rice", category: "Veg Rice", price: 119, isVeg: true },
  { id: "rice-veg-manchurian-schezwan", name: "Veg Manchurian Schezwan Rice", category: "Veg Rice", price: 139, isVeg: true },
  { id: "rice-gobi-fried", name: "Gobi Fried Rice", category: "Veg Rice", price: 109, isVeg: true },
  { id: "rice-gobi-schezwan-fried", name: "Gobi Schezwan Fried Rice", category: "Veg Rice", price: 129, isVeg: true },
  { id: "rice-mushroom-fried", name: "Mushroom Fried Rice", category: "Veg Rice", price: 119, isVeg: true },
  { id: "rice-mushroom-schezwan", name: "Mushroom Schezwan Rice", category: "Veg Rice", price: 129, isVeg: true },
  { id: "rice-paneer-fried", name: "Paneer Fried Rice", category: "Veg Rice", price: 139, isVeg: true },
  { id: "rice-paneer-schezwan", name: "Paneer Schezwan Rice", category: "Veg Rice", price: 149, isVeg: true },
  { id: "rice-corn", name: "Corn Rice", category: "Veg Rice", price: 109, isVeg: true },
  { id: "rice-jeera", name: "Jeera Rice", category: "Veg Rice", price: 109, isVeg: true },

  // VEG NOODLES
  { id: "noodles-veg", name: "Veg Noodles", category: "Veg Noodles", price: 109, isVeg: true },
  { id: "noodles-veg-schezwan", name: "Veg Schezwan Noodles", category: "Veg Noodles", price: 119, isVeg: true },
  { id: "noodles-veg-manchurian", name: "Veg Manchurian Noodles", category: "Veg Noodles", price: 129, isVeg: true },
  { id: "noodles-veg-manchurian-schezwan", name: "Veg Manchuria Schezwan Noodles", category: "Veg Noodles", price: 139, isVeg: true },
  { id: "noodles-haka", name: "Haka Noodles", category: "Veg Noodles", price: 139, isVeg: true },
  { id: "noodles-paneer", name: "Paneer Noodles", category: "Veg Noodles", price: 139, isVeg: true },
  { id: "noodles-paneer-schezwan", name: "Paneer Schezwan Noodles", category: "Veg Noodles", price: 149, isVeg: true },

  // NON-VEG RICE
  { id: "rice-egg-fried", name: "Egg Fried Rice", category: "Non-Veg Rice", price: 119, isVeg: false },
  { id: "rice-egg-schezwan", name: "Egg Schezwan Rice", category: "Non-Veg Rice", price: 129, isVeg: false },
  { id: "rice-chicken-fried", name: "Chicken Fried Rice", category: "Non-Veg Rice", price: 139, isVeg: false },
  { id: "rice-chicken-schezwan", name: "Chicken Schezwan Rice", category: "Non-Veg Rice", price: 149, isVeg: false },
  { id: "rice-chilly-garlic-chicken", name: "Chilly Garlic Chicken Rice", category: "Non-Veg Rice", price: 149, isVeg: false },
  { id: "rice-chilly-garlic-egg", name: "Chilly Garlic Egg Rice", category: "Non-Veg Rice", price: 139, isVeg: false },
  { id: "rice-prawns-fried", name: "Prawns Fried Rice", category: "Non-Veg Rice", price: 179, isVeg: false },
  { id: "rice-prawns-schezwan", name: "Prawns Schezwan Rice", category: "Non-Veg Rice", price: 189, isVeg: false },
  { id: "rice-mix-nonveg-fried", name: "Mix Non-Veg Fried Rice", category: "Non-Veg Rice", price: 219, isVeg: false },
  { id: "rice-mix-nonveg-schezwan", name: "Mix Non-Veg Schezwan Rice", category: "Non-Veg Rice", price: 239, isVeg: false },

  // NON-VEG NOODLES
  { id: "noodles-egg", name: "Egg Noodles", category: "Non-Veg Noodles", price: 119, isVeg: false },
  { id: "noodles-egg-schezwan", name: "Egg Schezwan Noodles", category: "Non-Veg Noodles", price: 129, isVeg: false },
  { id: "noodles-chicken", name: "Chicken Noodles", category: "Non-Veg Noodles", price: 139, isVeg: false },
  { id: "noodles-chicken-schezwan", name: "Chicken Schezwan Noodles", category: "Non-Veg Noodles", price: 149, isVeg: false },
  { id: "noodles-chilly-garlic-chicken", name: "Chilly Garlic Chicken Noodles", category: "Non-Veg Noodles", price: 149, isVeg: false },
  { id: "noodles-chilly-garlic-egg", name: "Chilly Garlic Egg Noodles", category: "Non-Veg Noodles", price: 139, isVeg: false },
  { id: "noodles-prawns", name: "Prawns Noodles", category: "Non-Veg Noodles", price: 169, isVeg: false },
  { id: "noodles-prawns-schezwan", name: "Schezwan Prawns Noodles", category: "Non-Veg Noodles", price: 189, isVeg: false },
  { id: "noodles-mix-nonveg", name: "Mix Non-Veg Noodles", category: "Non-Veg Noodles", price: 219, isVeg: false },
  { id: "noodles-mix-nonveg-schezwan", name: "Schezwan Mix Non-Veg Noodles", category: "Non-Veg Noodles", price: 239, isVeg: false },

  // BIRYANI (SINGLE / FULL)
  { id: "biryani-chicken-dum-single", name: "Chicken Dum Biryani (Single)", category: "Biryani", price: 149, isVeg: false },
  { id: "biryani-chicken-dum-full", name: "Chicken Dum Biryani (Full)", category: "Biryani", price: 239, isVeg: false },
  { id: "biryani-chicken-fry-single", name: "Chicken Fry Piece Biryani (Single)", category: "Biryani", price: 169, isVeg: false },
  { id: "biryani-chicken-fry-full", name: "Chicken Fry Piece Biryani (Full)", category: "Biryani", price: 269, isVeg: false },
  { id: "biryani-chicken-special-single", name: "Special Chicken Biryani (Single)", category: "Biryani", price: 199, isVeg: false },
  { id: "biryani-chicken-special-full", name: "Special Chicken Biryani (Full)", category: "Biryani", price: 299, isVeg: false },
  { id: "biryani-chicken-moghlai-single", name: "Moghlai Chicken Biryani (Single)", category: "Biryani", price: 199, isVeg: false },
  { id: "biryani-chicken-moghlai-full", name: "Moghlai Chicken Biryani (Full)", category: "Biryani", price: 299, isVeg: false },
  { id: "biryani-chicken-gongura-single", name: "Gongura Chicken Biryani (Single)", category: "Biryani", price: 199, isVeg: false },
  { id: "biryani-chicken-gongura-full", name: "Gongura Chicken Biryani (Full)", category: "Biryani", price: 299, isVeg: false },
  { id: "biryani-prawns-single", name: "Prawns Biryani (Single)", category: "Biryani", price: 249, isVeg: false },
  { id: "biryani-prawns-full", name: "Prawns Biryani (Full)", category: "Biryani", price: 349, isVeg: false },
  { id: "biryani-chicken-65", name: "Chicken 65 Biryani", category: "Biryani", price: 169, isVeg: false },
  { id: "biryani-chicken-roast", name: "Chicken Roast Biryani", category: "Biryani", price: 179, isVeg: false },

  // VEG BIRYANI (SINGLE / FULL)
  { id: "biryani-mushroom-single", name: "Mushroom Biryani (Single)", category: "Veg Biryani", price: 149, isVeg: true },
  { id: "biryani-mushroom-full", name: "Mushroom Biryani (Full)", category: "Veg Biryani", price: 249, isVeg: true },
  { id: "biryani-paneer-single", name: "Paneer Biryani (Single)", category: "Veg Biryani", price: 169, isVeg: true },
  { id: "biryani-paneer-full", name: "Paneer Biryani (Full)", category: "Veg Biryani", price: 269, isVeg: true },

  // MOJITOS
  { id: "mojito-mint", name: "Mint Mojito", category: "Mojitos", price: 119, isVeg: true },
  { id: "mojito-strawberry", name: "Strawberry Mojito", category: "Mojitos", price: 119, isVeg: true },
  { id: "mojito-watermelon", name: "Watermelon Mojito", category: "Mojitos", price: 119, isVeg: true },
  { id: "mojito-blueberry", name: "Blue Berry Mojito", category: "Mojitos", price: 119, isVeg: true },
  { id: "mojito-greenapple", name: "Green Apple Mojito", category: "Mojitos", price: 119, isVeg: true },
  { id: "mojito-kiwi", name: "Kiwi Mojito", category: "Mojitos", price: 119, isVeg: true },
];

export const CATEGORIES = [
  "Chinese Soups",
  "Veg Starters",
  "Non-Veg Starters",
  "Veg Rice",
  "Veg Noodles",
  "Non-Veg Rice",
  "Non-Veg Noodles",
  "Biryani",
  "Veg Biryani",
  "Mojitos"
];

export function getLocalMenu() {
  const local = localStorage.getItem("maestro_menu");
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Error parsing local menu, using default", e);
    }
  }
  return DEFAULT_MENU;
}

export function saveMenuToLocal(menu) {
  localStorage.setItem("maestro_menu", JSON.stringify(menu));
}
