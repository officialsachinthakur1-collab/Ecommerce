/* GET SET MART Official ERP Application Logic - Instant Page Switcher */

window.ERPState = {
  theme: 'dark',
  activeView: 'dashboard',
  orders: [],
  suppliers: [],
  inventory: [],
  payments: [],
  expenses: []
};

// Rich Pre-populated Seed Data
const SeedData = {
  inventory: [
    { sku: 'GSM-HD-001', name: 'Oversized Streetwear Hoodie - Charcoal Black', category: 'Streetwear', cost: 420, price: 1499, stock: 145, minStock: 20 },
    { sku: 'GSM-JK-002', name: 'Vintage Acid Wash Denim Jacket', category: 'Streetwear', cost: 750, price: 2499, stock: 8, minStock: 15 },
    { sku: 'GSM-ET-003', name: 'Royal Anarkali Kurti Set - Emerald Green', category: 'Ethnic Wear', cost: 580, price: 1999, stock: 82, minStock: 10 },
    { sku: 'GSM-JW-004', name: 'Kundan Choker Necklace Set', category: 'Jewelry', cost: 140, price: 799, stock: 5, minStock: 15 },
    { sku: 'GSM-HD-005', name: 'Graphic Printed Heavy Fleece Hoodie', category: 'Streetwear', cost: 460, price: 1599, stock: 95, minStock: 25 },
    { sku: 'GSM-ET-006', name: 'Chanderi Silk Printed Saree', category: 'Ethnic Wear', cost: 350, price: 1299, stock: 60, minStock: 12 }
  ],
  
  suppliers: [
    { id: 'SUP-01', name: 'Vardhman Textiles Ltd', contact: 'Rajesh Malhotra (+91 98765 43210)', totalPurchased: 450000, paid: 380000, remaining: 70000, status: 'Active' },
    { id: 'SUP-02', name: 'Jaipur Crafts & Ethnic Apparels', contact: 'Sunita Sharma (+91 98111 22334)', totalPurchased: 280000, paid: 280000, remaining: 0, status: 'Paid in Full' },
    { id: 'SUP-03', name: 'Aura Accessories & Jewelry', contact: 'Amit Varma (+91 99887 76655)', totalPurchased: 120000, paid: 90000, remaining: 30000, status: 'Active' }
  ],

  orders: [
    { id: 'GSM-ORD-1001', date: '2026-07-26', channel: 'GetSetMart Store', customer: 'Rohan Verma (Delhi)', sku: 'GSM-HD-001', items: 'Oversized Hoodie', price: 1499, cost: 420, shipping: 70, fee: 30, ads: 120, rtoCost: 0, status: 'DELIVERED' },
    { id: 'GSM-ORD-1002', date: '2026-07-26', channel: 'Amazon', customer: 'Priya Singh (Mumbai)', sku: 'GSM-JK-002', items: 'Denim Jacket', price: 2499, cost: 750, shipping: 90, fee: 375, ads: 180, rtoCost: 0, status: 'SHIPPED' },
    { id: 'GSM-ORD-1003', date: '2026-07-25', channel: 'Flipkart', customer: 'Anish Kumar (Bangalore)', sku: 'GSM-ET-003', items: 'Anarkali Set', price: 1999, cost: 580, shipping: 80, fee: 240, ads: 150, rtoCost: 0, status: 'DELIVERED' },
    { id: 'GSM-ORD-1004', date: '2026-07-25', channel: 'Meesho', customer: 'Kavita Das (Kolkata)', sku: 'GSM-JW-004', items: 'Kundan Set', price: 799, cost: 140, shipping: 50, fee: 40, ads: 60, rtoCost: 150, status: 'RETURNED' },
    { id: 'GSM-ORD-1005', date: '2026-07-24', channel: 'GetSetMart Store', customer: 'Vikram Gupta (Chandigarh)', sku: 'GSM-HD-005', items: 'Graphic Hoodie', price: 1599, cost: 460, shipping: 70, fee: 32, ads: 110, rtoCost: 0, status: 'PENDING' },
    { id: 'GSM-ORD-1006', date: '2026-07-24', channel: 'Amazon', customer: 'Deepak Rao (Hyderabad)', sku: 'GSM-ET-006', items: 'Chanderi Saree', price: 1299, cost: 350, shipping: 65, fee: 195, ads: 90, rtoCost: 0, status: 'DELIVERED' }
  ],

  expenses: [
    { date: '2026-07-25', category: 'Ads & Marketing', desc: 'Meta & Instagram Ads Campaign', amount: 15000, method: 'Credit Card' },
    { date: '2026-07-24', category: 'Packing Materials', desc: 'Custom Branded Polybags & Boxes', amount: 4500, method: 'UPI' },
    { date: '2026-07-20', category: 'Shipping & Logistics', desc: 'Delhivery Post-paid Freight Invoice', amount: 18200, method: 'Bank Transfer' },
    { date: '2026-07-01', category: 'Salaries', desc: 'Warehouse & Dispatch Team Salaries', amount: 35000, method: 'Bank Transfer' }
  ]
};

function initERP() {
  try {
    const inv = JSON.parse(localStorage.getItem('gsm_inventory'));
    const sup = JSON.parse(localStorage.getItem('gsm_suppliers'));
    const ord = JSON.parse(localStorage.getItem('gsm_orders'));
    const exp = JSON.parse(localStorage.getItem('gsm_expenses'));

    ERPState.inventory = (inv && Array.isArray(inv) && inv.length > 0) ? inv : SeedData.inventory;
    ERPState.suppliers = (sup && Array.isArray(sup) && sup.length > 0) ? sup : SeedData.suppliers;
    ERPState.orders = (ord && Array.isArray(ord) && ord.length > 0) ? ord : SeedData.orders;
    ERPState.expenses = (exp && Array.isArray(exp) && exp.length > 0) ? exp : SeedData.expenses;
  } catch (err) {
    ERPState.inventory = SeedData.inventory;
    ERPState.suppliers = SeedData.suppliers;
    ERPState.orders = SeedData.orders;
    ERPState.expenses = SeedData.expenses;
  }
  saveState();
}

function saveState() {
  try {
    localStorage.setItem('gsm_inventory', JSON.stringify(ERPState.inventory));
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

// BULLETPROOF NAVIGATE TO FUNCTION
window.navigateTo = function(viewId) {
  ERPState.activeView = viewId;

  // 1. Hide all view sections
  const sections = document.querySelectorAll('.view-section');
  sections.forEach(sec => {
    sec.style.display = 'none';
    sec.classList.remove('active');
  });

  // 2. Show selected view section
  const target = document.getElementById(`view-${viewId}`);
  if (target) {
    target.style.display = 'block';
    target.classList.add('active');
  }

  // 3. Update sidebar active item
  const navItems = document.querySelectorAll('.sidebar .nav-item');
  navItems.forEach(el => {
    if (el.getAttribute('data-view') === viewId) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  // 4. Update Header Titles
  const titles = {
    'dashboard': ['Dashboard Overview', 'Real-time business performance & profit analytics'],
    'orders': ['All-Channel Orders', 'Order workflow, delivery statuses & profit per order'],
    'pnl-calculator': ['Order P&L Engine', 'Live mathematical simulator for order profitability'],
    'suppliers': ['Supplier Ledger', 'Vendor balances, purchase history & inward stock'],
    'inventory': ['Inventory & SKUs', 'Stock levels, cost prices & low-stock alerts'],
    'payments': ['Payments & Settlements', 'Marketplace payouts, COD reconciliation & receivables'],
    'expenses': ['Expense Tracker', 'Log operating costs (Ads, Shipping, Salaries, Packing)'],
    'reports': ['Sales & ROI Reports', 'Channel-wise net profit & SKU performance analysis'],
    'import-sync': ['Excel Import & Sync', 'Drag & drop Excel files or simulate scheduled sync']
  };

  if (titles[viewId]) {
    const tEl = document.getElementById('current-view-title');
    const sEl = document.getElementById('current-view-subtitle');
    if (tEl) tEl.innerText = titles[viewId][0];
    if (sEl) sEl.innerText = titles[viewId][1];
  }

  renderAllViews();
};

window.openModal = function(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'flex';
};

window.closeModal = function(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'none';
};

window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerText = message;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

function renderAllViews() {
  renderDashboard();
  renderOrdersTable();
  renderSupplierTable();
  renderInventoryTable();
  renderPayments();
  renderExpenseTable();
  renderReportsTable();
  populateOrderModalSKUs();
}

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
  const rtoRatePct = totalOrders > 0 ? ((rtoCount / totalOrders) * 100).toFixed(1) : 0;

  const gr = document.getElementById('kpi-gross-revenue');
  const np = document.getElementById('kpi-net-profit');
  const pm = document.getElementById('kpi-profit-margin');
  const to = document.getElementById('kpi-total-orders');
  const os = document.getElementById('kpi-orders-split');
  const rc = document.getElementById('kpi-rto-cost');
  const rr = document.getElementById('kpi-rto-rate');

  if (gr) gr.innerText = `₹${grossRevenue.toLocaleString('en-IN')}`;
  if (np) np.innerText = `₹${finalNetProfit.toLocaleString('en-IN')}`;
  if (pm) pm.innerText = `${marginPct}% margin`;
  if (to) to.innerText = totalOrders;
  if (os) os.innerText = `${pendingOrders} Pending • ${shippedOrders} Shipped`;
  if (rc) rc.innerText = `₹${rtoCost.toLocaleString('en-IN')}`;
  if (rr) rr.innerText = `${rtoRatePct}% RTO Rate`;

  renderDashboardLowStock();
  renderDashboardRecentOrders();
  initChartsSafe();
}

function renderDashboardLowStock() {
  const tbody = document.querySelector('#dashboard-low-stock-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  const lowStockItems = ERPState.inventory.filter(i => i.stock <= i.minStock);

  if (lowStockItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">All stock levels healthy!</td></tr>`;
    return;
  }

  lowStockItems.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td><code>${item.sku}</code></td>
        <td>${item.name}</td>
        <td><strong style="color:var(--accent-danger)">${item.stock}</strong></td>
        <td>${item.minStock}</td>
        <td><button class="btn btn-sm btn-secondary" onclick="restockSKU('${item.sku}')">Restock</button></td>
      </tr>
    `;
  });
}

function renderDashboardRecentOrders() {
  const tbody = document.querySelector('#dashboard-recent-orders-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  const recent = ERPState.orders.slice(-5).reverse();
  recent.forEach(ord => {
    const pnl = window.calculateOrderPnL(ord);
    const pnlClass = pnl >= 0 ? 'pnl-positive' : 'pnl-negative';
    const channelClass = getChannelBadgeClass(ord.channel);

    tbody.innerHTML += `
      <tr>
        <td><code>${ord.id}</code></td>
        <td><span class="ch-badge ${channelClass}">${ord.channel}</span></td>
        <td>₹${ord.price}</td>
        <td><span class="${pnlClass}">${pnl >= 0 ? '+' : ''}₹${pnl}</span></td>
        <td><span class="badge badge-${ord.status.toLowerCase()}">${ord.status}</span></td>
      </tr>
    `;
  });
}

function renderOrdersTable() {
  const tbody = document.getElementById('orders-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const activeTab = document.querySelector('#order-status-tabs .tab-btn.active');
  const activeStatusTab = activeTab ? activeTab.getAttribute('data-status') : 'ALL';
  const channelFilter = document.getElementById('order-channel-filter')?.value || 'ALL';
  const searchQuery = document.getElementById('global-search-input')?.value.toLowerCase() || '';

  const counts = { ALL: 0, PENDING: 0, SHIPPED: 0, DELIVERED: 0, RETURNED: 0, CANCELLED: 0 };
  ERPState.orders.forEach(o => {
    counts.ALL++;
    if (counts[o.status] !== undefined) counts[o.status]++;
  });

  for (let key in counts) {
    const span = document.getElementById(`count-${key.toLowerCase()}`);
    if (span) span.innerText = counts[key];
  }

  let filtered = ERPState.orders.filter(ord => {
    const matchStatus = activeStatusTab === 'ALL' || ord.status === activeStatusTab;
    const matchChannel = channelFilter === 'ALL' || ord.channel === channelFilter;
    const matchSearch = ord.id.toLowerCase().includes(searchQuery) ||
                        ord.customer.toLowerCase().includes(searchQuery) ||
                        ord.items.toLowerCase().includes(searchQuery);
    return matchStatus && matchChannel && matchSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:30px; color:var(--text-muted);">No orders found matching filters.</td></tr>`;
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
            <option value="PENDING" ${ord.status === 'PENDING' ? 'selected' : ''}>Pending</option>
            <option value="SHIPPED" ${ord.status === 'SHIPPED' ? 'selected' : ''}>Shipped</option>
            <option value="DELIVERED" ${ord.status === 'DELIVERED' ? 'selected' : ''}>Delivered</option>
            <option value="RETURNED" ${ord.status === 'RETURNED' ? 'selected' : ''}>Returned / RTO</option>
            <option value="CANCELLED" ${ord.status === 'CANCELLED' ? 'selected' : ''}>Cancelled</option>
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

function renderSupplierTable() {
  const tbody = document.getElementById('supplier-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  ERPState.suppliers.forEach(sup => {
    tbody.innerHTML += `
      <tr>
        <td><code>${sup.id}</code></td>
        <td><strong>${sup.name}</strong></td>
        <td>${sup.contact}</td>
        <td>₹${sup.totalPurchased.toLocaleString('en-IN')}</td>
        <td style="color:var(--accent-success)">₹${sup.paid.toLocaleString('en-IN')}</td>
        <td style="color:var(--accent-danger)"><strong>₹${sup.remaining.toLocaleString('en-IN')}</strong></td>
        <td><span class="badge ${sup.remaining === 0 ? 'badge-delivered' : 'badge-pending'}">${sup.remaining === 0 ? 'Settled' : 'Balance Pending'}</span></td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="recordSupplierPayment('${sup.id}')">Pay Balance</button>
        </td>
      </tr>
    `;
  });
}

window.handleSaveSupplier = function() {
  const name = document.getElementById('form-sup-name')?.value;
  const contact = document.getElementById('form-sup-contact')?.value;
  const total = parseFloat(document.getElementById('form-sup-total')?.value) || 0;
  const paid = parseFloat(document.getElementById('form-sup-paid')?.value) || 0;

  if (!name || !contact) {
    showToast('Please enter supplier name and contact!', 'danger');
    return;
  }

  const newSupplier = {
    id: `SUP-0${ERPState.suppliers.length + 1}`,
    name,
    contact,
    totalPurchased: total,
    paid: paid,
    remaining: Math.max(0, total - paid),
    status: total - paid === 0 ? 'Paid in Full' : 'Active'
  };

  ERPState.suppliers.push(newSupplier);
  saveState();
  closeModal('supplier-modal');
  renderAllViews();
  showToast(`Supplier ${name} created successfully!`, 'success');
};

window.recordSupplierPayment = function(supId) {
  const sup = ERPState.suppliers.find(s => s.id === supId);
  if (!sup || sup.remaining === 0) {
    showToast('No pending balance for this supplier!', 'info');
    return;
  }
  const amount = prompt(`Enter payment to ${sup.name} (Remaining: ₹${sup.remaining}):`, sup.remaining);
  if (amount && !isNaN(amount)) {
    const payVal = parseFloat(amount);
    sup.paid += payVal;
    sup.remaining = Math.max(0, sup.totalPurchased - sup.paid);
    saveState();
    renderAllViews();
    showToast(`Paid ₹${payVal} to ${sup.name}`, 'success');
  }
};

function renderInventoryTable() {
  const tbody = document.getElementById('inventory-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  ERPState.inventory.forEach(item => {
    const isLow = item.stock <= item.minStock;
    tbody.innerHTML += `
      <tr>
        <td><code>${item.sku}</code></td>
        <td><strong>${item.name}</strong></td>
        <td>${item.category}</td>
        <td>₹${item.cost}</td>
        <td>₹${item.price}</td>
        <td><strong style="color: ${isLow ? 'var(--accent-danger)' : 'var(--text-primary)'}">${item.stock} units</strong></td>
        <td>${item.minStock} units</td>
        <td><span class="badge ${isLow ? 'badge-returned' : 'badge-delivered'}">${isLow ? 'LOW STOCK' : 'Healthy'}</span></td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="restockSKU('${item.sku}')">Add Stock</button>
        </td>
      </tr>
    `;
  });
}

window.handleSaveSKU = function() {
  const sku = document.getElementById('form-sku-code')?.value;
  const category = document.getElementById('form-sku-category')?.value;
  const name = document.getElementById('form-sku-name')?.value;
  const cost = parseFloat(document.getElementById('form-sku-cost')?.value) || 0;
  const price = parseFloat(document.getElementById('form-sku-price')?.value) || 0;
  const stock = parseInt(document.getElementById('form-sku-stock')?.value) || 0;
  const minStock = parseInt(document.getElementById('form-sku-min')?.value) || 20;

  if (!sku || !name) {
    showToast('Please enter SKU code and product name!', 'danger');
    return;
  }

  const newSKU = { sku, category, name, cost, price, stock, minStock };
  ERPState.inventory.push(newSKU);
  saveState();
  closeModal('sku-modal');
  renderAllViews();
  showToast(`SKU ${sku} added to inventory!`, 'success');
};

window.restockSKU = function(skuCode) {
  const item = ERPState.inventory.find(i => i.sku === skuCode);
  if (!item) return;
  const qty = prompt(`Enter stock quantity to add for ${item.name}:`, 50);
  if (qty && !isNaN(qty)) {
    item.stock += parseInt(qty);
    saveState();
    renderAllViews();
    showToast(`Added ${qty} units to ${item.sku}`, 'success');
  }
};

function renderPayments() {
  const tbody = document.getElementById('payments-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  let settled = 0, pending = 0, cod = 0;

  const mockSettlements = [
    { id: 'SET-9912', channel: 'Amazon', gross: 45000, deductions: 6750, net: 38250, status: 'Settled' },
    { id: 'SET-9913', channel: 'Flipkart', gross: 28000, deductions: 3360, net: 24640, status: 'Pending Payout' },
    { id: 'SET-9914', channel: 'GetSetMart COD', gross: 14500, deductions: 500, net: 14000, status: 'In Transit' }
  ];

  mockSettlements.forEach(s => {
    if (s.status === 'Settled') settled += s.net;
    if (s.status === 'Pending Payout') pending += s.net;
    if (s.status === 'In Transit') cod += s.net;

    tbody.innerHTML += `
      <tr>
        <td><code>${s.id}</code></td>
        <td><span class="ch-badge ${getChannelBadgeClass(s.channel)}">${s.channel}</span></td>
        <td>₹${s.gross.toLocaleString('en-IN')}</td>
        <td style="color:var(--accent-danger)">-₹${s.deductions.toLocaleString('en-IN')}</td>
        <td style="color:var(--accent-success)"><strong>₹${s.net.toLocaleString('en-IN')}</strong></td>
        <td><span class="badge ${s.status === 'Settled' ? 'badge-delivered' : 'badge-pending'}">${s.status}</span></td>
      </tr>
    `;
  });

  const ps = document.getElementById('pay-settled');
  const pp = document.getElementById('pay-pending');
  const pc = document.getElementById('pay-cod');

  if (ps) ps.innerText = `₹${settled.toLocaleString('en-IN')}`;
  if (pp) pp.innerText = `₹${pending.toLocaleString('en-IN')}`;
  if (pc) pc.innerText = `₹${cod.toLocaleString('en-IN')}`;
}

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
  showToast(`Logged expense of ₹${amount} for ${category}`, 'success');
};

function renderReportsTable() {
  const tbody = document.getElementById('channel-reports-table');
  if (!tbody) return;
  tbody.innerHTML = '';

  const channelStats = {};

  ERPState.orders.forEach(ord => {
    if (!channelStats[ord.channel]) {
      channelStats[ord.channel] = { count: 0, revenue: 0, totalCosts: 0, profit: 0 };
    }
    const stat = channelStats[ord.channel];
    stat.count++;
    if (ord.status !== 'CANCELLED' && ord.status !== 'RETURNED') {
      stat.revenue += ord.price;
    }
    const pnl = window.calculateOrderPnL(ord);
    stat.profit += pnl;
    stat.totalCosts += (ord.cost + ord.shipping + ord.fee + ord.ads + (ord.rtoCost || 0));
  });

  for (let ch in channelStats) {
    const s = channelStats[ch];
    const roi = s.revenue > 0 ? ((s.profit / s.revenue) * 100).toFixed(1) : 0;
    const badgeClass = getChannelBadgeClass(ch);

    tbody.innerHTML += `
      <tr>
        <td><span class="ch-badge ${badgeClass}">${ch}</span></td>
        <td>${s.count} orders</td>
        <td>₹${s.revenue.toLocaleString('en-IN')}</td>
        <td>₹${s.totalCosts.toLocaleString('en-IN')}</td>
        <td><strong style="color:${s.profit >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)'}">${s.profit >= 0 ? '+' : ''}₹${s.profit.toLocaleString('en-IN')}</strong></td>
        <td><span class="trend-badge ${roi >= 0 ? 'positive' : 'negative'}">${roi}% ROI</span></td>
      </tr>
    `;
  });
}

function populateOrderModalSKUs() {
  const select = document.getElementById('form-order-sku');
  if (!select) return;
  select.innerHTML = '';
  ERPState.inventory.forEach(item => {
    select.innerHTML += `<option value="${item.sku}">${item.sku} - ${item.name} (CP: ₹${item.cost})</option>`;
  });
}

window.handleSaveOrder = function() {
  const channel = document.getElementById('form-order-channel')?.value || 'GetSetMart Store';
  const customer = document.getElementById('form-customer-name')?.value || 'Customer';
  const sku = document.getElementById('form-order-sku')?.value;
  const status = document.getElementById('form-order-status')?.value || 'PENDING';
  const price = parseFloat(document.getElementById('form-selling-price')?.value) || 0;
  const cost = parseFloat(document.getElementById('form-product-cost')?.value) || 0;
  const shipping = parseFloat(document.getElementById('form-shipping-cost')?.value) || 0;
  const fee = parseFloat(document.getElementById('form-other-fee')?.value) || 0;

  if (!customer) {
    showToast('Please enter customer name & city!', 'danger');
    return;
  }

  const skuObj = ERPState.inventory.find(i => i.sku === sku);

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
  showToast(`Order ${newOrder.id} created & saved successfully!`, 'success');
};

window.triggerLiveSyncNow = function() {
  showToast('Connecting to GetSetMart, Amazon & Flipkart APIs...', 'info');
  setTimeout(() => {
    showToast('Live Sync Completed! New order imported.', 'success');
    ERPState.orders.push({
      id: `GSM-ORD-${1000 + ERPState.orders.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      channel: 'Amazon',
      customer: 'Siddharth Nair (Kochi)',
      sku: 'GSM-HD-001',
      items: 'Oversized Hoodie',
      price: 1499,
      cost: 420,
      shipping: 80,
      fee: 220,
      ads: 120,
      rtoCost: 0,
      status: 'SHIPPED'
    });
    saveState();
    renderAllViews();
  }, 1200);
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
        labels: ['GetSetMart Store', 'Amazon', 'Flipkart', 'Meesho'],
        datasets: [{ data: [45, 30, 15, 10], backgroundColor: ['#ff0000', '#ff9900', '#2874f0', '#f43397'] }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#888' } } } }
    });
  } catch (err) {}
}

// Attach Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initERP();
  window.navigateTo('dashboard');

  document.getElementById('order-channel-filter')?.addEventListener('change', renderOrdersTable);
  document.getElementById('global-search-input')?.addEventListener('input', () => {
    if (ERPState.activeView === 'orders') renderOrdersTable();
  });

  const tabs = document.querySelectorAll('#order-status-tabs .tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      renderOrdersTable();
    });
  });
});
