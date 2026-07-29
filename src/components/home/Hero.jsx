import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Tag, ArrowRight, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import useMobile from '../../hooks/useMobile';

export default function Hero() {
    const isMobile = useMobile();
    const { products } = useProducts(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Dynamic Festival Settings from Admin
    const [festivalConfig, setFestivalConfig] = useState(() => {
        const saved = localStorage.getItem('gsm_festival_settings');
        return saved ? JSON.parse(saved) : {
            festivalName: 'Fashion Dhamaka',
            bannerTitle: 'BIG FASHION FESTIVAL SALE',
            subTitle: 'Get Up To 70% OFF On Trendsetting Apparel & Essentials',
            badgeText: '🔥 LIMITED TIME DEAL',
            discountTag: 'UP TO 70% OFF',
            bgColor: '#800020'
        };
    });

    useEffect(() => {
        const handleFestivalUpdate = (e) => {
            if (e.detail) {
                setFestivalConfig(e.detail);
            } else {
                const saved = localStorage.getItem('gsm_festival_settings');
                if (saved) setFestivalConfig(JSON.parse(saved));
            }
        };

        window.addEventListener('gsm_festival_updated', handleFestivalUpdate);
        return () => window.removeEventListener('gsm_festival_updated', handleFestivalUpdate);
    }, []);

    // Construct Amazon Hero Slides
    const heroSlides = useMemo(() => {
        const baseSlides = [
            {
                id: 'festive-slide',
                tag: festivalConfig.badgeText || '🔥 SPECIAL OFFER',
                title: festivalConfig.bannerTitle || 'BIG FASHION FESTIVAL',
                description: festivalConfig.subTitle || 'Discover premium apparel, footwear & accessories at unmatched prices.',
                image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
                btnText: `Shop ${festivalConfig.festivalName || 'Sale'} — ${festivalConfig.discountTag || 'Up to 70% OFF'}`,
                btnLink: '/shop',
                bgGradient: festivalConfig.bgColor || '#7f1d1d'
            },
            {
                id: 'trending-slide',
                tag: '⚡ TRENDING NOW',
                title: 'PREMIUM OVERSIZED COLLECTION',
                description: 'Upgrade your daily street style with heavyweight 100% organic cotton hoodies & tees.',
                image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80',
                btnText: 'Explore Streetwear ➔',
                btnLink: '/shop?category=Men',
                bgGradient: '#1e1b4b'
            },
            {
                id: 'bestseller-slide',
                tag: '👑 BESTSELLERS SPOTLIGHT',
                title: 'CURATED LUXURY & DAILY WEAR',
                description: 'Over 10,000+ happy customers love our top-rated collections. Free Shipping across India!',
                image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
                btnText: 'View Bestsellers ➔',
                btnLink: '/shop?tag=Bestseller',
                bgGradient: '#064e3b'
            }
        ];

        // Add user hero products if available
        const customHeroProducts = products.filter(p => p.isHero).map(p => ({
            id: p.id || p._id,
            tag: p.tag || '✨ FEATURED PRODUCT',
            title: p.heroTitle || p.name,
            description: p.description || 'Exclusive premium quality item ready for express dispatch.',
            image: p.image,
            btnText: `Shop Now — ${p.price}`,
            btnLink: `/product/${p.id || p._id}`,
            bgGradient: '#18181b'
        }));

        return customHeroProducts.length > 0 ? [baseSlides[0], ...customHeroProducts] : baseSlides;
    }, [festivalConfig, products]);

    // Auto Slide Timer
    useEffect(() => {
        if (heroSlides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroSlides.length]);

    const activeSlide = heroSlides[currentIndex] || heroSlides[0];

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

    // Pick top 4 products for Amazon Category Cards Grid
    const menProducts = products.filter(p => p.category === 'Men').slice(0, 2);
    const womenProducts = products.filter(p => p.category === 'Women').slice(0, 2);
    const hotDeals = products.slice(0, 4);

    return (
        <section style={{ position: 'relative', width: '100%', background: '#0a0a0c', overflow: 'hidden', paddingBottom: '2rem' }}>
            
            {/* Amazon Main Banner Slider */}
            <div style={{
                position: 'relative',
                minHeight: isMobile ? '380px' : '480px',
                display: 'flex',
                alignItems: 'center',
                background: `linear-gradient(135deg, ${activeSlide.bgGradient || '#7f1d1d'} 0%, #0a0a0c 100%)`,
                transition: 'background 0.8s ease'
            }}>
                
                {/* Full-Bleed Background Overlay Pattern */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                    opacity: 0.6
                }} />

                {/* Left & Right Amazon Nav Arrows */}
                <button
                    onClick={prevSlide}
                    style={{
                        position: 'absolute',
                        left: '1rem',
                        zIndex: 20,
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    <ChevronLeft size={24} />
                </button>

                <button
                    onClick={nextSlide}
                    style={{
                        position: 'absolute',
                        right: '1rem',
                        zIndex: 20,
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    <ChevronRight size={24} />
                </button>

                {/* Main Banner Content */}
                <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '2rem 1.25rem' : '3rem 2rem', position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 0.8fr', gap: '2rem', alignItems: 'center' }}>
                        
                        {/* Text & CTA */}
                        <div>
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                background: 'rgba(239, 68, 68, 0.2)',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                color: 'white',
                                padding: '0.35rem 0.9rem',
                                borderRadius: '100px',
                                fontSize: '0.78rem',
                                fontWeight: '800',
                                marginBottom: '1rem',
                                letterSpacing: '0.5px'
                            }}>
                                <Sparkles size={14} color="#f59e0b" /> {activeSlide.tag}
                            </span>

                            <h1 style={{
                                fontSize: isMobile ? '2.2rem' : '3.4rem',
                                fontWeight: '900',
                                color: 'white',
                                lineHeight: '1.1',
                                marginBottom: '1rem',
                                textShadow: '0 4px 20px rgba(0,0,0,0.5)'
                            }}>
                                {activeSlide.title}
                            </h1>

                            <p style={{
                                fontSize: isMobile ? '0.9rem' : '1.15rem',
                                color: 'rgba(255,255,255,0.85)',
                                marginBottom: '1.75rem',
                                maxWidth: '560px',
                                lineHeight: '1.5'
                            }}>
                                {activeSlide.description}
                            </p>

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <Link
                                    to={activeSlide.btnLink}
                                    style={{
                                        padding: '0.9rem 2rem',
                                        background: 'var(--primary-red)',
                                        color: 'white',
                                        borderRadius: '10px',
                                        fontWeight: '800',
                                        fontSize: '0.95rem',
                                        textDecoration: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)'
                                    }}
                                >
                                    {activeSlide.btnText}
                                </Link>
                                <Link
                                    to="/shop"
                                    style={{
                                        padding: '0.9rem 1.5rem',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.25)',
                                        color: 'white',
                                        borderRadius: '10px',
                                        fontWeight: '700',
                                        fontSize: '0.95rem',
                                        textDecoration: 'none',
                                        backdropFilter: 'blur(6px)'
                                    }}
                                >
                                    Explore Store Catalogue ➔
                                </Link>
                            </div>
                        </div>

                        {/* Right Banner Image */}
                        {!isMobile && (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{
                                    position: 'relative',
                                    width: '340px',
                                    height: '340px',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    border: '2px solid rgba(255,255,255,0.15)',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
                                }}>
                                    <img
                                        src={activeSlide.image}
                                        alt={activeSlide.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '1rem',
                                        left: '1rem',
                                        right: '1rem',
                                        background: 'rgba(0,0,0,0.75)',
                                        backdropFilter: 'blur(8px)',
                                        padding: '0.75rem',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase' }}>Festival Special</div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#10b981' }}>{festivalConfig.discountTag || 'UP TO 70% OFF'}</div>
                                        </div>
                                        <Tag size={18} color="#f59e0b" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Slider Dots */}
                <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    zIndex: 15
                }}>
                    {heroSlides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            style={{
                                width: idx === currentIndex ? '28px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                background: idx === currentIndex ? 'var(--primary-red)' : 'rgba(255,255,255,0.3)',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Premium Modern Quick Category Cards Grid (4 Cards) */}
            <div style={{ width: '100%', maxWidth: '1280px', margin: isMobile ? '1.5rem auto 0' : '-55px auto 0', padding: '0 1.25rem', position: 'relative', zIndex: 30 }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
                    gap: '1.25rem'
                }}>
                    
                    {/* Card 1: Men's & Trending Apparel */}
                    <div style={{
                        background: 'rgba(15, 15, 18, 0.88)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderTop: '3px solid var(--primary-red)',
                        borderRadius: '20px',
                        padding: '1.35rem',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', letterSpacing: '-0.2px' }}>
                                    👔 Men's & Streetwear
                                </h3>
                                <span style={{ fontSize: '0.7rem', color: '#888', background: '#1c1c22', padding: '2px 8px', borderRadius: '100px' }}>Curated</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                                {(menProducts.length > 0 ? menProducts : hotDeals.slice(0, 2)).map((p, i) => (
                                    <Link key={i} to={`/product/${p.id || p._id}`} style={{ textDecoration: 'none' }}>
                                        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#fff', border: '1px solid #2a2a30', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img src={p.image} alt={p.name} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                                            <div style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.85)', color: '#10b981', padding: '1px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: '800' }}>
                                                {p.price}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#d4d4d8', fontWeight: '600', marginTop: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {p.name}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <Link to="/shop?category=Men" style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--primary-red)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '0.5rem' }}>
                            Explore Men's Collection <ArrowRight size={15} />
                        </Link>
                    </div>

                    {/* Card 2: Today's Mega Deals & Festival Spotlight */}
                    <div style={{
                        background: 'rgba(15, 15, 18, 0.88)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderTop: '3px solid #10b981',
                        borderRadius: '20px',
                        padding: '1.35rem',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', letterSpacing: '-0.2px' }}>
                                    🏷️ Today's Mega Deals
                                </h3>
                                <span style={{ background: '#ef4444', color: 'white', fontSize: '0.65rem', fontWeight: '900', padding: '2px 7px', borderRadius: '100px', letterSpacing: '0.5px' }}>
                                    LIVE
                                </span>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.25) 100%)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                borderRadius: '14px',
                                padding: '1rem',
                                marginBottom: '1rem'
                            }}>
                                <div style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: '600', textTransform: 'uppercase' }}>
                                    {festivalConfig.festivalName || 'Special Event'}
                                </div>
                                <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#10b981', marginTop: '2px' }}>
                                    {festivalConfig.discountTag || 'UP TO 70% OFF'}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '4px' }}>
                                    ⚡ Limited time store discounts applied
                                </div>
                            </div>
                        </div>

                        <Link to="/shop?tag=Hot Deal" style={{ fontSize: '0.82rem', fontWeight: '800', color: '#10b981', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            View Today's Hot Deals <ArrowRight size={15} />
                        </Link>
                    </div>

                    {/* Card 3: Women's & Accessories Collection */}
                    <div style={{
                        background: 'rgba(15, 15, 18, 0.88)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderTop: '3px solid #f59e0b',
                        borderRadius: '20px',
                        padding: '1.35rem',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', letterSpacing: '-0.2px' }}>
                                    ✨ Women & Essentials
                                </h3>
                                <span style={{ fontSize: '0.7rem', color: '#888', background: '#1c1c22', padding: '2px 8px', borderRadius: '100px' }}>Top Rated</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                                {(womenProducts.length > 0 ? womenProducts : hotDeals.slice(2, 4)).map((p, i) => (
                                    <Link key={i} to={`/product/${p.id || p._id}`} style={{ textDecoration: 'none' }}>
                                        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#fff', border: '1px solid #2a2a30', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img src={p.image} alt={p.name} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                                            <div style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.85)', color: '#f59e0b', padding: '1px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: '800' }}>
                                                {p.price}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#d4d4d8', fontWeight: '600', marginTop: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {p.name}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <Link to="/shop?category=Women" style={{ fontSize: '0.82rem', fontWeight: '800', color: '#f59e0b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            Explore Women's Store <ArrowRight size={15} />
                        </Link>
                    </div>

                    {/* Card 4: Store Quality & Trust Guarantee */}
                    <div style={{
                        background: 'rgba(15, 15, 18, 0.88)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderTop: '3px solid #38bdf8',
                        borderRadius: '20px',
                        padding: '1.35rem',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', letterSpacing: '-0.2px' }}>
                                    🛡️ Store Trust Guarantee
                                </h3>
                                <span style={{ fontSize: '0.7rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '2px 8px', borderRadius: '100px', fontWeight: '700' }}>Verified</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#18181c', padding: '0.55rem 0.75rem', borderRadius: '10px' }}>
                                    <Truck size={18} color="#38bdf8" />
                                    <div>
                                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'white' }}>Express Delivery</div>
                                        <div style={{ fontSize: '0.68rem', color: '#888' }}>2-3 Days Fast Shipping</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#18181c', padding: '0.55rem 0.75rem', borderRadius: '10px' }}>
                                    <ShieldCheck size={18} color="#10b981" />
                                    <div>
                                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'white' }}>100% Quality Inspected</div>
                                        <div style={{ fontSize: '0.68rem', color: '#888' }}>Verified Premium Goods</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#18181c', padding: '0.55rem 0.75rem', borderRadius: '10px' }}>
                                    <RefreshCw size={18} color="#f59e0b" />
                                    <div>
                                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'white' }}>Easy 30 Days Return</div>
                                        <div style={{ fontSize: '0.68rem', color: '#888' }}>Hassle-free Replacements</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link to="/shop" style={{ fontSize: '0.82rem', fontWeight: '800', color: '#38bdf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            Start Shopping Now <ArrowRight size={15} />
                        </Link>
                    </div>

                </div>
            </div>

        </section>
    );
}
