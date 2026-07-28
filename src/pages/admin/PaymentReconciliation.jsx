import { useState, useEffect } from 'react';
import { DollarSign, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export default function PaymentReconciliation() {
  const [reconciliations, setReconciliations] = useState(() => {
    const saved = localStorage.getItem('gsm_reconciliation');
    return saved ? JSON.parse(saved) : [
      { id: 'REC-101', orderId: 'GSM-ORD-1001', channel: 'Meesho', date: '2026-07-28', expected: 1324, actualBank: 1324, shortfall: 0, status: 'RECONCILED', note: 'Exact Payout Received' },
      { id: 'REC-102', orderId: 'GSM-ORD-1002', channel: 'Flipkart', date: '2026-07-28', expected: 2059, actualBank: 1809, shortfall: 250, status: 'DISCREPANCY', note: 'Wrong Courier Weight Penalty Deducted' },
      { id: 'REC-103', orderId: 'GSM-ORD-1003', channel: 'Amazon', date: '2026-07-27', expected: 1599, actualBank: 1599, shortfall: 0, status: 'RECONCILED', note: 'Exact Payout Received' },
      { id: 'REC-104', orderId: 'GSM-ORD-1004', channel: 'Meesho', date: '2026-07-27', expected: 609, actualBank: 409, shortfall: 200, status: 'DISCREPANCY', note: 'Excess RTO Penalty Deducted by Courier' },
      { id: 'REC-105', orderId: 'GSM-ORD-1005', channel: 'GetSetMart Store', date: '2026-07-26', expected: 1450, actualBank: 0, shortfall: 1450, status: 'PENDING', note: 'Payment Pending from Razorpay' }
    ];
  });

  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    localStorage.setItem('gsm_reconciliation', JSON.stringify(reconciliations));
  }, [reconciliations]);

  const totalExpected = reconciliations.reduce((acc, curr) => acc + curr.expected, 0);
  const totalActual = reconciliations.reduce((acc, curr) => acc + curr.actualBank, 0);
  const totalShortfall = reconciliations.reduce((acc, curr) => acc + curr.shortfall, 0);

  const handleResolveDiscrepancy = (recId) => {
    setReconciliations(reconciliations.map(r => {
      if (r.id === recId) {
        return {
          ...r,
          actualBank: r.expected,
          shortfall: 0,
          status: 'RECONCILED',
          note: 'Discrepancy Claim Approved by Marketplace'
        };
      }
      return r;
    }));
  };

  const filteredData = reconciliations.filter(r => filter === 'ALL' || r.status === filter);

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Payment Reconciliation (Hisaab Audit Tracker)</h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Audit Expected Settlement vs Actual Bank Payout from Meesho, Flipkart, Amazon & Payment Gateways</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#111', border: '1px solid #222', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem' }}>TOTAL EXPECTED SETTLEMENT</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white' }}>₹{totalExpected.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ background: '#111', border: '1px solid #222', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem' }}>ACTUAL BANK PAYOUT RECEIVED</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#10b981' }}>₹{totalActual.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ background: '#111', border: '1px solid #222', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem' }}>SHORTFALL / DISCREPANCY (CLAIMABLE)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ef4444' }}>₹{totalShortfall.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#111', padding: '4px', borderRadius: '8px', width: 'fit-content', border: '1px solid #222' }}>
        {['ALL', 'DISCREPANCY', 'RECONCILED', 'PENDING'].map(st => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: filter === st ? 'var(--primary-red)' : 'transparent',
              color: filter === st ? 'white' : 'var(--text-muted)',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Reconciliation Table */}
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Order ID</th>
                <th style={{ padding: '0.75rem' }}>Channel</th>
                <th style={{ padding: '0.75rem' }}>Expected Settlement</th>
                <th style={{ padding: '0.75rem' }}>Actual Bank Payout</th>
                <th style={{ padding: '0.75rem' }}>Shortfall / Difference</th>
                <th style={{ padding: '0.75rem' }}>Audit Status</th>
                <th style={{ padding: '0.75rem' }}>Notes / Discrepancy Reason</th>
                <th style={{ padding: '0.75rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '700', color: 'white' }}><code>{r.orderId}</code></td>
                  <td style={{ padding: '0.75rem', fontWeight: '600', color: '#cbd5e1' }}>{r.channel}</td>
                  <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>₹{r.expected.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: '700' }}>₹{r.actualBank.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.75rem', color: r.shortfall > 0 ? '#ef4444' : '#10b981', fontWeight: '800' }}>
                    {r.shortfall > 0 ? `-₹${r.shortfall}` : '₹0'}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ 
                      background: r.status === 'RECONCILED' ? '#10b981' : r.status === 'DISCREPANCY' ? '#ef4444' : '#f59e0b', 
                      color: 'white', 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      fontWeight: '700' 
                    }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>{r.note}</td>
                  <td style={{ padding: '0.75rem' }}>
                    {r.status === 'DISCREPANCY' ? (
                      <button 
                        onClick={() => handleResolveDiscrepancy(r.id)}
                        style={{ background: '#222', border: '1px solid #333', color: 'white', padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}
                      >
                        Claim Shortfall
                      </button>
                    ) : (
                      <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: '600' }}>Audited</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
