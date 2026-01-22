import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="container">
                <div className="footer-grid">
                    {/* Newsletter */}
                    <div className="mobile-symmetric-aligned" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', width: '100%' }}>
                        <h3 className="section-header-title" style={{ fontSize: '2rem', marginBottom: '1rem', textTransform: 'uppercase', marginLeft: 0, textAlign: 'left', width: '100%' }}>Join the Movement</h3>
                        <div style={{ marginLeft: '1rem', marginRight: '1rem', width: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'left', width: '100%' }}>Sign up for exclusive drops and early access.</p>
                            <div style={{ display: 'flex', gap: '1rem', maxWidth: '400px', width: '100%' }}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        background: 'transparent',
                                        border: '1px solid #333',
                                        color: 'white',
                                        borderRadius: '4px',
                                        minWidth: 0,
                                        textAlign: 'left'
                                    }}
                                />
                                <button className="btn-primary">Subscribe</button>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="footer-links mobile-symmetric-aligned" style={{ textAlign: 'left', alignItems: 'flex-start', width: '100%' }}>
                        <div>
                            <h4 className="section-header-title" style={{ marginBottom: '1.5rem', fontWeight: '800', textTransform: 'uppercase', fontSize: '1rem', textAlign: 'left' }}>Shop</h4>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '1rem', marginRight: '1rem', textAlign: 'left', alignItems: 'flex-start' }}>
                                <li><Link to="/shop?category=Men">Men</Link></li>
                                <li><Link to="/shop?category=Women">Women</Link></li>
                                <li><Link to="/shop?category=Unisex">Unisex</Link></li>
                                <li><Link to="/shop?category=New">New Arrivals</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="section-header-title" style={{ marginBottom: '1.5rem', fontWeight: '800', textTransform: 'uppercase', fontSize: '1rem', textAlign: 'left' }}>Company</h4>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '1rem', marginRight: '1rem', textAlign: 'left', alignItems: 'flex-start' }}>
                                <li><a href="#">About</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Press</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="section-header-title" style={{ marginBottom: '1.5rem', fontWeight: '800', textTransform: 'uppercase', fontSize: '1rem', textAlign: 'left' }}>Support</h4>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '1rem', marginRight: '1rem', textAlign: 'left', alignItems: 'flex-start' }}>
                                <li><a href="#">Contact</a></li>
                                <li><a href="#">Shipping</a></li>
                                <li><a href="#">Returns</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="section-header-title" style={{ marginBottom: '1.5rem', fontWeight: '800', textTransform: 'uppercase', fontSize: '1rem', textAlign: 'left' }}>Social</h4>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '1rem', marginRight: '1rem', textAlign: 'left', alignItems: 'flex-start' }}>
                                <li><a href="#">Instagram</a></li>
                                <li><a href="#">Twitter</a></li>
                                <li><a href="#">TikTok</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Big Brand Text */}
                <div className="footer-brand">
                    NIVEST
                </div>

                {/* Sub Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', fontSize: '0.8rem', color: '#444', borderTop: '1px solid #111', paddingTop: '2rem' }}>
                    <div>© 2026 Nivest Inc. All rights reserved.</div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
