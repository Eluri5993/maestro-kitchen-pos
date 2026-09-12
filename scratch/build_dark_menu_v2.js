const fs = require('fs');

// Data from the massive prompt (with Rice, Noodles, Mojitos appended to complete the menu)
const data = [
  {
    category: "CHINESE SOUPS",
    items: [
      { name: "Hot & Sour Soup (Veg / Non-Veg)", price: "125/- | 135/-" },
      { name: "Hot & Sour Soup (Fish)", price: "159/-" },
      { name: "Manchow Soup (Veg / Non-Veg)", price: "125/- | 135/-" },
      { name: "Manchow Soup (Fish)", price: "159/-" },
      { name: "Lemon Coriander (Veg / Non-Veg)", price: "125/- | 135/-" },
      { name: "Clear Soup (Veg)", price: "125/-" },
      { name: "Sweet Corn Soup (Veg / Non-Veg)", price: "135/- | 149/-" }
    ]
  },
  {
    category: "VEG STARTERS",
    items: [
      { name: "Veg Manchuria", price: "135/-" },
      { name: "Gobi Manchuria", price: "169/-" },
      { name: "Gobi 65", price: "169/-" },
      { name: "Gobi Chilly", price: "169/-" },
      { name: "Mushroom Manchuria", price: "169/-" },
      { name: "Mushroom 65", price: "179/-" },
      { name: "Mushroom Chilly", price: "179/-" },
      { name: "Paneer Manchuria", price: "189/-" },
      { name: "Paneer 65", price: "199/-" },
      { name: "Paneer Chilly", price: "199/-" },
      { name: "Kaju Paneer Manchuria", price: "215/-" },
      { name: "Kaju Gobi Manchuria", price: "215/-" },
      { name: "Kaju Mushroom Manchuria", price: "215/-" },
      { name: "Kaju Baby Corn Manchuria", price: "215/-" },
      { name: "Kaju Veg Manchuria", price: "215/-" },
      { name: "Baby Corn Manchuria", price: "179/-" },
      { name: "Baby Corn 65", price: "189/-" },
      { name: "Baby Corn Chilly", price: "189/-" },
      { name: "Crispy Corn", price: "169/-" },
      { name: "Veg Special", price: "189/-" },
      { name: "Veg Butani", price: "189/-" },
      { name: "Veg Green Dry", price: "179/-" }
    ]
  },
  {
    category: "EGG STARTERS",
    items: [
      { name: "Egg Boiled", price: "79/-" },
      { name: "Egg Omelette", price: "89/-" },
      { name: "Egg Manchuria", price: "155/-" },
      { name: "Egg Chilly", price: "169/-" },
      { name: "Egg 65", price: "169/-" }
    ]
  },
  {
    category: "NON-VEG STARTERS",
    items: [
      { name: "Chicken Manchuria", price: "205/-" },
      { name: "Chicken 65", price: "219/-" },
      { name: "Garlic Chicken", price: "219/-" },
      { name: "Pepper Chicken", price: "229/-" },
      { name: "Chilly Chicken", price: "219/-" },
      { name: "Chicken Lollypop (4 Pc / 6 Pc)", price: "229/- | 329/-" },
      { name: "Chicken Majestic", price: "239/-" },
      { name: "Chicken 555", price: "249/-" },
      { name: "Dragon Chicken", price: "249/-" },
      { name: "Red Pepper Chicken", price: "239/-" },
      { name: "Kaju Pakoda", price: "275/-" },
      { name: "Drum Sticks (4 Pc / 6 Pc)", price: "229/- | 329/-" }
    ]
  },
  {
    category: "CHICKEN SPECIALS",
    items: [
      { name: "Singapore Chicken", price: "345/-" },
      { name: "Chicken Green Line", price: "285/-" },
      { name: "Ginger Chicken", price: "229/-" },
      { name: "Lemon Chicken", price: "229/-" },
      { name: "Jawad Chicken", price: "239/-" },
      { name: "Chef Special Chicken", price: "399/-" },
      { name: "Maestro Special Chicken", price: "435/-" }
    ]
  },
  {
    category: "SEAFOOD STARTERS",
    items: [
      { name: "Chilly Fish", price: "275/-" },
      { name: "Apollo Fish", price: "275/-" },
      { name: "Fish 65", price: "285/-" },
      { name: "Lemon Pepper Fish", price: "299/-" },
      { name: "Fish Fingers", price: "285/-" },
      { name: "Chilly Prawns", price: "319/-" },
      { name: "Pepper Prawns", price: "335/-" },
      { name: "Loose Prawns", price: "335/-" }
    ]
  },
  {
    category: "KEBABS & TANDOOR (HALF / FULL)",
    items: [
      { name: "Reshmi Kebab", price: "239/- | 459/-" },
      { name: "Grill Chicken", price: "335/- | 665/-" },
      { name: "Malai Kebab", price: "219/- | 399/-" },
      { name: "Kalmi Kebab", price: "239/- | 459/-" },
      { name: "Haryali Kebab", price: "265/- | 515/-" },
      { name: "Sheekh Kebab", price: "265/- | 399/-" },
      { name: "Chicken Tikka", price: "299/-" },
      { name: "Tangadi Kebab", price: "399/-" },
      { name: "Tandoori Fish (8 Pc)", price: "345/-" },
      { name: "Fish Tikka (8 Pc)", price: "345/-" },
      { name: "Prawns Tandoori", price: "399/-" },
      { name: "Prawns Tikka", price: "399/-" }
    ]
  },
  {
    category: "ROTI, NAAN & PARATHA",
    items: [
      { name: "Tandoori Roti", price: "15/-" },
      { name: "Butter Roti", price: "25/-" },
      { name: "Naan", price: "30/-" },
      { name: "Pudina Naan", price: "35/-" },
      { name: "Butter Naan", price: "45/-" },
      { name: "Garlic Naan", price: "50/-" },
      { name: "Laccha Paratha", price: "55/-" },
      { name: "Methi Paratha", price: "25/-" },
      { name: "Aloo Paratha", price: "45/-" },
      { name: "Paneer Paratha", price: "55/-" },
      { name: "Plain Kulcha", price: "35/-" },
      { name: "Basket (4)", price: "120/-" }
    ]
  },
  {
    category: "VEG CURRIES",
    items: [
      { name: "Dal", price: "69/-" },
      { name: "Dal Tadka", price: "95/-" },
      { name: "Butter Dal", price: "79/-" },
      { name: "Malai Dal", price: "89/-" },
      { name: "Mix Veg", price: "105/-" },
      { name: "Kadai Veg", price: "125/-" },
      { name: "Singapore Veg", price: "149/-" },
      { name: "Jaipuri", price: "149/-" },
      { name: "Paneer Butter Masala", price: "159/-" },
      { name: "Kadai Paneer", price: "169/-" },
      { name: "Malai Paneer", price: "159/-" },
      { name: "Kheema Paneer", price: "169/-" },
      { name: "Methi Paneer", price: "185/-" },
      { name: "Palak Paneer", price: "159/-" },
      { name: "Maestro Paneer Special", price: "195/-" },
      { name: "Butter Palak Paneer", price: "159/-" },
      { name: "Palak", price: "135/-" },
      { name: "Tomato", price: "135/-" },
      { name: "Aloo Tomato", price: "149/-" },
      { name: "Tomato Chutney", price: "135/-" },
      { name: "Aloo Palak", price: "149/-" },
      { name: "Gobi Curry", price: "135/-" },
      { name: "Gobi Masala", price: "149/-" },
      { name: "Gobi Tomato", price: "135/-" },
      { name: "Kaju Tomato", price: "169/-" },
      { name: "ODS Special Curry", price: "185/-" },
      { name: "Khandari Curry", price: "195/-" },
      { name: "Mushroom Masala", price: "159/-" },
      { name: "Mushroom Curry", price: "159/-" },
      { name: "Baby Corn Masala", price: "159/-" },
      { name: "Crispy Corn Masala", price: "169/-" }
    ]
  },
  {
    category: "CHICKEN CURRIES",
    items: [
      { name: "Chicken Curry (5 Pc)", price: "149/-" },
      { name: "Chicken Masala (5 Pc)", price: "159/-" },
      { name: "Chicken Fry (6 Pc)", price: "169/-" },
      { name: "Mughalai (Bone / Boneless)", price: "169/- | 185/-" },
      { name: "Butter Chicken (Boneless)", price: "185/-" },
      { name: "Ginger Chicken (Boneless)", price: "195/-" },
      { name: "Spicy Chicken (Bone / Boneless)", price: "185/- | 195/-" },
      { name: "Kadai Chicken (Bone / Boneless)", price: "185/- | 195/-" },
      { name: "Kadai Chilly Chicken (Bone / Boneless)", price: "205/- | 195/-" },
      { name: "Maestro Special Chicken (Bone / Boneless)", price: "219/- | 229/-" },
      { name: "ODS Special Chicken", price: "219/-" },
      { name: "Chef Special Chicken", price: "239/-" },
      { name: "Gongura Chicken (5 Pc)", price: "205/-" }
    ]
  },
  {
    category: "EGG & MUTTON CURRIES",
    items: [
      { name: "Egg Bhurji", price: "115/-" },
      { name: "Egg Masala", price: "135/-" },
      { name: "Egg Curry", price: "125/-" },
      { name: "Egg Fry Curry", price: "135/-" },
      { name: "Egg Kheema Masala", price: "135/-" },
      { name: "Mutton Curry (6 Pc)", price: "285/-" },
      { name: "Mutton Masala (6 Pc)", price: "285/-" },
      { name: "Mutton Ginger (6 Pc)", price: "299/-" },
      { name: "Butter Mutton Masala (6 Pc)", price: "309/-" },
      { name: "Gongura Mutton (6 Pc)", price: "319/-" }
    ]
  },
  {
    category: "SEAFOOD CURRIES",
    items: [
      { name: "Fish Curry (Boneless)", price: "299/-" },
      { name: "Fish Masala (Boneless)", price: "299/-" },
      { name: "Fish Ginger (Boneless)", price: "309/-" },
      { name: "Butter Fish (Boneless)", price: "319/-" },
      { name: "Prawns Curry (8 Pc)", price: "309/-" },
      { name: "Prawns Masala (8 Pc)", price: "309/-" },
      { name: "Prawns Ginger (8 Pc)", price: "319/-" },
      { name: "Butter Prawns (8 Pc)", price: "335/-" },
      { name: "Special Mix Non-Veg Curry", price: "365/-" }
    ]
  },
  {
    category: "BIRYANI (SINGLE / FULL)",
    items: [
      { name: "Veg Biryani", price: "139/-" },
      { name: "Egg Biryani", price: "149/-" },
      { name: "Mushroom Biryani", price: "169/-" },
      { name: "Paneer Biryani", price: "169/-" },
      { name: "Chicken Dum Biryani", price: "169/- | 275/-" },
      { name: "Fry Piece Biryani", price: "185/- | 285/-" },
      { name: "Fish Biryani", price: "195/-" },
      { name: "Prawns Biryani", price: "205/-" },
      { name: "Gongura Biryani", price: "219/- | 319/-" },
      { name: "Special Biryani", price: "229/- | 335/-" },
      { name: "Mutton Fry Piece Biryani", price: "249/-" },
      { name: "Handi Biryani", price: "285/-" },
      { name: "Maestro Special Biryani", price: "345/-" },
      { name: "Family Pack (3-4 Members)", price: "645/-" },
      { name: "Jumbo Biryani (5-6 Members)", price: "875/-" }
    ]
  },
  {
    category: "VEG RICE & NOODLES",
    items: [
      { name: "Veg Fried Rice", price: "99/-" },
      { name: "Veg Schezwan Fried Rice", price: "119/-" },
      { name: "Veg Manchurian Rice", price: "119/-" },
      { name: "Veg Manchurian Schezwan Rice", price: "139/-" },
      { name: "Gobi Fried Rice", price: "109/-" },
      { name: "Mushroom Fried Rice", price: "119/-" },
      { name: "Paneer Fried Rice", price: "139/-" },
      { name: "Veg Noodles", price: "109/-" },
      { name: "Veg Schezwan Noodles", price: "119/-" },
      { name: "Veg Manchurian Noodles", price: "129/-" },
      { name: "Haka Noodles", price: "139/-" },
      { name: "Paneer Noodles", price: "139/-" }
    ]
  },
  {
    category: "NON-VEG RICE & NOODLES",
    items: [
      { name: "Egg Fried Rice", price: "119/-" },
      { name: "Chicken Fried Rice", price: "139/-" },
      { name: "Chicken Schezwan Rice", price: "149/-" },
      { name: "Chilly Garlic Chicken Rice", price: "149/-" },
      { name: "Prawns Fried Rice", price: "179/-" },
      { name: "Mix Non-Veg Fried Rice", price: "219/-" },
      { name: "Egg Noodles", price: "119/-" },
      { name: "Chicken Noodles", price: "139/-" },
      { name: "Chicken Schezwan Noodles", price: "149/-" },
      { name: "Prawns Noodles", price: "169/-" },
      { name: "Mix Non-Veg Noodles", price: "219/-" }
    ]
  },
  {
    category: "MOJITOS",
    items: [
      { name: "Mint Mojito", price: "119/-" },
      { name: "Strawberry Mojito", price: "119/-" },
      { name: "Watermelon Mojito", price: "119/-" },
      { name: "Blue Berry Mojito", price: "119/-" },
      { name: "Green Apple Mojito", price: "119/-" },
      { name: "Kiwi Mojito", price: "119/-" }
    ]
  }
];

// Grouping into 3 pages exactly as before
const page1 = [data[0], data[1], data[2], data[3], data[4], data[5]];
const page2 = [data[6], data[7], data[8], data[9]];
const page3 = [data[10], data[11], data[12], data[13], data[14], data[15]];

const renderPage = (pageData, pageNum, totalPages) => {
  const cats = pageData.map(cat => `
    <div class="category">
      <div class="category-title">${cat.category}</div>
      ${cat.items.map(i => `
        <div class="menu-item">
          <div class="item-name">${i.name}</div>
          <div class="item-price">${i.price}</div>
        </div>
      `).join('')}
    </div>
  `).join('');

  return `
    <div class="page">
        <div class="header">
            <h1>MAESTRO KITCHEN</h1>
            <p>R E S T A U R A N T</p>
            <div class="header-line"></div>
        </div>
        <div class="menu-columns">
            ${cats}
        </div>
        <div class="footer">Page ${pageNum} of ${totalPages} | Location: Hyderabad, India | Prices are in INR</div>
    </div>
  `;
};

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maestro Kitchen Menu</title>
    <style>
        :root {
            --bg-color: #fff5c2; /* Little more yellow */
            --gold: #8b1a1a; /* Elegant maroon for headers and borders */
            --text-main: #222222; /* Dark text for items */
            --text-muted: #666666; /* Muted text for footers */
        }
        @page {
            size: A4 landscape;
            margin: 0;
        }
        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .page {
            width: 297mm;
            height: 210mm;
            border: 2px solid var(--gold);
            padding: 30px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            position: relative;
            page-break-after: always;
            overflow: hidden;
            background-color: var(--bg-color);
        }
        .page::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 60%;
            height: 60%;
            transform: translate(-50%, -50%);
            background-image: url('logo.jpg');
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
            mix-blend-mode: screen; /* Hides the black background */
            opacity: 0.25; /* Subtle watermark */
            z-index: 0;
            pointer-events: none;
        }
        .header, .menu-columns, .footer {
            position: relative;
            z-index: 1; /* Keep text above watermark */
        }
        @media print {
            .page {
                border: 2px solid var(--gold);
                margin: 0;
            }
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            color: var(--gold);
            font-size: 3.2rem;
            margin: 0;
            text-transform: uppercase;
            font-weight: bold;
        }
        .header p {
            color: var(--text-muted);
            font-size: 1.1rem;
            font-style: italic;
            margin: 5px 0 15px 0;
            letter-spacing: 4px;
        }
        .header-line {
            border-top: 1px solid var(--gold);
            margin: 0 40px;
        }
        .menu-columns {
            column-count: 3;
            column-gap: 50px;
            flex-grow: 1;
            margin-top: 15px;
        }
        .category {
            break-inside: avoid;
            margin-bottom: 22px;
        }
        .category-title {
            color: var(--gold);
            font-size: 1.05rem;
            font-weight: bold;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        .menu-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 0.9rem;
            line-height: 1.25;
        }
        .item-name {
            flex: 1;
            padding-right: 15px;
        }
        .item-price {
            text-align: right;
            white-space: nowrap;
        }
        .footer {
            position: absolute;
            bottom: 15px;
            left: 0;
            width: 100%;
            text-align: center;
            color: var(--text-muted);
            font-size: 0.75rem;
        }
    </style>
</head>
<body>
    ${renderPage(page1, 1, 3)}
    ${renderPage(page2, 2, 3)}
    ${renderPage(page3, 3, 3)}
</body>
</html>`;

fs.writeFileSync('c:/Users/eluri/OneDrive/Desktop/MAESTRO KITCHEN/pos-app/dark_menu.html', html);
console.log('HTML written successfully');
