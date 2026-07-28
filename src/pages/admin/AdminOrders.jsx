import { useState, useEffect } from 'react';
import { Plus, Download, Trash2, ShoppingBag, RefreshCw } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('gsm_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeChannel, setActiveChannel] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [ordChannel, setOrdChannel] = useState('Meesho');
  const [ordCustomer, setOrdCustomer] = useState('');
  const [ordItem, setOrdItem] = useState('');
  const [ordPrice, setOrdPrice] = useState(999);
  const [ordCost, setOrdCost] = useState(300);
  const [ordShipping, setOrdShipping] = useState(70);
  const [ordFee, setOrdFee] = useState(50);
  const [ordStatus, setOrdStatus] = useState('DELIVERED');

  useEffect(() => {
    localStorage.setItem('gsm_orders', JSON.stringify(orders));
  }, [orders]);

  // Sync with Chrome Extension synced storage
  useEffect(() => {
    if (window.chrome && window.chrome.storage && window.chrome.storage.local) {
      window.chrome.storage.local.get(['gsm_synced_orders'], (result) => {
        if (result && result.gsm_synced_orders && result.gsm_synced_orders.length > 0) {
          setOrders(prev => {
            const combined = [...result.gsm_synced_orders, ...prev];
            const uniqueMap = new Map();
            combined.forEach(item => uniqueMap.set(item.id, item));
            return Array.from(uniqueMap.values());
          });
        }
      });
    }
  }, []);

  const calculatePnL = (ord) => {
    if (ord.status === 'RETURNED') {
      return -(ord.cost + ord.shipping + (ord.rtoCost || 150) + (ord.ads || 0) + ord.fee);
    }
    if (ord.status === 'CANCELLED') return 0;
    return ord.price - (ord.cost + ord.shipping + ord.fee + (ord.ads || 0));
  };

  const handleSaveOrder = (e) => {
    e.preventDefault();
    if (!ordCustomer || !ordItem) return;
    const newOrd = {
      id: `GSM-ORD-${1000 + orders.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      channel: ordChannel,
      customer: ordCustomer,
      items: ordItem,
      price: Number(ordPrice),
      cost: Number(ordCost),
      shipping: Number(ordShipping),
      fee: Number(ordFee),
      ads: 0,
      rtoCost: ordStatus === 'RETURNED' ? 150 : 0,
      status: ordStatus
    };
    setOrders([newOrd, ...orders]);
    setShowModal(false);
    setOrdCustomer('');
    setOrdItem('');
  };

  const handleStatusChange = (id, newStatus) => {
    setOrders(orders.map(o => {
      if (o.id === id) {
        return {
          ...o,
          status: newStatus,
          rtoCost: newStatus === 'RETURNED' ? 150 : 0
        };
      }
      return o;
    }));
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm(`Delete order ${id}?`)) {
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all order records?")) {
      setOrders([]);
      localStorage.removeItem('gsm_orders');
      if (window.chrome && window.chrome.storage && window.chrome.storage.local) {
        window.chrome.storage.local.remove(['gsm_synced_orders']);
      }
    }
  };

  const exportExcel = () => {
    if (orders.length === 0) return alert("No orders available to export!");
    const headers = ['Order ID', 'Date', 'Channel', 'Customer', 'Item', 'Selling Price', 'Cost Price', 'Shipping', 'Fee/Ads', 'Net Profit', 'Status'];
    const rows = orders.map(o => [
      o.id,
      o.date,
      o.channel,
      `"${o.customer.replace(/"/g, '""')}"`,
      `"${o.items.replace(/"/g, '""')}"`,
      o.price,
      o.cost,
      o.shipping,
      o.fee + (o.ads || 0),
      calculatePnL(o),
      o.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GetSetMart_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter(o => {
    const matchChannel = activeChannel === 'ALL' || o.channel === activeChannel;
    const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        o.items.toLowerCase().includes(searchQuery.toLowerCase());
    return matchChannel && matchStatus && matchSearch;
  });

  const getChannelBadge = (ch) => {
    if (ch.includes('Meesho')) return { bg: '#f43397', label: 'Meesho' };
    if (ch.includes('Flipkart')) return { bg: '#2874f0', label: 'Flipkart' };
    if (ch.includes('Amazon')) return { bg: '#ff9900', label: 'Amazon' };
    return { bg: 'var(--primary-red)', label: 'Website Store' };
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Multi-Channel Orders & P&L</h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Track orders from Meesho, Flipkart, Amazon & Store with real-time profit & loss</div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {orders.length > 0 && (
            <button 
              onClick={handleClearAll}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid #333',
                background: '#1c1917',
                color: '#ef4444',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.85rem'
              }}
            >
              Clear All Orders
            </button>
          )}
          <button 
            onClick={exportExcel}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid #333',
              background: '#111',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '600'
            }}
          >
            <Download size={18} /> Export Excel / CSV P&L
          </button>
          <button 
            onClick={() => setShowModal(true)}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--primary-red)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '600'
            }}
          >
            <Plus size={18} /> Add Real Order
          </button>
        </div>
      </div>

      {/* Filter Tabs & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '4px', gap: '4px' }}>
          {['ALL', 'Meesho', 'Flipkart', 'Amazon', 'GetSetMart Store'].map(ch => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '6px',
                border: 'none',
                background: activeChannel === ch ? 'var(--primary-red)' : 'transparent',
                color: activeChannel === ch ? 'white' : 'var(--text-muted)',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              {ch}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Search Order ID, Customer, Item..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ padding: '0.5rem 1rem', background: '#111', border: '1px solid #222', borderRadius: '8px', color: 'white', fontSize: '0.85rem', width: '220px' }}
          />
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '0.5rem 1rem', background: '#111', border: '1px solid #222', borderRadius: '8px', color: 'white', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="DELIVERED">Delivered</option>
            <option value="SHIPPED">Shipped</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="RETURNED">Returned / RTO</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem' }}>
        {filteredOrders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <ShoppingBag size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.5rem' }}>No Real Orders Added Yet</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Click "+ Add Real Order" above, or open your Meesho / Flipkart orders panel and use the GetSetMart Chrome Extension to Sync Orders!</p>
            <button 
              onClick={() => setShowModal(true)}
              style={{ padding: '0.65rem 1.25rem', background: 'var(--primary-red)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
            >
              + Add Real Order Now
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #222', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>Order ID</th>
                  <th style={{ padding: '0.75rem' }}>Channel</th>
                  <th style={{ padding: '0.75rem' }}>Customer</th>
                  <th style={{ padding: '0.75rem' }}>Product</th>
                  <th style={{ padding: '0.75rem' }}>Price</th>
                  <th style={{ padding: '0.75rem' }}>Cost Breakdown</th>
                  <th style={{ padding: '0.75rem' }}>Net Profit / Loss</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(o => {
                  const pnl = calculatePnL(o);
                  const badge = getChannelBadge(o.channel);
                  return (
                    <tr key={o.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '700', color: 'white' }}><code>{o.id}</code></td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ background: badge.bg, color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700' }}>
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: '#cbd5e1', fontWeight: '600' }}>{o.customer}</td>
                      <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>{o.items}</td>
                      <td style={{ padding: '0.75rem', color: 'white', fontWeight: '700' }}>₹{o.price}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        CP: ₹{o.cost} | Ship: ₹{o.shipping} | Fee: ₹{o.fee + (o.ads || 0)}
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: '800', color: pnl >= 0 ? '#10b981' : '#ef4444' }}>
                        {pnl >= 0 ? '+' : ''}₹{pnl}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <select 
                          value={o.status}
                          onChange={e => handleStatusChange(o.id, e.target.value)}
                          style={{ padding: '0.35rem 0.6rem', background: '#080808', border: '1px solid #333', borderRadius: '6px', color: 'white', fontSize: '0.78rem' }}
                        >
                          <option value="DELIVERED">Delivered</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="PENDING">Pending</option>
                          <option value="CANCELLED">Cancelled</option>
                          <option value="RETURNED">Returned / RTO</option>
                        </select>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <button 
                          onClick={() => handleDeleteOrder(o.id)}
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Order Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '14px', width: '100%', maxWidth: '540px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem', color: 'white' }}>Record Real Order</h3>
            <form onSubmit={handleSaveOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Sales Channel</label>
                  <select value={ordChannel} onChange={e => setOrdChannel(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}>
                    <option value="Meesho">Meesho</option>
                    <option value="Flipkart">Flipkart</option>
                    <option value="Amazon">Amazon</option>
                    <option value="GetSetMart Store">GetSetMart Store</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Customer Name & City</label>
                  <input type="text" value={ordCustomer} onChange={e => setOrdCustomer(e.target.value)} placeholder="e.g. Rahul Sharma (Delhi)" required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Product Name</label>
                  <input type="text" value={ordItem} onChange={e => setOrdItem(e.target.value)} placeholder="e.g. Oversized Hoodie XL" required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Order Status</label>
                  <select value={ordStatus} onChange={e => setOrdStatus(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}>
                    <option value="DELIVERED">Delivered</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="PENDING">Pending</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="RETURNED">Returned / RTO</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Selling Price (SP ₹)</label>
                  <input type="number" value={ordPrice} onChange={e => setOrdPrice(e.target.value)} required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Cost Price (CP ₹)</label>
                  <input type="number" value={ordCost} onChange={e => setOrdCost(e.target.value)} required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Shipping Fee (₹)</label>
                  <input type="number" value={ordShipping} onChange={e => setOrdShipping(e.target.value)} required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Marketplace Fee (₹)</label>
                  <input type="number" value={ordFee} onChange={e => setOrdFee(e.target.value)} required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.65rem 1.25rem', background: 'transparent', border: '1px solid #333', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.65rem 1.25rem', background: 'var(--primary-red)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Save Real Order & P&L</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
