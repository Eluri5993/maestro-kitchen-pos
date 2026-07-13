import { getLocalMenu, CATEGORIES, DEFAULT_MENU } from "./menu.js";
import { 
  calculateCartTotals, 
  generateThermalReceiptHTML, 
  getLocalTaxConfig
} from "./billing.js";
import { 
  getLocalOrders, 
  getDashboardMetrics, 
  getTopSellingItems, 
  getHourlySalesData, 
  getCategorySalesData, 
  exportOrdersToCSV 
} from "./analytics.js";
import { auth, db, firebaseConfig } from "./firebase-init.js";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  updatePassword, 
  sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  onSnapshot,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Global Runtime State
let menu = [];
let orders = [];
let taxConfig = {};
let cart = [];
let groceries = [];
let recurringBills = [];
let tables = [];
let activeTableId = null;
let currentUserProfile = null;
let userDocUnsubscribe = null;
let usersList = [];

const DEFAULT_GROCERIES = [
  { id: "groc-1", date: "2026-07-10", item: "Raw Chicken", qty: 25, unit: "kg", cost: 6250, buyer: "Shiva", paymode: "UPI", note: "Anand Broiler" },
  { id: "groc-2", date: "2026-07-11", item: "Basmati Rice", qty: 50, unit: "kg", cost: 4800, buyer: "Vamshi", paymode: "Cash", note: "Kiran Groceries" },
  { id: "groc-3", date: "2026-07-11", item: "Cooking Oil", qty: 15, unit: "ltr", cost: 2100, buyer: "Antony", paymode: "Card", note: "Metro Wholesalers" },
  { id: "groc-4", date: "2026-07-12", item: "Onions & Tomatoes", qty: 12, unit: "kg", cost: 720, buyer: "Shiva", paymode: "UPI", note: "Local Mandi" },
  { id: "groc-5", date: "2026-07-12", item: "Fresh Mint & Lemons", qty: 2, unit: "kg", cost: 180, buyer: "Vamshi", paymode: "Cash", note: "Sabzi Bazar" },
  { id: "groc-6", date: "2026-07-12", item: "Ginger-Garlic Paste", qty: 5, unit: "kg", cost: 950, buyer: "Santhosh", paymode: "UPI", note: "Wholesale Grocery" },
];

const DEFAULT_BILLS = [
  { id: "bill-1", name: "Rent", category: "Rent", amount: 15000, period: "2026-07", dueDate: "2026-07-05", status: "Paid", paidDate: "2026-07-04", notes: "Owner Antony" },
  { id: "bill-2", name: "Electricity Bill", category: "Electricity", amount: 3500, period: "2026-07", dueDate: "2026-07-15", status: "Unpaid", paidDate: "", notes: "Expected high summer load" },
  { id: "bill-3", name: "Commercial Cylinder", category: "Gas", amount: 2200, period: "2026-07", dueDate: "2026-07-10", status: "Paid", paidDate: "2026-07-09", notes: "Indane Gas Agency" }
];

let activeCategory = CATEGORIES[0];
let activeDiningMode = "Dine-In";
let activePayMode = "UPI";
let discount = { type: "percent", value: 0 };

// Chart.js instances
let hourlyChartInstance = null;
let modeChartInstance = null;

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  hydrateState();
  initViewRouting();
  initPOSBilling();
  initInventoryView();
  initOrdersView();
  initMenuManagement();
  initRecurringBills();
  initSettingsView();
  initTablesView();
  initAuth();
  initUsersView();
  
  // Initial Icon Render
  lucide.createIcons();
});

function hydrateState() {
  menu = getLocalMenu();
  orders = getLocalOrders();
  taxConfig = getLocalTaxConfig();
  groceries = getLocalGroceries();
  recurringBills = getLocalRecurringBills();
  tables = getLocalTables();

  // Force update address and phone to user request
  taxConfig.restaurantAddress = "2-364, Sachivalaya Colony, Hyderabad, Vanasthalipuram, Telangana 500070";
  taxConfig.restaurantPhone = "+91 9989352547";
}

function getLocalTables() {
  const local = localStorage.getItem("maestro_tables");
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Error parsing local tables", e);
    }
  }
  return [];
}

let lastTablesState = [];
async function saveTablesToLocal(data) {
  localStorage.setItem("maestro_tables", JSON.stringify(data));
  try {
    for (const t of data) {
      const last = lastTablesState.find(x => x.id === t.id);
      if (!last || JSON.stringify(last) !== JSON.stringify(t)) {
        await setDoc(doc(db, "tables", t.id.toString()), {
          status: t.status,
          cart: t.cart || [],
          reservation: t.reservation || null
        });
      }
    }
    lastTablesState = JSON.parse(JSON.stringify(data));
  } catch (e) {
    console.error("Firestore tables sync failed", e);
  }
}

function getLocalGroceries() {
  const local = localStorage.getItem("maestro_groceries");
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Error parsing local groceries", e);
    }
  }
  return [];
}

let lastGroceriesState = [];
async function saveGroceriesToLocal(data) {
  localStorage.setItem("maestro_groceries", JSON.stringify(data));
  try {
    const snapshot = await getDocs(collection(db, "groceries"));
    snapshot.forEach(async docSnap => {
      if (!data.some(x => x.id === docSnap.id)) {
        await deleteDoc(doc(db, "groceries", docSnap.id));
      }
    });
    for (const g of data) {
      const last = lastGroceriesState.find(x => x.id === g.id);
      if (!last || JSON.stringify(last) !== JSON.stringify(g)) {
        await setDoc(doc(db, "groceries", g.id), g);
      }
    }
    lastGroceriesState = JSON.parse(JSON.stringify(data));
  } catch (e) {
    console.error("Firestore groceries sync failed", e);
  }
}

// ----------------------------------------------------
// UI TOAST NOTIFICATIONS
// ----------------------------------------------------
function showToast(message, type = "success") {
  const host = document.getElementById("notification-host");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let iconName = "check-circle";
  if (type === "error") iconName = "alert-circle";
  if (type === "warn") iconName = "alert-triangle";
  
  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span>${message}</span>
  `;
  host.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.animation = "toastSlideIn 0.3s reverse forwards";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ----------------------------------------------------
// VIEW ROUTER
// ----------------------------------------------------
function initViewRouting() {
  const navItems = document.querySelectorAll(".nav-item");
  const panels = document.querySelectorAll(".view-panel");
  const titleEl = document.getElementById("view-title");

  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const view = item.getAttribute("data-view");
      
      navItems.forEach(n => n.classList.remove("active"));
      item.classList.add("active");
      
      panels.forEach(p => {
        p.classList.remove("active");
        if (p.id === `view-${view}`) {
          p.classList.add("active");
        }
      });

      // Update header title
      const viewNames = {
        dashboard: "Dashboard Overview",
        pos: "POS Billing Terminal",
        inventory: "Daily Grocery Expense Log",
        orders: "Historical Sales Ledger",
        "menu-mgmt": "Menu Catalog Control",
        "recurring-bills": "Recurring Expenses Ledger",
        settings: "POS Configurations & Settings"
      };
      titleEl.innerText = viewNames[view] || "POS Terminal";

      // Refresh data on switching views
      if (view === "dashboard") {
        renderDashboard();
      } else if (view === "inventory") {
        renderGroceries();
      } else if (view === "menu-mgmt") {
        renderMenuManagement();
      } else if (view === "recurring-bills") {
        renderRecurringBills();
      } else if (view === "orders") {
        renderOrdersList();
      } else if (view === "settings") {
        renderSettingsForm();
      } else if (view === "tables") {
        renderTables();
      }
      
      // If navigating to POS from sidebar, reset active table mode
      if (view === "pos" && e.isTrusted) {
        if (activeTableId !== null) {
           activeTableId = null;
           cart = [];
           document.getElementById("checkout-discount-value").value = "";
           document.getElementById("checkout-discount-reason").value = "";
           document.getElementById("checkout-discount-type").value = "percent";
           renderCart();
           updatePOSActiveTableUI();
        }
      }
      
      // Update icons
      lucide.createIcons();
    });
  });
}

// ----------------------------------------------------
// DASHBOARD VIEW
// ----------------------------------------------------
function renderDashboard() {
  const metrics = getDashboardMetrics(orders);
  
  // Set Text Values
  document.getElementById("dash-revenue").innerText = `₹${metrics.revenue.toLocaleString()}`;
  document.getElementById("dash-bills").innerText = metrics.orderCount;
  document.getElementById("dash-aov").innerText = `₹${metrics.avgOrderValue.toLocaleString()}`;
  
  // Today's Grocery spend
  const todayStr = new Date().toISOString().substring(0, 10);
  const todayGroceries = groceries.filter(g => g.date === todayStr);
  const todayGrocSpend = todayGroceries.reduce((sum, g) => sum + g.cost, 0);
  document.getElementById("dash-groceries-today").innerText = `₹${todayGrocSpend.toLocaleString()}`;
  
  // Render Dashboard Charts
  renderDashboardCharts(metrics);

  // Render Top Selling Items Table
  const topSelling = getTopSellingItems(orders, 5);
  const topRows = document.getElementById("dash-top-selling-rows");
  if (topSelling.length === 0) {
    topRows.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--text-muted);">No sales data logged yet</td></tr>`;
  } else {
    topRows.innerHTML = topSelling.map(item => `
      <tr>
        <td>${item.name}</td>
        <td style="text-align: center;" class="bold">${item.qty}</td>
        <td style="text-align: right;" class="bold color-gold">₹${item.revenue.toLocaleString()}</td>
      </tr>
    `).join("");
  }

  // Render Recent Groceries Log List
  const recentGrocRows = document.getElementById("dash-recent-groceries-rows");
  const sortedGroc = [...groceries].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  if (sortedGroc.length === 0) {
    recentGrocRows.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No grocery logs yet</td></tr>`;
  } else {
    recentGrocRows.innerHTML = sortedGroc.map(g => `
      <tr>
        <td>${g.date}</td>
        <td class="bold">${g.item}</td>
        <td style="text-align: right;" class="bold color-gold">₹${g.cost.toLocaleString()}</td>
        <td><span class="badge-buyer" style="padding:2px 6px; border-radius:4px; font-size:10px; background:rgba(255,255,255,0.06);">${g.buyer}</span></td>
      </tr>
    `).join("");
  }
}

function renderDashboardCharts(metrics) {
  // Chart 1: Hourly trend
  const hourlyData = getHourlySalesData(orders);
  const ctxHourly = document.getElementById("hourlySalesChart").getContext("2d");
  
  if (hourlyChartInstance) hourlyChartInstance.destroy();
  
  hourlyChartInstance = new Chart(ctxHourly, {
    type: "line",
    data: {
      labels: hourlyData.labels,
      datasets: [{
        label: "Hourly Revenue (₹)",
        data: hourlyData.data,
        borderColor: "#d4af37",
        backgroundColor: "rgba(212, 175, 55, 0.15)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#d4af37",
        pointBorderColor: "#fff",
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          grid: { color: "rgba(255, 255, 255, 0.05)" },
          ticks: { color: "#94a3b8" }
        },
        x: {
          grid: { display: false },
          ticks: { color: "#94a3b8" }
        }
      }
    }
  });

  // Chart 2: Order Modes Breakdown
  const ctxMode = document.getElementById("modeChart").getContext("2d");
  
  if (modeChartInstance) modeChartInstance.destroy();
  
  const hasModeData = metrics.modes.dineIn > 0 || metrics.modes.takeaway > 0 || metrics.modes.delivery > 0;
  
  modeChartInstance = new Chart(ctxMode, {
    type: "doughnut",
    data: {
      labels: ["Dine-In", "Takeaway", "Delivery"],
      datasets: [{
        data: hasModeData ? [metrics.modes.dineIn, metrics.modes.takeaway, metrics.modes.delivery] : [1, 1, 1],
        backgroundColor: hasModeData ? ["#3b82f6", "#f59e0b", "#a78bfa"] : ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.05)", "rgba(255,255,255,0.05)"],
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#94a3b8", boxWidth: 12 }
        }
      },
      cutout: "70%"
    }
  });
}

// ----------------------------------------------------
// POS BILLING TERMINAL
// ----------------------------------------------------
function initPOSBilling() {
  // Render category buttons
  const catContainer = document.getElementById("pos-categories-list");
  catContainer.innerHTML = CATEGORIES.map(cat => {
    const count = menu.filter(item => item.category === cat).length;
    return `
      <div class="category-tab ${cat === activeCategory ? "active" : ""}" data-category="${cat}">
        <span>${cat}</span>
        <span class="category-badge">${count}</span>
      </div>
    `;
  }).join("");

  // Category Tab Selection Event
  document.querySelectorAll(".category-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".category-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeCategory = tab.getAttribute("data-category");
      renderPOSItems();
    });
  });

  // Search Event
  document.getElementById("pos-search-input").addEventListener("input", (e) => {
    const searchVal = e.target.value.toLowerCase();
    renderPOSItems(searchVal);
  });

  // Dining Mode Event Selection
  document.querySelectorAll("[data-dining-mode]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-dining-mode]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeDiningMode = btn.getAttribute("data-dining-mode");
    });
  });

  // Payment Mode Event Selection
  document.querySelectorAll("[data-pay-mode]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-pay-mode]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activePayMode = btn.getAttribute("data-pay-mode");
    });
  });

  // Clear Cart Event
  document.getElementById("btn-clear-cart").addEventListener("click", () => {
    cart = [];
    document.getElementById("checkout-discount-value").value = "";
    document.getElementById("checkout-discount-reason").value = "";
    document.getElementById("checkout-discount-type").value = "percent";
    renderCart();
    showToast("Cart cleared", "success");
  });

  // PLACE ORDER / CHECKOUT Event
  document.getElementById("btn-checkout-place").addEventListener("click", placePOSOrder);

  // Discount input listeners
  const discType = document.getElementById("checkout-discount-type");
  const discVal = document.getElementById("checkout-discount-value");
  if (discType && discVal) {
    discType.addEventListener("change", updateCartCalculations);
    discVal.addEventListener("input", updateCartCalculations);
  }

  // Initial Item rendering
  renderPOSItems();
  renderCart();
}

function renderPOSItems(searchFilter = "") {
  const grid = document.getElementById("pos-items-grid");
  
  // Filter menu items
  const filtered = menu.filter(item => {
    const matchesCategory = searchFilter ? true : item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchFilter) || 
                          item.category.toLowerCase().includes(searchFilter);
    const isAvailable = item.available !== false;
    return matchesCategory && matchesSearch && isAvailable;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-muted);">
      No menu items match your query
    </div>`;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const discountPercent = item.discountPercent || 0;
    const hasDiscount = discountPercent > 0;
    const finalPrice = hasDiscount ? (item.price * (1 - discountPercent / 100)) : item.price;
    const imageTag = item.image ? `<img src="${item.image}" style="width:100%; height:120px; object-fit:cover; border-radius:8px 8px 0 0;" onerror="this.style.display='none'">` : "";

    return `
      <div class="item-card" data-item-id="${item.id}">
        ${imageTag}
        <div class="item-card-badge ${item.isVeg ? "veg" : "nonveg"}"></div>
        <div class="item-card-name">${item.name}</div>
        <div class="item-card-footer">
          <div class="item-card-price" style="flex-wrap: wrap; gap: 4px;">
            ${hasDiscount ? `<span style="text-decoration:line-through; font-size:11px; opacity:0.6;">₹${item.price}</span>` : ""}
            <span>₹${finalPrice.toFixed(0)}</span>
            ${hasDiscount ? `<span style="font-size:9px; color:var(--veg-green); font-weight:bold;">(-${discountPercent}%)</span>` : ""}
          </div>
          <button class="item-card-add-btn">+</button>
        </div>
      </div>
    `;
  }).join("");

  // Bind Card Addition Click
  grid.querySelectorAll(".item-card").forEach(card => {
    card.addEventListener("click", () => {
      const itemId = card.getAttribute("data-item-id");
      const menuItem = menu.find(i => i.id === itemId);
      if (menuItem) addToCart(menuItem);
    });
  });
}

function addToCart(menuItem) {
  const existing = cart.find(c => c.menuId === menuItem.id);
  const discountPercent = menuItem.discountPercent || 0;
  const finalPrice = discountPercent > 0 ? (menuItem.price * (1 - discountPercent / 100)) : menuItem.price;

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      menuId: menuItem.id,
      name: menuItem.name,
      price: finalPrice,
      qty: 1,
      notes: ""
    });
  }
  renderCart();
}

function renderCart() {
  const cartList = document.getElementById("cart-items-target");
  
  if (cart.length === 0) {
    cartList.innerHTML = `
      <div class="cart-empty-state">
        <i data-lucide="shopping-bag"></i>
        <p>No items added to bill yet</p>
      </div>
    `;
    lucide.createIcons();
    updateCartCalculations();
    return;
  }

  cartList.innerHTML = cart.map(item => `
    <div class="cart-item-row" data-cart-id="${item.menuId}">
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price-sub">₹${item.price.toFixed(2)} x ${item.qty}</div>
        
        <span class="cart-item-note-trigger" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
          ${item.notes ? "Edit Note" : "+ Add Instruction"}
        </span>
        <input type="text" class="cart-item-note-input" value="${item.notes}" placeholder="E.g. Extra spicy, no onions" style="display: ${item.notes ? "block" : "none"};" />
      </div>
      
      <div class="cart-item-controls">
        <i data-lucide="trash-2" class="cart-item-delete" data-action="delete"></i>
        <div class="cart-qty-buttons">
          <button class="qty-btn" data-action="dec">-</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" data-action="inc">+</button>
        </div>
      </div>
    </div>
  `).join("");

  lucide.createIcons();

  // Bind cart row control click actions
  cartList.querySelectorAll(".cart-item-row").forEach(row => {
    const id = row.getAttribute("data-cart-id");
    
    // Qty controls
    row.querySelector("[data-action='inc']").addEventListener("click", () => {
      const item = cart.find(c => c.menuId === id);
      if (item) { item.qty++; renderCart(); }
    });
    
    row.querySelector("[data-action='dec']").addEventListener("click", () => {
      const item = cart.find(c => c.menuId === id);
      if (item) {
        item.qty--;
        if (item.qty <= 0) {
          cart = cart.filter(c => c.menuId !== id);
        }
        renderCart();
      }
    });

    row.querySelector("[data-action='delete']").addEventListener("click", () => {
      cart = cart.filter(c => c.menuId !== id);
      renderCart();
    });

    // Notes instructions change
    const inputNote = row.querySelector(".cart-item-note-input");
    inputNote.addEventListener("blur", () => {
      const item = cart.find(c => c.menuId === id);
      if (item) {
        item.notes = inputNote.value;
      }
    });
    inputNote.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        const item = cart.find(c => c.menuId === id);
        if (item) {
          item.notes = inputNote.value;
          inputNote.style.display = "none";
          renderCart();
        }
      }
    });
  });

  if (typeof syncActiveTableCart === 'function') syncActiveTableCart();
  updateCartCalculations();
}

function updateCartCalculations() {
  const discTypeEl = document.getElementById("checkout-discount-type");
  const discValEl = document.getElementById("checkout-discount-value");
  const type = discTypeEl ? discTypeEl.value : "percent";
  const val = discValEl ? (parseFloat(discValEl.value) || 0) : 0;

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  let validatedVal = val;
  if (val < 0) validatedVal = 0;
  else if (type === "percent" && val > 100) validatedVal = 100;
  else if (type === "flat" && val > subtotal) validatedVal = subtotal;

  const activeDiscount = { type, value: validatedVal };
  const totals = calculateCartTotals(cart, activeDiscount, taxConfig);
  
  document.getElementById("bill-subtotal").innerText = `₹${totals.subtotal.toFixed(2)}`;
  document.getElementById("bill-cgst").innerText = `₹${totals.cgst.toFixed(2)}`;
  document.getElementById("bill-sgst").innerText = `₹${totals.sgst.toFixed(2)}`;
  document.getElementById("bill-roundoff").innerText = `${totals.roundOff > 0 ? "+" : ""}₹${totals.roundOff.toFixed(2)}`;
  document.getElementById("bill-total").innerText = `₹${totals.finalTotal.toFixed(2)}`;

  const discountRow = document.getElementById("summary-discount-row");
  if (totals.discountAmount > 0) {
    discountRow.style.display = "flex";
    document.getElementById("bill-discount").innerText = `-₹${totals.discountAmount.toFixed(2)}`;
  } else {
    discountRow.style.display = "none";
  }
}

function placePOSOrder() {
  if (cart.length === 0) {
    showToast("Cannot place order. Cart is empty", "error");
    return;
  }

  const type = document.getElementById("checkout-discount-type").value;
  const val = parseFloat(document.getElementById("checkout-discount-value").value) || 0;
  const reason = document.getElementById("checkout-discount-reason").value || "";

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  if (val < 0) {
    showToast("Discount value cannot be negative", "error");
    return;
  }
  if (type === "percent" && val > 100) {
    showToast("Discount percentage cannot exceed 100%", "error");
    return;
  }
  if (type === "flat" && val > subtotal) {
    showToast("Discount amount cannot exceed the subtotal", "error");
    return;
  }

  const activeDiscount = { type, value: val, reason };
  const totals = calculateCartTotals(cart, activeDiscount, taxConfig);

  const newOrder = {
    id: `MK-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString(),
    mode: activeDiningMode,
    payment: activePayMode,
    tableNumber: activeTableId || null,
    items: [...cart],
    totals: totals,
    discountInfo: {
      type: activeDiscount.type,
      value: activeDiscount.value,
      amount: totals.discountAmount,
      reason: activeDiscount.reason
    }
  };

  // Save order records
  orders.push(newOrder);
  saveOrdersToLocal(orders);

  // If this was an active table, clear the table
  if (activeTableId !== null) {
    const t = tables.find(x => x.id === activeTableId);
    if (t) {
      t.status = "Available";
      t.cart = [];
      t.reservation = null;
    }
    saveTablesToLocal(tables);
    activeTableId = null;
    updatePOSActiveTableUI();
  }

  // 4. Print receipt thermal view in hidden print iframe
  const printIframe = document.getElementById("receipt-print-area");
  const htmlContent = generateThermalReceiptHTML(newOrder, taxConfig);
  
  const doc = printIframe.contentDocument || printIframe.contentWindow.document;
  doc.open();
  doc.write(htmlContent);
  doc.close();

  // Trigger browser print
  setTimeout(() => {
    printIframe.contentWindow.focus();
    printIframe.contentWindow.print();
  }, 300);

  // Reset POS terminal Cart state
  cart = [];
  document.getElementById("checkout-discount-value").value = "";
  document.getElementById("checkout-discount-reason").value = "";
  document.getElementById("checkout-discount-type").value = "percent";
  renderCart();
  
  showToast(`Bill #${newOrder.id} generated and printed successfully!`, "success");
}

// ----------------------------------------------------
// DAILY GROCERIES LEDGER VIEW
// ----------------------------------------------------
function initInventoryView() {
  const dateInput = document.getElementById("groc-date");
  if (dateInput) {
    dateInput.value = new Date().toISOString().substring(0, 10);
  }

  const form = document.getElementById("groceries-log-form");
  
  const grocQty = document.getElementById("groc-qty");
  const grocUnitCost = document.getElementById("groc-unit-cost");
  const grocCost = document.getElementById("groc-cost");
  
  function updateGrocTotal() {
    const qty = parseFloat(grocQty.value) || 0;
    const unitCost = parseFloat(grocUnitCost.value) || 0;
    const total = qty * unitCost;
    grocCost.value = total > 0 ? total.toFixed(2) : "";
  }
  
  if (grocQty) grocQty.addEventListener("input", updateGrocTotal);
  if (grocUnitCost) grocUnitCost.addEventListener("input", updateGrocTotal);
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newGroc = {
      id: `groc-${Date.now()}`,
      date: document.getElementById("groc-date").value,
      item: document.getElementById("groc-item").value,
      qty: parseFloat(document.getElementById("groc-qty").value),
      unit: document.getElementById("groc-unit").value,
      unitCost: parseFloat(document.getElementById("groc-unit-cost").value) || 0,
      cost: parseFloat(document.getElementById("groc-cost").value),
      buyer: document.getElementById("groc-buyer").value,
      paymode: document.getElementById("groc-paymode").value,
      note: document.getElementById("groc-note").value || ""
    };

    groceries.push(newGroc);
    saveGroceriesToLocal(groceries);
    
    // Reset form fields
    document.getElementById("groc-item").value = "";
    document.getElementById("groc-qty").value = "";
    document.getElementById("groc-unit-cost").value = "";
    document.getElementById("groc-cost").value = "";
    document.getElementById("groc-note").value = "";
    
    renderGroceries();
    renderDashboard();
    showToast("Grocery purchase logged successfully", "success");
  });

  document.getElementById("groc-filter-search").addEventListener("input", renderGroceries);
  document.getElementById("groc-filter-buyer").addEventListener("change", renderGroceries);
  document.getElementById("groc-filter-date").addEventListener("change", renderGroceries);

  document.getElementById("btn-export-groceries-csv").addEventListener("click", () => {
    const csvContent = exportGroceriesToCSV(groceries);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Maestro_Kitchen_Groceries_Ledger_${new Date().toISOString().substring(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Grocery ledger CSV exported", "success");
  });

  renderGroceries();
}

function renderGroceries() {
  const searchVal = document.getElementById("groc-filter-search").value.toLowerCase();
  const buyerVal = document.getElementById("groc-filter-buyer").value;
  const dateVal = document.getElementById("groc-filter-date").value;

  const filtered = groceries.filter(g => {
    const matchesSearch = g.item.toLowerCase().includes(searchVal) || g.note.toLowerCase().includes(searchVal);
    const matchesBuyer = buyerVal === "All" ? true : g.buyer === buyerVal;
    const matchesDate = !dateVal ? true : g.date === dateVal;
    return matchesSearch && matchesBuyer && matchesDate;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  // Metrics
  let totalSpend = 0;
  let spendShiva = 0;
  let spendVamshi = 0;
  let spendAntony = 0;
  let spendSanthosh = 0;

  groceries.forEach(g => {
    totalSpend += g.cost;
    if (g.buyer === "Shiva") spendShiva += g.cost;
    else if (g.buyer === "Vamshi") spendVamshi += g.cost;
    else if (g.buyer === "Antony") spendAntony += g.cost;
    else if (g.buyer === "Santhosh") spendSanthosh += g.cost;
  });

  document.getElementById("groceries-total-cost").innerText = `₹${totalSpend.toLocaleString()}`;
  document.getElementById("groceries-spent-shiva").innerText = `₹${spendShiva.toLocaleString()}`;
  document.getElementById("groceries-spent-vamshi").innerText = `₹${spendVamshi.toLocaleString()}`;
  document.getElementById("groceries-spent-antony").innerText = `₹${spendAntony.toLocaleString()}`;
  document.getElementById("groceries-spent-santhosh").innerText = `₹${spendSanthosh.toLocaleString()}`;

  const rowsTarget = document.getElementById("groceries-table-rows");
  if (filtered.length === 0) {
    rowsTarget.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-muted); padding: 20px;">No grocery purchases found matching filter</td></tr>`;
    return;
  }

  rowsTarget.innerHTML = filtered.map(g => `
    <tr data-groc-id="${g.id}">
      <td>${g.date}</td>
      <td class="bold">${g.item}</td>
      <td style="text-align: right;">${g.qty} ${g.unit}</td>
      <td style="text-align: right;">₹${(g.unitCost || (g.cost / (g.qty || 1))).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} / ${g.unit}</td>
      <td style="text-align: right;" class="bold color-gold">₹${g.cost.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
      <td>${g.buyer}</td>
      <td><span class="badge-pay ${g.paymode.toLowerCase()}">${g.paymode}</span></td>
      <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${g.note || ""}">${g.note || "-"}</td>
      <td style="text-align: center;">
        <button class="qty-btn btn-delete-groc" style="color:var(--nonveg-red); border:none; background:none; cursor:pointer; font-size:16px;">&times;</button>
      </td>
    </tr>
  `).join("");

  rowsTarget.querySelectorAll(".btn-delete-groc").forEach(btn => {
    btn.onclick = (e) => {
      const tr = btn.closest("tr");
      const grocId = tr.getAttribute("data-groc-id");
      const grocItem = groceries.find(x => x.id === grocId);
      if (grocItem && confirm(`Delete purchase log for "${grocItem.item}" (₹${grocItem.cost})?`)) {
        groceries = groceries.filter(x => x.id !== grocId);
        saveGroceriesToLocal(groceries);
        renderGroceries();
        renderDashboard();
        showToast("Grocery purchase deleted", "success");
      }
    };
  });
}

function exportGroceriesToCSV(data) {
  const headers = ["ID", "Date", "Item Name", "Quantity", "Unit", "Total Cost (INR)", "Purchased By", "Payment Mode", "Note"];
  const rows = data.map(g => [
    g.id,
    g.date,
    g.item.replace(/"/g, '""'),
    g.qty,
    g.unit,
    g.cost,
    g.buyer,
    g.paymode,
    (g.note || "").replace(/"/g, '""')
  ]);
  
  const csvContent = [
    headers.join(","),
    ...rows.map(r => r.map(val => `"${val}"`).join(","))
  ].join("\r\n");
  
  return csvContent;
}

// ----------------------------------------------------
// ORDERS HISTORY VIEW
// ----------------------------------------------------
function initOrdersView() {
  // Bind order search
  document.getElementById("order-search-input").addEventListener("input", () => {
    renderOrdersList();
  });

  // Bind Period Filters
  document.querySelectorAll("[data-period]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-period]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const period = btn.getAttribute("data-period");
      
      const customRangeDiv = document.getElementById("order-custom-range");
      if (period === "custom") {
        customRangeDiv.style.display = "flex";
      } else {
        customRangeDiv.style.display = "none";
      }
      
      renderOrdersList();
    });
  });

  document.getElementById("order-date-from").addEventListener("change", renderOrdersList);
  document.getElementById("order-date-to").addEventListener("change", renderOrdersList);

  // Bind Export CSV

  document.getElementById("btn-export-sales-csv").addEventListener("click", () => {
    const csvContent = exportOrdersToCSV(orders);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Maestro_Kitchen_Sales_${new Date().toISOString().substring(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Sales ledger CSV exported", "success");
  });

  // Bind Modal Reprint Action
  document.getElementById("btn-modal-reprint").onclick = () => {
    const modalId = document.getElementById("modal-order-title").innerText.replace("Bill #", "");
    const order = orders.find(o => o.id === modalId);
    if (order) {
      const printIframe = document.getElementById("receipt-print-area");
      const htmlContent = generateThermalReceiptHTML(order, taxConfig);
      
      const doc = printIframe.contentDocument || printIframe.contentWindow.document;
      doc.open();
      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        printIframe.contentWindow.focus();
        printIframe.contentWindow.print();
      }, 300);
      showToast(`Receipt #${order.id} sent to printer`, "success");
    }
  };

  // Bind Modal Refund / Cancel Action
  document.getElementById("btn-modal-refund").onclick = () => {
    const modalId = document.getElementById("modal-order-title").innerText.replace("Bill #", "");
    const orderIndex = orders.findIndex(o => o.id === modalId);
    
    if (orderIndex > -1) {
      if (confirm(`Are you sure you want to cancel and refund Bill #${modalId}? This action cannot be undone.`)) {
        // Delete order records
        orders.splice(orderIndex, 1);
        saveOrdersToLocal(orders);

        document.getElementById("modal-order-detail").classList.remove("active");
        renderOrdersList();
        showToast(`Order #${modalId} refunded and deleted successfully`, "success");
      }
    }
  };
  
  renderOrdersList();
}

function renderOrdersList() {
  const searchFilter = document.getElementById("order-search-input").value.toLowerCase();
  const activePeriodBtn = document.querySelector("[data-period].active");
  const period = activePeriodBtn ? activePeriodBtn.getAttribute("data-period") : "all";
  
  const fromDateVal = document.getElementById("order-date-from").value;
  const toDateVal = document.getElementById("order-date-to").value;
  
  const now = new Date();
  
  const filtered = orders.filter(o => {
    const orderDate = new Date(o.date);
    let matchesPeriod = true;
    
    if (period === "today") {
      matchesPeriod = orderDate.toDateString() === now.toDateString();
    } else if (period === "week") {
      const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
      matchesPeriod = orderDate >= firstDay;
    } else if (period === "month") {
      matchesPeriod = orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    } else if (period === "year") {
      matchesPeriod = orderDate.getFullYear() === now.getFullYear();
    } else if (period === "custom") {
      if (fromDateVal) matchesPeriod = matchesPeriod && orderDate >= new Date(fromDateVal + "T00:00:00");
      if (toDateVal) matchesPeriod = matchesPeriod && orderDate <= new Date(toDateVal + "T23:59:59");
    }

    const matchesSearch = o.id.toLowerCase().includes(searchFilter) ||
           o.mode.toLowerCase().includes(searchFilter) ||
           o.payment.toLowerCase().includes(searchFilter) ||
           (o.tableNumber && o.tableNumber.toString().includes(searchFilter)) ||
           orderDate.toLocaleDateString().includes(searchFilter);

    return matchesPeriod && matchesSearch;
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first

  const rowsTarget = document.getElementById("orders-table-rows");
  
  // Update Summary
  const totalOrders = filtered.length;
  const totalSales = filtered.reduce((sum, o) => sum + o.totals.finalTotal, 0);
  document.getElementById("orders-summary-count").innerText = totalOrders;
  document.getElementById("orders-summary-total").innerText = totalSales.toLocaleString();

  if (filtered.length === 0) {
    rowsTarget.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding: 30px;">No transaction records found</td></tr>`;
    return;
  }

  rowsTarget.innerHTML = filtered.map(o => {
    const isAdmin = typeof currentUserProfile !== 'undefined' && currentUserProfile && currentUserProfile.role === "Admin";
    const manualTag = o.isManualEntry ? `<span class="badge-buyer" style="background:#c8982f; color:#000; font-size:10px; margin-left: 6px; padding: 2px 4px; border-radius: 4px;">Manual Entry</span>` : "";
    const delBtnHtml = isAdmin ? `<button class="table-action-btn del-order-btn" data-order-id="${o.id}" style="color: #ef4444; margin-left: 8px;"><i data-lucide="trash-2" style="width:14px; height:14px; vertical-align:middle;"></i> Delete</button>` : "";
    
    return `
      <tr>
        <td class="bold">${o.id} ${manualTag}</td>
        <td>${new Date(o.date).toLocaleString()}</td>
        <td>
          <span class="badge-mode ${o.mode ? o.mode.toLowerCase() : 'other'}">${o.mode || 'N/A'}</span>
          ${o.tableNumber ? `<span style="font-size: 10px; color: var(--accent-gold); display: block; margin-top: 2px;">Table ${o.tableNumber}</span>` : ""}
        </td>
        <td><span class="badge-pay ${o.payment ? o.payment.toLowerCase() : 'other'}">${o.payment || 'N/A'}</span></td>
        <td style="text-align: right;" class="bold color-gold">₹${(o.totals ? o.totals.finalTotal : 0).toFixed(2)}</td>
        <td style="text-align: center;">
          <button class="table-action-btn view-order-btn" data-order-id="${o.id}">View Details</button>
          ${delBtnHtml}
        </td>
      </tr>
    `;
  }).join("");

  // Bind view details row click
  rowsTarget.querySelectorAll(".view-order-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const orderId = btn.getAttribute("data-order-id");
      openOrderDetailModal(orderId);
    });
  });

  // Bind delete order row click
  rowsTarget.querySelectorAll(".del-order-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const orderId = btn.getAttribute("data-order-id");
      deleteOrderAdmin(orderId);
    });
  });
  
  if (window.lucide) window.lucide.createIcons();
}

async function deleteOrderAdmin(orderId) {
  if (!confirm("Are you sure you want to delete this order? This cannot be undone.")) return;
  
  try {
    await deleteDoc(doc(db, "orders", orderId));
    
    // Remove from local cache
    orders = orders.filter(o => o.id !== orderId);
    if (typeof saveOrdersToLocal === 'function') {
      saveOrdersToLocal(orders);
    }
    
    showToast(`Order ${orderId} deleted successfully.`, "success");
    renderOrders();
    renderDashboard();
  } catch (error) {
    console.error("Error deleting order:", error);
    showToast("Failed to delete order.", "error");
  }
}


function openOrderDetailModal(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  const modal = document.getElementById("modal-order-detail");
  document.getElementById("modal-order-title").innerText = `Bill #${order.id}`;

  const modeStr = order.mode || "Other";
  const payStr = order.payment || "Other";
  
  let itemsHtml = "";
  if (order.items && order.items.length > 0) {
    itemsHtml = order.items.map(i => `
      <div style="display:flex; justify-content:space-between; margin-bottom: 6px;">
        <span>${i.name} (x${i.qty}) ${i.notes ? `<span style="font-size:10px; color:var(--text-muted); display:block;">* ${i.notes}</span>` : ""}</span>
        <span class="bold">₹${(i.price * i.qty).toFixed(2)}</span>
      </div>
    `).join("");
  } else if (order.isManualEntry) {
    itemsHtml = `<div style="color:var(--text-muted); font-size:12px; text-align:center; padding:10px;">Lump Sum Entry (No items)</div>`;
  }

  const totals = order.totals || { finalTotal: 0, subtotal: 0, cgst: 0, sgst: 0, discountAmount: 0 };

  document.getElementById("modal-order-body").innerHTML = `
    <div style="border-bottom:1px dashed rgba(255,255,255,0.08); padding-bottom:12px; margin-bottom:12px;">
      <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
        <span style="color:var(--text-secondary);">Date / Time:</span>
        <span>${new Date(order.date).toLocaleString()}</span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
        <span style="color:var(--text-secondary);">Order Mode:</span>
        <span class="badge-mode ${modeStr.toLowerCase()}">${modeStr}</span>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span style="color:var(--text-secondary);">Payment Method:</span>
        <span class="badge-pay ${payStr.toLowerCase()}">${payStr}</span>
      </div>
    </div>
    
    <div style="border-bottom:1px dashed rgba(255,255,255,0.08); padding-bottom:12px; margin-bottom:12px;">
      <div style="font-weight:600; margin-bottom:8px; color:var(--accent-gold);">Items Log:</div>
      ${itemsHtml}
    </div>
    
    <div style="display:flex; flex-direction:column; gap:4px;">
      ${order.isManualEntry ? "" : `
      <div style="display:flex; justify-content:space-between;">
        <span style="color:var(--text-secondary);">Subtotal:</span>
        <span>₹${(totals.subtotal || 0).toFixed(2)}</span>
      </div>
      ${totals.discountAmount > 0 ? `
      <div style="display:flex; justify-content:space-between; color:var(--veg-green);">
        <span>Discount:</span>
        <span>-₹${totals.discountAmount.toFixed(2)}</span>
      </div>
      ` : ""}
      <div style="display:flex; justify-content:space-between;">
        <span style="color:var(--text-secondary);">CGST:</span>
        <span>₹${(totals.cgst || 0).toFixed(2)}</span>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span style="color:var(--text-secondary);">SGST:</span>
        <span>₹${(totals.sgst || 0).toFixed(2)}</span>
      </div>
      `}
      <div style="display:flex; justify-content:space-between; font-size:16px; font-weight:700; color:var(--accent-gold); margin-top:8px;">
        <span>Total Bill Amount:</span>
        <span>₹${(totals.finalTotal || 0).toFixed(2)}</span>
      </div>
    </div>
  `;

  modal.classList.add("active");
  if (window.lucide) window.lucide.createIcons();
}

// ----------------------------------------------------
// SETTINGS CONFIG VIEW
// ----------------------------------------------------
function initSettingsView() {
  const profileForm = document.getElementById("settings-profile-form");
  
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    taxConfig = {
      cgstRate: parseFloat(document.getElementById("set-rest-cgst").value),
      sgstRate: parseFloat(document.getElementById("set-rest-sgst").value),
      restaurantName: document.getElementById("set-rest-name").value,
      restaurantAddress: document.getElementById("set-rest-address").value,
      restaurantPhone: document.getElementById("set-rest-phone").value,
      gstin: document.getElementById("set-rest-gstin").value
    };

    saveTaxConfigToLocal(taxConfig);
    showToast("Store profile configurations saved", "success");
  });

  // DB Backup utilities
  document.getElementById("btn-db-export").addEventListener("click", () => {
    const backupData = {
      menu,
      groceries,
      recurringBills,
      orders,
      taxConfig
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Maestro_Kitchen_POS_Backup_${new Date().toISOString().substring(0,10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Database backup downloaded", "success");
  });

  // Import Database File
  const fileInput = document.getElementById("db-import-file-input");
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        
        // Basic validation of keys
        if (imported.menu && imported.orders) {
          if (confirm("This will overwrite your existing POS data with the backup file. Do you want to continue?")) {
            menu = imported.menu;
            groceries = imported.groceries || [];
            recurringBills = imported.recurringBills || [];
            orders = imported.orders;
            taxConfig = imported.taxConfig || taxConfig;

            saveMenuToLocal(menu);
            saveGroceriesToLocal(groceries);
            saveRecurringBillsToLocal(recurringBills);
            saveOrdersToLocal(orders);
            saveTaxConfigToLocal(taxConfig);

            showToast("Database backup restored successfully!", "success");
            
            // Reload components
            hydrateState();
            renderSettingsForm();
            fileInput.value = "";
          }
        } else {
          showToast("Invalid backup file structure", "error");
        }
      } catch (err) {
        showToast("Error reading backup JSON file", "error");
      }
    };
    reader.readAsText(file);
  });

  // System Factory Reset
  document.getElementById("btn-db-reset").addEventListener("click", () => {
    if (confirm("⚠️ WARNING: This will completely delete all sales ledgers, custom inventory logs, and configurations, and reset to defaults. This action CANNOT be undone. Are you sure?")) {
      localStorage.clear();
      showToast("POS system reset to defaults", "success");
      setTimeout(() => window.location.reload(), 1000);
    }
  });

  renderSettingsForm();
}

function renderSettingsForm() {
  document.getElementById("set-rest-name").value = taxConfig.restaurantName;
  document.getElementById("set-rest-address").value = taxConfig.restaurantAddress;
  document.getElementById("set-rest-phone").value = taxConfig.restaurantPhone;
  document.getElementById("set-rest-gstin").value = taxConfig.gstin;
  document.getElementById("set-rest-cgst").value = taxConfig.cgstRate;
  document.getElementById("set-rest-sgst").value = taxConfig.sgstRate;
}

// ----------------------------------------------------
// MENU CATALOG MANAGEMENT PANEL
// ----------------------------------------------------
function initMenuManagement() {
  // Populate category options
  const catSelect = document.getElementById("menu-item-category");
  catSelect.innerHTML = CATEGORIES.map(cat => `<option value="${cat}">${cat}</option>`).join("");
  
  const catFilter = document.getElementById("menu-filter-category");
  catFilter.innerHTML = `<option value="All">All Categories</option>` + CATEGORIES.map(cat => `<option value="${cat}">${cat}</option>`).join("");

  // Form submit handler
  const form = document.getElementById("menu-item-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const itemId = document.getElementById("menu-item-id").value;
    const name = document.getElementById("menu-item-name").value;
    const category = document.getElementById("menu-item-category").value;
    const price = parseFloat(document.getElementById("menu-item-price").value) || 0;
    const discountPercent = parseFloat(document.getElementById("menu-item-discount").value) || 0;
    const image = document.getElementById("menu-item-image").value || "";
    const available = document.getElementById("menu-item-available").checked;
    const isVeg = document.getElementById("menu-item-veg").checked;

    if (discountPercent < 0 || discountPercent > 100) {
      showToast("Discount percentage must be between 0 and 100", "error");
      return;
    }

    if (itemId) {
      // Edit mode
      const idx = menu.findIndex(item => item.id === itemId);
      if (idx > -1) {
        menu[idx] = { ...menu[idx], name, category, price, discountPercent, image, available, isVeg };
        showToast("Menu item updated successfully", "success");
      }
    } else {
      // Add mode
      const newItem = {
        id: `menu-${Date.now()}`,
        name,
        category,
        price,
        discountPercent,
        image,
        available,
        isVeg
      };
      menu.push(newItem);
      showToast("New menu item added successfully", "success");
    }

    saveMenuToLocal(menu);
    resetMenuForm();
    renderMenuManagement();
    renderPOSItems();
  });

  // Cancel edit button
  document.getElementById("btn-cancel-menu-edit").addEventListener("click", resetMenuForm);

  // Filters
  document.getElementById("menu-filter-search").addEventListener("input", renderMenuManagement);
  document.getElementById("menu-filter-category").addEventListener("change", renderMenuManagement);

  renderMenuManagement();
}

function resetMenuForm() {
  document.getElementById("menu-item-id").value = "";
  document.getElementById("menu-item-name").value = "";
  document.getElementById("menu-item-price").value = "";
  document.getElementById("menu-item-discount").value = "";
  document.getElementById("menu-item-image").value = "";
  document.getElementById("menu-item-available").checked = true;
  document.getElementById("menu-item-veg").checked = true;
  document.getElementById("menu-form-title").innerText = "Add New Menu Item";
  document.getElementById("btn-cancel-menu-edit").style.display = "none";
}

function renderMenuManagement() {
  const searchVal = document.getElementById("menu-filter-search").value.toLowerCase();
  const categoryVal = document.getElementById("menu-filter-category").value;

  const filtered = menu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchVal);
    const matchesCategory = categoryVal === "All" ? true : item.category === categoryVal;
    return matchesSearch && matchesCategory;
  });

  const tbody = document.getElementById("menu-table-rows");
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:20px;">No menu items found</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const statusText = item.available !== false ? "Available" : "Unavailable";
    const statusClass = item.available !== false ? "badge-status paid" : "badge-status unpaid";
    const discountText = item.discountPercent ? `${item.discountPercent}% Off` : "-";
    return `
      <tr data-item-id="${item.id}">
        <td class="bold">${item.name}</td>
        <td>${item.category}</td>
        <td style="text-align: right;" class="bold">₹${item.price.toFixed(2)}</td>
        <td style="text-align: right; color: var(--veg-green); font-weight: bold;">${discountText}</td>
        <td><span class="${statusClass}">${statusText}</span></td>
        <td style="text-align: center;">
          <button class="table-action-btn btn-edit-menu" style="padding: 4px 8px; margin-right: 4px; font-size:11px;">Edit</button>
          <button class="table-action-btn btn-delete-menu" style="padding: 4px 8px; font-size:11px; background:rgba(239,68,68,0.1); border-color:rgba(239,68,68,0.15); color:var(--nonveg-red);">Delete</button>
        </td>
      </tr>
    `;
  }).join("");

  // Bind edit/delete click handlers
  tbody.querySelectorAll(".btn-edit-menu").forEach(btn => {
    btn.onclick = () => {
      const id = btn.closest("tr").getAttribute("data-item-id");
      const item = menu.find(x => x.id === id);
      if (item) {
        document.getElementById("menu-item-id").value = item.id;
        document.getElementById("menu-item-name").value = item.name;
        document.getElementById("menu-item-category").value = item.category;
        document.getElementById("menu-item-price").value = item.price;
        document.getElementById("menu-item-discount").value = item.discountPercent || "";
        document.getElementById("menu-item-image").value = item.image || "";
        document.getElementById("menu-item-available").checked = item.available !== false;
        document.getElementById("menu-item-veg").checked = item.isVeg !== false;
        
        document.getElementById("menu-form-title").innerText = "Edit Menu Item";
        document.getElementById("btn-cancel-menu-edit").style.display = "inline-block";
      }
    };
  });

  tbody.querySelectorAll(".btn-delete-menu").forEach(btn => {
    btn.onclick = () => {
      const id = btn.closest("tr").getAttribute("data-item-id");
      const item = menu.find(x => x.id === id);
      if (item && confirm(`Delete "${item.name}" from the menu catalog?`)) {
        menu = menu.filter(x => x.id !== id);
        saveMenuToLocal(menu);
        renderMenuManagement();
        renderPOSItems();
        showToast("Menu item deleted from catalog", "success");
      }
    };
  });
}

// ----------------------------------------------------
// MONTHLY RECURRING EXPENSES PANEL
// ----------------------------------------------------
function initRecurringBills() {
  const selectCat = document.getElementById("bill-category-select");
  const customCat = document.getElementById("bill-custom-category");
  
  selectCat.addEventListener("change", () => {
    if (selectCat.value === "Custom") {
      customCat.style.display = "inline-block";
      customCat.required = true;
    } else {
      customCat.style.display = "none";
      customCat.required = false;
      customCat.value = "";
    }
  });

  // Handle bill paid date toggle
  const billStatus = document.getElementById("bill-status");
  const paidDateGroup = document.getElementById("bill-paid-date-group");
  const paidDateInput = document.getElementById("bill-paid-date");
  
  billStatus.addEventListener("change", () => {
    if (billStatus.value === "Paid") {
      paidDateGroup.style.display = "flex";
      paidDateInput.value = new Date().toISOString().substring(0, 10);
    } else {
      paidDateGroup.style.display = "none";
      paidDateInput.value = "";
    }
  });

  // Set default billing period to current month
  const periodInput = document.getElementById("bill-period");
  if (periodInput) {
    periodInput.value = new Date().toISOString().substring(0, 7);
  }

  // Set default due date to current date
  const dueDateInput = document.getElementById("bill-due-date");
  if (dueDateInput) {
    dueDateInput.value = new Date().toISOString().substring(0, 10);
  }

  // Form submit handler
  const form = document.getElementById("recurring-bill-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const billId = document.getElementById("bill-item-id").value;
    
    let category = selectCat.value;
    if (category === "Custom") {
      category = customCat.value.trim();
    }
    
    const amount = parseFloat(document.getElementById("bill-amount").value) || 0;
    const period = document.getElementById("bill-period").value;
    const dueDate = document.getElementById("bill-due-date").value;
    const status = billStatus.value;
    const paidDate = status === "Paid" ? (document.getElementById("bill-paid-date").value || new Date().toISOString().substring(0,10)) : "";
    const notes = document.getElementById("bill-notes").value || "";

    if (billId) {
      // Edit
      const idx = recurringBills.findIndex(b => b.id === billId);
      if (idx > -1) {
        recurringBills[idx] = { ...recurringBills[idx], category, name: category, amount, period, dueDate, status, paidDate, notes };
        showToast("Recurring bill log updated", "success");
      }
    } else {
      // Add
      const newBill = {
        id: `bill-${Date.now()}`,
        name: category,
        category,
        amount,
        period,
        dueDate,
        status,
        paidDate,
        notes
      };
      recurringBills.push(newBill);
      showToast("Recurring bill logged successfully", "success");
    }

    saveRecurringBillsToLocal(recurringBills);
    resetBillForm();
    renderRecurringBills();
  });

  // Cancel edit
  document.getElementById("btn-cancel-bill-edit").addEventListener("click", resetBillForm);

  // Filters
  document.getElementById("bill-filter-search").addEventListener("input", renderRecurringBills);
  document.getElementById("bill-filter-category").addEventListener("change", renderRecurringBills);
  document.getElementById("bill-filter-status").addEventListener("change", renderRecurringBills);

  // CSV Export
  document.getElementById("btn-export-bills-csv").addEventListener("click", () => {
    const csvContent = exportBillsToCSV(recurringBills);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Maestro_Kitchen_Recurring_Bills_${new Date().toISOString().substring(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Monthly bills CSV exported", "success");
  });

  renderRecurringBills();
}

function resetBillForm() {
  document.getElementById("bill-item-id").value = "";
  document.getElementById("bill-category-select").value = "Electricity";
  document.getElementById("bill-custom-category").style.display = "none";
  document.getElementById("bill-custom-category").value = "";
  document.getElementById("bill-custom-category").required = false;
  document.getElementById("bill-amount").value = "";
  document.getElementById("bill-period").value = new Date().toISOString().substring(0, 7);
  document.getElementById("bill-due-date").value = new Date().toISOString().substring(0, 10);
  document.getElementById("bill-status").value = "Unpaid";
  document.getElementById("bill-paid-date-group").style.display = "none";
  document.getElementById("bill-paid-date").value = "";
  document.getElementById("bill-notes").value = "";
  
  document.getElementById("bill-form-title").innerText = "Log Recurring Bill";
  document.getElementById("btn-cancel-bill-edit").style.display = "none";
}

function renderRecurringBills() {
  const searchVal = document.getElementById("bill-filter-search").value.toLowerCase();
  const categoryVal = document.getElementById("bill-filter-category").value;
  const statusVal = document.getElementById("bill-filter-status").value;

  const filtered = recurringBills.filter(b => {
    const matchesSearch = (b.notes || "").toLowerCase().includes(searchVal) || (b.category || "").toLowerCase().includes(searchVal);
    const matchesCategory = categoryVal === "All" ? true : b.category === categoryVal;
    const matchesStatus = statusVal === "All" ? true : b.status === statusVal;
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => b.period.localeCompare(a.period) || b.dueDate.localeCompare(a.dueDate));

  // Calculations for summary cards
  let totalLogged = 0;
  let totalPaid = 0;
  let totalUnpaid = 0;
  let currentMonthSpend = 0;
  
  const currentMonthStr = new Date().toISOString().substring(0, 7); // e.g. "2026-07"

  recurringBills.forEach(b => {
    totalLogged += b.amount;
    if (b.status === "Paid") totalPaid += b.amount;
    else totalUnpaid += b.amount;

    if (b.period === currentMonthStr) {
      currentMonthSpend += b.amount;
    }
  });

  document.getElementById("bills-total-cost").innerText = `₹${totalLogged.toLocaleString()}`;
  document.getElementById("bills-total-paid").innerText = `₹${totalPaid.toLocaleString()}`;
  document.getElementById("bills-total-unpaid").innerText = `₹${totalUnpaid.toLocaleString()}`;
  document.getElementById("bills-current-month").innerText = `₹${currentMonthSpend.toLocaleString()}`;

  const tbody = document.getElementById("bills-table-rows");
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-muted); padding:20px;">No recurring bills found</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(b => {
    const statusClass = b.status === "Paid" ? "badge-status paid" : "badge-status unpaid";
    return `
      <tr data-bill-id="${b.id}">
        <td class="bold">${b.category}</td>
        <td style="text-align: right;" class="bold color-gold">₹${b.amount.toLocaleString()}</td>
        <td>${b.period}</td>
        <td>${b.dueDate}</td>
        <td><span class="${statusClass}">${b.status}</span></td>
        <td>${b.paidDate || "-"}</td>
        <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${b.notes || ""}">${b.notes || "-"}</td>
        <td style="text-align: center;">
          <button class="table-action-btn btn-edit-bill" style="padding: 4px 8px; margin-right: 4px; font-size:11px;">Edit</button>
          <button class="table-action-btn btn-delete-bill" style="padding: 4px 8px; font-size:11px; background:rgba(239,68,68,0.1); border-color:rgba(239,68,68,0.15); color:var(--nonveg-red);">Delete</button>
        </td>
      </tr>
    `;
  }).join("");

  // Bind event handlers
  const selectCat = document.getElementById("bill-category-select");
  const customCat = document.getElementById("bill-custom-category");
  const paidDateGroup = document.getElementById("bill-paid-date-group");
  const billStatus = document.getElementById("bill-status");

  tbody.querySelectorAll(".btn-edit-bill").forEach(btn => {
    btn.onclick = () => {
      const id = btn.closest("tr").getAttribute("data-bill-id");
      const bill = recurringBills.find(x => x.id === id);
      if (bill) {
        document.getElementById("bill-item-id").value = bill.id;
        
        // Handle select vs custom category
        const categories = ["Electricity", "Gas", "Rent", "Staff Salaries", "Water", "Internet"];
        if (categories.includes(bill.category)) {
          selectCat.value = bill.category;
          customCat.style.display = "none";
          customCat.value = "";
        } else {
          selectCat.value = "Custom";
          customCat.style.display = "inline-block";
          customCat.value = bill.category;
          customCat.required = true;
        }

        document.getElementById("bill-amount").value = bill.amount;
        document.getElementById("bill-period").value = bill.period;
        document.getElementById("bill-due-date").value = bill.dueDate;
        
        billStatus.value = bill.status;
        if (bill.status === "Paid") {
          paidDateGroup.style.display = "flex";
          document.getElementById("bill-paid-date").value = bill.paidDate;
        } else {
          paidDateGroup.style.display = "none";
          document.getElementById("bill-paid-date").value = "";
        }
        
        document.getElementById("bill-notes").value = bill.notes || "";
        
        document.getElementById("bill-form-title").innerText = "Edit Recurring Bill";
        document.getElementById("btn-cancel-bill-edit").style.display = "inline-block";
      }
    };
  });

  tbody.querySelectorAll(".btn-delete-bill").forEach(btn => {
    btn.onclick = () => {
      const id = btn.closest("tr").getAttribute("data-bill-id");
      const bill = recurringBills.find(x => x.id === id);
      if (bill && confirm(`Delete recurring bill log for "${bill.category}" (₹${bill.amount})?`)) {
        recurringBills = recurringBills.filter(x => x.id !== id);
        saveRecurringBillsToLocal(recurringBills);
        renderRecurringBills();
        showToast("Recurring bill deleted", "success");
      }
    };
  });
}

function exportBillsToCSV(data) {
  const headers = ["ID", "Category", "Amount (INR)", "Period (Month)", "Due Date", "Status", "Paid Date", "Notes"];
  const rows = data.map(b => [
    b.id,
    b.category,
    b.amount,
    b.period,
    b.dueDate,
    b.status,
    b.paidDate || "",
    (b.notes || "").replace(/"/g, '""')
  ]);
  
  const csvContent = [
    headers.join(","),
    ...rows.map(r => r.map(val => `"${val}"`).join(","))
  ].join("\r\n");
  
  return csvContent;
}

function getLocalRecurringBills() {
  const local = localStorage.getItem("maestro_recurring_bills");
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Error parsing local recurring bills", e);
    }
  }
  return [];
}


// ----------------------------------------------------
// TABLE MANAGEMENT VIEW
// ----------------------------------------------------
function initTablesView() {
  const modal = document.getElementById("modal-table-reserve");
  
  document.getElementById("btn-close-reserve-modal").addEventListener("click", () => {
    modal.style.display = "none";
  });
  
  document.getElementById("btn-clear-reservation").addEventListener("click", () => {
    const tId = parseInt(document.getElementById("reserve-table-id").value);
    const t = tables.find(x => x.id === tId);
    if (t) {
      t.status = "Available";
      t.reservation = null;
      saveTablesToLocal(tables);
      renderTables();
      modal.style.display = "none";
      showToast(`Table ${tId} is now available`, "success");
    }
  });

  document.getElementById("reserve-table-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const tId = parseInt(document.getElementById("reserve-table-id").value);
    const t = tables.find(x => x.id === tId);
    if (t) {
      t.status = "Reserved";
      t.reservation = {
        name: document.getElementById("reserve-customer-name").value,
        time: document.getElementById("reserve-time").value
      };
      saveTablesToLocal(tables);
      renderTables();
      modal.style.display = "none";
      showToast(`Table ${tId} reserved`, "success");
    }
  });
}

function renderTables() {
  const grid = document.getElementById("tables-grid");
  if (!grid) return;
  
  let avail = 0, occ = 0, res = 0;
  
  grid.innerHTML = tables.map(t => {
    if (t.status === "Available") avail++;
    else if (t.status === "Occupied") occ++;
    else if (t.status === "Reserved") res++;
    
    let colorClass = "available";
    if (t.status === "Occupied") colorClass = "occupied";
    if (t.status === "Reserved") colorClass = "reserved";
    
    let infoHtml = "";
    if (t.status === "Occupied") {
      const itemsCount = t.cart ? t.cart.reduce((sum, item) => sum + item.qty, 0) : 0;
      infoHtml = `<div style="font-size: 11px; margin-top: 8px;">${itemsCount} Items</div>`;
    } else if (t.status === "Reserved") {
      infoHtml = `<div style="font-size: 11px; margin-top: 8px;">${t.reservation?.name || 'Reserved'} ${t.reservation?.time ? '@ '+t.reservation.time : ''}</div>`;
    }
    
    return `
      <div class="table-card ${colorClass}" data-table-id="${t.id}" style="cursor: pointer;">
        <div style="font-weight: bold; font-size: 18px;">Table ${t.id}</div>
        <div style="font-size: 12px; margin-top: 4px; opacity: 0.8;">${t.status}</div>
        ${infoHtml}
      </div>
    `;
  }).join("");
  
  document.getElementById("tables-stat-available").innerText = avail;
  document.getElementById("tables-stat-occupied").innerText = occ;
  document.getElementById("tables-stat-reserved").innerText = res;
  
  grid.querySelectorAll(".table-card").forEach(card => {
    card.addEventListener("click", () => handleTableClick(parseInt(card.getAttribute("data-table-id"))));
  });
}

function handleTableClick(tableId) {
  const t = tables.find(x => x.id === tableId);
  if (!t) return;
  
  if (t.status === "Reserved") {
    // Show reservation modal
    document.getElementById("reserve-table-id").value = t.id;
    document.getElementById("reserve-customer-name").value = t.reservation?.name || "";
    document.getElementById("reserve-time").value = t.reservation?.time || "";
    document.getElementById("modal-table-reserve").style.display = "flex";
  } else {
    // Switch to POS and load cart or start new
    activeTableId = t.id;
    if (t.status === "Occupied") {
      cart = t.cart ? JSON.parse(JSON.stringify(t.cart)) : [];
    } else {
      t.status = "Occupied";
      t.cart = [];
      cart = [];
      saveTablesToLocal(tables);
    }
    
    // Switch view explicitly
    document.querySelector('[data-view="pos"]').click();
    updatePOSActiveTableUI();
    renderCart();
  }
}

function updatePOSActiveTableUI() {
  const titleEl = document.querySelector(".cart-title");
  if (activeTableId !== null) {
    titleEl.innerHTML = `Current Order <span style="background: var(--accent-gold); color: black; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; margin-left: 8px;">Table ${activeTableId}</span>`;
  } else {
    titleEl.innerHTML = `Current Order`;
  }
}

function syncActiveTableCart() {
  if (activeTableId !== null) {
    const t = tables.find(x => x.id === activeTableId);
    if (t) {
      t.cart = JSON.parse(JSON.stringify(cart));
      saveTablesToLocal(tables);
    }
  }
}

// ====================================================
// FIRESTORE SYNC & PERSISTENCE WRAPPERS
// ====================================================
let lastMenuState = [];
async function saveMenuToLocal(data) {
  localStorage.setItem("maestro_menu", JSON.stringify(data));
  try {
    const snapshot = await getDocs(collection(db, "menu"));
    snapshot.forEach(async docSnap => {
      if (!data.some(x => x.id === docSnap.id)) {
        await deleteDoc(doc(db, "menu", docSnap.id));
      }
    });
    for (const item of data) {
      const last = lastMenuState.find(x => x.id === item.id);
      if (!last || JSON.stringify(last) !== JSON.stringify(item)) {
        await setDoc(doc(db, "menu", item.id), item);
      }
    }
    lastMenuState = JSON.parse(JSON.stringify(data));
  } catch (e) {
    console.error("Firestore menu sync failed", e);
  }
}

let lastOrdersState = [];
async function saveOrdersToLocal(data) {
  localStorage.setItem("maestro_orders", JSON.stringify(data));
  try {
    const snapshot = await getDocs(collection(db, "orders"));
    snapshot.forEach(async docSnap => {
      if (!data.some(x => x.id === docSnap.id)) {
        await deleteDoc(doc(db, "orders", docSnap.id));
      }
    });
    for (const o of data) {
      const last = lastOrdersState.find(x => x.id === o.id);
      if (!last || JSON.stringify(last) !== JSON.stringify(o)) {
        await setDoc(doc(db, "orders", o.id), o);
      }
    }
    lastOrdersState = JSON.parse(JSON.stringify(data));
  } catch (e) {
    console.error("Firestore orders sync failed", e);
  }
}

let lastBillsState = [];
async function saveRecurringBillsToLocal(data) {
  localStorage.setItem("maestro_recurring_bills", JSON.stringify(data));
  try {
    const snapshot = await getDocs(collection(db, "recurring_bills"));
    snapshot.forEach(async docSnap => {
      if (!data.some(x => x.id === docSnap.id)) {
        await deleteDoc(doc(db, "recurring_bills", docSnap.id));
      }
    });
    for (const b of data) {
      const last = lastBillsState.find(x => x.id === b.id);
      if (!last || JSON.stringify(last) !== JSON.stringify(b)) {
        await setDoc(doc(db, "recurring_bills", b.id), b);
      }
    }
    lastBillsState = JSON.parse(JSON.stringify(data));
  } catch (e) {
    console.error("Firestore recurring bills sync failed", e);
  }
}

async function saveTaxConfigToLocal(data) {
  localStorage.setItem("maestro_tax_config", JSON.stringify(data));
  try {
    await setDoc(doc(db, "settings", "tax_config"), data);
  } catch (e) {
    console.error("Firestore tax config sync failed", e);
  }
}

// ====================================================
// FIREBASE AUTHENTICATION & LOGIN LOGIC
// ====================================================
function initAuth() {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const pass = document.getElementById("login-password").value;
      try {
        await signInWithEmailAndPassword(auth, email, pass);
        loginForm.reset();
        showToast("Successfully signed in", "success");
      } catch (err) {
        console.error(err);
        showToast("Authentication failed. Invalid email or password.", "error");
      }
    });
  }

  const logoutBtn = document.getElementById("btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        if (userDocUnsubscribe) userDocUnsubscribe();
        if (usersUnsubscribe) usersUnsubscribe();
        stopRealtimeSync();
        await signOut(auth);
        showToast("Signed out successfully", "success");
      } catch (err) {
        console.error(err);
      }
    });
  }

  const passForm = document.getElementById("change-password-form");
  if (passForm) {
    passForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newPass = document.getElementById("new-password").value;
      const confirmPass = document.getElementById("confirm-new-password").value;
      if (newPass !== confirmPass) {
        showToast("Passwords do not match", "error");
        return;
      }
      try {
        const user = auth.currentUser;
        if (user) {
          await updatePassword(user, newPass);
          await updateDoc(doc(db, "users", user.uid), {
            needsPasswordChange: false
          });
          document.getElementById("modal-change-password").style.display = "none";
          passForm.reset();
          showToast("Password updated successfully!", "success");
          
          document.getElementById("app-container").style.display = "flex";
          redirectUserAfterLogin();
        }
      } catch (err) {
        console.error(err);
        showToast("Failed to update password: " + err.message, "error");
      }
    });
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (userDocUnsubscribe) userDocUnsubscribe();
      userDocUnsubscribe = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
        if (!docSnap.exists()) {
          signOut(auth);
          showToast("User record not found in database", "error");
          return;
        }
        const profile = docSnap.data();
        if (profile.status === "disabled") {
          signOut(auth);
          showToast("Your account has been disabled.", "error");
          return;
        }
        
        currentUserProfile = { uid: user.uid, ...profile };
        
        document.getElementById("header-user-name").innerText = profile.name;
        document.getElementById("header-user-role").innerText = profile.role;
        
        if (profile.needsPasswordChange) {
          document.getElementById("modal-change-password").style.display = "flex";
          document.getElementById("app-container").style.display = "none";
          document.getElementById("login-screen").style.display = "none";
        } else {
          document.getElementById("modal-change-password").style.display = "none";
          document.getElementById("login-screen").style.display = "none";
          document.getElementById("app-container").style.display = "flex";
          
          applyRoleAccess(profile.role);
          startRealtimeSync();
        }
      }, (err) => {
        console.error("Firestore user doc error", err);
        signOut(auth);
      });
    } else {
      currentUserProfile = null;
      if (userDocUnsubscribe) {
        userDocUnsubscribe();
        userDocUnsubscribe = null;
      }
      stopRealtimeSync();
      document.getElementById("app-container").style.display = "none";
      document.getElementById("login-screen").style.display = "flex";
      document.getElementById("modal-change-password").style.display = "none";
    }
  });

  seedDefaultAdmin();
}

async function seedDefaultAdmin() {
  try {
    const defaultEmail = "admin@maestrokitchen.com";
    const defaultPass = "admin123";
    
    await createUserWithEmailAndPassword(auth, defaultEmail, defaultPass)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          name: "Administrator",
          email: defaultEmail,
          role: "Admin",
          status: "active",
          needsPasswordChange: true
        });
        showToast("Default Admin account seeded successfully!", "success");
      })
      .catch((err) => {
        if (err.code !== "auth/email-already-in-use") {
          console.error("Seeding error", err);
        }
      });
  } catch (err) {
    // Ignore
  }
}

function redirectUserAfterLogin() {
  if (!currentUserProfile) return;
  if (currentUserProfile.role === "Admin") {
    document.querySelector('.nav-item[data-view="dashboard"]').click();
  } else {
    document.querySelector('.nav-item[data-view="tables"]').click();
  }
}

function applyRoleAccess(role) {
  const adminItems = document.querySelectorAll(".admin-only");
  if (role === "Admin") {
    adminItems.forEach(el => el.style.display = "");
  } else {
    adminItems.forEach(el => el.style.display = "none");
    
    const activePanel = document.querySelector(".view-panel.active");
    if (activePanel) {
      const view = activePanel.id.replace("view-", "");
      const restrictedViews = ["dashboard", "menu-mgmt", "recurring-bills", "settings", "users"];
      if (restrictedViews.includes(view)) {
        showToast("Access Restricted", "error");
        document.querySelector('.nav-item[data-view="tables"]').click();
      }
    }
  }
}

// ====================================================
// FIRESTORE REAL-TIME SYNCHRONIZER
// ====================================================
let menuUnsubscribe = null;
let ordersUnsubscribe = null;
let groceriesUnsubscribe = null;
let billsUnsubscribe = null;
let tablesUnsubscribe = null;

function startRealtimeSync() {
  // Sync Menu
  menuUnsubscribe = onSnapshot(collection(db, "menu"), (snapshot) => {
    menu = [];
    snapshot.forEach(docSnap => {
      menu.push({ id: docSnap.id, ...docSnap.data() });
    });
    
    if (menu.length === 0) {
      DEFAULT_MENU.forEach(async item => {
        await setDoc(doc(db, "menu", item.id), { ...item, available: true, discountPercent: 0, image: "" });
      });
      return;
    }
    
    // Cache to localStorage as backup
    localStorage.setItem("maestro_menu", JSON.stringify(menu));
    lastMenuState = JSON.parse(JSON.stringify(menu));
    
    const activePanel = document.querySelector(".view-panel.active");
    if (activePanel) {
      if (activePanel.id === "view-menu-mgmt") renderMenuManagement();
      if (activePanel.id === "view-pos") renderPOSMenu();
    }
  });

  // Sync Tables
  tablesUnsubscribe = onSnapshot(collection(db, "tables"), (snapshot) => {
    tables = [];
    snapshot.forEach(docSnap => {
      tables.push({ id: parseInt(docSnap.id), ...docSnap.data() });
    });
    tables.sort((a, b) => a.id - b.id);
    
    if (tables.length === 0) {
      Array.from({length: 15}, (_, i) => ({
        id: i + 1,
        status: "Available",
        cart: [],
        reservation: null
      })).forEach(async t => {
        await setDoc(doc(db, "tables", t.id.toString()), { status: t.status, cart: t.cart, reservation: t.reservation });
      });
      return;
    }

    localStorage.setItem("maestro_tables", JSON.stringify(tables));
    lastTablesState = JSON.parse(JSON.stringify(tables));
    
    // Sync current active table cart back to POS cart
    if (activeTableId !== null) {
      const activeT = tables.find(x => x.id === activeTableId);
      if (activeT) {
        cart = activeT.cart ? JSON.parse(JSON.stringify(activeT.cart)) : [];
        renderCart();
      }
    }
    
    const activePanel = document.querySelector(".view-panel.active");
    if (activePanel && activePanel.id === "view-tables") {
      renderTables();
    }
  });

  // Sync Orders
  ordersUnsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
    orders = [];
    snapshot.forEach(docSnap => {
      orders.push({ id: docSnap.id, ...docSnap.data() });
    });
    
    localStorage.setItem("maestro_orders", JSON.stringify(orders));
    lastOrdersState = JSON.parse(JSON.stringify(orders));
    
    const activePanel = document.querySelector(".view-panel.active");
    if (activePanel) {
      if (activePanel.id === "view-orders") renderOrdersList();
      if (activePanel.id === "view-dashboard") renderDashboard();
    }
  });

  // Sync Groceries
  groceriesUnsubscribe = onSnapshot(collection(db, "groceries"), (snapshot) => {
    groceries = [];
    snapshot.forEach(docSnap => {
      groceries.push({ id: docSnap.id, ...docSnap.data() });
    });
    
    localStorage.setItem("maestro_groceries", JSON.stringify(groceries));
    lastGroceriesState = JSON.parse(JSON.stringify(groceries));
    
    const activePanel = document.querySelector(".view-panel.active");
    if (activePanel) {
      if (activePanel.id === "view-inventory") renderGroceries();
      if (activePanel.id === "view-dashboard") renderDashboard();
    }
  });

  // Sync Recurring Bills
  billsUnsubscribe = onSnapshot(collection(db, "recurring_bills"), (snapshot) => {
    recurringBills = [];
    snapshot.forEach(docSnap => {
      recurringBills.push({ id: docSnap.id, ...docSnap.data() });
    });
    
    localStorage.setItem("maestro_recurring_bills", JSON.stringify(recurringBills));
    lastBillsState = JSON.parse(JSON.stringify(recurringBills));
    
    const activePanel = document.querySelector(".view-panel.active");
    if (activePanel && activePanel.id === "view-recurring-bills") {
      renderRecurringBills();
    }
  });

  // Sync Tax Config settings
  onSnapshot(doc(db, "settings", "tax_config"), (docSnap) => {
    if (docSnap.exists()) {
      taxConfig = docSnap.data();
      localStorage.setItem("maestro_tax_config", JSON.stringify(taxConfig));
      const activePanel = document.querySelector(".view-panel.active");
      if (activePanel && activePanel.id === "view-settings") {
        renderSettingsForm();
      }
    }
  });
}

function stopRealtimeSync() {
  if (menuUnsubscribe) { menuUnsubscribe(); menuUnsubscribe = null; }
  if (tablesUnsubscribe) { tablesUnsubscribe(); tablesUnsubscribe = null; }
  if (ordersUnsubscribe) { ordersUnsubscribe(); ordersUnsubscribe = null; }
  if (groceriesUnsubscribe) { groceriesUnsubscribe(); groceriesUnsubscribe = null; }
  if (billsUnsubscribe) { billsUnsubscribe(); billsUnsubscribe = null; }
}

// ====================================================
// ADMIN USER MANAGEMENT Logic
// ====================================================
let usersUnsubscribe = null;

function initUsersView() {
  const modal = document.getElementById("modal-user-edit");
  const modalBtn = document.getElementById("btn-add-user-modal");
  const closeBtn = document.getElementById("btn-close-user-modal");
  const form = document.getElementById("user-edit-form");

  if (modalBtn) {
    modalBtn.addEventListener("click", () => {
      document.getElementById("user-modal-title").innerText = "Create New Account";
      document.getElementById("user-edit-id").value = "";
      document.getElementById("user-edit-name").value = "";
      document.getElementById("user-edit-email").value = "";
      document.getElementById("user-edit-email").disabled = false;
      document.getElementById("user-edit-password").value = "";
      document.getElementById("user-edit-password").required = true;
      document.getElementById("user-edit-password-group").style.display = "flex";
      document.getElementById("user-edit-role").value = "Staff";
      modal.style.display = "flex";
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("user-edit-id").value;
      const name = document.getElementById("user-edit-name").value;
      const email = document.getElementById("user-edit-email").value;
      const password = document.getElementById("user-edit-password").value;
      const role = document.getElementById("user-edit-role").value;

      try {
        if (id) {
          await updateDoc(doc(db, "users", id), {
            name: name,
            role: role
          });
          showToast("User details saved", "success");
        } else {
          if (password.length < 6) {
            showToast("Password must be at least 6 characters", "error");
            return;
          }
          showToast("Registering staff credentials...", "info");
          await registerUserWithoutSignout(name, email, password, role);
          showToast(`Account successfully created for ${name}`, "success");
        }
        modal.style.display = "none";
      } catch (err) {
        console.error(err);
        showToast("Error creating account: " + err.message, "error");
      }
    });
  }
}

async function registerUserWithoutSignout(name, email, password, role) {
  let tempApp;
  try {
    try {
      const { getApp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
      tempApp = getApp("TempRegistrationApp");
    } catch {
      // Ignored
    }
    
    if (!tempApp) {
      tempApp = initializeApp(firebaseConfig, "TempRegistrationApp");
    }
    
    const tempAuth = getAuth(tempApp);
    tempAuth.setPersistence({ type: 'NONE' });
    
    const userCredential = await createUserWithEmailAndPassword(tempAuth, email, password);
    const newUser = userCredential.user;
    
    await setDoc(doc(db, "users", newUser.uid), {
      name: name,
      email: email,
      role: role,
      status: "active",
      needsPasswordChange: true
    });
    
    await signOut(tempAuth);
  } catch (err) {
    throw err;
  }
}

function renderUsersList() {
  const tbody = document.getElementById("users-table-rows");
  if (!tbody) return;

  if (usersUnsubscribe) usersUnsubscribe();

  usersUnsubscribe = onSnapshot(collection(db, "users"), (querySnapshot) => {
    usersList = [];
    querySnapshot.forEach((docSnap) => {
      usersList.push({ id: docSnap.id, ...docSnap.data() });
    });

    if (usersList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:20px;">No user accounts configured</td></tr>`;
      return;
    }

    tbody.innerHTML = usersList.map(u => {
      const isSelf = currentUserProfile && currentUserProfile.uid === u.id;
      const statusClass = u.status === "active" ? "veg" : "nonveg";
      
      let actionButtons = "";
      if (!isSelf) {
        actionButtons = `
          <button class="table-action-btn btn-edit-user" data-uid="${u.id}" style="padding:4px 8px; font-size:11px;">Edit</button>
          <button class="table-action-btn btn-toggle-status" data-uid="${u.id}" data-status="${u.status}" style="padding:4px 8px; font-size:11px; margin-left:4px; ${u.status === 'active' ? 'background:rgba(239,68,68,0.1); border-color:rgba(239,68,68,0.15); color:var(--nonveg-red);' : 'background:rgba(34,197,94,0.1); border-color:rgba(34,197,94,0.15); color:var(--veg-green);'}">
            ${u.status === "active" ? "Disable" : "Enable"}
          </button>
          <button class="table-action-btn btn-reset-pass" data-email="${u.email}" style="padding:4px 8px; font-size:11px; margin-left:4px; background:rgba(212,175,55,0.1); border-color:rgba(212,175,55,0.15); color:var(--accent-gold);">Reset Pass</button>
        `;
      } else {
        actionButtons = `<span style="font-size:11px; color:var(--text-muted);">Current Active Session</span>`;
      }

      return `
        <tr>
          <td class="bold">${u.name}</td>
          <td>${u.email}</td>
          <td><span class="badge-buyer" style="padding:2px 6px; border-radius:4px; font-size:10px; background:rgba(255,255,255,0.06);">${u.role}</span></td>
          <td><span class="badge-status ${statusClass}">${u.status}</span></td>
          <td style="text-align: center;">
            ${actionButtons}
          </td>
        </tr>
      `;
    }).join("");

    tbody.querySelectorAll(".btn-edit-user").forEach(btn => {
      btn.addEventListener("click", () => {
        const uid = btn.getAttribute("data-uid");
        const u = usersList.find(x => x.id === uid);
        if (u) {
          document.getElementById("user-modal-title").innerText = "Edit Account Details";
          document.getElementById("user-edit-id").value = u.id;
          document.getElementById("user-edit-name").value = u.name;
          document.getElementById("user-edit-email").value = u.email;
          document.getElementById("user-edit-email").disabled = true;
          document.getElementById("user-edit-password").value = "";
          document.getElementById("user-edit-password").required = false;
          document.getElementById("user-edit-password-group").style.display = "none";
          document.getElementById("user-edit-role").value = u.role;
          modal.style.display = "flex";
        }
      });
    });

    tbody.querySelectorAll(".btn-toggle-status").forEach(btn => {
      btn.addEventListener("click", async () => {
        const uid = btn.getAttribute("data-uid");
        const currentStatus = btn.getAttribute("data-status");
        const newStatus = currentStatus === "active" ? "disabled" : "active";
        const word = newStatus === "active" ? "enable" : "disable";
        
        if (confirm(`Are you sure you want to ${word} this user account?`)) {
          try {
            await updateDoc(doc(db, "users", uid), { status: newStatus });
            showToast(`Account successfully ${word}d`, "success");
          } catch (err) {
            console.error(err);
            showToast("Failed to update status: " + err.message, "error");
          }
        }
      });
    });

    tbody.querySelectorAll(".btn-reset-pass").forEach(btn => {
      btn.addEventListener("click", async () => {
        const email = btn.getAttribute("data-email");
        if (confirm(`Send a secure password reset email to ${email}?`)) {
          try {
            await sendPasswordResetEmail(auth, email);
            showToast("Password reset link sent to registered email.", "success");
          } catch (err) {
            console.error(err);
            showToast("Failed to send reset email: " + err.message, "error");
          }
        }
      });
    });
    
    lucide.createIcons();
  }, (err) => {
    console.error("Users list listener error", err);
  });
}


// Sidebar Toggle Logic
document.addEventListener("DOMContentLoaded", () => {
  const sidebarToggle = document.getElementById("btn-sidebar-toggle");
  const mobileMenuBtn = document.getElementById("btn-mobile-menu");
  const body = document.body;
  const navItems = document.querySelectorAll(".nav-item");

  // Desktop minimize toggle
  if (sidebarToggle) {
    // Restore state
    if (localStorage.getItem("sidebar-collapsed") === "true") {
      body.classList.add("sidebar-collapsed");
    }
    
    sidebarToggle.addEventListener("click", () => {
      body.classList.toggle("sidebar-collapsed");
      localStorage.setItem("sidebar-collapsed", body.classList.contains("sidebar-collapsed"));
    });
  }

  // Mobile menu open
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      body.classList.toggle("mobile-sidebar-open");
    });
  }

  // Close mobile menu on nav click
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        body.classList.remove("mobile-sidebar-open");
      }
    });
  });
});

// ==========================================
// HISTORICAL SALES LOGIC (ITEMIZED)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const histForm = document.getElementById("hist-sales-form");
  if (!histForm) return;

  const itemsContainer = document.getElementById("hist-items-container");
  const addItemBtn = document.getElementById("hist-add-item-btn");
  const totalDisplay = document.getElementById("hist-total-display");
  
  function calculateHistTotal() {
    let total = 0;
    const rows = itemsContainer.querySelectorAll(".hist-item-row");
    rows.forEach(row => {
      const qty = parseFloat(row.querySelector(".hist-qty").value) || 0;
      const price = parseFloat(row.querySelector(".hist-price").value) || 0;
      total += (qty * price);
    });
    totalDisplay.innerText = `?${total.toFixed(2)}`;
    return total;
  }

  function addHistItemRow() {
    const row = document.createElement("div");
    row.className = "hist-item-row";
    row.style = "display:flex; gap:8px; align-items:center; background:rgba(0,0,0,0.2); padding:10px; border-radius:6px; border:1px solid rgba(255,255,255,0.05);";
    
    row.innerHTML = `
      <input type="text" class="hist-name" placeholder="Item Name" required style="flex:2; background:transparent; border:1px solid rgba(255,255,255,0.1); border-radius:4px; padding:6px; color:white;">
      <input type="number" class="hist-qty" placeholder="Qty" min="1" required style="flex:1; background:transparent; border:1px solid rgba(255,255,255,0.1); border-radius:4px; padding:6px; color:white;">
      <input type="number" class="hist-price" placeholder="Price (?)" step="0.01" min="0" required style="flex:1; background:transparent; border:1px solid rgba(255,255,255,0.1); border-radius:4px; padding:6px; color:white;">
      <button type="button" class="hist-del-btn" style="background:none; border:none; color:var(--nonveg-red); cursor:pointer; font-size:18px; padding:0 4px;">&times;</button>
    `;
    
    row.querySelector(".hist-qty").addEventListener("input", calculateHistTotal);
    row.querySelector(".hist-price").addEventListener("input", calculateHistTotal);
    
    row.querySelector(".hist-del-btn").addEventListener("click", () => {
      row.remove();
      calculateHistTotal();
    });
    
    itemsContainer.appendChild(row);
  }

  addItemBtn.addEventListener("click", addHistItemRow);
  
  // Add an initial empty row
  addHistItemRow();

  histForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const dateVal = document.getElementById("hist-sales-date").value;
    if (!dateVal) return;
    
    const items = [];
    const rows = itemsContainer.querySelectorAll(".hist-item-row");
    
    rows.forEach(row => {
      const name = row.querySelector(".hist-name").value;
      const qty = parseFloat(row.querySelector(".hist-qty").value) || 0;
      const price = parseFloat(row.querySelector(".hist-price").value) || 0;
      if (name && qty > 0) {
        items.push({ name, qty, price });
      }
    });
    
    if (items.length === 0) {
      showToast("Please add at least one item.", "error");
      return;
    }
    
    const finalTotal = calculateHistTotal();
    
    const newOrder = {
      id: `manual-${Date.now()}`,
      date: dateVal,
      timestamp: new Date(dateVal + "T12:00:00").getTime(),
      items: items,
      totals: { finalTotal, subtotal: finalTotal, cgst: 0, sgst: 0, discountAmount: 0 },
      payment: "Manual",
      mode: "Manual",
      isManualEntry: true
    };

    try {
      await setDoc(doc(db, "orders", newOrder.id), newOrder);
      orders.push(newOrder);
      if (typeof saveOrdersToLocal === 'function') saveOrdersToLocal(orders);
      
      // Reset form
      histForm.reset();
      itemsContainer.innerHTML = "";
      addHistItemRow();
      calculateHistTotal();
      
      showToast("Historical sales order logged successfully!", "success");
      
      // Navigate to Order History view to see it
      document.querySelector('.nav-item[data-view="orders"]').click();
      
    } catch (err) {
      console.error("Error saving historical sales:", err);
      showToast("Failed to log historical sales", "error");
    }
  });
});
