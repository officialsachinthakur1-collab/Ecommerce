import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, ShoppingBag, ExternalLink, LogOut } from 'lucide-react';
import API_URL from '../config';

const Account = () => {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            try {
                const userId = user.id || user._id;
                const response = await fetch(`${API_URL}/api/orders?userId=${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error("Error fetching order history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <CheckCircle size={14} color="#10b981" />;
            case 'Shipped': return <Truck size={14} color="#3b82f6" />;
            case 'Pending': return <Clock size={14} color="#f59e0b" />;
            default: return <Package size={14} color="#666" />;
        }
    };

    if (!user) {
        return (
            <div style={{ paddingTop: 'var(--header-height)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <h2 style={{ marginBottom: '1rem' }}>Please log in to view your account</h2>
                <a href="/login" className="btn-primary">Login Now</a>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: 'calc(var(--header-height) + 4rem)', minHeight: '100vh', paddingBottom: '6rem' }}>
            <div className="container">
                <div style={{ marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>MY ACCOUNT</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, <span style={{ color: 'white' }}>{user.name}</span></p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '4rem' }}>
                    {/* Sidebar/Profile Section */}
                    <div>
                        <div style={{ background: '#111', padding: '2rem', borderRadius: '24px', border: '1px solid #222' }}>
                            <div style={{ width: '60px', height: '60px', background: 'var(--primary-red)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                                {user.name.charAt(0)}
                            </div>
                            <h3 style={{ marginBottom: '0.25rem' }}>{user.name}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{user.email}</p>

                            <div style={{ borderTop: '1px solid #222', paddingTop: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '0.875rem', color: '#666' }}>Joined</span>
                                    <span style={{ fontSize: '0.875rem' }}>Dec 2024</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.875rem', color: '#666' }}>Total Orders</span>
                                    <span style={{ fontSize: '0.875rem' }}>{orders.length}</span>
                                </div>
                            </div>

                            <button
                                onClick={logout}
                                style={{
                                    width: '100%',
                                    marginTop: '2rem',
                                    padding: '1rem',
                                    background: 'rgba(255, 68, 68, 0.1)',
                                    color: '#ff4444',
                                    border: '1px solid rgba(255, 68, 68, 0.2)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(255, 68, 68, 0.15)';
                                    e.target.style.borderColor = 'rgba(255, 68, 68, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'rgba(255, 68, 68, 0.1)';
                                    e.target.style.borderColor = 'rgba(255, 68, 68, 0.2)';
                                }}
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    </div>

                    {/* Order History Section */}
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>PURCHASE HISTORY</h2>

                        {loading ? (
                            <div style={{ color: 'var(--text-muted)' }}>Fetching your orders...</div>
                        ) : orders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem', background: '#111', borderRadius: '24px', border: '1px dashed #333' }}>
                                <ShoppingBag size={48} color="#333" style={{ marginBottom: '1rem' }} />
                                <h3 style={{ marginBottom: '0.5rem' }}>No orders found</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't placed any orders yet.</p>
                                <a href="/shop" className="btn-primary" style={{ display: 'inline-block' }}>Start Shopping</a>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {orders.map((order) => (
                                    <motion.div
                                        key={order._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{ background: '#111', borderRadius: '24px', border: '1px solid #222', overflow: 'hidden' }}
                                    >
                                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0a0a' }}>
                                            <div style={{ display: 'flex', gap: '2rem' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Order Date</div>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{order.date}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Total Amount</div>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary-red)' }}>{order.total}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Order ID</div>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{order.orderId}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '6px 14px', background: '#181818', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                {getStatusIcon(order.status)} {order.status}
                                            </div>
                                        </div>

                                        <div style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                                        <div style={{ width: '70px', height: '70px', borderRadius: '12px', background: '#050505', border: '1px solid #222', overflow: 'hidden' }}>
                                                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{item.name}</h4>
                                                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                                <span>Size: {item.selectedSize || 'Standard'}</span>
                                                                <span>Qty: {item.quantity || 1}</span>
                                                            </div>
                                                        </div>
                                                        <div style={{ fontWeight: '700' }}>{item.price}</div>
                                                        <a href={`/shop/product/${item.id}`} style={{ color: '#444' }}>
                                                            <ExternalLink size={18} />
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
