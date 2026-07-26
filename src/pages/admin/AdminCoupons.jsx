import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Plus, Trash2, Calendar, Users, Briefcase, X, Check } from 'lucide-react';
import API_URL from '../../config';

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountAmount: '',
        minOrderAmount: '0',
        expiryDate: '',
        usageLimit: ''
    });

    const adminPass = 'admin'; // Same as reviews

    const fetchCoupons = async () => {
        try {
            const res = await fetch(`${API_URL}/api/coupons?adminPass=${adminPass}`);
            const data = await res.json();
            if (data.success) {
                setCoupons(data.coupons);
            }
        } catch (error) {
            console.error("Error fetching coupons:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this coupon?')) return;
        try {
            const res = await fetch(`${API_URL}/api/coupons?adminPass=${adminPass}&id=${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setCoupons(coupons.filter(c => c._id !== id));
            }
        } catch (error) {
            alert('Delete failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/coupons`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminPass,
                    couponData: {
                        ...formData,
                        discountAmount: Number(formData.discountAmount),
                        minOrderAmount: Number(formData.minOrderAmount),
                        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null
                    }
                })
            });
            const data = await res.json();
            if (data.success) {
                setIsModalOpen(false);
                setFormData({ code: '', discountType: 'percentage', discountAmount: '', minOrderAmount: '0', expiryDate: '', usageLimit: '' });
                fetchCoupons();
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Failed to create coupon');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Coupon Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Create and manage discount codes</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={20} /> Create Coupon
                </button>
            </div>

            {loading ? (
                <div style={{ color: 'var(--text-muted)' }}>Loading coupons...</div>
            ) : (
                <div style={{ background: '#111', borderRadius: '16px', border: '1px solid #222', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#0a0a0a', borderBottom: '1px solid #222' }}>
                            <tr>
                                <th style={{ padding: '1.25rem' }}>Code</th>
                                <th style={{ padding: '1.25rem' }}>Discount</th>
                                <th style={{ padding: '1.25rem' }}>Min Order</th>
                                <th style={{ padding: '1.25rem' }}>Usage</th>
                                <th style={{ padding: '1.25rem' }}>Expiry</th>
                                <th style={{ padding: '1.25rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((coupon) => (
                                <tr key={coupon._id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ padding: '0.5rem', background: 'rgba(255,0,0,0.1)', borderRadius: '8px' }}>
                                                <Ticket size={18} color="var(--primary-red)" />
                                            </div>
                                            <span style={{ fontWeight: '700', letterSpacing: '1px' }}>{coupon.code}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        {coupon.discountAmount}{coupon.discountType === 'percentage' ? '%' : ' INR'} Off
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>₹{coupon.minOrderAmount}</td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ fontSize: '0.85rem' }}>
                                            {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : 'uses'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem', color: new Date(coupon.expiryDate) < new Date() ? '#ef4444' : 'inherit' }}>
                                        {new Date(coupon.expiryDate).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleDelete(coupon._id)}
                                            style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', transition: 'color 0.2s' }}
                                            onMouseOver={(e) => e.target.style.color = '#ef4444'}
                                            onMouseOut={(e) => e.target.style.color = '#666'}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{ background: '#111', width: '100%', maxWidth: '500px', borderRadius: '24px', border: '1px solid #333', padding: '2.5rem', position: 'relative' }}
                        >
                            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>

                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>New Coupon</h2>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.8rem', color: '#666' }}>Coupon Code</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. FLASH25"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        style={{ width: '100%', padding: '0.875rem', background: '#050505', border: '1px solid #333', borderRadius: '12px', color: 'white' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.8rem', color: '#666' }}>Type</label>
                                        <select
                                            value={formData.discountType}
                                            onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                            style={{ width: '100%', padding: '0.875rem', background: '#050505', border: '1px solid #333', borderRadius: '12px', color: 'white' }}
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount (₹)</option>
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.8rem', color: '#666' }}>Amount</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.discountAmount}
                                            onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                                            style={{ width: '100%', padding: '0.875rem', background: '#050505', border: '1px solid #333', borderRadius: '12px', color: 'white' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.8rem', color: '#666' }}>Min Order</label>
                                        <input
                                            type="number"
                                            value={formData.minOrderAmount}
                                            onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                                            style={{ width: '100%', padding: '0.875rem', background: '#050505', border: '1px solid #333', borderRadius: '12px', color: 'white' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.8rem', color: '#666' }}>Usage Limit</label>
                                        <input
                                            type="number"
                                            placeholder="Unlimited"
                                            value={formData.usageLimit}
                                            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                            style={{ width: '100%', padding: '0.875rem', background: '#050505', border: '1px solid #333', borderRadius: '12px', color: 'white' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.8rem', color: '#666' }}>Expiry Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                        style={{ width: '100%', padding: '0.875rem', background: '#050505', border: '1px solid #333', borderRadius: '12px', color: 'white' }}
                                    />
                                </div>

                                <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1rem' }}>
                                    Create Promo Code
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

