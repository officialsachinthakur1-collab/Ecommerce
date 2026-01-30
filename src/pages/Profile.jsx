import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, User as UserIcon, LogOut, ChevronRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch(`${API_URL}/api/orders?email=${user.email}`);
                const data = await response.json();
                setOrders(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div style={{ paddingTop: 'calc(var(--header-height) + 2rem)', minHeight: '100vh', background: 'var(--bg-color)', color: 'white' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 300px) 1fr', gap: '3rem', alignItems: 'start' }}>

                {/* Sidebar */}
                <aside style={{ background: '#111', borderRadius: '24px', padding: '2rem', border: '1px solid #222' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-red)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UserIcon size={40} />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{user.name}</h2>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>{user.email}</p>
                    </div>

                    <div style={{ borderTop: '1px solid #222', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button style={{ color: 'var(--primary-red)', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', width: '100%', cursor: 'pointer', fontWeight: '600' }}>
                            <Package size={20} /> My Orders
                        </button>
                        <button
                            onClick={logout}
                            style={{ color: '#666', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', width: '100%', cursor: 'pointer' }}
                        >
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main>
                    <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '2rem' }}>ORDER <span className="text-gradient">HISTORY</span></h1>

                    {loading ? (
                        <div style={{ padding: '4rem', textAlign: 'center', color: '#666' }}>Loading your orders...</div>
                    ) : orders.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {orders.map((order) => (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        background: '#111',
                                        borderRadius: '16px',
                                        padding: '1.5rem',
                                        border: '1px solid #222',
                                        display: 'grid',
                                        gridTemplateColumns: 'auto 1fr auto auto',
                                        gap: '2rem',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '12px', border: '1px solid #333' }}>
                                        <Package size={24} style={{ color: 'var(--primary-red)' }} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem' }}>{order.orderId}</h3>
                                        <p style={{ color: '#666', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Clock size={14} /> {order.date}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            background: order.status === 'Paid' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                                            color: order.status === 'Paid' ? '#4ade80' : '#fbbf24',
                                            border: `1px solid ${order.status === 'Paid' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(251, 191, 36, 0.2)'}`
                                        }}>
                                            {order.status}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: '800', fontSize: '1.125rem' }}>{order.total}</div>
                                        <div style={{ color: '#666', fontSize: '0.875rem' }}>{order.items?.length || 0} items</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            padding: '6rem 2rem',
                            textAlign: 'center',
                            background: '#111',
                            borderRadius: '24px',
                            border: '1px dotted #333'
                        }}>
                            <Package size={48} style={{ color: '#333', marginBottom: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No orders yet</h3>
                            <p style={{ color: '#666', marginBottom: '2rem' }}>Looks like you haven't made your first move yet.</p>
                            <button onClick={() => navigate('/shop')} className="btn-primary" style={{ padding: '0.75rem 2rem' }}>Start Shopping</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Profile;
