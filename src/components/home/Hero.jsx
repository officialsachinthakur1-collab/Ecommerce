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

    // Category Availability & Coming Soon Map
    const [categoryStatusMap, setCategoryStatusMap] = useState(() => {
        const saved = localStorage.getItem('gsm_category_status');
        if (!saved) return {};
        try {
            const parsed = JSON.parse(saved);
            const map = {};
            parsed.forEach(item => {
                map[item.id] = item.status;
                map[item.name] = item.status;
            });
            return map;
        } catch (e) {
            return {};
        }
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

        const handleCategoryUpdate = () => {
            const saved = localStorage.getItem('gsm_category_status');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    const map = {};
                    parsed.forEach(item => {
                        map[item.id] = item.status;
                        map[item.name] = item.status;
                    });
                    setCategoryStatusMap(map);
                } catch (e) {}
            }
        };

        window.addEventListener('gsm_festival_updated', handleFestivalUpdate);
        window.addEventListener('gsm_categories_updated', handleCategoryUpdate);
        return () => {
            window.removeEventListener('gsm_festival_updated', handleFestivalUpdate);
            window.removeEventListener('gsm_categories_updated', handleCategoryUpdate);
        };
    }, []);

    // Category Teaser Photos
    const getCategoryTeaserImage = (catName) => {
        const images = {
            'Jewelry': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
            'Electronics': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
            'Home': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
            'Gifts': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
            'Footwear': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
            'Women': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
            'Men': 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
        };
        return images[catName] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80';
    };

    // Construct Amazon Hero Slides
    const heroSlides = useMemo(() => {
        const baseSlides = [
            {
                id: 'festive-slide',
                tag: festivalConfig.badgeText || '🔥 SPECIAL OFFER',
                title: festivalConfig.bannerTitle || 'BIG FASHION FESTIVAL',
                description: festivalConfig.subTitle || 'Discover premium apparel, footwear & accessories at unmatched prices.',
                image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
                btnText: `SHOP ${festivalConfig.festivalName || 'SALE'} — ${festivalConfig.discountTag || 'UP TO 70% OFF'}`,
                btnLink: '/shop',
                bgGradient: festivalConfig.bgColor || '#7f1d1d'
            }
        ];

        // Add user hero products if available
        const customHeroProducts = products.filter(p => p.isHero).map(p => ({
            id: p.id || p._id,
            tag: p.tag || '✨ FEATURED PRODUCT',
            title: p.heroTitle || p.name,
            description: p.description || 'Exclusive premium quality item ready for express dispatch.',
            image: p.image,
            btnText: `SHOP NOW — ${p.price}`,
            btnLink: `/product/${p.id || p._id}`,
            bgGradient: '#18181b'
        }));

        // Dynamic "Coming Soon" Hero Slides for categories marked COMING_SOON
        const comingSoonSlides = Object.keys(categoryStatusMap)
            .filter(catName => catName !== 'All' && categoryStatusMap[catName] === 'COMING_SOON')
            .map(catName => ({
                id: `coming-soon-${catName}`,
                tag: '🚀 COMING SOON LAUNCH',
                title: `${catName.toUpperCase()} COLLECTION LAUNCHING SOON`,
                description: `WE ARE HAND-PICKING PREMIUM HIGH-QUALITY ITEMS FOR OUR ${catName.toUpperCase()} STORE. GET READY FOR EXCLUSIVE EARLY ACCESS DISCOUNTS!`,
                image: getCategoryTeaserImage(catName),
                btnText: 'GET VIP EARLY ACCESS ➔',
                btnLink: `/shop?category=${catName}`,
                bgGradient: '#311b92'
            }));

        const combined = [...customHeroProducts, ...comingSoonSlides];
        return combined.length > 0 ? combined : baseSlides;
    }, [festivalConfig, products, categoryStatusMap]);

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
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            }}>
                                <Sparkles size={14} color="#f59e0b" /> {activeSlide.tag}
                            </span>

                            <h1 style={{
                                fontSize: isMobile ? '2.2rem' : '3.4rem',
                                fontWeight: '900',
                                color: 'white',
                                lineHeight: '1.1',
                                marginBottom: '1rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                textShadow: '0 4px 20px rgba(0,0,0,0.5)'
                            }}>
                                {activeSlide.title}
                            </h1>

                            <p style={{
                                fontSize: isMobile ? '0.9rem' : '1.15rem',
                                color: 'rgba(255,255,255,0.85)',
                                marginBottom: '1.75rem',
                                maxWidth: '560px',
                                lineHeight: '1.5',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
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
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
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
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        backdropFilter: 'blur(6px)'
                                    }}
                                >
                                    EXPLORE STORE CATALOGUE ➔
                                </Link>
                            </div>
                        </div>

                        {/* Right Banner Image (Padded Contain View to Show Full Image) */}
                        {!isMobile && (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{
                                    position: 'relative',
                                    width: '360px',
                                    height: '360px',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    border: '2px solid rgba(255,255,255,0.15)',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                                    background: 'linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '16px'
                                }}>
                                    <img
                                        src={activeSlide.image}
                                        alt={activeSlide.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '0.75rem',
                                        left: '0.75rem',
                                        right: '0.75rem',
                                        background: 'rgba(0,0,0,0.85)',
                                        backdropFilter: 'blur(8px)',
                                        padding: '0.65rem 0.85rem',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.65rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>FESTIVAL SPECIAL</div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#10b981', textTransform: 'uppercase' }}>{festivalConfig.discountTag || 'UP TO 70% OFF'}</div>
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

            {/* Sleek Myntra / Zara Style Circular Category Stories Bar */}
            <div style={{
                width: '100%',
                background: '#0c0c0e',
                borderTop: '1px solid #1f1f23',
                borderBottom: '1px solid #1f1f23',
                padding: '1.25rem 0',
                marginTop: '0'
            }}>
                <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isMobile ? 'flex-start' : 'space-between',
                        width: '100%',
                        gap: isMobile ? '1.25rem' : '0.5rem',
                        overflowX: 'auto',
                        paddingBottom: '0.4rem',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}>
                        {[
                            { label: 'Hot Deals', tag: 'Hot Deal', icon: '🔥', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=300&q=80', gradient: 'linear-gradient(45deg, #ef4444, #f59e0b)' },
                            { label: "Men's Wear", category: 'Men', icon: '👔', img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=300&q=80', gradient: 'linear-gradient(45deg, #3b82f6, #06b6d4)' },
                            { label: "Women's", category: 'Women', icon: '👗', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80', gradient: 'linear-gradient(45deg, #ec4899, #8b5cf6)' },
                            { label: 'Footwear', category: 'Footwear', icon: '👟', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80', gradient: 'linear-gradient(45deg, #10b981, #3b82f6)' },
                            { label: 'Bestsellers', tag: 'Bestseller', icon: '👑', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=300&q=80', gradient: 'linear-gradient(45deg, #f59e0b, #ef4444)' },
                            { label: 'New Arrivals', tag: 'New', icon: '✨', img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80', gradient: 'linear-gradient(45deg, #a855f7, #ec4899)' },
                            { label: 'Accessories', category: 'Accessories', icon: '🎒', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80', gradient: 'linear-gradient(45deg, #06b6d4, #10b981)' },
                            { label: 'Jewelry', category: 'Jewelry', icon: '💎', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80', gradient: 'linear-gradient(45deg, #eab308, #f97316)' },
                        ].map((story, i) => {
                            const targetLink = story.category ? `/shop?category=${story.category}` : `/shop?tag=${story.tag}`;
                            const isComingSoon = story.category && categoryStatusMap[story.category] === 'COMING_SOON';

                            return (
                                <Link
                                    key={i}
                                    to={targetLink}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        textDecoration: 'none',
                                        minWidth: isMobile ? '72px' : '85px',
                                        flexShrink: 0
                                    }}
                                >
                                    {/* Glowing Story Ring */}
                                    <div style={{
                                        padding: '3px',
                                        background: isComingSoon ? 'linear-gradient(45deg, #71717a, #3f3f46)' : story.gradient,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                                        transition: 'transform 0.3s ease',
                                        opacity: isComingSoon ? 0.85 : 1
                                    }}>
                                        <div style={{
                                            width: isMobile ? '64px' : '78px',
                                            height: isMobile ? '64px' : '78px',
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            border: '2px solid #0c0c0e',
                                            background: '#1c1c22',
                                            position: 'relative'
                                        }}>
                                            <img
                                                src={story.img}
                                                alt={story.label}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isComingSoon ? 'grayscale(40%)' : 'none' }}
                                            />
                                            <span style={{
                                                position: 'absolute',
                                                bottom: '2px',
                                                right: '2px',
                                                background: 'rgba(0,0,0,0.75)',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.65rem'
                                            }}>
                                                {story.icon}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Category Title & Coming Soon Pill Below */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem' }}>
                                        <span style={{
                                            fontSize: isMobile ? '0.75rem' : '0.82rem',
                                            fontWeight: '700',
                                            color: isComingSoon ? '#a1a1aa' : '#e4e4e7',
                                            textAlign: 'center',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {story.label}
                                        </span>
                                        {isComingSoon && (
                                            <span style={{
                                                fontSize: '0.62rem',
                                                fontWeight: '800',
                                                color: '#f59e0b',
                                                background: 'rgba(245, 158, 11, 0.15)',
                                                border: '1px solid rgba(245, 158, 11, 0.4)',
                                                padding: '1px 6px',
                                                borderRadius: '100px',
                                                whiteSpace: 'nowrap',
                                                marginTop: '1px'
                                            }}>
                                                Coming Soon
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

        </section>
    );
}
