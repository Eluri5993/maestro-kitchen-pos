// Billing and terminal checkout module for Maestro Kitchen POS
export const DEFAULT_TAX_CONFIG = {
  cgstRate: 2.5, // 2.5% CGST
  sgstRate: 2.5, // 2.5% SGST
  restaurantName: "MAESTRO KITCHEN",
  restaurantAddress: "2-364, Sachivalaya Colony, Hyderabad, Vanasthalipuram, Telangana 500070",
  restaurantPhone: "+91 9989352547",
  gstin: "36AAAAA1111A1Z1",
};

export function getLocalTaxConfig() {
  const local = localStorage.getItem("maestro_tax_config");
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Error parsing local tax config", e);
    }
  }
  return DEFAULT_TAX_CONFIG;
}

export function saveTaxConfigToLocal(config) {
  localStorage.setItem("maestro_tax_config", JSON.stringify(config));
}

/**
 * Calculate totals for the cart items
 * @param {Array} cartItems - List of { price, qty }
 * @param {Object} discount - { type: 'percent'|'flat', value: number }
 * @param {Object} config - Tax configuration
 * @param {Object} promo - Applied promo { discountType: 'percent'|'flat', discountValue: number }
 * @returns {Object} Calculated figures
 */
export function calculateCartTotals(cartItems, discount = { type: "percent", value: 0 }, config = getLocalTaxConfig(), promo = null) {
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  
  let discountAmount = 0;
  if (discount.type === "percent") {
    discountAmount = parseFloat(((subtotal * discount.value) / 100).toFixed(2));
  } else if (discount.type === "flat") {
    discountAmount = Math.min(subtotal, discount.value);
  }

  let promoDiscountAmount = 0;
  const subtotalAfterManual = Math.max(0, subtotal - discountAmount);
  if (promo) {
    if (promo.discountType === "percent") {
      promoDiscountAmount = parseFloat(((subtotalAfterManual * promo.discountValue) / 100).toFixed(2));
    } else if (promo.discountType === "flat") {
      promoDiscountAmount = Math.min(subtotalAfterManual, promo.discountValue);
    }
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount - promoDiscountAmount);
  
  const cgst = parseFloat(((taxableAmount * config.cgstRate) / 100).toFixed(2));
  const sgst = parseFloat(((taxableAmount * config.sgstRate) / 100).toFixed(2));
  
  const rawTotal = taxableAmount + cgst + sgst;
  const finalTotal = Math.round(rawTotal);
  const roundOff = parseFloat((finalTotal - rawTotal).toFixed(2));

  return {
    subtotal,
    discountAmount,
    promoDiscountAmount,
    taxableAmount,
    cgst,
    sgst,
    roundOff,
    finalTotal
  };
}

/**
 * Generate a receipt HTML string for thermal printing
 * @param {Object} order - Order details containing id, items, totals, mode, payment, date
 * @param {Object} config - Restaurant config
 * @returns {string} HTML string to be injected into a print iframe or print window
 */
export function generateThermalReceiptHTML(order, config = getLocalTaxConfig()) {
  const dateStr = new Date(order.date).toLocaleString();
  
  // Format amount in Indian billing style: XX.XX/-
  const fmt = (val) => `${val.toFixed(2)}/-`;

  const itemsHtml = order.items.map(item => `
    <div class="receipt-row">
      <div class="col-item">
        ${item.name}
        ${item.notes ? `<div style="font-size: 9px; font-style: italic; color: #555;">* ${item.notes}</div>` : ""}
      </div>
      <div class="col-qty">${item.qty}</div>
      <div class="col-rate">${fmt(item.price)}</div>
      <div class="col-amt">${fmt(item.price * item.qty)}</div>
    </div>
  `).join("");

  const tableInfo = order.tableNumber ? `<div style="font-size:10px; margin-bottom:2px;">Table: <b>${order.tableNumber}</b> &nbsp;|&nbsp; Mode: <b>${order.mode}</b></div>` : `<div style="font-size:10px; margin-bottom:2px;">Mode: <b>${order.mode}</b></div>`;

  return `
    <html>
      <head>
        <title>Receipt #${order.id}</title>
        <style>
          @page { size: 80mm auto; margin: 4mm 2mm; }
          body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 11px;
            color: #000;
            width: 74mm;
            margin: 0 auto;
            padding: 6px 0;
            text-align: center;
          }
          .bold { font-weight: bold; }
          .title { font-size: 15px; margin-bottom: 2px; letter-spacing: 1px; }
          .divider { border-top: 1px dashed #000; margin: 6px 0; }
          /* Item list using flexbox for fixed column spacing */
          .items-section { margin: 6px 0; }
          .receipt-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            font-size: 11px;
            padding: 3px 0;
            line-height: 1.3;
          }
          .receipt-row.header {
            border-bottom: 1px dashed #000;
            padding-bottom: 4px;
            margin-bottom: 4px;
            font-size: 10px;
          }
          .col-item {
            flex: 1;
            text-align: left;
            word-break: break-word;
            padding-right: 10px;
          }
          .col-qty {
            width: 30px;
            text-align: center;
            flex-shrink: 0;
            padding-right: 5px;
          }
          .col-rate {
            width: 75px;
            text-align: right;
            flex-shrink: 0;
            padding-right: 10px;
          }
          .col-amt {
            width: 80px;
            text-align: right;
            flex-shrink: 0;
          }
          .totals-table { width: 100%; border-collapse: collapse; font-size: 11px; margin: 4px 0; }
          .totals-table td { padding: 2px 0; }
          .totals-table td:first-child { text-align: left; }
          .totals-table td:last-child { text-align: right; white-space: nowrap; }
          .net-row td { font-size: 11px; font-weight: bold; border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 5px 0; }
          .info-table { width: 100%; border-collapse: collapse; font-size: 10px; margin: 2px 0; }
          .info-table td { padding: 1px 0; }
          .text-left { text-align: left; }
          .text-right { text-align: right; }
          .footer { margin-top: 12px; font-size: 10px; }
        </style>
      </head>
      <body>
        <div class="bold title">${config.restaurantName}</div>
        <div style="font-size: 9px; line-height: 1.5; margin: 2px 0;">${config.restaurantAddress}</div>
        <div style="font-size: 9px;">Tel: ${config.restaurantPhone}</div>
        ${config.gstin ? `<div style="font-size: 9px;">GSTIN: ${config.gstin}</div>` : ""}
        
        <div class="divider"></div>
        
        <table class="info-table">
          <tr>
            <td class="text-left">Bill No: <b>${order.id}</b></td>
            <td class="text-right">Pay: <b>${order.payment}</b></td>
          </tr>
          <tr>
            <td class="text-left" colspan="2">Date: ${dateStr}</td>
          </tr>
          <tr>
            <td class="text-left" colspan="2">${tableInfo}</td>
          </tr>
        </table>
        
        <div class="divider"></div>
        
        <div class="items-section">
          <div class="receipt-row header bold">
            <div class="col-item">Item</div>
            <div class="col-qty">Qty</div>
            <div class="col-rate">Rate</div>
            <div class="col-amt">Amt</div>
          </div>
          ${itemsHtml}
        </div>
        
        <div class="divider"></div>
        
        <table class="totals-table">
          <tr>
            <td class="text-left">Sub Total:</td>
            <td class="text-right">${fmt(order.totals.subtotal)}</td>
          </tr>
          ${order.totals.discountAmount > 0 ? `
          <tr>
            <td class="text-left">Discount${order.discountInfo && order.discountInfo.reason ? ` (${order.discountInfo.reason})` : ""}:</td>
            <td class="text-right">-${fmt(order.totals.discountAmount)}</td>
          </tr>
          ` : ""}
          ${order.totals.promoDiscountAmount > 0 ? `
          <tr>
            <td class="text-left">Promo${order.promoInfo && order.promoInfo.code ? ` (${order.promoInfo.code})` : ""}:</td>
            <td class="text-right">-${fmt(order.totals.promoDiscountAmount)}</td>
          </tr>
          ` : ""}
          <tr>
            <td class="text-left">CGST (${config.cgstRate}%):</td>
            <td class="text-right">${fmt(order.totals.cgst)}</td>
          </tr>
          <tr>
            <td class="text-left">SGST (${config.sgstRate}%):</td>
            <td class="text-right">${fmt(order.totals.sgst)}</td>
          </tr>
          ${order.totals.roundOff !== 0 ? `
          <tr>
            <td class="text-left">Round Off:</td>
            <td class="text-right">${order.totals.roundOff > 0 ? "+" : ""}${fmt(Math.abs(order.totals.roundOff))}</td>
          </tr>
          ` : ""}
          <tr class="net-row">
            <td class="text-left">NET AMOUNT:</td>
            <td class="text-right">${fmt(order.totals.finalTotal)}</td>
          </tr>
        </table>
        
        <div class="footer">
          <div class="bold">Thank You! Visit Again</div>
          <div style="margin-top: 2px;">Software Powered by Maestro POS</div>
        </div>
      </body>
    </html>
  `;
}
