import { useState } from 'react';
import { AlertOctagon, AlertTriangle, TrendingUp, PauseCircle, ArrowUpRight } from 'lucide-react';

export default function LossAlerts() {
  const [products, setProducts] = useState([
    { id: 'SKU-HD-01', name: 'Oversized Anime Hoodie', category: 'Streetwear', sp: 1499, cp: 480, returnRate: 34, adSpendPerOrder: 350, netProfit: -120, status: 'CRITICAL_LOSS', aiAction: 'Increase SP by ₹200 & Pause Meta Ads' },
    { id: 'SKU-DN-02', name: 'Vintage Washed Denim Jacket', category: 'Outerwear', sp: 2499, cp: 780, returnRate: 28, adSpendPerOrder: 220, netProfit: 150, status: 'WARNING', aiAction: 'Add Exact Size Chart to Reduce 28% Returns' },
    { id: 'SKU-ANK-03', name: 'Royal Anarkali Suit Set', category: 'Ethnic Wear', sp: 1999, cp: 580, returnRate: 14, adSpendPerOrder: 150, netProfit: 620, status: 'PROFITABLE', aiAction: 'Scale Meta Ads Budget (High Margin 31%)' },
    { id: 'SKU-JWL-04', name: 'Kundan Choker Jewelry Set', category: 'Jewelry', sp: 799, cp: 140, returnRate: 8, adSpendPerOrder: 80, netProfit: 340, status: 'PROFITABLE', aiAction: 'Promote as Combo Pack with Earrings' }
  ]);

  const [activeTab, setActiveTab] = useState('ALL');

  const criticalCount = products.filter(p => p.status === 'CRITICAL_LOSS').length;
  const warningCount = products.filter(p => p.status === 'WARNING').length;

  const filteredProducts = products.filter(p => activeTab === 'ALL' || p.status === activeTab);

  const getStatusBadge = (st) => {
    switch (st) {
      case 'CRITICAL_LOSS': return { bg: '#ef4444', label: '🔴 CRITICAL LOSS (STOP SELLING)', icon: AlertOctagon };
      case 'WARNING': return { bg: '#f59e0b', label: '🟡 HIGH RETURN RISK (>25%)', icon: AlertTriangle };
      case 'PROFITABLE': return { bg: '#10b981', label: '🟢 HIGH PROFITABLE MARGIN', icon: TrendingUp };
      default: return { bg: '#666', label: st, icon: TrendingUp };
    }
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Loss-Making Product Alerts & AI Optimizer</h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Real-time scanner flagging negative-margin SKUs, high RTO rates, and wasteful ad spend</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#111', border: '1px solid #222', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem' }}>CRITICAL LOSS-MAKING SKUs</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ef4444' }}>{criticalCount} Products</div>
        </div>
        <div style={{ background: '#111', border: '1px solid #222', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem' }}>HIGH RTO / RETURN RISK SKUs</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f59e0b' }}>{warningCount} Products</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#111', padding: '4px', borderRadius: '8px', width: 'fit-content', border: '1px solid #222' }}>
        {['ALL', 'CRITICAL_LOSS', 'WARNING', 'PROFITABLE'].map(st => (
          <button
            key={st}
            onClick={() => setActiveTab(st)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === st ? 'var(--primary-red)' : 'transparent',
              color: activeTab === st ? 'white' : 'var(--text-muted)',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Product Risk Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {filteredProducts.map(p => {
          const badge = getStatusBadge(p.status);
          const Icon = badge.icon;
          return (
            <div key={p.id} style={{ background: '#111', border: `1px solid ${p.status === 'CRITICAL_LOSS' ? '#ef4444' : p.status === 'WARNING' ? '#f59e0b' : '#222'}`, borderRadius: '14px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ background: badge.bg, color: 'white', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Icon size={14} /> {badge.label}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}><code>{p.id}</code></span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', marginBottom: '0.75rem' }}>{p.name}</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: '#080808', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.8rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Selling Price (SP):</div>
                  <div style={{ color: 'white', fontWeight: '700', marginTop: '0.15rem' }}>₹{p.sp}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Cost Price (CP):</div>
                  <div style={{ color: 'white', fontWeight: '700', marginTop: '0.15rem' }}>₹{p.cp}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Return Rate %:</div>
                  <div style={{ color: p.returnRate > 25 ? '#ef4444' : '#10b981', fontWeight: '800', marginTop: '0.15rem' }}>{p.returnRate}%</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Net Profit / Order:</div>
                  <div style={{ color: p.netProfit >= 0 ? '#10b981' : '#ef4444', fontWeight: '800', marginTop: '0.15rem' }}>
                    {p.netProfit >= 0 ? '+' : ''}₹{p.netProfit}
                  </div>
                </div>
              </div>

              <div style={{ background: '#1c1917', border: '1px solid #44403c', borderRadius: '8px', padding: '0.85rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: '700', marginBottom: '0.2rem' }}>AI ACTION RECOMMENDATION:</div>
                <div style={{ fontSize: '0.85rem', color: '#fef3c7', fontWeight: '600' }}>{p.aiAction}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
