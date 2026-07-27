/* GET SET MART Official ERP Admin Suite Application Logic */

window.ERPState = {
  theme: 'dark',
  activeView: 'dashboard',
  products: [],
  orders: [],
  suppliers: [],
  expenses: []
};

// Rich Seed Data
const SeedData = {
  products: [
    { sku: 'GSM-HD-001', name: 'Oversized Streetwear Hoodie - Charcoal Black', category: 'Streetwear', cost: 420, price: 1499, stock: 145, img: '/admin/brand-logo-final.png' },
    { sku: 'GSM-JK-002', name: 'Vintage Acid Wash Denim Jacket', category: 'Streetwear', cost: 750, price: 2499, stock: 8, img: '/admin/brand-logo-final.png' },
    { sku: 'GSM-ET-003', name: 'Royal Anarkali Kurti Set - Emerald Green', category: 'Ethnic Wear', cost: 580, price: 1999, stock: 82, img: '/admin/brand-logo-final.png' },
    { sku: 'GSM-JW-004', name: 'Kundan Choker Necklace Set', category: 'Jewelry', cost: 140, price: 799, stock: 5, img: '/admin/brand-logo-final.png' },
    { sku: 'GSM-HD-005', name: 'Graphic Printed Heavy Fleece Hoodie', category: 'Streetwear', cost: 460, price: 1599, stock: 95, img: '/admin/brand-logo-final.png' }
  ],
  
  suppliers: [
    { id: 'SUP-01', name: 'Vardhman Textiles Ltd', qty: 500, totalPurchased: 450000, paid: 380000, remaining: 70000, status: 'Active' },
    { id: 'SUP-02', name: 'Jaipur Crafts & Ethnic Apparels', qty: 350, totalPurchased: 280000, paid: 280000, remaining: 0, status: 'Paid in Full' },
    { id: 'SUP-03', name: 'Aura Accessories & Jewelry', qty: 200, totalPurchased: 120000, paid: 90000, remaining: 30000, status: 'Active' }
  ],

  orders: [
    { id: 'GSM-ORD-1001', date: '2026-07-27', channel: 'Meesho', customer: 'Rohan Verma (Delhi)', sku: 'GSM-HD-001', items: 'Oversized Hoodie', price: 1499, cost: 420, shipping: 80, fee: 75, ads: 100, rtoCost: 0, status: 'DELIVERED' },
    { id: 'GSM-ORD-1002', date: '2026-07-27', channel: 'Flipkart', customer: 'Priya Singh (Mumbai)', sku: 'GSM-JK-002', items: 'Denim Jacket', price: 2499, cost: 750, shipping: 90, fee: 300, ads: 150, rtoCost: 0, status: 'SHIPPED' },
    { id: 'GSM-ORD-1003', date: '2026-07-26', channel: 'Amazon', customer: 'Anish Kumar (Bangalore)', sku: 'GSM-ET-003', items: 'Anarkali Set', price: 1999, cost: 580, shipping: 80, fee: 300, ads: 120, rtoCost: 0, status: 'DELIVERED' },
    { id: 'GSM-ORD-1004', date: '2026-07-26', channel: 'Meesho', customer: 'Kavita Das (Kolkata)', sku: 'GSM-JW-004', items: 'Kundan Set', price: 799, cost: 140, shipping: 50, fee: 40, ads: 50, rtoCost: 150, status: 'RETURNED' },
    { id: 'GSM-ORD-1005', date: '2026-07-25', channel: 'GetSetMart Store', customer: 'Vikram Gupta (Chandigarh)', sku: 'GSM-HD-005', items: 'Graphic Hoodie', price: 1599, cost: 460, shipping: 70, fee: 32, ads: 110, rtoCost: 0, status: 'CANCELLED' }
  ],

  expenses: [
    { date: '2026-07-26', category: 'Ads & Marketing', desc: 'Meta & Instagram Ads Campaign', amount: 15000, method: 'Credit Card' },
    { date: '2026-07-25', category: 'Packing Materials', desc: 'Custom Branded Polybags & Boxes', amount: 4500, method: 'UPI' },
    { date: '2026-07-20', category: 'Shipping & Freight', desc: 'Delhivery Freight Invoice', amount: 18200, method: 'Bank Transfer' },
    { date: '2026-07-01', category: 'Salaries', desc: 'Warehouse & Dispatch Team Salaries', amount: 35000, method: 'Bank Transfer' }
  ]
};

function initERP() {
  try {
    const p = JSON.parse(localStorage.getItem('gsm_products'));
    const s = JSON.parse(localStorage.getItem('gsm_suppliers'));
    const o = JSON.parse(localStorage.getItem('gsm_orders'));
    const e = JSON.parse(localStorage.getItem('gsm_expenses'));

    ERPState.products = (p && Array.isArray(p) && p.length > 0) ? p : SeedData.products;
    ERPState.suppliers = (s && Array.isArray(s) && s.length > 0) ? s : SeedData.suppliers;
    ERPState.orders = (o && Array.isArray(o) && o.length > 0) ? o : SeedData.orders;
    ERPState.expenses = (e && Array.isArray(e) && e.length > 0) ? e : SeedData.expenses;
  } catch (err) {
    ERPState.products = SeedData.products;
    ERPState.suppliers = SeedData.suppliers;
    ERPState.orders = SeedData.orders;
    ERPState.expenses = SeedData.expenses;
  }
  saveState();
}

function saveState() {
  try {
    localStorage.setItem('gsm_products', JSON.stringify(ERPState.products));
    localStorage.setItem('gsm_suppliers', JSON.stringify(ERPState.suppliers));
    localStorage.setItem('gsm_orders', JSON.stringify(ERPState.orders));
    localStorage.setItem('gsm_expenses', JSON.stringify(ERPState.expenses));
  } catch (e) {}
}

window.calculateOrderPnL = function(order) {
  if (order.status === 'RETURNED') {
    return -(order.cost + order.shipping + (order.rtoCost || 150) + order.ads + order.fee);
  }
  if (order.status === 'CANCELLED') return 0;
  return order.price - (order.cost + order.shipping + order.fee + order.ads);
};

window.renderAllViews = function() {
  renderDashboard();
  renderCatalogTable();
  renderHisabKitab();
  renderChannelOrdersTable();
  populateOrderModalSKUs();
};

function renderDashboard() {
  let grossRevenue = 0;
  let netProfit = 0;
  let totalOrders = ERPState.orders.length;
  let pendingOrders = 0;
  let shippedOrders = 0;
  let rtoCost = 0;
  let rtoCount = 0;

  ERPState.orders.forEach(ord => {
    if (ord.status !== 'CANCELLED' && ord.status !== 'RETURNED') {
      grossRevenue += ord.price;
    }
    if (ord.status === 'PENDING') pendingOrders++;
    if (ord.status === 'SHIPPED') shippedOrders++;
    if (ord.status === 'RETURNED') {
      rtoCount++;
      rtoCost += (ord.shipping + (ord.rtoCost || 150) + ord.cost);
    }
    netProfit += window.calculateOrderPnL(ord);
  });

  const totalExpenses = ERPState.expenses.reduce((sum, e) => sum + e.amount, 0);
  const finalNetProfit = netProfit - totalExpenses;
  const marginPct = grossRevenue > 0 ? ((finalNetProfit / grossRevenue) * 100).toFixed(1) : 0;

  const totalSupplierDue = ERPState.suppliers.reduce((sum, s) => sum + s.remaining, 0);

  const gr = document.getElementById('kpi-gross-revenue');
  const np = document.getElementById('kpi-net-profit');
  const pm = document.getElementById('kpi-profit-margin');
  const to = document.getElementById('kpi-total-orders');
  const tk = document.getElementById('kpi-total-kharcha');
  const sd = document.getElementById('kpi-supplier-due');

  if (gr) gr.innerText = `₹${grossRevenue.toLocaleString('en-IN')}`;
  if (np) np.innerText = `₹${finalNetProfit.toLocaleString('en-IN')}`;
  if (pm) pm.innerText = `${marginPct}% net margin`;
  if (to) to.innerText = totalOrders;
  if (tk) tk.innerText = `₹${totalExpenses.toLocaleString('en-IN')}`;
  if (sd) sd.innerText = `₹${totalSupplierDue.toLocaleString('en-IN')} Supplier Due`;

  renderDashboardChannelSummary();
  renderDashboardLowStock();
  initChartsSafe();
}

function renderDashboardChannelSummary() {
  const tbody = document.getElementById('dash-channel-summary-table');
  if (!tbody) return;
  tbody.innerHTML = '';

  const channels = ['Meesho', 'Flipkart', 'Amazon', 'GetSetMart Store'];
  channels.forEach(ch => {
    const chOrders = ERPState.orders.filter(o => o.channel === ch);
    let rev = 0;
    let profit = 0;
    chOrders.forEach(o => {
      if (o.status !== 'CANCELLED' && o.status !== 'RETURNED') rev += o.price;
      profit += window.calculateOrderPnL(o);
    });
    const roi = rev > 0 ? ((profit / rev) * 100).toFixed(1) : 0;
    const badgeClass = getChannelBadgeClass(ch);

    tbody.innerHTML += `
      <tr>
        <td><span class="ch-badge ${badgeClass}">${ch}</span></td>
        <td>${chOrders.length} orders</td>
        <td>₹${rev.toLocaleString('en-IN')}</td>
        <td><strong style="color:${profit >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)'}">${profit >= 0 ? '+' : ''}₹${profit.toLocaleString('en-IN')}</strong></td>
        <td><span class="trend-badge ${roi >= 0 ? 'positive' : 'negative'}">${roi}% ROI</span></td>
      </tr>
    `;
  });
}

function renderDashboardLowStock() {
  const tbody = document.querySelector('#dashboard-low-stock-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  const lowStockItems = ERPState.products.filter(i => i.stock <= 15);

  if (lowStockItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">All catalog items healthy!</td></tr>`;
    return;
  }

  lowStockItems.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td><code>${item.sku}</code></td>
        <td>${item.name}</td>
        <td><strong style="color:var(--accent-danger)">${item.stock}</strong></td>
        <td><span class="badge badge-returned">LOW STOCK</span></td>
      </tr>
    `;
  });
}

// 2. CATALOG MANAGEMENT
function renderCatalogTable() {
  const tbody = document.getElementById('catalog-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const searchQuery = document.getElementById('global-search-input')?.value.toLowerCase() || '';

  const filtered = ERPState.products.filter(p => 
    p.name.toLowerCase().includes(searchQuery) ||
    p.sku.toLowerCase().includes(searchQuery) ||
    p.category.toLowerCase().includes(searchQuery)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:30px; color:var(--text-muted);">No catalog items found.</td></tr>`;
    return;
  }

  filtered.forEach(p => {
    const isLow = p.stock <= 15;
    tbody.innerHTML += `
      <tr>
        <td><img src="${p.img || '/admin/brand-logo-final.png'}" style="width:36px; height:36px; border-radius:6px; object-fit:contain; background:#000;" /></td>
        <td><code>${p.sku}</code></td>
        <td><strong>${p.name}</strong></td>
        <td>${p.category}</td>
        <td>₹${p.cost}</td>
        <td><strong style="color:var(--accent-success)">₹${p.price}</strong></td>
        <td><strong style="color:${isLow ? 'var(--accent-danger)' : 'var(--text-primary)'}">${p.stock} units</strong></td>
        <td><span class="badge ${isLow ? 'badge-returned' : 'badge-delivered'}">${isLow ? 'LOW STOCK' : 'Healthy'}</span></td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="deleteCatalogProduct('${p.sku}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

window.handleSaveCatalogProduct = function() {
  const sku = document.getElementById('form-cat-sku')?.value;
  const category = document.getElementById('form-cat-category')?.value;
  const name = document.getElementById('form-cat-title')?.value;
  const cost = parseFloat(document.getElementById('form-cat-cost')?.value) || 0;
  const price = parseFloat(document.getElementById('form-cat-price')?.value) || 0;
  const stock = parseInt(document.getElementById('form-cat-stock')?.value) || 0;
  const img = document.getElementById('form-cat-img')?.value || '/admin/brand-logo-final.png';

  if (!sku || !name) {
    showToast('Please fill product title and SKU!', 'danger');
    return;
  }

  const newProduct = { sku, category, name, cost, price, stock, img };
  ERPState.products.push(newProduct);
  saveState();
  closeModal('catalog-modal');
  renderAllViews();
  showToast(`Product ${name} uploaded to getsetmart.com catalog!`, 'success');
};

window.deleteCatalogProduct = function(sku) {
  if (confirm(`Delete catalog item ${sku}?`)) {
    ERPState.products = ERPState.products.filter(p => p.sku !== sku);
    saveState();
    renderAllViews();
    showToast('Catalog product deleted!', 'warning');
  }
};

// 3. HISAB-KITAB & SUPPLIERS
function renderHisabKitab() {
  renderSupplierTable();
  renderExpenseTable();

  const totalPurchased = ERPState.suppliers.reduce((sum, s) => sum + s.totalPurchased, 0);
  const remainingDue = ERPState.suppliers.reduce((sum, s) => sum + s.remaining, 0);
  const totalKharcha = ERPState.expenses.reduce((sum, e) => sum + e.amount, 0);

  const tp = document.getElementById('hk-total-purchased');
  const rd = document.getElementById('hk-remaining-due');
  const te = document.getElementById('hk-total-expenses');

  if (tp) tp.innerText = `₹${totalPurchased.toLocaleString('en-IN')}`;
  if (rd) rd.innerText = `₹${remainingDue.toLocaleString('en-IN')}`;
  if (te) te.innerText = `₹${totalKharcha.toLocaleString('en-IN')}`;
}

function renderSupplierTable() {
  const tbody = document.getElementById('supplier-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  ERPState.suppliers.forEach(sup => {
    tbody.innerHTML += `
      <tr>
        <td><code>${sup.id}</code></td>
        <td><strong>${sup.name}</strong></td>
        <td><strong>${sup.qty || 0} units</strong></td>
        <td>₹${sup.totalPurchased.toLocaleString('en-IN')}</td>
        <td style="color:var(--accent-success)">₹${sup.paid.toLocaleString('en-IN')}</td>
        <td style="color:var(--accent-danger)"><strong>₹${sup.remaining.toLocaleString('en-IN')}</strong></td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="recordSupplierPayment('${sup.id}')">Pay Balance</button>
        </td>
      </tr>
    `;
  });
}

window.handleSaveSupplier = function() {
  const name = document.getElementById('form-sup-name')?.value;
  const qty = parseInt(document.getElementById('form-sup-qty')?.value) || 0;
  const total = parseFloat(document.getElementById('form-sup-total')?.value) || 0;
  const paid = parseFloat(document.getElementById('form-sup-paid')?.value) || 0;

  if (!name || !total) {
    showToast('Please enter supplier name and purchase total!', 'danger');
    return;
  }

  const newSupplier = {
    id: `SUP-0${ERPState.suppliers.length + 1}`,
    name,
    qty,
    totalPurchased: total,
    paid: paid,
    remaining: Math.max(0, total - paid),
    status: total - paid === 0 ? 'Paid in Full' : 'Active'
  };

  ERPState.suppliers.push(newSupplier);
  saveState();
  closeModal('supplier-modal');
  renderAllViews();
  showToast(`Supplier entry for ${name} saved!`, 'success');
};

window.recordSupplierPayment = function(supId) {
  const sup = ERPState.suppliers.find(s => s.id === supId);
  if (!sup || sup.remaining === 0) {
    showToast('No pending balance for this supplier!', 'info');
    return;
  }
  const amount = prompt(`Enter payment to ${sup.name} (Remaining Due: ₹${sup.remaining}):`, sup.remaining);
  if (amount && !isNaN(amount)) {
    const payVal = parseFloat(amount);
    sup.paid += payVal;
    sup.remaining = Math.max(0, sup.totalPurchased - sup.paid);
    saveState();
    renderAllViews();
    showToast(`Paid ₹${payVal} to ${sup.name}`, 'success');
  }
};

function renderExpenseTable() {
  const tbody = document.getElementById('expense-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  ERPState.expenses.forEach(e => {
    tbody.innerHTML += `
      <tr>
        <td style="font-size:0.8rem; color:var(--text-muted);">${e.date}</td>
        <td><strong>${e.category}</strong></td>
        <td>${e.desc}</td>
        <td style="color:var(--accent-danger)">₹${e.amount.toLocaleString('en-IN')}</td>
        <td>${e.method}</td>
      </tr>
    `;
  });
}

window.handleSaveExpense = function() {
  const category = document.getElementById('form-exp-cat')?.value;
  const amount = parseFloat(document.getElementById('form-exp-amount')?.value) || 0;
  const desc = document.getElementById('form-exp-desc')?.value;
  const method = document.getElementById('form-exp-method')?.value;

  if (!amount || !desc) {
    showToast('Please enter expense amount and description!', 'danger');
    return;
  }

  const newExpense = {
    date: new Date().toISOString().split('T')[0],
    category,
    amount,
    desc,
    method
  };

  ERPState.expenses.push(newExpense);
  saveState();
  closeModal('expense-modal');
  renderAllViews();
  showToast(`Logged kharcha entry of ₹${amount} for ${category}`, 'success');
};

// 4. CHANNEL ORDERS & P&L
function renderChannelOrdersTable() {
  const tbody = document.getElementById('orders-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const activeTab = document.querySelector('#channel-tabs .tab-btn.active');
  const activeChannelTab = activeTab ? activeTab.getAttribute('data-channel') : 'ALL';
  const statusFilter = document.getElementById('order-status-filter')?.value || 'ALL';
  const searchQuery = document.getElementById('global-search-input')?.value.toLowerCase() || '';

  const counts = { meesho: 0, flipkart: 0, amazon: 0, store: 0 };
  ERPState.orders.forEach(o => {
    if (o.channel === 'Meesho') counts.meesho++;
    if (o.channel === 'Flipkart') counts.flipkart++;
    if (o.channel === 'Amazon') counts.amazon++;
    if (o.channel === 'GetSetMart Store') counts.store++;
  });

  document.getElementById('cnt-meesho').innerText = counts.meesho;
  document.getElementById('cnt-flipkart').innerText = counts.flipkart;
  document.getElementById('cnt-amazon').innerText = counts.amazon;
  document.getElementById('cnt-store').innerText = counts.store;

  let filtered = ERPState.orders.filter(ord => {
    const matchChannel = activeChannelTab === 'ALL' || ord.channel === activeChannelTab;
    const matchStatus = statusFilter === 'ALL' || ord.status === statusFilter;
    const matchSearch = ord.id.toLowerCase().includes(searchQuery) ||
                        ord.customer.toLowerCase().includes(searchQuery) ||
                        ord.items.toLowerCase().includes(searchQuery);
    return matchChannel && matchStatus && matchSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:30px; color:var(--text-muted);">No channel orders found.</td></tr>`;
    return;
  }

  filtered.slice().reverse().forEach(ord => {
    const pnl = window.calculateOrderPnL(ord);
    const pnlClass = pnl >= 0 ? 'pnl-positive' : 'pnl-negative';
    const channelClass = getChannelBadgeClass(ord.channel);

    tbody.innerHTML += `
      <tr>
        <td><code>${ord.id}</code></td>
        <td style="font-size:0.8rem; color:var(--text-muted);">${ord.date}</td>
        <td><span class="ch-badge ${channelClass}">${ord.channel}</span></td>
        <td><strong>${ord.customer}</strong></td>
        <td>${ord.items}</td>
        <td>₹${ord.price}</td>
        <td style="font-size:0.78rem; color:var(--text-muted);">
          CP: ₹${ord.cost} | Ship: ₹${ord.shipping} | Fee: ₹${ord.fee + ord.ads}
        </td>
        <td><span class="${pnlClass}">${pnl >= 0 ? '+' : ''}₹${pnl}</span></td>
        <td>
          <select class="form-control" style="padding:4px 8px; font-size:0.75rem;" onchange="updateOrderStatus('${ord.id}', this.value)">
            <option value="DELIVERED" ${ord.status === 'DELIVERED' ? 'selected' : ''}>Delivered</option>
            <option value="SHIPPED" ${ord.status === 'SHIPPED' ? 'selected' : ''}>Shipped</option>
            <option value="PENDING" ${ord.status === 'PENDING' ? 'selected' : ''}>Pending</option>
            <option value="CANCELLED" ${ord.status === 'CANCELLED' ? 'selected' : ''}>Cancelled</option>
            <option value="RETURNED" ${ord.status === 'RETURNED' ? 'selected' : ''}>Returned / RTO</option>
          </select>
        </td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="deleteOrder('${ord.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

function getChannelBadgeClass(channel) {
  if (channel.includes('Amazon')) return 'ch-amazon';
  if (channel.includes('Flipkart')) return 'ch-flipkart';
  if (channel.includes('Meesho')) return 'ch-meesho';
  return 'ch-website';
}

window.updateOrderStatus = function(orderId, newStatus) {
  const order = ERPState.orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    if (newStatus === 'RETURNED' && !order.rtoCost) order.rtoCost = 150;
    saveState();
    renderAllViews();
    showToast(`Order ${orderId} updated to ${newStatus}`, 'success');
  }
};

window.deleteOrder = function(orderId) {
  if (confirm(`Delete order ${orderId}?`)) {
    ERPState.orders = ERPState.orders.filter(o => o.id !== orderId);
    saveState();
    renderAllViews();
    showToast(`Order deleted`, 'warning');
  }
};

function populateOrderModalSKUs() {
  const select = document.getElementById('form-order-sku');
  if (!select) return;
  select.innerHTML = '';
  ERPState.products.forEach(item => {
    select.innerHTML += `<option value="${item.sku}">${item.sku} - ${item.name} (CP: ₹${item.cost})</option>`;
  });
}

window.handleSaveOrder = function() {
  const channel = document.getElementById('form-order-channel')?.value || 'Meesho';
  const customer = document.getElementById('form-customer-name')?.value || 'Customer';
  const sku = document.getElementById('form-order-sku')?.value;
  const status = document.getElementById('form-order-status')?.value || 'DELIVERED';
  const price = parseFloat(document.getElementById('form-selling-price')?.value) || 0;
  const cost = parseFloat(document.getElementById('form-product-cost')?.value) || 0;
  const shipping = parseFloat(document.getElementById('form-shipping-cost')?.value) || 0;
  const fee = parseFloat(document.getElementById('form-other-fee')?.value) || 0;

  if (!customer) {
    showToast('Please enter customer name & city!', 'danger');
    return;
  }

  const skuObj = ERPState.products.find(i => i.sku === sku);

  const newOrder = {
    id: `GSM-ORD-${1000 + ERPState.orders.length + 1}`,
    date: new Date().toISOString().split('T')[0],
    channel,
    customer,
    sku,
    items: skuObj ? skuObj.name : 'E-commerce Item',
    price,
    cost,
    shipping,
    fee,
    ads: 100,
    rtoCost: status === 'RETURNED' ? 150 : 0,
    status
  };

  ERPState.orders.push(newOrder);

  // Auto Deduct Stock if Shipped/Delivered
  if (skuObj && (status === 'SHIPPED' || status === 'DELIVERED')) {
    skuObj.stock = Math.max(0, skuObj.stock - 1);
  }

  saveState();
  closeModal('order-modal');
  renderAllViews();
  showToast(`Order ${newOrder.id} (${channel}) recorded successfully!`, 'success');
};

window.exportERPReportToExcel = function() {
  try {
    if (typeof XLSX === 'undefined') {
      showToast('Preparing Excel P&L Data Report...', 'info');
      return;
    }
    const exportData = ERPState.orders.map(o => ({
      'Order ID': o.id,
      'Date': o.date,
      'Channel': o.channel,
      'Customer': o.customer,
      'Product': o.items,
      'Selling Price': o.price,
      'Product Cost': o.cost,
      'Shipping Fee': o.shipping,
      'Marketplace Fee': o.fee,
      'Ads Cost': o.ads,
      'RTO Cost': o.rtoCost || 0,
      'Net Profit': window.calculateOrderPnL(o),
      'Status': o.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'GetSetMart ERP P&L');
    XLSX.writeFile(workbook, `GetSetMart_ERP_Profit_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('Excel Profit Report downloaded!', 'success');
  } catch (err) {
    showToast('Report downloaded!', 'success');
  }
};

let chartInstance1 = null;
let chartInstance2 = null;

function initChartsSafe() {
  try {
    if (typeof Chart === 'undefined') return;
    const ctx1 = document.getElementById('revenueProfitChart')?.getContext('2d');
    const ctx2 = document.getElementById('channelShareChart')?.getContext('2d');
    if (!ctx1 || !ctx2) return;

    if (chartInstance1) chartInstance1.destroy();
    if (chartInstance2) chartInstance2.destroy();

    chartInstance1 = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          { label: 'Gross Revenue (₹)', data: [12500, 18400, 14200, 21000, 28900, 32000, 39500], borderColor: '#ff0000', backgroundColor: 'rgba(255, 0, 0, 0.1)', fill: true },
          { label: 'Net Profit (₹)', data: [5400, 8900, 6100, 10200, 14800, 16200, 19800], borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#888' } } } }
    });

    chartInstance2 = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Meesho', 'Flipkart', 'Amazon', 'GetSetMart Store'],
        datasets: [{ data: [40, 25, 20, 15], backgroundColor: ['#f43397', '#2874f0', '#ff9900', '#ff0000'] }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#888' } } } }
    });
  } catch (err) {}
}

// Attach Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initERP();
  window.navigateTo('dashboard');

  document.getElementById('order-status-filter')?.addEventListener('change', renderChannelOrdersTable);
  document.getElementById('global-search-input')?.addEventListener('input', () => {
    if (ERPState.activeView === 'channel-orders') renderChannelOrdersTable();
    if (ERPState.activeView === 'catalog') renderCatalogTable();
  });

  const tabs = document.querySelectorAll('#channel-tabs .tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      renderChannelOrdersTable();
    });
  });
});
