import { motion } from 'framer-motion';
import { RotateCcw, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

const Returns = () => {
    return (
        <div style={{ paddingTop: 'calc(var(--header-height) + 4rem)', minHeight: '100vh', paddingBottom: '6rem' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '2rem', textTransform: 'uppercase' }}
                >
                    Returns & <span className="text-gradient">Refunds</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}
                >
                    <p style={{ marginBottom: '3rem' }}>
                        We want you to love your purchase. If a product doesn't fit or meet your expectations, our easy return and exchange policy has got you covered.
                    </p>

                    <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '4rem' }}>
                        <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <RotateCcw size={40} color="var(--primary-red)" style={{ flexShrink: 0 }} />
                            <div>
                                <h3 style={{ color: 'white', marginBottom: '0.25rem' }}>7-Day Easy Returns</h3>
                                <p style={{ fontSize: '0.9rem' }}>Return or exchange any product within 7 days of delivery. No questions asked.</p>
                            </div>
                        </div>
                        <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <ShieldCheck size={40} color="var(--primary-red)" style={{ flexShrink: 0 }} />
                            <div>
                                <h3 style={{ color: 'white', marginBottom: '0.25rem' }}>Quality Assurance</h3>
                                <p style={{ fontSize: '0.9rem' }}>If you receive a damaged or wrong item, we will replace it free of cost immediately.</p>
                            </div>
                        </div>
                        <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <CheckCircle2 size={40} color="var(--primary-red)" style={{ flexShrink: 0 }} />
                            <div>
                                <h3 style={{ color: 'white', marginBottom: '0.25rem' }}>Hassle-Free Refunds</h3>
                                <p style={{ fontSize: '0.9rem' }}>Refunds are processed to the original payment method within 5-7 business days after the return pick-up.</p>
                            </div>
                        </div>
                    </div>

                    <h2 style={{ color: 'white', marginBottom: '1.5rem', fontWeight: 800 }}>How to Return</h2>
                    <div style={{ borderLeft: '2px solid var(--primary-red)', paddingLeft: '2rem', marginLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>
                        <div>
                            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Step 1: Request Return</h4>
                            <p style={{ fontSize: '1rem' }}>Go to your 'Account' section or email us at <span style={{ color: 'white' }}>returns@getsetmart.com</span> with your order ID.</p>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Step 2: Tag & Pack</h4>
                            <p style={{ fontSize: '1rem' }}>Ensure the tags are intact and the product is in its original packaging.</p>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Step 3: Pick-up</h4>
                            <p style={{ fontSize: '1rem' }}>Our courier partner will arrive within 24-48 hours to collect the return parcel.</p>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(255,165,0,0.05)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,165,0,0.1)', display: 'flex', gap: '1.5rem' }}>
                        <AlertCircle color="#ffa500" size={24} style={{ flexShrink: 0 }} />
                        <p style={{ fontSize: '0.95rem', color: '#ffa500' }}>
                            <strong>Note:</strong> Used products or items with missing tags cannot be returned or exchanged for hygiene reasons.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Returns;
