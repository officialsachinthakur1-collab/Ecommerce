import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import API_URL from '../../config';

const Dashboard = () => {
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        users: 2345, // Mock
        conversion: '4.35%' // Mock
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${API_URL}/api/orders`);
                if (response.ok) {
                    const orders = await response.json();

                    // Calculate Total Revenue
                    const totalRevenue = orders.reduce((acc, order) => {
                        // Clean price string (remove $ and commas)
                        const price = parseFloat(order.total.replace(/[^0-9.-]+/g, ""));
                        return acc + (isNaN(price) ? 0 : price);
                    }, 0);

                    setStats(prev => ({
                        ...prev,
                        revenue: totalRevenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
                        orders: orders.length,
                        recentOrders: orders.slice(0, 5) // Get latest 5
                    }));
                }
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Mock Data for Graph
    const dataPoints = [20, 45, 28, 80, 56, 100, 75];
    const maxVal = Math.max(...dataPoints);
    const points = dataPoints.map((val, i) => {
        const x = (i / (dataPoints.length - 1)) * 100;
        const y = 100 - (val / maxVal) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Dashboard</h1>
                <div style={{ color: 'var(--text-muted)' }}>Last 30 Days</div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard title="Total Revenue" value={loading ? "Loading..." : stats.revenue} change="+20.1%" icon={DollarSign} />
                <StatCard title="Total Orders" value={loading ? "Loading..." : stats.orders} change="+12.2%" icon={ShoppingBag} color="#3b82f6" />
                <StatCard title="Active Users" value={stats.users} change="+8.7%" icon={Users} color="#a855f7" />
                <StatCard title="Conversion Rate" value={stats.conversion} change="+2.4%" icon={TrendingUp} color="#f97316" />
            </div>

            {/* UI Bottom Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                {/* Revenue Graph */}
                <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2rem' }}>Revenue Overview</h2>
                    <div style={{ height: '300px', width: '100%', position: 'relative' }}>
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                            {/* Grid Lines */}
                            {[0, 25, 50, 75, 100].map(y => (
                                <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#333" strokeWidth="0.2" vectorEffect="non-scaling-stroke" />
                            ))}

                            <motion.polyline
                                points={points}
                                fill="none"
                                stroke="var(--primary-red)"
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />

                            <defs>
                                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--primary-red)" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="var(--primary-red)" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <polyline
                                points={`0,100 ${points} 100,100`}
                                fill="url(#gradient)"
                                stroke="none"
                            />
                        </svg>
                    </div>
                </div>

                {/* Recent Orders List */}
                <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Recent Orders</h2>
                    {loading ? <p style={{ color: 'var(--text-muted)' }}>Fetching latest activity...</p> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {stats.recentOrders && stats.recentOrders.length > 0 ? stats.recentOrders.map(order => (
                                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#050505', borderRadius: '8px', border: '1px solid #1a1a1a' }}>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{order.customer}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.id} • {order.date}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--primary-red)' }}>{order.total}</div>
                                        <span style={{ fontSize: '0.7rem', color: order.status === 'Pending' ? '#f59e0b' : '#10b981' }}>{order.status}</span>
                                    </div>
                                </div>
                            )) : <p style={{ color: 'var(--text-muted)' }}>No recent orders found.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
