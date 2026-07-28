import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

export default function ReturnClaims() {
  const [claims, setClaims] = useState(() => {
    const saved = localStorage.getItem('gsm_return_claims');
    return saved ? JSON.parse(saved) : [];
  });

  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [clmChannel, setClmChannel] = useState('Meesho');
  const [clmWaybill, setClmWaybill] = useState('');
  const [clmIssue, setClmIssue] = useState('Parcel Untraced / Lost in Transit');
  const [clmItem, setClmItem] = useState('');
  const [clmAmount, setClmAmount] = useState('');

  useEffect(() => {
    localStorage.setItem('gsm_return_claims', JSON.stringify(claims));
  }, [claims]);

  const handleSaveClaim = (e) => {
    e.preventDefault();
    if (!clmWaybill || !clmAmount) return;
    const newClaim = {
      id: `CLM-${900 + claims.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      channel: clmChannel,
      waybill: clmWaybill,
      issueType: clmIssue,
      item: clmItem || 'Fashion Product',
      sp: Number(clmAmount) * 1.4,
      refundClaim: Number(clmAmount),
      status: 'SUBMITTED',
      creditDate: 'Pending'
    };
    setClaims([newClaim, ...claims]);
    setShowModal(false);
    setClmWaybill('');
    setClmAmount('');
  };

  const handleStatusUpdate = (id, newStatus) => {
    setClaims(claims.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: newStatus,
          creditDate: newStatus === 'APPROVED' ? new Date().toISOString().split('T')[0] : c.creditDate
        };
      }
      return c;
    }));
  };

  const totalLoss = claims.reduce((acc, curr) => acc + curr.refundClaim, 0);
  const totalApproved = claims.filter(c => c.status === 'APPROVED').reduce((acc, curr) => acc + curr.refundClaim, 0);
  const totalPending = claims.filter(c => c.status === 'SUBMITTED' || c.status === 'ELIGIBLE').reduce((acc, curr) => acc + curr.refundClaim, 0);

  const filteredClaims = claims.filter(c => filterStatus === 'ALL' || c.status === filterStatus);

  const getStatusBadge = (st) => {
    switch (st) {
      case 'APPROVED': return { bg: '#10b981', label: 'Refund Credited' };
      case 'SUBMITTED': return { bg: '#3b82f6', label: 'Claim Submitted' };
      case 'ELIGIBLE': return { bg: '#f59e0b', label: 'Eligible (Apply Now)' };
      case 'REJECTED': return { bg: '#ef4444', label: 'Claim Rejected' };
      default: return { bg: '#666', label: st };
    }
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>RTO & Return Loss Prevention (Refund Claim Tracker)</h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Track untraced courier parcels & wrong customer returns to claim refunds from Meesho, Flipkart & Amazon</div>
        </div>
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
          <Plus size={18} /> File New Loss Claim
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#111', border: '1px solid #222', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem' }}>TOTAL RETURN DAMAGE VALUE</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white' }}>₹{totalLoss.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ background: '#111', border: '1px solid #222', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem' }}>REFUND CREDITED / RECOVERED</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#10b981' }}>₹{totalApproved.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ background: '#111', border: '1px solid #222', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem' }}>PENDING REFUND CLAIMS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f59e0b' }}>₹{totalPending.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#111', padding: '4px', borderRadius: '8px', width: 'fit-content', border: '1px solid #222' }}>
        {['ALL', 'ELIGIBLE', 'SUBMITTED', 'APPROVED', 'REJECTED'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: filterStatus === st ? 'var(--primary-red)' : 'transparent',
              color: filterStatus === st ? 'white' : 'var(--text-muted)',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Claims Table */}
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem' }}>
        {filteredClaims.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No return loss claims filed yet. Click "+ File New Loss Claim" to log untraced parcels or damaged returns.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #222', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>Claim ID</th>
                  <th style={{ padding: '0.75rem' }}>Channel</th>
                  <th style={{ padding: '0.75rem' }}>Waybill / AWB No</th>
                  <th style={{ padding: '0.75rem' }}>Issue Type</th>
                  <th style={{ padding: '0.75rem' }}>Product</th>
                  <th style={{ padding: '0.75rem' }}>Refund Claimed</th>
                  <th style={{ padding: '0.75rem' }}>Claim Status</th>
                  <th style={{ padding: '0.75rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.map(c => {
                  const badge = getStatusBadge(c.status);
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '700', color: 'white' }}><code>{c.id}</code></td>
                      <td style={{ padding: '0.75rem', fontWeight: '600', color: '#cbd5e1' }}>{c.channel}</td>
                      <td style={{ padding: '0.75rem', color: '#94a3b8' }}><code>{c.waybill}</code></td>
                      <td style={{ padding: '0.75rem', color: '#f59e0b', fontWeight: '600' }}>{c.issueType}</td>
                      <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>{c.item}</td>
                      <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: '800' }}>₹{c.refundClaim.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ background: badge.bg, color: 'white', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' }}>
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <select 
                          value={c.status}
                          onChange={e => handleStatusUpdate(c.id, e.target.value)}
                          style={{ padding: '0.35rem 0.6rem', background: '#080808', border: '1px solid #333', borderRadius: '6px', color: 'white', fontSize: '0.78rem' }}
                        >
                          <option value="ELIGIBLE">Eligible</option>
                          <option value="SUBMITTED">Submitted</option>
                          <option value="APPROVED">Approved & Credited</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* File Claim Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '14px', width: '100%', maxWidth: '500px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem', color: 'white' }}>File Return Loss / Safe-T Claim</h3>
            <form onSubmit={handleSaveClaim} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Marketplace</label>
                <select value={clmChannel} onChange={e => setClmChannel(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}>
                  <option value="Meesho">Meesho</option>
                  <option value="Flipkart">Flipkart</option>
                  <option value="Amazon">Amazon</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>AWB / Courier Waybill Number</label>
                <input type="text" value={clmWaybill} onChange={e => setClmWaybill(e.target.value)} placeholder="e.g. DEL-9918203" required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Issue Category</label>
                <select value={clmIssue} onChange={e => setClmIssue(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}>
                  <option value="Parcel Untraced / Lost in Transit">Parcel Untraced / Lost in Transit</option>
                  <option value="Wrong Product Received (Switch Return)">Wrong Product Received (Switch Return)</option>
                  <option value="Empty Box Delivered">Empty Box Delivered</option>
                  <option value="Damaged Item Received">Damaged Item Received</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Product Name</label>
                <input type="text" value={clmItem} onChange={e => setClmItem(e.target.value)} placeholder="e.g. Oversized Hoodie XL" required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Claim Refund Amount (₹)</label>
                <input type="number" value={clmAmount} onChange={e => setClmAmount(e.target.value)} placeholder="e.g. 1050" required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.65rem 1.25rem', background: 'transparent', border: '1px solid #333', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.65rem 1.25rem', background: 'var(--primary-red)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Save & File Claim</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
