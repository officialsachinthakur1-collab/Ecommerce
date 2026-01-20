import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="container">
                <div className="footer-grid">
                    {/* Newsletter */}
                    <div>
                        <h3 style={{ fontSize: '2rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Join the Movement</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Sign up for exclusive drops and early access.</p>
                        <div style={{ display: 'flex', gap: '1rem', maxWidth: '400px' }}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    background: 'transparent',
                                    border: '1px solid #333',
                                    color: 'white',
                                    borderRadius: '4px'
                                }}
                            />
                            <button className="btn-primary">Subscribe</button>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="footer-links">
                        <div>
                            <h4 style={{ marginBottom: '1.5rem', fontWeight: '600' }}>Shop</h4>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <li><Link to="/shop?category=Men">Men</Link></li>
                                <li><Link to="/shop?category=Women">Women</Link></li>
                                <li><Link to="/shop?category=Unisex">Unisex</Link></li>
                                <li><Link to="/shop?category=New">New Arrivals</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1.5rem', fontWeight: '600' }}>Company</h4>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <li><a href="#">About</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Press</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1.5rem', fontWeight: '600' }}>Support</h4>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <li><a href="#">Contact</a></li>
                                <li><a href="#">Shipping</a></li>
                                <li><a href="#">Returns</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1.5rem', fontWeight: '600' }}>Social</h4>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
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
