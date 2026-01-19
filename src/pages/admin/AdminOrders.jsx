import { Eye, Trash2 } from 'lucide-react';

import { useEffect, useState } from 'react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await fetch('https://ecommerce-eo7c.onrender.com/api/orders');
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        // Optimistic update
        setOrders(orders.map(order =>
            order.id === id ? { ...order, status: newStatus } : order
        ));

        try {
            await fetch(`https://ecommerce-eo7c.onrender.com/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (error) {
            console.error("Error updating status:", error);
            // Revert on error (could implement fetchOrders() here instead)
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#f97316'; // Orange
            case 'Shipped': return '#3b82f6'; // Blue
            case 'Delivered': return '#4ade80'; // Green
            case 'Cancelled': return '#ef4444'; // Red
            default: return 'var(--text-muted)';
        }
    };

    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
    };

    const handleDeleteOrder = async (id) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;

        try {
            // Encode ID because it contains '#'
            const encodedId = encodeURIComponent(id);
            const response = await fetch(`https://ecommerce-eo7c.onrender.com/api/orders/${encodedId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setOrders(orders.filter(order => order.id !== id));
            } else {
                alert("Failed to delete order");
            }
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>Orders</h1>

            <div style={{ background: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid #222' }}>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No orders found.</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #222', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                <th style={{ padding: '1rem 1.5rem' }}>Order ID</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Customer</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Date</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Total</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid #222' }}>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{order.id}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>{order.customer}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{order.date}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>{order.total}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '999px',
                                                fontSize: '0.75rem',
                                                background: `${getStatusColor(order.status)}20`,
                                                color: getStatusColor(order.status),
                                                border: '1px solid transparent',
                                                cursor: 'pointer',
                                                outline: 'none',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            <option value="Pending" style={{ background: '#111', color: 'white' }}>Pending</option>
                                            <option value="Processing" style={{ background: '#111', color: 'white' }}>Processing</option>
                                            <option value="Shipped" style={{ background: '#111', color: 'white' }}>Shipped</option>
                                            <option value="Delivered" style={{ background: '#111', color: 'white' }}>Delivered</option>
                                            <option value="Cancelled" style={{ background: '#111', color: 'white' }}>Cancelled</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleViewOrder(order)}
                                                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteOrder(order.id)}
                                                style={{ background: 'transparent', border: 'none', color: '#ff3333', cursor: 'pointer' }}
                                                title="Delete Order"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }} onClick={() => setSelectedOrder(null)}>
                    <div style={{
                        background: '#111', padding: '2rem', borderRadius: '12px',
                        width: '100%', maxWidth: '600px', border: '1px solid #333',
                        maxHeight: '80vh', overflowY: 'auto'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #222', paddingBottom: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Order Details</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>&times;</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Customer</h3>
                                <p style={{ fontWeight: '600' }}>{selectedOrder.customer}</p>
                                <p style={{ fontSize: '0.875rem', color: '#888' }}>{selectedOrder.email}</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Shipping Address</h3>
                                <p style={{ fontSize: '0.875rem' }}>{selectedOrder.address}</p>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Items</h3>
                        <div style={{ background: '#050505', borderRadius: '8px', overflow: 'hidden' }}>
                            {selectedOrder.items && selectedOrder.items.map((item, index) => (
                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: index !== selectedOrder.items.length - 1 ? '1px solid #222' : 'none' }}>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ width: '48px', height: '48px', background: '#222', borderRadius: '4px', overflow: 'hidden' }}>
                                            <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: '500' }}>{item.name}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Size: {item.size}</p>
                                        </div>
                                    </div>
                                    <p style={{ fontWeight: '600' }}>{item.price}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #222' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Total Amount</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{selectedOrder.total}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
