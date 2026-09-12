const fs = require('fs');

const data = [
  {
    category: "🥣 Soups",
    variants: ["Veg", "Non-Veg", "Fish"],
    items: [
      { name: "Hot & Sour", prices: { "Veg": "₹125", "Non-Veg": "₹135", "Fish": "₹159" } },
      { name: "Manchow", prices: { "Veg": "₹125", "Non-Veg": "₹135", "Fish": "₹159" } },
      { name: "Lemon & Coriander", prices: { "Veg": "₹125", "Non-Veg": "₹135" } },
      { name: "Sweet Corn", prices: { "Veg": "₹135", "Non-Veg": "₹149" } },
      { name: "Clear Veg", prices: { "Veg": "₹125" } }
    ]
  },
  {
    category: "🥦 Veg Starters",
    items: [
      { name: "Veg Manchuria", prices: { "": "₹135" } },
      { name: "Gobi Manchuria", prices: { "": "₹169" } },
      { name: "Gobi 65", prices: { "": "₹169" } },
      { name: "Gobi Chilly", prices: { "": "₹169" } },
      { name: "Mushroom Manchuria", prices: { "": "₹169" } },
      { name: "Mushroom 65", prices: { "": "₹179" } },
      { name: "Mushroom Chilly", prices: { "": "₹179" } },
      { name: "Paneer Manchuria", prices: { "": "₹189" } },
      { name: "Paneer 65", prices: { "": "₹199" } },
      { name: "Paneer Chilly", prices: { "": "₹199" } },
      { name: "Kaju Paneer Manchuria", prices: { "": "₹215" } },
      { name: "Kaju Gobi Manchuria", prices: { "": "₹215" } },
      { name: "Kaju Mushroom Manchuria", prices: { "": "₹215" } },
      { name: "Kaju Baby Corn Manchuria", prices: { "": "₹215" } },
      { name: "Kaju Veg Manchuria", prices: { "": "₹215" } },
      { name: "Baby Corn Manchuria", prices: { "": "₹179" } },
      { name: "Baby Corn 65", prices: { "": "₹189" } },
      { name: "Baby Corn Chilly", prices: { "": "₹189" } },
      { name: "Crispy Corn", prices: { "": "₹169" } },
      { name: "Veg Special", prices: { "": "₹189" } },
      { name: "Veg Butani", prices: { "": "₹189" } },
      { name: "Veg Green Dry", prices: { "": "₹179" } }
    ]
  },
  {
    category: "🍳 Egg Starters",
    items: [
      { name: "Egg Boiled", prices: { "": "₹79" } },
      { name: "Egg Omelette", prices: { "": "₹89" } },
      { name: "Egg Manchuria", prices: { "": "₹155" } },
      { name: "Egg Chilly", prices: { "": "₹169" } },
      { name: "Egg 65", prices: { "": "₹169" } }
    ]
  },
  {
    category: "🍗 Non-Veg Chicken Starters",
    items: [
      { name: "Chicken Manchuria", prices: { "": "₹205" } },
      { name: "Chicken 65", prices: { "": "₹219" } },
      { name: "Chilly Chicken", prices: { "": "₹219" } },
      { name: "Garlic Chicken", prices: { "": "₹219" } },
      { name: "Pepper Chicken", prices: { "": "₹229" } },
      { name: "Chicken Lollipop (4 Pc)", prices: { "": "₹229" } },
      { name: "Chicken Lollipop (6 Pc)", prices: { "": "₹329" } },
      { name: "Majestic Chicken", prices: { "": "₹239" } },
      { name: "Chicken 555", prices: { "": "₹249" } },
      { name: "Red Pepper Chicken", prices: { "": "₹239" } },
      { name: "Dragon Chicken", prices: { "": "₹249" } },
      { name: "Kaju Pakoda", prices: { "": "₹275" } },
      { name: "Drum Sticks (4 Pc)", prices: { "": "₹229" } },
      { name: "Drum Sticks (6 Pc)", prices: { "": "₹329" } }
    ]
  },
  {
    category: "👑 Signature Chicken Specials",
    items: [
      { name: "Singapore Chicken", prices: { "": "₹345" } },
      { name: "Chicken Green Line", prices: { "": "₹285" } },
      { name: "Ginger Chicken", prices: { "": "₹229" } },
      { name: "Lemon Chicken", prices: { "": "₹229" } },
      { name: "Jawad Chicken", prices: { "": "₹239" } },
      { name: "Chef Special Chicken", prices: { "": "₹399" } },
      { name: "Maestro Special Chicken", prices: { "": "₹435" } }
    ]
  },
  {
    category: "🍤 Fish & Prawns Starters",
    items: [
      { name: "Chilly Fish", prices: { "": "₹275" } },
      { name: "Apollo Fish", prices: { "": "₹275" } },
      { name: "Fish 65", prices: { "": "₹285" } },
      { name: "Lemon Pepper Fish", prices: { "": "₹299" } },
      { name: "Fish Fingers", prices: { "": "₹285" } },
      { name: "Chilly Prawns", prices: { "": "₹319" } },
      { name: "Pepper Prawns", prices: { "": "₹335" } },
      { name: "Loose Prawns", prices: { "": "₹335" } }
    ]
  },
  {
    category: "🍢 Kebabs & Tandoor",
    variants: ["Full", "Half"],
    items: [
      { name: "Reshmi Kebab", prices: { "Full": "₹459", "Half": "₹239" } },
      { name: "Grill Chicken", prices: { "Full": "₹665", "Half": "₹335" } },
      { name: "Malai Kebab", prices: { "Full": "₹399", "Half": "₹219" } },
      { name: "Kalmi Kebab", prices: { "Full": "₹459", "Half": "₹239" } },
      { name: "Haryali Kebab", prices: { "Full": "₹515", "Half": "₹265" } },
      { name: "Sheekh Kebab", prices: { "Full": "₹399", "Half": "₹265" } },
      { name: "Chicken Tikka", prices: { "Full": "₹299" } },
      { name: "Tangadi Kebab", prices: { "Full": "₹399" } },
      { name: "Tandoori Fish (8 Pc)", prices: { "Full": "₹345" } },
      { name: "Fish Tikka (8 Pc)", prices: { "Full": "₹345" } },
      { name: "Prawns Tandoori", prices: { "Full": "₹399" } },
      { name: "Prawns Tikka", prices: { "Full": "₹399" } }
    ]
  },
  {
    category: "🫓 Roti, Naan & Paratha",
    items: [
      { name: "Tandoori Roti", prices: { "": "₹15" } },
      { name: "Butter Roti", prices: { "": "₹25" } },
      { name: "Naan", prices: { "": "₹30" } },
      { name: "Pudina Naan", prices: { "": "₹35" } },
      { name: "Butter Naan", prices: { "": "₹45" } },
      { name: "Garlic Naan", prices: { "": "₹50" } },
      { name: "Laccha Paratha", prices: { "": "₹55" } },
      { name: "Methi Paratha", prices: { "": "₹25" } },
      { name: "Aloo Paratha", prices: { "": "₹45" } },
      { name: "Paneer Paratha", prices: { "": "₹55" } },
      { name: "Plain Kulcha", prices: { "": "₹35" } },
      { name: "Basket (4)", prices: { "": "₹120" } }
    ]
  },
  {
    category: "🥘 Veg Curries",
    items: [
      { name: "Dal", prices: { "": "₹69" } },
      { name: "Dal Tadka", prices: { "": "₹95" } },
      { name: "Butter Dal", prices: { "": "₹79" } },
      { name: "Malai Dal", prices: { "": "₹89" } },
      { name: "Mix Veg", prices: { "": "₹105" } },
      { name: "Kadai Veg", prices: { "": "₹125" } },
      { name: "Singapore Veg", prices: { "": "₹149" } },
      { name: "Jaipuri", prices: { "": "₹149" } },
      { name: "Paneer Butter Masala", prices: { "": "₹159" } },
      { name: "Kadai Paneer", prices: { "": "₹169" } },
      { name: "Malai Paneer", prices: { "": "₹159" } },
      { name: "Kheema Paneer", prices: { "": "₹169" } },
      { name: "Methi Paneer", prices: { "": "₹185" } },
      { name: "Palak Paneer", prices: { "": "₹159" } },
      { name: "Maestro Paneer Special", prices: { "": "₹195" } },
      { name: "Butter Palak Paneer", prices: { "": "₹159" } },
      { name: "Palak", prices: { "": "₹135" } },
      { name: "Tomato", prices: { "": "₹135" } },
      { name: "Aloo Tomato", prices: { "": "₹149" } },
      { name: "Tomato Chutney", prices: { "": "₹135" } },
      { name: "Aloo Palak", prices: { "": "₹149" } },
      { name: "Gobi Curry", prices: { "": "₹135" } },
      { name: "Gobi Masala", prices: { "": "₹149" } },
      { name: "Gobi Tomato", prices: { "": "₹135" } },
      { name: "Kaju Tomato", prices: { "": "₹169" } },
      { name: "ODS Special Curry", prices: { "": "₹185" } },
      { name: "Khandari Curry", prices: { "": "₹195" } },
      { name: "Mushroom Masala", prices: { "": "₹159" } },
      { name: "Mushroom Curry", prices: { "": "₹159" } },
      { name: "Baby Corn Masala", prices: { "": "₹159" } },
      { name: "Crispy Corn Masala", prices: { "": "₹169" } }
    ]
  },
  {
    category: "🍛 Chicken Curries",
    items: [
      { name: "Chicken Curry (5 Pc)", prices: { "": "₹149" } },
      { name: "Chicken Masala (5 Pc)", prices: { "": "₹159" } },
      { name: "Chicken Fry (6 Pc)", prices: { "": "₹169" } },
      { name: "Mughalai Chicken (Bone)", prices: { "": "₹169" } },
      { name: "Mughalai Chicken (Boneless)", prices: { "": "₹185" } },
      { name: "Butter Chicken (Boneless)", prices: { "": "₹185" } },
      { name: "Ginger Chicken (Boneless)", prices: { "": "₹195" } },
      { name: "Spicy Chicken (Bone)", prices: { "": "₹185" } },
      { name: "Spicy Chicken (Boneless)", prices: { "": "₹195" } },
      { name: "Kadai Chicken (Bone)", prices: { "": "₹185" } },
      { name: "Kadai Chicken (Boneless)", prices: { "": "₹195" } },
      { name: "Kadai Chilly Chicken Curry (Bone)", prices: { "": "₹205" } },
      { name: "Kadai Chilly Chicken Curry (Boneless)", prices: { "": "₹195" } },
      { name: "Maestro Special Chicken Curry (Bone)", prices: { "": "₹219" } },
      { name: "Maestro Special Chicken Curry (Boneless)", prices: { "": "₹229" } },
      { name: "ODS Special Chicken", prices: { "": "₹219" } },
      { name: "Chef Special Chicken", prices: { "": "₹239" } },
      { name: "Gongura Chicken (5 Pc)", prices: { "": "₹205" } }
    ]
  },
  {
    category: "🍳 Egg Curries",
    items: [
      { name: "Egg Bhurji", prices: { "": "₹115" } },
      { name: "Egg Masala", prices: { "": "₹135" } },
      { name: "Egg Curry", prices: { "": "₹125" } },
      { name: "Egg Fry Curry", prices: { "": "₹135" } },
      { name: "Egg Kheema Masala", prices: { "": "₹135" } }
    ]
  },
  {
    category: "🐐 Mutton Curries",
    items: [
      { name: "Mutton Curry (6 Pc)", prices: { "": "₹285" } },
      { name: "Mutton Masala (6 Pc)", prices: { "": "₹285" } },
      { name: "Mutton Ginger (6 Pc)", prices: { "": "₹299" } },
      { name: "Butter Mutton Masala (6 Pc)", prices: { "": "₹309" } },
      { name: "Gongura Mutton (6 Pc)", prices: { "": "₹319" } }
    ]
  },
  {
    category: "🐟 Fish & Prawns Curries",
    items: [
      { name: "Fish Curry (Boneless)", prices: { "": "₹299" } },
      { name: "Fish Masala (Boneless)", prices: { "": "₹299" } },
      { name: "Fish Ginger (Boneless)", prices: { "": "₹309" } },
      { name: "Butter Fish (Boneless)", prices: { "": "₹319" } },
      { name: "Prawns Curry (8 Pc)", prices: { "": "₹309" } },
      { name: "Prawns Masala (8 Pc)", prices: { "": "₹309" } },
      { name: "Prawns Ginger (8 Pc)", prices: { "": "₹319" } },
      { name: "Butter Prawns (8 Pc)", prices: { "": "₹335" } },
      { name: "Special Mix Non-Veg Curry", prices: { "": "₹365" } }
    ]
  },
  {
    category: "🍚 Veg Biryani",
    items: [
      { name: "Veg Biryani", prices: { "": "₹139" } },
      { name: "Mushroom Biryani", prices: { "": "₹169" } },
      { name: "Paneer Biryani", prices: { "": "₹169" } }
    ]
  },
  {
    category: "🍗 Non-Veg Biryani",
    variants: ["Single", "Full"],
    items: [
      { name: "Egg Biryani", prices: { "Single": "₹149" } },
      { name: "Chicken Dum Biryani", prices: { "Single": "₹169", "Full": "₹275" } },
      { name: "Handi Biryani", prices: { "Single": "₹285" } },
      { name: "Fry Piece Biryani", prices: { "Single": "₹185", "Full": "₹285" } },
      { name: "Maestro Special Biryani", prices: { "Single": "₹345" } },
      { name: "Special Biryani", prices: { "Single": "₹229", "Full": "₹335" } },
      { name: "Gongura Biryani", prices: { "Single": "₹219", "Full": "₹319" } },
      { name: "Family Pack Biryani (3-4 Members)", prices: { "Single": "₹645" } },
      { name: "Jumbo Biryani (5-6 Members)", prices: { "Single": "₹875" } },
      { name: "Fish Biryani", prices: { "Single": "₹195" } },
      { name: "Prawns Biryani", prices: { "Single": "₹205" } },
      { name: "Mutton Fry Piece Biryani", prices: { "Single": "₹249" } }
    ]
  }
];

const renderPrices = (prices) => {
  return Object.keys(prices).map(key => {
    if (key === "") {
      return `<div class="price-var"><b>${prices[key]}</b></div>`;
    }
    return `<div class="price-var"><span class="price-label">${key}</span> <b>${prices[key]}</b></div>`;
  }).join('');
};

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maestro Kitchen Menu</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #fffdf7;
            --primary: #4a1525; /* Maroon */
            --gold: #d4af37;
            --text-main: #333333;
            --text-muted: #666666;
        }
        @page {
            size: A3 portrait;
            margin: 15mm;
        }
        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 40px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        .page-container {
            max-width: 1400px;
            margin: 0 auto;
            background: #ffffff;
            border: 8px solid var(--gold);
            padding: 0;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            padding: 60px 40px 40px 40px;
            background-color: var(--primary);
            color: #fffdf7;
            border-bottom: 4px solid var(--gold);
            position: relative;
        }
        .header h1 {
            font-family: 'Playfair Display', serif;
            font-size: 5rem;
            color: var(--gold);
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 4px;
        }
        .header p {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem;
            font-style: italic;
            color: #fffdf7;
            margin: 10px 0 0 0;
            letter-spacing: 2px;
        }
        
        .logo-placeholder {
            width: 80px;
            height: 80px;
            border: 2px dashed rgba(212, 175, 55, 0.5);
            border-radius: 50%;
            margin: 0 auto 20px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(212, 175, 55, 0.8);
            font-size: 0.8rem;
            text-transform: uppercase;
        }

        .content {
            padding: 50px;
            column-count: 2;
            column-gap: 80px;
        }

        .category {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 50px;
        }
        
        .category-title {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            color: var(--primary);
            margin-bottom: 25px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 2px solid var(--gold);
            padding-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .menu-item {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 12px;
            page-break-inside: avoid;
        }
        
        .item-name {
            font-size: 1.15rem;
            font-weight: 500;
            color: var(--primary);
        }
        
        .item-dots {
            flex-grow: 1;
            border-bottom: 1px dotted #ccc;
            margin: 0 15px;
            opacity: 0.6;
            position: relative;
            top: -5px;
        }
        
        .item-prices {
            display: flex;
            gap: 15px;
            align-items: baseline;
        }
        
        .price-var {
            display: flex;
            align-items: baseline;
            gap: 6px;
        }
        
        .price-var b {
            font-size: 1.2rem;
            color: var(--primary);
            font-weight: 700;
        }
        
        .price-label {
            font-size: 0.85rem;
            color: var(--text-muted);
            text-transform: uppercase;
            font-weight: 500;
            letter-spacing: 0.5px;
        }

        .footer {
            text-align: center;
            padding: 30px;
            border-top: 1px solid #eee;
            background: var(--bg-color);
            color: var(--primary);
            font-size: 0.9rem;
            font-weight: 500;
        }

        @media print {
            body {
                background-color: white;
                padding: 0;
            }
            .page-container {
                border: none;
                box-shadow: none;
                width: 100%;
                max-width: 100%;
            }
            .content {
                padding: 30px;
                column-gap: 50px;
            }
            .header {
                border-bottom-width: 6px;
                padding-top: 40px;
            }
            /* Add page break to specific elements to flow well across A3 pages */
            .page-break-before {
                page-break-before: always;
                break-before: page;
            }
        }
    </style>
</head>
<body>
    <div class="page-container">
        
        <!-- Header Section -->
        <div class="header">
            <div class="logo-placeholder">Logo</div>
            <h1>Maestro Kitchen</h1>
            <p>Authentic Flavours, Signature Taste</p>
        </div>

        <!-- Menu Content -->
        <div class="content">
            ${data.map((cat, index) => `
                <div class="category ${index === 7 ? 'page-break-before' : ''}">
                    <div class="category-title">${cat.category}</div>
                    ${cat.items.map(item => `
                        <div class="menu-item">
                            <div class="item-name">${item.name}</div>
                            <div class="item-dots"></div>
                            <div class="item-prices">
                                ${renderPrices(item.prices)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </div>

        <!-- Footer Section -->
        <div class="footer">
            123 Flavor Street, Food District | +91 9989352547 | Prices are exclusive of applicable taxes.
        </div>

    </div>
</body>
</html>`;

fs.writeFileSync('c:/Users/eluri/OneDrive/Desktop/MAESTRO KITCHEN/pos-app/menu.html', html);
console.log('Final print-ready menu generated!');

