import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Wallet } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem('gsm_orders');
        return saved ? JSON.parse(saved) : [];
    });

    const [expenses, setExpenses] = useState(() => {
        const saved = localStorage.getItem('gsm_expenses');
        return saved ? JSON.parse(saved) : [];
    });

    const [suppliers, setSuppliers] = useState(() => {
        const saved = localStorage.getItem('gsm_suppliers');
        return saved ? JSON.parse(saved) : [];
    });

    const calculatePnL = (ord) => {
        if (ord.status === 'RETURNED') {
            return -(ord.cost + ord.shipping + (ord.rtoCost || 150) + (ord.ads || 0) + ord.fee);
        }
        if (ord.status === 'CANCELLED') return 0;
        return ord.price - (ord.cost + ord.shipping + ord.fee + (ord.ads || 0));
    };

    let grossRevenue = 0;
    let netOrderProfit = 0;

    orders.forEach(o => {
        if (o.status !== 'CANCELLED' && o.status !== 'RETURNED') {
            grossRevenue += o.price;
        }
        netOrderProfit += calculatePnL(o);
    });

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const finalNetProfit = netOrderProfit - totalExpenses;
    const marginPct = grossRevenue > 0 ? ((finalNetProfit / grossRevenue) * 100).toFixed(1) : 0;
    const totalSupplierDue = suppliers.reduce((acc, curr) => acc + curr.remaining, 0);

    const channels = ['Meesho', 'Flipkart', 'Amazon', 'GetSetMart Store'];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Dashboard Overview</h1>
                    <div style={{ color: 'var(--text-muted)' }}>Real-time Channel Sales & Net Profit Control</div>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard title="Gross Sales Revenue" value={`₹${grossRevenue.toLocaleString('en-IN')}`} change="All Channels" icon={DollarSign} />
                <StatCard title="Net Profit (P&L)" value={`₹${finalNetProfit.toLocaleString('en-IN')}`} change={`${marginPct}% Margin`} icon={TrendingUp} color="#10b981" />
                <StatCard title="Total Orders" value={orders.length} change="Multi-Channel" icon={ShoppingBag} color="#3b82f6" />
                <StatCard title="Total Kharcha (Expenses)" value={`₹${totalExpenses.toLocaleString('en-IN')}`} change={`₹${totalSupplierDue.toLocaleString('en-IN')} Due`} icon={Wallet} color="#ef4444" />
            </div>

            {/* Channel Profit & Loss Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Channel Profit & Loss Summary</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Breakdown of sales, profit and ROI by marketplace</p>
                        </div>
                        <Link to="/admin/orders" style={{ color: 'var(--primary-red)', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem' }}>
                            View Orders →
                        </Link>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #222', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '0.75rem' }}>Channel</th>
                                <th style={{ padding: '0.75rem' }}>Orders</th>
                                <th style={{ padding: '0.75rem' }}>Revenue</th>
                                <th style={{ padding: '0.75rem' }}>Net Profit</th>
                                <th style={{ padding: '0.75rem' }}>ROI %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {channels.map(ch => {
                                const chOrders = orders.filter(o => o.channel === ch);
                                let rev = 0;
                                let profit = 0;
                                chOrders.forEach(o => {
                                    if (o.status !== 'CANCELLED' && o.status !== 'RETURNED') rev += o.price;
                                    profit += calculatePnL(o);
                                });
                                const roi = rev > 0 ? ((profit / rev) * 100).toFixed(1) : 0;

                                return (
                                    <tr key={ch} style={{ borderBottom: '1px solid #1a1a1a' }}>
                                        <td style={{ padding: '0.75rem', fontWeight: '700', color: 'white' }}>{ch}</td>
                                        <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>{chOrders.length} orders</td>
                                        <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>₹{rev.toLocaleString('en-IN')}</td>
                                        <td style={{ padding: '0.75rem', fontWeight: '800', color: profit >= 0 ? '#10b981' : '#ef4444' }}>
                                            {profit >= 0 ? '+' : ''}₹{profit.toLocaleString('en-IN')}
                                        </td>
                                        <td style={{ padding: '0.75rem', color: roi >= 0 ? '#10b981' : '#ef4444', fontWeight: '700' }}>
                                            {roi}% ROI
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Quick Hisab-Kitab Summary */}
                <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Hisab-Kitab & Supplier Summary</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Pending supplier dues & operating kharcha</p>
                        </div>
                        <Link to="/admin/hisab-kitab" style={{ color: 'var(--primary-red)', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem' }}>
                            Hisab-Kitab →
                        </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ background: '#0a0a0a', padding: '1rem', borderRadius: '8px', border: '1px solid #1f1f1f' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Supplier Balance Remaining</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ef4444', marginTop: '0.2rem' }}>₹{totalSupplierDue.toLocaleString('en-IN')}</div>
                        </div>
                        <div style={{ background: '#0a0a0a', padding: '1rem', borderRadius: '8px', border: '1px solid #1f1f1f' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Logged Kharcha (Operating Expenses)</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f59e0b', marginTop: '0.2rem' }}>₹{totalExpenses.toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
