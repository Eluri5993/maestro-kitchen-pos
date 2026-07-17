// Analytics and data aggregator module for Maestro Kitchen POS

export function getLocalOrders() {
  const local = localStorage.getItem("maestro_orders");
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Error parsing local orders", e);
    }
  }
  return [];
}

export function saveOrdersToLocal(orders) {
  localStorage.setItem("maestro_orders", JSON.stringify(orders));
}

/**
 * Calculate dashboard aggregate metrics for a specific date range (default: today)
 * @param {Array} orders - List of all orders
 * @param {string} dateStr - YYYY-MM-DD or empty for today
 * @returns {Object} Dashboard metrics
 */
export function getDashboardMetrics(orders, dateStr = "") {
  let dayOrders = orders;
  
  if (dateStr !== "filtered") {
    const targetDate = dateStr ? new Date(dateStr) : new Date();
    // Filter for orders from targetDate (local calendar day)
    dayOrders = orders.filter(order => {
      const oDate = new Date(order.date);
      return oDate.getFullYear() === targetDate.getFullYear() &&
             oDate.getMonth() === targetDate.getMonth() &&
             oDate.getDate() === targetDate.getDate();
    });
  }

  const totalRevenue = dayOrders.reduce((sum, o) => sum + o.totals.finalTotal, 0);
  const totalOrders = dayOrders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Payments breakdown
  const payments = { cash: 0, upi: 0, card: 0 };
  const modes = { dineIn: 0, takeaway: 0, delivery: 0 };
  
  dayOrders.forEach(o => {
    const p = (o.payment || "").toLowerCase();
    if (p === "cash") payments.cash += o.totals.finalTotal;
    else if (p === "upi") payments.upi += o.totals.finalTotal;
    else if (p === "card") payments.card += o.totals.finalTotal;

    const m = (o.mode || "").toLowerCase();
    if (m === "dine-in" || m === "dinein") modes.dineIn++;
    else if (m === "takeaway") modes.takeaway++;
    else if (m === "delivery") modes.delivery++;
  });

  return {
    revenue: totalRevenue,
    orderCount: totalOrders,
    avgOrderValue,
    payments,
    modes,
    ordersList: dayOrders
  };
}

/**
 * Get sales data grouped by hour or day depending on the period range
 * @param {Array} filteredOrders - List of filtered orders
 * @param {string} period - today, week, month, custom
 * @param {string} fromDate - YYYY-MM-DD
 * @param {string} toDate - YYYY-MM-DD
 * @returns {Object} { labels: Array, data: Array }
 */
export function getSalesGraphData(filteredOrders, period = "today", fromDate = "", toDate = "") {
  if (period === "today") {
    const hourlyRevenue = Array(24).fill(0);
    filteredOrders.forEach(order => {
      const oDate = new Date(order.date);
      const hour = oDate.getHours();
      hourlyRevenue[hour] += order.totals.finalTotal;
    });

    const labels = [];
    const data = [];
    for (let h = 9; h <= 23; h++) {
      const label = h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`;
      labels.push(label);
      data.push(hourlyRevenue[h]);
    }
    return { labels, data };
  } else if (period === "week") {
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dailyRevenue = Array(7).fill(0);

    filteredOrders.forEach(order => {
      const oDate = new Date(order.date);
      let dayIndex = oDate.getDay(); // 0 is Sunday, 1 is Monday
      dayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
      dailyRevenue[dayIndex] += order.totals.finalTotal;
    });

    return { labels: dayNames, data: dailyRevenue };
  } else if (period === "month") {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dailyRevenue = Array(daysInMonth).fill(0);

    filteredOrders.forEach(order => {
      const oDate = new Date(order.date);
      const day = oDate.getDate();
      dailyRevenue[day - 1] += order.totals.finalTotal;
    });

    const labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
    return { labels, data: dailyRevenue };
  } else if (period === "custom") {
    const revenueByDate = {};
    if (!fromDate || !toDate) {
      return { labels: [], data: [] };
    }
    
    // Pre-populate date range
    const start = new Date(fromDate + "T00:00:00");
    const end = new Date(toDate + "T23:59:59");
    const temp = new Date(start);
    
    while (temp <= end) {
      const dateStr = temp.toISOString().substring(0, 10);
      revenueByDate[dateStr] = 0;
      temp.setDate(temp.getDate() + 1);
    }

    filteredOrders.forEach(order => {
      const dateStr = order.date.substring(0, 10);
      if (revenueByDate[dateStr] !== undefined) {
        revenueByDate[dateStr] += order.totals.finalTotal;
      }
    });

    const labels = Object.keys(revenueByDate).map(d => {
      const parts = d.split("-");
      return `${parts[1]}-${parts[2]}`; // MM-DD
    });
    const data = Object.values(revenueByDate);
    return { labels, data };
  }
  return { labels: [], data: [] };
}

/**
 * Get top selling menu items based on total quantity sold
 * @param {Array} orders 
 * @param {number} limit 
 * @returns {Array} List of { name, qty, revenue }
 */
export function getTopSellingItems(orders, limit = 5) {
  const itemMap = {};
  
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!itemMap[item.menuId]) {
        itemMap[item.menuId] = { name: item.name, qty: 0, revenue: 0 };
      }
      itemMap[item.menuId].qty += item.qty;
      itemMap[item.menuId].revenue += (item.price * item.qty);
    });
  });

  return Object.values(itemMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, limit);
}

/**
 * Get hourly sales breakdown for the current day
 * @param {Array} orders 
 * @returns {Object} { labels: Array, data: Array }
 */
export function getHourlySalesData(orders) {
  const hourlyRevenue = Array(24).fill(0);
  const today = new Date();
  
  orders.forEach(order => {
    const oDate = new Date(order.date);
    if (oDate.getFullYear() === today.getFullYear() &&
        oDate.getMonth() === today.getMonth() &&
        oDate.getDate() === today.getDate()) {
      const hour = oDate.getHours();
      hourlyRevenue[hour] += order.totals.finalTotal;
    }
  });

  // Generate labels like "12 PM", "1 PM"
  const labels = [];
  const data = [];
  
  // Format hours from 9 AM to 11 PM (active restaurant hours)
  for (let h = 9; h <= 23; h++) {
    const label = h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`;
    labels.push(label);
    data.push(hourlyRevenue[h]);
  }

  return { labels, data };
}

/**
 * Get category-wise sales revenue
 * @param {Array} orders 
 * @param {Array} menu 
 * @returns {Object} { labels: Array, data: Array }
 */
export function getCategorySalesData(orders, menu) {
  const categoryRevenue = {};
  const menuMap = new Map(menu.map(m => [m.id, m.category]));

  orders.forEach(order => {
    order.items.forEach(item => {
      const category = menuMap.get(item.menuId) || "Other";
      categoryRevenue[category] = (categoryRevenue[category] || 0) + (item.price * item.qty);
    });
  });

  return {
    labels: Object.keys(categoryRevenue),
    data: Object.values(categoryRevenue)
  };
}

/**
 * Export orders to CSV string
 * @param {Array} orders 
 * @returns {string} CSV format data
 */
export function exportOrdersToCSV(orders) {
  if (orders.length === 0) return "No orders found";
  
  const headers = ["Order ID", "Date", "Mode", "Payment", "Subtotal", "Discount", "CGST", "SGST", "Total", "Items Count", "Items Details"];
  
  const rows = orders.map(o => {
    const dateStr = new Date(o.date).toISOString().replace("T", " ").substring(0, 19);
    const itemDetails = o.items.map(item => `${item.name} (x${item.qty})`).join(" | ");
    
    return [
      o.id,
      `"${dateStr}"`,
      o.mode,
      o.payment,
      o.totals.subtotal,
      o.totals.discountAmount,
      o.totals.cgst,
      o.totals.sgst,
      o.totals.finalTotal,
      o.items.length,
      `"${itemDetails}"`
    ];
  });

  return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
}
