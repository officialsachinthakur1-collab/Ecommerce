import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

export default function HisabKitab() {
  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem('gsm_suppliers');
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('gsm_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Supplier Form State
  const [supName, setSupName] = useState('');
  const [supQty, setSupQty] = useState(100);
  const [supTotal, setSupTotal] = useState(50000);
  const [supPaid, setSupPaid] = useState(20000);

  // Expense Form State
  const [expCategory, setExpCategory] = useState('Ads & Marketing');
  const [expAmount, setExpAmount] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expMethod, setExpMethod] = useState('UPI');

  useEffect(() => {
    localStorage.setItem('gsm_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('gsm_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleSaveSupplier = (e) => {
    e.preventDefault();
    if (!supName || !supTotal) return;
    const newEntry = {
      id: `SUP-0${suppliers.length + 1}`,
      name: supName,
      qty: Number(supQty),
      totalPurchased: Number(supTotal),
      paid: Number(supPaid),
      remaining: Math.max(0, Number(supTotal) - Number(supPaid))
    };
    setSuppliers([...suppliers, newEntry]);
    setShowSupplierModal(false);
    setSupName('');
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    if (!expAmount || !expDesc) return;
    const newExp = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      category: expCategory,
      amount: Number(expAmount),
      desc: expDesc,
      method: expMethod
    };
    setExpenses([newExp, ...expenses]);
    setShowExpenseModal(false);
    setExpAmount('');
    setExpDesc('');
  };

  const handlePaySupplier = (supId) => {
    const target = suppliers.find(s => s.id === supId);
    if (!target || target.remaining === 0) return;
    const amount = prompt(`Enter payment to ${target.name} (Remaining Due: ₹${target.remaining}):`, target.remaining);
    if (amount && !isNaN(amount)) {
      const payVal = Number(amount);
      setSuppliers(suppliers.map(s => {
        if (s.id === supId) {
          const newPaid = s.paid + payVal;
          return {
            ...s,
            paid: newPaid,
            remaining: Math.max(0, s.totalPurchased - newPaid)
          };
        }
        return s;
      }));
    }
  };

  const totalPurchased = suppliers.reduce((acc, curr) => acc + curr.totalPurchased, 0);
  const totalRemainingDue = suppliers.reduce((acc, curr) => acc + curr.remaining, 0);
  const totalKharcha = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Hisab-Kitab & Suppliers</h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Track supplier purchases, material quantities & operational expenses (kharcha)</div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setShowExpenseModal(true)}
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
            <Plus size={18} /> Log Kharcha (Expense)
          </button>
          <button 
            onClick={() => setShowSupplierModal(true)}
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
            <Plus size={18} /> Add Supplier Purchase
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#111', border: '1px solid #222', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem' }}>TOTAL MATERIAL PURCHASED</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white' }}>₹{totalPurchased.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ background: '#111', border: '1px solid #222', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem' }}>SUPPLIER BALANCE DUE</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ef4444' }}>₹{totalRemainingDue.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ background: '#111', border: '1px solid #222', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem' }}>OPERATIONAL KHARCHA (EXPENSES)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f59e0b' }}>₹{totalKharcha.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Tables Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '2rem' }}>
        
        {/* Supplier Purchase Ledger */}
        <div style={{ background: '#111', border: '1px solid #222', padding: '1.5rem', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1rem', color: 'white' }}>Supplier Purchase Ledger</h2>
          {suppliers.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No supplier purchases logged. Click "+ Add Supplier Purchase" to record inventory invoices.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #222', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem' }}>Supplier</th>
                    <th style={{ padding: '0.75rem' }}>Qty</th>
                    <th style={{ padding: '0.75rem' }}>Total Invoice</th>
                    <th style={{ padding: '0.75rem' }}>Paid</th>
                    <th style={{ padding: '0.75rem' }}>Remaining</th>
                    <th style={{ padding: '0.75rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '600', color: 'white' }}>{s.name}</td>
                      <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>{s.qty} units</td>
                      <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>₹{s.totalPurchased.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '0.75rem', color: '#10b981' }}>₹{s.paid.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '0.75rem', color: '#ef4444', fontWeight: '700' }}>₹{s.remaining.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '0.75rem' }}>
                        {s.remaining > 0 ? (
                          <button 
                            onClick={() => handlePaySupplier(s.id)}
                            style={{ background: '#222', border: '1px solid #333', color: 'white', padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}
                          >
                            Pay Balance
                          </button>
                        ) : (
                          <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: '600' }}>Paid</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Operating Kharcha Tracker */}
        <div style={{ background: '#111', border: '1px solid #222', padding: '1.5rem', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1rem', color: 'white' }}>Operating Kharcha Tracker</h2>
          {expenses.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No expenses logged yet. Click "+ Log Kharcha (Expense)" to record marketing, polybags, or freight costs.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #222', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem' }}>Date</th>
                    <th style={{ padding: '0.75rem' }}>Category</th>
                    <th style={{ padding: '0.75rem' }}>Description</th>
                    <th style={{ padding: '0.75rem' }}>Amount</th>
                    <th style={{ padding: '0.75rem' }}>Method</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(e => (
                    <tr key={e.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>{e.date}</td>
                      <td style={{ padding: '0.75rem', fontWeight: '600', color: 'white' }}>{e.category}</td>
                      <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>{e.desc}</td>
                      <td style={{ padding: '0.75rem', color: '#ef4444', fontWeight: '700' }}>₹{e.amount.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{e.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Supplier Modal */}
      {showSupplierModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '14px', width: '100%', maxWidth: '500px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem', color: 'white' }}>Add Supplier Purchase Entry</h3>
            <form onSubmit={handleSaveSupplier} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Supplier Name</label>
                <input type="text" value={supName} onChange={e => setSupName(e.target.value)} placeholder="e.g. Ludhiana Hosiery Works" required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Quantity (Units)</label>
                  <input type="number" value={supQty} onChange={e => setSupQty(e.target.value)} required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Total Invoice (₹)</label>
                  <input type="number" value={supTotal} onChange={e => setSupTotal(e.target.value)} required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Advance Paid (₹)</label>
                <input type="number" value={supPaid} onChange={e => setSupPaid(e.target.value)} required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowSupplierModal(false)} style={{ padding: '0.65rem 1.25rem', background: 'transparent', border: '1px solid #333', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.65rem 1.25rem', background: 'var(--primary-red)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Save Supplier Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpenseModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '14px', width: '100%', maxWidth: '500px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem', color: 'white' }}>Log Kharcha (Expense)</h3>
            <form onSubmit={handleSaveExpense} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Category</label>
                <select value={expCategory} onChange={e => setExpCategory(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}>
                  <option value="Ads & Marketing">Ads & Marketing</option>
                  <option value="Packing Materials">Packing Materials</option>
                  <option value="Shipping & Freight">Shipping & Freight</option>
                  <option value="Salaries">Warehouse Salaries</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Amount (₹)</label>
                <input type="number" value={expAmount} onChange={e => setExpAmount(e.target.value)} placeholder="e.g. 5000" required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Description / Vendor</label>
                <input type="text" value={expDesc} onChange={e => setExpDesc(e.target.value)} placeholder="e.g. Meta Ads Invoice #991" required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Payment Method</label>
                <select value={expMethod} onChange={e => setExpMethod(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}>
                  <option value="UPI">UPI / GPay</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowExpenseModal(false)} style={{ padding: '0.65rem 1.25rem', background: 'transparent', border: '1px solid #333', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.65rem 1.25rem', background: 'var(--primary-red)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Save Kharcha Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
