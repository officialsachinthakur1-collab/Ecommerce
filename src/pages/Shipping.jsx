import { motion } from 'framer-motion';
import { Truck, Clock, Globe, ShieldCheck } from 'lucide-react';

const Shipping = () => {
    return (
        <div style={{ paddingTop: 'calc(var(--header-height) + 4rem)', minHeight: '100vh', paddingBottom: '6rem' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '2rem', textTransform: 'uppercase' }}
                >
                    Shipping <span className="text-gradient">Policy</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}
                >
                    <p style={{ marginBottom: '2rem' }}>
                        At GetSetMart, we ensure that your style reaches you as fast as possible. We partner with reliable carriers like Delhivery, BlueDart, and Ecom Express to provide seamless delivery across India and worldwide.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
                        <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
                            <Truck size={32} color="var(--primary-red)" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Pan-India Delivery</h3>
                            <p style={{ fontSize: '0.9rem' }}>Delivery to 19,000+ pin codes. Free shipping on orders over ₹500.</p>
                        </div>
                        <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
                            <Clock size={32} color="var(--primary-red)" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Fast Processing</h3>
                            <p style={{ fontSize: '0.9rem' }}>Orders are processed within 24-48 hours. Estimated delivery: 3-5 business days.</p>
                        </div>
                        <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
                            <Globe size={32} color="var(--primary-red)" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Global Shipping</h3>
                            <p style={{ fontSize: '0.9rem' }}>We ship worldwide. International delivery times vary by location (7-12 days).</p>
                        </div>
                        <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
                            <ShieldCheck size={32} color="var(--primary-red)" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Order Tracking</h3>
                            <p style={{ fontSize: '0.9rem' }}>Real-time SMS and Email updates with a tracking link for every order.</p>
                        </div>
                    </div>

                    <h2 style={{ color: 'white', marginBottom: '1.5rem', fontWeight: 800 }}>Shipping Rates</h2>
                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '3rem' }}>
                        <li style={{ padding: '1rem 0', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Orders below ₹500</span>
                            <span style={{ color: 'white', fontWeight: 600 }}>₹50</span>
                        </li>
                        <li style={{ padding: '1rem 0', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Orders above ₹500</span>
                            <span style={{ color: '#4ade80', fontWeight: 600 }}>FREE</span>
                        </li>
                        <li style={{ padding: '1rem 0', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between' }}>
                            <span>International Shipping</span>
                            <span style={{ color: 'white', fontWeight: 600 }}>Calculated at Checkout</span>
                        </li>
                    </ul>

                    <p>
                        If you have any questions regarding your shipment, please reach out to us at <span style={{ color: 'white' }}>support@getsetmart.com</span> or via the WhatsApp button below.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Shipping;
