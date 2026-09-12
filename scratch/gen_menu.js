const fs = require('fs');

const page1 = [
  {
    title: "CHINESE SOUPS",
    items: [
      ["Hot & Sour Soup (Veg / Non-Veg)", "125/- | 135/-"],
      ["Hot & Sour Soup (Fish)", "159/-"],
      ["Manchow Soup (Veg / Non-Veg)", "125/- | 135/-"],
      ["Manchow Soup (Fish)", "159/-"],
      ["Lemon Coriander (Veg / Non-Veg)", "125/- | 135/-"],
      ["Clear Soup (Veg)", "125/-"],
      ["Sweet Corn Soup (Veg / Non-Veg)", "135/- | 149/-"]
    ]
  },
  {
    title: "VEG STARTERS",
    items: [
      ["Veg Manchuria", "135/-"],
      ["Gobi Manchuria", "169/-"],
      ["Gobi 65", "169/-"],
      ["Gobi Chilly", "169/-"],
      ["Mushroom Manchuria", "169/-"],
      ["Mushroom 65", "179/-"],
      ["Mushroom Chilly", "179/-"],
      ["Baby Corn Manchuria", "179/-"],
      ["Baby Corn 65", "189/-"],
      ["Baby Corn Chilly", "189/-"],
      ["Crispy Corn", "169/-"],
      ["Veg Kaju Manchuria", "215/-"],
      ["Paneer Manchuria", "189/-"],
      ["Paneer 65", "199/-"],
      ["Paneer Chilly", "199/-"],
      ["Kaju Paneer Manchuria", "215/-"],
      ["Kaju Gobi Manchuria", "215/-"],
      ["Kaju Mushroom Manchuria", "215/-"],
      ["Kaju Baby Corn Manchuria", "215/-"],
      ["Veg Special", "189/-"],
      ["Veg Butani", "189/-"],
      ["Veg Green Dry", "179/-"]
    ]
  },
  {
    title: "NON-VEG STARTERS",
    items: [
      ["Egg Boiled", "79/-"],
      ["Egg Omelette", "89/-"],
      ["Egg Manchuria", "155/-"],
      ["Egg Chilly", "169/-"],
      ["Egg 65", "169/-"],
      ["Chicken Manchuria", "205/-"],
      ["Chicken 65", "219/-"],
      ["Garlic Chicken", "219/-"],
      ["Pepper Chicken", "229/-"],
      ["Chilly Chicken", "219/-"],
      ["Chicken Lollypop (4 Pc / 6 Pc)", "229/- | 329/-"],
      ["Chicken Majestic", "239/-"],
      ["Chicken 555", "249/-"],
      ["Dragon Chicken", "249/-"],
      ["Red Pepper Chicken", "239/-"],
      ["Kaju Pakoda", "275/-"],
      ["Drum Sticks (4 Pc / 6 Pc)", "229/- | 329/-"]
    ]
  },
  {
    title: "SIGNATURE CHICKEN SPECIALS",
    items: [
      ["Singapore Chicken", "345/-"],
      ["Chicken Green Line", "285/-"],
      ["Ginger Chicken", "229/-"],
      ["Lemon Chicken", "229/-"],
      ["Jawad Chicken", "239/-"],
      ["Chef Special Chicken", "399/-"],
      ["Maestro Special Chicken", "435/-"]
    ]
  },
  {
    title: "SEAFOOD STARTERS",
    items: [
      ["Chilly Fish", "275/-"],
      ["Apollo Fish", "275/-"],
      ["Fish 65", "285/-"],
      ["Lemon Pepper Fish", "299/-"],
      ["Fish Fingers", "285/-"],
      ["Chilly Prawns", "319/-"],
      ["Pepper Prawns", "335/-"],
      ["Loose Prawns", "335/-"]
    ]
  }
];

const page2 = [
  {
    title: "KEBABS & TANDOOR (HALF / FULL)",
    items: [
      ["Reshmi Kebab", "239/- | 459/-"],
      ["Grill Chicken", "335/- | 665/-"],
      ["Malai Kebab", "219/- | 399/-"],
      ["Kalmi Kebab", "239/- | 459/-"],
      ["Haryali Kebab", "265/- | 515/-"],
      ["Sheekh Kebab", "265/- | 399/-"],
      ["Chicken Tikka", "299/-"],
      ["Tangadi Kebab", "399/-"],
      ["Tandoori Fish (8 Pc)", "345/-"],
      ["Fish Tikka (8 Pc)", "345/-"],
      ["Prawns Tandoori", "399/-"],
      ["Prawns Tikka", "399/-"]
    ]
  },
  {
    title: "ROTI, NAAN & PARATHA",
    items: [
      ["Tandoori Roti", "15/-"],
      ["Butter Roti", "25/-"],
      ["Naan", "30/-"],
      ["Pudina Naan", "35/-"],
      ["Butter Naan", "45/-"],
      ["Garlic Naan", "50/-"],
      ["Laccha Paratha", "55/-"],
      ["Methi Paratha", "25/-"],
      ["Aloo Paratha", "45/-"],
      ["Paneer Paratha", "55/-"],
      ["Plain Kulcha", "35/-"],
      ["Basket (4)", "120/-"]
    ]
  },
  {
    title: "VEG CURRIES",
    items: [
      ["Dal", "69/-"],
      ["Dal Tadka", "95/-"],
      ["Butter Dal", "79/-"],
      ["Malai Dal", "89/-"],
      ["Mix Veg", "105/-"],
      ["Kadai Veg", "125/-"],
      ["Singapore Veg", "149/-"],
      ["Jaipuri", "149/-"],
      ["Paneer Butter Masala", "159/-"],
      ["Kadai Paneer", "169/-"],
      ["Malai Paneer", "159/-"],
      ["Kheema Paneer", "169/-"],
      ["Methi Paneer", "185/-"],
      ["Palak Paneer", "159/-"],
      ["Maestro Paneer Special", "195/-"],
      ["Butter Palak Paneer", "159/-"],
      ["Palak", "135/-"],
      ["Tomato", "135/-"],
      ["Aloo Tomato", "149/-"],
      ["Tomato Chutney", "135/-"],
      ["Aloo Palak", "149/-"],
      ["Gobi Curry", "135/-"],
      ["Gobi Masala", "149/-"],
      ["Gobi Tomato", "135/-"],
      ["Kaju Tomato", "169/-"],
      ["ODS Special Curry", "185/-"],
      ["Khandari Curry", "195/-"],
      ["Mushroom Masala", "159/-"],
      ["Mushroom Curry", "159/-"],
      ["Baby Corn Masala", "159/-"],
      ["Crispy Corn Masala", "169/-"]
    ]
  },
  {
    title: "CHICKEN CURRIES",
    items: [
      ["Chicken Curry (5 Pc)", "149/-"],
      ["Chicken Masala (5 Pc)", "159/-"],
      ["Chicken Fry (6 Pc)", "169/-"],
      ["Mughalai Chicken (Bone)", "169/-"],
      ["Mughalai Chicken (Boneless)", "185/-"],
      ["Butter Chicken (Boneless)", "185/-"],
      ["Ginger Chicken (Boneless)", "195/-"],
      ["Spicy Chicken (Bone)", "185/-"],
      ["Spicy Chicken (Boneless)", "195/-"],
      ["Kadai Chicken (Bone)", "185/-"],
      ["Kadai Chicken (Boneless)", "195/-"],
      ["Kadai Chilly Chicken Curry (Bone)", "205/-"],
      ["Kadai Chilly Chicken Curry (Boneless)", "195/-"],
      ["Maestro Special Chicken (Bone)", "219/-"],
      ["Maestro Special Chicken (Boneless)", "229/-"],
      ["ODS Special Chicken", "219/-"],
      ["Chef Special Chicken", "239/-"],
      ["Gongura Chicken (5 Pc)", "205/-"]
    ]
  }
];

const page3 = [
  {
    title: "EGG & MUTTON CURRIES",
    items: [
      ["Egg Bhurji", "115/-"],
      ["Egg Masala", "135/-"],
      ["Egg Curry", "125/-"],
      ["Egg Fry Curry", "135/-"],
      ["Egg Kheema Masala", "135/-"],
      ["Mutton Curry (6 Pc)", "285/-"],
      ["Mutton Masala (6 Pc)", "285/-"],
      ["Mutton Ginger (6 Pc)", "299/-"],
      ["Butter Mutton Masala (6 Pc)", "309/-"],
      ["Gongura Mutton (6 Pc)", "319/-"]
    ]
  },
  {
    title: "SEAFOOD CURRIES",
    items: [
      ["Fish Curry (Boneless)", "299/-"],
      ["Fish Masala (Boneless)", "299/-"],
      ["Fish Ginger (Boneless)", "309/-"],
      ["Butter Fish (Boneless)", "319/-"],
      ["Prawns Curry (8 Pc)", "309/-"],
      ["Prawns Masala (8 Pc)", "309/-"],
      ["Prawns Ginger (8 Pc)", "319/-"],
      ["Butter Prawns (8 Pc)", "335/-"],
      ["Special Mix Non-Veg Curry", "365/-"]
    ]
  },
  {
    title: "BIRYANI (SINGLE / FULL)",
    items: [
      ["Veg Biryani", "139/-"],
      ["Egg Biryani", "149/-"],
      ["Mushroom Biryani", "169/-"],
      ["Paneer Biryani", "169/-"],
      ["Chicken Dum Biryani", "169/- | 275/-"],
      ["Fry Piece Biryani", "185/- | 285/-"],
      ["Fish Biryani", "195/-"],
      ["Prawns Biryani", "205/-"],
      ["Gongura Biryani", "219/- | 319/-"],
      ["Special Biryani", "229/- | 335/-"],
      ["Mutton Fry Piece Biryani", "249/-"],
      ["Handi Biryani", "285/-"],
      ["Maestro Special Biryani", "345/-"],
      ["Family Pack (3-4 Members)", "645/-"],
      ["Jumbo Biryani (5-6 Members)", "875/-"]
    ]
  },
  {
    title: "VEG RICE & NOODLES",
    items: [
      ["Veg Fried Rice", "99/-"],
      ["Veg Schezwan Fried Rice", "119/-"],
      ["Veg Manchurian Rice", "119/-"],
      ["Veg Manchurian Schezwan Rice", "139/-"],
      ["Gobi Fried Rice", "109/-"],
      ["Mushroom Fried Rice", "119/-"],
      ["Paneer Fried Rice", "139/-"],
      ["Veg Noodles", "109/-"],
      ["Veg Schezwan Noodles", "119/-"],
      ["Veg Manchurian Noodles", "129/-"],
      ["Haka Noodles", "139/-"],
      ["Paneer Noodles", "139/-"]
    ]
  },
  {
    title: "NON-VEG RICE & NOODLES",
    items: [
      ["Egg Fried Rice", "119/-"],
      ["Chicken Fried Rice", "139/-"],
      ["Chicken Schezwan Rice", "149/-"],
      ["Chilly Garlic Chicken Rice", "149/-"],
      ["Prawns Fried Rice", "179/-"],
      ["Mix Non-Veg Fried Rice", "219/-"],
      ["Egg Noodles", "119/-"],
      ["Chicken Noodles", "139/-"],
      ["Chicken Schezwan Noodles", "149/-"],
      ["Prawns Noodles", "169/-"],
      ["Mix Non-Veg Noodles", "219/-"]
    ]
  },
  {
    title: "MOJITOS",
    items: [
      ["Mint Mojito", "119/-"],
      ["Strawberry Mojito", "119/-"],
      ["Watermelon Mojito", "119/-"],
      ["Blue Berry Mojito", "119/-"],
      ["Green Apple Mojito", "119/-"],
      ["Kiwi Mojito", "119/-"]
    ]
  }
];

const renderPage = (pageData, pageNum, totalPages) => {
  const cats = pageData.map(cat => `
    <div class="category">
      <div class="category-title">${cat.title}</div>
      ${cat.items.map(i => `
        <div class="menu-item">
          <div class="item-name">${i[0]}</div>
          <div class="item-price">${i[1]}</div>
        </div>
      `).join('')}
    </div>
  `).join('');

  return `
    <div class="page">
        <div class="header">
            <h1>MAESTRO KITCHEN</h1>
            <p>C A F E & R E S T A U R A N T</p>
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
            --bg-color: #0b0c10;
            --gold: #e2c044;
            --text-main: #ffffff;
            --text-muted: #9a9a9a;
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
            padding: 40px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            position: relative;
            page-break-after: always;
            overflow: hidden;
            background-color: var(--bg-color);
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
            font-size: 3rem;
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
            margin-top: 20px;
        }
        .category {
            break-inside: avoid;
            margin-bottom: 25px;
        }
        .category-title {
            color: var(--gold);
            font-size: 1.1rem;
            font-weight: bold;
            margin-bottom: 12px;
            text-transform: uppercase;
        }
        .menu-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 0.95rem;
            line-height: 1.3;
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
            font-size: 0.8rem;
        }
    </style>
</head>
<body>
    ${renderPage(page1, 1, 3)}
    ${renderPage(page2, 2, 3)}
    ${renderPage(page3, 3, 3)}
</body>
</html>`;

fs.writeFileSync('c:/Users/eluri/OneDrive/Desktop/MAESTRO KITCHEN/pos-app/physical-menu.html', html);
console.log('HTML written successfully');
