import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

import useMobile from '../../hooks/useMobile';

const Navbar = () => {
    const isMobile = useMobile();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { toggleCart, cartCount } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearchOpen(false);
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    return (
        <>
            <nav style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: scrolled ? 'rgba(5, 5, 5, 0.95)' : 'transparent',
                backdropFilter: (scrolled && !isMobile) ? 'blur(10px)' : 'none',
                borderBottom: scrolled ? '1px solid var(--glass-border)' : 'none',
                transition: isMobile ? 'none' : 'all 0.3s ease',
                height: 'var(--header-height)',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div className="container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    position: 'relative'
                }}>
                    {/* Left Section: Menu (Mobile) / Nav (Desktop) */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        <div className="desktop-nav">
                            <Link to="/shop" style={{ fontWeight: 500, fontSize: '0.9rem', textTransform: 'uppercase' }}>Shop</Link>
                            <Link to="/about" style={{ fontWeight: 500, fontSize: '0.9rem', textTransform: 'uppercase' }}>Company</Link>
                            <Link to="/blog" style={{ fontWeight: 500, fontSize: '0.9rem', textTransform: 'uppercase' }}>Insights</Link>
                        </div>
                        <div className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
                            <Menu size={24} />
                        </div>
                    </div>

                    {/* Center Section: Logo (Perfectly Centered) */}
                    <div style={{
                        flex: '0 0 auto',
                        textAlign: 'center',
                        zIndex: 2
                    }}>
                        <Link to="/" style={{
                            fontSize: isMobile ? '1.1rem' : '1.5rem',
                            fontWeight: 800,
                            letterSpacing: '-0.05em',
                            color: 'white',
                            whiteSpace: 'nowrap'
                        }}>
                            GETSETMART
                        </Link>
                    </div>

                    {/* Right Section: Utilities */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        gap: isMobile ? '1rem' : '1.5rem',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        <div onClick={() => setSearchOpen(true)} style={{ cursor: 'pointer' }}>
                            <Search size={isMobile ? 18 : 20} />
                        </div>
                        <Link to="/wishlist" style={{ cursor: 'pointer', color: 'inherit' }}>
                            <Heart size={isMobile ? 18 : 20} />
                        </Link>
                        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={toggleCart}>
                            <ShoppingBag size={isMobile ? 18 : 20} />
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-8px',
                                    background: 'var(--primary-red)',
                                    color: 'white',
                                    fontSize: '10px',
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold'
                                }}>{cartCount}</span>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'black',
                            zIndex: 200,
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '2rem'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '2rem', right: '2rem', cursor: 'pointer' }} onClick={() => setMobileMenuOpen(false)}>
                            <X size={32} />
                        </div>
                        <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', color: 'white' }}>GETSETMART</Link>

                        <Link to="/shop" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 600 }}>SHOP</Link>
                        <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 600 }}>COMPANY</Link>
                        <Link to="/blog" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 600 }}>INSIGHTS</Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Overlay */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100vh',
                            background: 'rgba(0,0,0,0.9)',
                            zIndex: 150,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '2rem', right: '2rem', cursor: 'pointer' }} onClick={() => setSearchOpen(false)}>
                            <X size={32} />
                        </div>
                        <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: '600px', padding: '0 2rem' }}>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                style={{
                                    width: '100%',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '2px solid var(--primary-red)',
                                    color: 'white',
                                    fontSize: '2rem',
                                    padding: '1rem 0',
                                    outline: 'none',
                                    textAlign: 'center'
                                }}
                            />
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
