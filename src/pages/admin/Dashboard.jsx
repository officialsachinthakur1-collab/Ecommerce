import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import API_URL from '../../config';

export default function Dashboard() {
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        avgOrder: 0,
        recentOrders: []
    });
    const [chartData, setChartData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Analytics
                const anaRes = await fetch(`${API_URL}/api/analytics`);
                const anaData = await anaRes.json();

                if (anaData.success) {
                    setStats({
                        revenue: anaData.stats.totalRevenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
                        orders: anaData.stats.totalOrders,
                        avgOrder: anaData.stats.avgOrderValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
                    });
                    setChartData(anaData.chartData);
                    setTopProducts(anaData.topProducts);
                    setLowStockProducts(anaData.lowStockProducts);
                }

                // Fetch Recent Orders separately for the list
                const ordRes = await fetch(`${API_URL}/api/orders`);
                const ordData = await ordRes.json();
                if (ordRes.ok) {
                    setStats(prev => ({ ...prev, recentOrders: ordData.slice(0, 5) }));
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Graph Calculation
    const maxVal = Math.max(...chartData.map(d => d.revenue), 10);
    const points = chartData.map((d, i) => {
        const x = (i / (chartData.length - 1 || 1)) * 100;
        const y = 100 - (d.revenue / maxVal) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Dashboard</h1>
                <div style={{ color: 'var(--text-muted)' }}>Real-time Insights</div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard title="Total Revenue" value={loading ? "..." : stats.revenue} change="+Real" icon={DollarSign} />
                <StatCard title="Total Orders" value={loading ? "..." : stats.orders} change="+Real" icon={ShoppingBag} color="#3b82f6" />
                <StatCard title="Avg. Order Value" value={loading ? "..." : stats.avgOrder} change="Live" icon={TrendingUp} color="#f97316" />
                <StatCard title="Top Products" value={topProducts.length} change="Live" icon={Users} color="#a855f7" />
            </div>

            {/* UI Bottom Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                {/* Revenue Graph */}
                <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>Revenue Trends</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '2rem' }}>Last 7 days sales performance</p>

                    <div style={{ height: '250px', width: '100%', position: 'relative', padding: '0 10px' }}>
                        {chartData.length > 1 ? (
                            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                                {/* Horizontal Grid Lines */}
                                {[0, 25, 50, 75, 100].map(y => (
                                    <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#222" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                                ))}

                                <motion.polyline
                                    points={points}
                                    fill="none"
                                    stroke="var(--primary-red)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    vectorEffect="non-scaling-stroke"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                />

                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--primary-red)" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="var(--primary-red)" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <polyline
                                    points={`0,100 ${points} 100,100`}
                                    fill="url(#chartGradient)"
                                    stroke="none"
                                />

                                {/* Data Points */}
                                {chartData.map((d, i) => {
                                    const x = (i / (chartData.length - 1)) * 100;
                                    const y = 100 - (d.revenue / maxVal) * 100;
                                    return (
                                        <circle key={i} cx={x} cy={y} r="1.5" fill="var(--primary-red)" />
                                    );
                                })}
                            </svg>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
                                Not enough data for trends
                            </div>
                        )}

                        {/* X-Axis Labels */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                            {chartData.map((d, i) => (
                                <span key={i} style={{ fontSize: '0.65rem', color: '#666', transform: 'rotate(-45deg)' }}>{d.date.split(',')[0]}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Best Sellers</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {topProducts.length > 0 ? topProducts.map((prod, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', background: '#222', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                    #{idx + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{prod.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prod.sales} items sold</div>
                                </div>
                                <div style={{ height: '6px', width: '60px', background: '#222', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', background: 'var(--primary-red)', width: `${(prod.sales / topProducts[0].sales) * 100}%` }}></div>
                                </div>
                            </div>
                        )) : <p style={{ color: '#666' }}>No sales data yet.</p>}
                    </div>
                </div>
            </div>

            {/* Stock Alerts Widget */}
            {lowStockProducts.length > 0 && (
                <div style={{ marginTop: '2rem', background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ff4444' }}>Critical Stock Alerts</h2>
                        <div style={{ fontSize: '0.75rem', padding: '2px 10px', background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', borderRadius: '99px', fontWeight: 'bold' }}>ATTENTION REQUIRED</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                        {lowStockProducts.map(prod => (
                            <div key={prod._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#050505', borderRadius: '12px', border: '1px solid #222' }}>
                                <div style={{ width: '45px', height: '45px', background: '#1a1a1a', borderRadius: '8px', overflow: 'hidden' }}>
                                    <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{prod.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#ff4444', fontWeight: 'bold' }}>Only {prod.stock} units left</div>
                                </div>
                                <a href="/admin/products" style={{ fontSize: '0.75rem', background: '#222', padding: '0.5rem 0.75rem', borderRadius: '8px', color: 'white', border: '1px solid #333', textDecoration: 'none' }}>
                                    Restock
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Bottom Section: Recent Orders */}
            <div style={{ marginTop: '2rem', background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Recent Order Activity</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                    {stats.recentOrders.map(order => (
                        <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#050505', borderRadius: '12px', border: '1px solid #222' }}>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{order.customer}</div>
                                <div style={{ fontSize: '0.75rem', color: '#666' }}>{order.orderId} • {order.date}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 'bold', color: 'var(--primary-red)' }}>{order.total}</div>
                                <span style={{
                                    fontSize: '0.65rem',
                                    padding: '2px 8px',
                                    borderRadius: '99px',
                                    background: order.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                    color: order.status === 'Completed' ? '#10b981' : '#f59e0b',
                                    fontWeight: 'bold'
                                }}>{order.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

