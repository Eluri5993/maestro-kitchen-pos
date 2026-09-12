const fs = require('fs');

const vegData = [
  {
    category: "CHINESE SOUPS",
    items: [
      { name: "Hot & Sour Soup (Veg)", price: "125/-" },
      { name: "Manchow Soup (Veg)", price: "125/-" },
      { name: "Lemon Coriander Soup (Veg)", price: "125/-" },
      { name: "Clear Soup (Veg)", price: "125/-" },
      { name: "Sweet Corn Soup (Veg)", price: "135/-" }
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
      { name: "Maestro Paneer Special", price: "195/-", signature: true },
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
      { name: "ODS Special Curry", price: "185/-", signature: true }
    ]
  },
  {
    category: "VEG BIRYANI (SINGLE / FULL)",
    items: [
      { name: "Veg Biryani", price: "139/-" },
      { name: "Mushroom Biryani", price: "169/-" },
      { name: "Paneer Biryani", price: "169/-" }
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

const nonVegData = [
  {
    category: "CHINESE SOUPS",
    items: [
      { name: "Hot & Sour Soup (Non-Veg)", price: "135/-" },
      { name: "Hot & Sour Soup (Fish)", price: "159/-" },
      { name: "Manchow Soup (Non-Veg)", price: "135/-" },
      { name: "Manchow Soup (Fish)", price: "159/-" },
      { name: "Lemon Coriander (Non-Veg)", price: "135/-" },
      { name: "Sweet Corn Soup (Non-Veg)", price: "149/-" }
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
      { name: "Chef Special Chicken", price: "399/-", signature: true },
      { name: "Maestro Special Chicken", price: "435/-", signature: true }
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
      { name: "Maestro Special (Bone / Boneless)", price: "219/- | 229/-", signature: true },
      { name: "ODS Special Chicken", price: "219/-", signature: true },
      { name: "Chef Special Chicken", price: "239/-", signature: true },
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
    category: "NON-VEG BIRYANI",
    items: [
      { name: "Egg Biryani", price: "149/-" },
      { name: "Chicken Dum Biryani", price: "169/- | 275/-" },
      { name: "Fry Piece Biryani", price: "185/- | 285/-" },
      { name: "Fish Biryani", price: "195/-" },
      { name: "Prawns Biryani", price: "205/-" },
      { name: "Gongura Biryani", price: "219/- | 319/-" },
      { name: "Special Biryani", price: "229/- | 335/-" },
      { name: "Mutton Fry Piece Biryani", price: "249/-" },
      { name: "Handi Biryani", price: "285/-" },
      { name: "Maestro Special Biryani", price: "345/-", signature: true },
      { name: "Family Pack (3-4 Members)", price: "645/-" },
      { name: "Jumbo Biryani (5-6 Members)", price: "875/-" }
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

const generateHTML = (data, menuTitle) => {
    // Split into 2 pages
    let pages = [];
    if (menuTitle === "VEGETARIAN") {
        pages = [
            [data[0], data[1], data[2]], // PAGE 1
            [data[3], data[4], data[5], data[6]] // PAGE 2
        ];
    } else {
        pages = [
            [data[0], data[1], data[2], data[3], data[4], data[5]], // PAGE 1
            [data[6], data[7], data[8], data[9], data[10], data[11]] // PAGE 2
        ];
    }

    const pagesHtml = pages.map((pageData, index) => {
        const catHtml = pageData.map(cat => `
            <div class="category">
                <div class="category-header">
                    <h2>${cat.category}</h2>
                    <div class="header-stars">★★★</div>
                </div>
                <div class="items">
                    ${cat.items.map(item => `
                        <div class="item">
                            <div class="item-name">
                                ${item.name}
                                ${item.signature ? '<span class="signature-badge">★ Special</span>' : ''}
                            </div>
                            <div class="leader"></div>
                            <div class="item-price">${item.price}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        return `
        <div class="page">
            <div class="bg-pattern"></div>
            <div class="page-border">
                <div class="header">
                    <img src="logo.jpg" alt="Logo" class="logo">
                    <h1>MAESTRO KITCHEN</h1>
                    <p class="tagline">Elevated Dining & Culinary</p>
                    <p class="subtitle">RESTAURANT | ${menuTitle}</p>
                </div>
                
                <div class="menu-content">
                    ${catHtml}
                </div>

                <div class="footer">
                    <span class="footer-item">📞 +91 98765 43210</span>
                    <span class="footer-item">📍 Hyderabad, India</span>
                    <span class="footer-item">Prices are in INR</span>
                    <span class="footer-item">Page ${index + 1} of 2</span>
                </div>
            </div>
        </div>
        `;
    }).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maestro Kitchen ${menuTitle}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-yellow: #F5C518;
            --accent-gold: #C9A227;
            --text-black: #000000;
        }
        @page {
            size: A4 portrait;
            margin: 0;
        }
        * {
            box-sizing: border-box;
        }
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4; /* outer preview bg */
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .page {
            width: 210mm;
            height: 297mm;
            background-color: var(--bg-yellow);
            position: relative;
            margin: 0 auto 20px auto;
            overflow: hidden;
            page-break-after: always;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        @media print {
            body { background-color: var(--bg-yellow); }
            .page { margin: 0; box-shadow: none; }
        }

        /* Seamless Line-Art Background */
        .bg-pattern {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: url('line_art_pattern.jpg');
            background-repeat: repeat;
            background-size: 300px;
            mix-blend-mode: multiply;
            opacity: 0.12; /* Subtle */
            z-index: 1;
            pointer-events: none;
        }

        /* Double Border */
        .page-border {
            position: absolute;
            top: 15mm; left: 15mm; right: 15mm; bottom: 15mm;
            border: 3px double var(--text-black);
            z-index: 2;
            display: flex;
            flex-direction: column;
            padding: 20px;
        }

        /* Header */
        .header {
            text-align: center;
            margin-bottom: 25px;
        }
        .logo {
            width: 130px;
            height: 130px;
            border-radius: 50%; /* Crop the black square into a circle */
            object-fit: cover;
            margin-bottom: 10px;
            border: 3px solid var(--accent-gold);
            background-color: #000; /* Just in case */
        }
        .header h1 {
            font-family: 'Anton', sans-serif;
            font-size: 38px;
            margin: 0;
            color: var(--text-black);
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .header .tagline {
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-style: italic;
            margin: 5px 0;
            color: #222;
        }
        .header .subtitle {
            font-family: 'Inter', sans-serif;
            font-weight: 700;
            font-size: 13px;
            margin: 0;
            letter-spacing: 3px;
            color: var(--text-black);
        }

        /* 2-Column Masonry Layout */
        .menu-content {
            flex-grow: 1;
            column-count: 2;
            column-gap: 30px;
        }
        
        .category {
            break-inside: avoid;
            margin-bottom: 25px;
        }
        .category-header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 1.5px solid var(--accent-gold);
            padding-bottom: 5px;
        }
        .category-header h2 {
            font-family: 'Anton', sans-serif;
            font-size: 20px;
            margin: 0;
            color: var(--text-black);
            letter-spacing: 1.5px;
        }
        .header-stars {
            color: var(--accent-gold);
            font-size: 12px;
            margin-top: -3px;
        }

        /* Item Rows */
        .items {
            font-family: 'Inter', sans-serif;
            font-size: 12.5px;
        }
        .item {
            display: flex;
            align-items: baseline;
            margin-bottom: 6px;
        }
        .item-name {
            font-weight: 600;
            color: var(--text-black);
            white-space: nowrap;
        }
        .leader {
            flex: 1;
            border-bottom: 2px dotted #555;
            margin: 0 8px;
            position: relative;
            top: -4px;
        }
        .item-price {
            font-weight: 700;
            color: var(--text-black);
            white-space: nowrap;
        }

        /* Special Badges */
        .signature-badge {
            background-color: var(--text-black);
            color: var(--accent-gold);
            font-size: 9px;
            padding: 2px 5px;
            border-radius: 4px;
            margin-left: 5px;
            text-transform: uppercase;
            font-weight: bold;
            vertical-align: middle;
        }

        /* Footer */
        .footer {
            margin-top: auto;
            border-top: 1.5px solid var(--text-black);
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            font-family: 'Inter', sans-serif;
            font-size: 10.5px;
            font-weight: 600;
            color: var(--text-black);
        }
    </style>
</head>
<body>
    ${pagesHtml}
</body>
</html>`;
};

fs.writeFileSync('c:/Users/eluri/OneDrive/Desktop/MAESTRO KITCHEN/pos-app/veg-menu.html', generateHTML(vegData, "VEGETARIAN"));
fs.writeFileSync('c:/Users/eluri/OneDrive/Desktop/MAESTRO KITCHEN/pos-app/nonveg-menu.html', generateHTML(nonVegData, "NON-VEGETARIAN"));
console.log('A4 menus generated successfully.');
