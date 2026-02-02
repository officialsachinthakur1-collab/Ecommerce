import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Menu, X, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

import useMobile from '../../hooks/useMobile';

const Navbar = () => {
    const isMobile = useMobile();
    const { user, logout } = useAuth();
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
                height: isMobile ? 'auto' : 'var(--header-height)',
                minHeight: 'var(--header-height)',
                display: 'flex',
                alignItems: 'center',
                padding: isMobile ? '0.75rem 0' : '0'
            }}>
                <div className="container" style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'stretch' : 'center',
                    gap: isMobile ? '0.75rem' : '2.5rem',
                    width: '100%',
                    position: 'relative'
                }}>
                    {/* Top Row: Logo & Icons (Mobile) / Left Side (Desktop) */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: isMobile ? '100%' : 'auto'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)} style={{ display: isMobile ? 'flex' : 'none' }}>
                                <Menu size={24} />
                            </div>
                            <Link to="/" style={{
                                fontSize: isMobile ? '1.1rem' : '1.4rem',
                                fontWeight: 800,
                                letterSpacing: '-0.05em',
                                color: 'white',
                                whiteSpace: 'nowrap'
                            }}>
                                GETSETMART
                            </Link>
                        </div>

                        {/* Mobile Icons - Moved to top row next to logo */}
                        {isMobile && (
                            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                                <Link to="/wishlist"><Heart size={22} /></Link>
                                <div style={{ position: 'relative', cursor: 'pointer' }} onClick={toggleCart}>
                                    <ShoppingBag size={22} />
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
                        )}
                    </div>

                    {/* Center Section: Persistent Search Bar (Amazon Style) - visible on BOTH */}
                    <div style={{
                        flex: 1,
                        maxWidth: isMobile ? 'none' : '800px'
                    }}>
                        <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%' }}>
                            <input
                                type="text"
                                placeholder="Search Getsetmart.com"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: isMobile ? '0.6rem 1rem' : '0.75rem 1.25rem',
                                    paddingRight: '3.5rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary-red)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                            <button type="submit" style={{
                                position: 'absolute',
                                right: '0.4rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'var(--primary-red)',
                                border: 'none',
                                borderRadius: '4px',
                                width: '2.4rem',
                                height: isMobile ? '2rem' : '2.2rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'white'
                            }}>
                                <Search size={18} />
                            </button>
                        </form>
                    </div>

                    {/* Right Section: Desktop Links & Utilities (HIDDEN ON MOBILE TOP ROW) */}
                    {!isMobile && (
                        <div style={{
                            display: 'flex',
                            gap: '2rem',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            flexShrink: 0
                        }}>
                            <Link to="/shop" style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Shop</Link>

                            {/* Animated V-Day Link */}
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <Link to="/valentines-day" style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary-red)', position: 'relative', zIndex: 1 }}>
                                    V-Day Special
                                </Link>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    style={{ position: 'absolute', inset: -10, pointerEvents: 'none' }}
                                >
                                    <Heart size={8} fill="currentColor" style={{ position: 'absolute', top: 0, left: '50%', color: 'var(--primary-red)', transform: 'translateX(-50%)' }} />
                                </motion.div>
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    style={{ position: 'absolute', inset: -15, pointerEvents: 'none' }}
                                >
                                    <Heart size={6} fill="currentColor" style={{ position: 'absolute', bottom: 0, left: '50%', color: 'var(--primary-red)', transform: 'translateX(-50%)' }} />
                                </motion.div>
                            </div>

                            <Link to="/blog" style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Insights</Link>

                            <Link to="/wishlist" style={{ cursor: 'pointer', color: 'inherit' }}>
                                <Heart size={20} />
                            </Link>

                            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={toggleCart}>
                                <ShoppingBag size={20} />
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

                            {user ? (
                                <>
                                    <Link to="/account">
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: 'var(--accent-gradient)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.9rem',
                                            fontWeight: '700',
                                            color: 'white',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            boxShadow: '0 0 10px rgba(255,0,0,0.2)'
                                        }}>
                                            {(user.name || user.email || 'M').charAt(0).toUpperCase()}
                                        </div>
                                    </Link>
                                    <button
                                        onClick={logout}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#666',
                                            cursor: 'pointer',
                                            padding: '0.5rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = '#ff4444'}
                                        onMouseLeave={(e) => e.target.style.color = '#666'}
                                        title="Logout"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Sign In</Link>
                            )}
                        </div>
                    )}
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

                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Link to="/valentines-day" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-red)', position: 'relative', zIndex: 1 }}>
                                V-DAY SPECIAL
                            </Link>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                style={{ position: 'absolute', inset: -20, pointerEvents: 'none' }}
                            >
                                <Heart size={12} fill="currentColor" style={{ position: 'absolute', top: 0, left: '50%', color: 'var(--primary-red)', transform: 'translateX(-50%)' }} />
                            </motion.div>
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                style={{ position: 'absolute', inset: -25, pointerEvents: 'none' }}
                            >
                                <Heart size={10} fill="currentColor" style={{ position: 'absolute', bottom: 0, left: '50%', color: 'var(--primary-red)', transform: 'translateX(-50%)' }} />
                            </motion.div>
                        </div>

                        <Link to="/blog" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 600 }}>INSIGHTS</Link>
                        {user ? (
                            <>
                                <Link to="/account" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary-red)' }}>MY ACCOUNT</Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#ff4444',
                                        fontSize: '1.2rem',
                                        fontWeight: 600,
                                        marginTop: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <LogOut size={20} /> LOGOUT
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 600 }}>SIGN IN</Link>
                                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 500, color: '#666' }}>CREATE ACCOUNT</Link>
                            </>
                        )}
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
                                placeholder="Search Getsetmart.com"
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
