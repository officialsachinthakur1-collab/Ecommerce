import { useState, useMemo, useEffect } from 'react';
import ProductCard from '../components/common/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import useMobile from '../hooks/useMobile';
import { Search, SlidersHorizontal, ChevronDown, X, Sparkles, Bell, Star, Filter, RotateCcw } from 'lucide-react';

const Shop = () => {
    const isMobile = useMobile();
    const [searchParams, setSearchParams] = useSearchParams();
    const { products: allProducts, loading } = useProducts();

    // Category Availability Map from Admin
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

    const [notifyEmail, setNotifyEmail] = useState('');
    const [notified, setNotified] = useState(false);

    // Filters State
    const category = searchParams.get('category') || 'All';
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
    const [priceRange, setPriceRange] = useState(1000000);
    const [minRating, setMinRating] = useState(0);
    const [minDiscount, setMinDiscount] = useState(0);
    const [sortBy, setSortBy] = useState('Featured');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        const updateCategories = () => {
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
        window.addEventListener('gsm_categories_updated', updateCategories);
        return () => window.removeEventListener('gsm_categories_updated', updateCategories);
    }, []);

    const handleNotifyMe = (e) => {
        e.preventDefault();
        if (!notifyEmail || !notifyEmail.includes('@')) {
            alert('Please enter a valid email address!');
            return;
        }
        const savedSubs = localStorage.getItem('gsm_coming_soon_subscribers') || '[]';
        const parsedSubs = JSON.parse(savedSubs);
        parsedSubs.push({ email: notifyEmail, category, date: new Date().toISOString() });
        localStorage.setItem('gsm_coming_soon_subscribers', JSON.stringify(parsedSubs));
        setNotified(true);
        setNotifyEmail('');
    };

    // Derived filtering and sorting logic
    const filteredProducts = useMemo(() => {
        let result = allProducts.filter(p => {
            const rawCategory = (p.category || "").trim();
            const productCategory = rawCategory === 'Clothing' ? 'Clothes' : rawCategory;
            const matchesCategory = category === 'All' ? true : productCategory === category;

            const nameMatch = (p.name || "").toLowerCase().includes(searchQuery.toLowerCase());
            const descMatch = (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSearch = nameMatch || descMatch;

            const numericPrice = parseInt(String(p.price || "0").replace(/[^0-9]/g, '')) || 0;
            const matchesPrice = numericPrice <= priceRange;

            const rating = p.rating || 4.5;
            const matchesRating = rating >= minRating;

            // Discount filter
            let discountPct = 0;
            if (p.originalPrice && p.price) {
                const sp = parseInt(String(p.price).replace(/[^0-9]/g, '')) || 0;
                const mrp = parseInt(String(p.originalPrice).replace(/[^0-9]/g, '')) || 0;
                if (mrp > sp) {
                    discountPct = Math.round(((mrp - sp) / mrp) * 100);
                }
            }
            const matchesDiscount = discountPct >= minDiscount;

            return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesDiscount;
        });

        // Amazon & Flipkart Sorting Options
        if (sortBy === 'Price: Low to High') {
            result.sort((a, b) => {
                const priceA = parseInt(String(a.price || "0").replace(/[^0-9]/g, '')) || 0;
                const priceB = parseInt(String(b.price || "0").replace(/[^0-9]/g, '')) || 0;
                return priceA - priceB;
            });
        } else if (sortBy === 'Price: High to Low') {
            result.sort((a, b) => {
                const priceA = parseInt(String(a.price || "0").replace(/[^0-9]/g, '')) || 0;
                const priceB = parseInt(String(b.price || "0").replace(/[^0-9]/g, '')) || 0;
                return priceB - priceA;
            });
        } else if (sortBy === 'Customer Rating') {
            result.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
        } else if (sortBy === 'Newest Arrivals') {
            result.sort((a, b) => {
                const dateA = new Date(a.createdAt || 0).getTime();
                const dateB = new Date(b.createdAt || 0).getTime();
                if (dateA !== dateB) return dateB - dateA;
                return String(b.id || "").localeCompare(String(a.id || ""));
            });
        }

        return result;
    }, [allProducts, category, searchQuery, priceRange, minRating, minDiscount, sortBy]);

    const resetFilters = () => {
        setSearchQuery("");
        setPriceRange(1000000);
        setMinRating(0);
        setMinDiscount(0);
        setSortBy('Featured');
        setSearchParams({ category: 'All' });
    };

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', background: '#09090b' }}>
                <div className="loader">Loading Catalog...</div>
            </div>
        );
    }

    const categoriesList = [
        { id: 'All', name: 'All Products', icon: '🛍️' },
        { id: 'Men', name: "Men's Wear", icon: '👔' },
        { id: 'Women', name: "Women's Fashion", icon: '👗' },
        { id: 'Footwear', name: 'Footwear & Shoes', icon: '👟' },
        { id: 'Accessories', name: 'Accessories & Bags', icon: '🎒' },
        { id: 'Jewelry', name: 'Jewelry & Watches', icon: '💎' },
        { id: 'Electronics', name: 'Electronics & Audio', icon: '🎧' },
        { id: 'Home', name: 'Home & Kitchen', icon: '🏠' },
        { id: 'Gifts', name: 'Gifts & Combos', icon: '🎁' }
    ];

    return (
        <div style={{ background: '#09090b', color: 'white', minHeight: '100vh', paddingBottom: '4rem' }}>
            
            {/* Amazon / Flipkart Sub-Header Breadcrumb & Top Bar */}
            <div style={{ background: '#121215', borderBottom: '1px solid #222', padding: '0.75rem 1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    
                    {/* Left: Amazon Breadcrumbs & Results Count */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: '#a1a1aa', flexWrap: 'wrap' }}>
                        <Link to="/" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Home</Link>
                        <span>›</span>
                        <Link to="/shop" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Shop Store</Link>
                        {category !== 'All' && (
                            <>
                                <span>›</span>
                                <span style={{ color: 'white', fontWeight: '700' }}>{category}</span>
                            </>
                        )}
                        <span style={{ color: '#555' }}>|</span>
                        <span style={{ color: '#10b981', fontWeight: '700' }}>
                            Showing {filteredProducts.length} Results
                        </span>
                    </div>

                    {/* Right: Search Input & Amazon Style Sort Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
                        {/* Search Bar */}
                        <div style={{ position: 'relative', minWidth: isMobile ? '100%' : '260px' }}>
                            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                            <input
                                type="text"
                                placeholder="Search in Store..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.55rem 0.85rem 0.55rem 2.2rem',
                                    background: '#09090b',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '0.82rem',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.82rem', color: '#888', whiteSpace: 'nowrap' }}>Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    padding: '0.55rem 1rem',
                                    background: '#18181b',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '0.82rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                            >
                                <option value="Featured">Featured Offers</option>
                                <option value="Price: Low to High">Price: Low to High</option>
                                <option value="Price: High to Low">Price: High to Low</option>
                                <option value="Customer Rating">Customer Rating</option>
                                <option value="Newest Arrivals">Newest Arrivals</option>
                            </select>
                        </div>

                        {isMobile && (
                            <button
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                style={{
                                    width: '100%',
                                    padding: '0.65rem 1rem',
                                    background: '#18181b',
                                    border: '1px solid #333',
                                    color: 'white',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    fontSize: '0.85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <Filter size={16} /> Filters & Categories
                            </button>
                        )}
                    </div>

                </div>
            </div>

            {/* Flipkart / Amazon Style Quick Category Chips Bar */}
            <div style={{ maxWidth: '1400px', margin: '0 auto 1.5rem auto', padding: '0 1.5rem' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    overflowX: 'auto',
                    paddingBottom: '0.5rem',
                    scrollbarWidth: 'none'
                }}>
                    {categoriesList.map(cat => {
                        const isSelected = category === cat.id;
                        const isSoon = cat.id !== 'All' && categoryStatusMap[cat.id] === 'COMING_SOON';
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSearchParams({ category: cat.id })}
                                style={{
                                    padding: '0.5rem 1.1rem',
                                    borderRadius: '100px',
                                    background: isSelected ? 'var(--primary-red)' : isSoon ? 'rgba(245, 158, 11, 0.12)' : '#18181b',
                                    border: isSelected ? 'none' : isSoon ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid #27272a',
                                    color: isSelected ? 'white' : isSoon ? '#f59e0b' : '#a1a1aa',
                                    fontSize: '0.82rem',
                                    fontWeight: isSelected ? '800' : '600',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    transition: 'all 0.2s ease',
                                    boxShadow: isSelected ? '0 4px 12px rgba(239, 68, 68, 0.4)' : 'none'
                                }}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                                {isSoon && <span style={{ fontSize: '0.6rem', fontWeight: '900', color: '#f59e0b' }}>(Soon)</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Catalog Body: Left Amazon Sidebar + Right 4-Column Product Grid */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '260px 1fr', gap: '2.5rem', alignItems: 'start' }}>
                    
                    {/* AMAZON & FLIPKART STYLE LEFT SIDEBAR FILTERS */}
                    {(!isMobile || showMobileFilters) && (
                        <aside style={{
                            background: '#121215',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            border: '1px solid #222',
                            position: isMobile ? 'relative' : 'sticky',
                            top: '90px'
                        }}>
                            {/* Filter Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #27272a', paddingBottom: '0.75rem' }}>
                                <span style={{ fontWeight: '900', fontSize: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Filter size={18} color="var(--primary-red)" /> Filters
                                </span>
                                <button
                                    onClick={resetFilters}
                                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                >
                                    <RotateCcw size={12} /> Clear All
                                </button>
                            </div>

                            {/* Category Filter Accordion */}
                            <div style={{ marginBottom: '1.75rem' }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', color: '#a1a1aa', letterSpacing: '1px', marginBottom: '0.85rem' }}>
                                    Categories
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {categoriesList.map(cat => {
                                        const isSelected = category === cat.id;
                                        const isSoon = cat.id !== 'All' && categoryStatusMap[cat.id] === 'COMING_SOON';
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSearchParams({ category: cat.id })}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    width: '100%',
                                                    padding: '0.6rem 0.75rem',
                                                    borderRadius: '8px',
                                                    background: isSelected ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                                                    border: isSelected ? '1px solid rgba(239, 68, 68, 0.4)' : 'none',
                                                    color: isSelected ? '#ef4444' : isSoon ? '#71717a' : '#d4d4d8',
                                                    fontSize: '0.85rem',
                                                    fontWeight: isSelected ? '800' : '500',
                                                    cursor: 'pointer',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                <span>{cat.icon} {cat.name}</span>
                                                {isSoon && (
                                                    <span style={{ fontSize: '0.62rem', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                                                        Soon
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Price Range Slider */}
                            <div style={{ marginBottom: '1.75rem', borderTop: '1px solid #222', paddingTop: '1.25rem' }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', color: '#a1a1aa', letterSpacing: '1px', marginBottom: '0.85rem' }}>
                                    Price Range
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="5000"
                                    step="100"
                                    value={priceRange > 5000 ? 5000 : priceRange}
                                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--primary-red)', cursor: 'pointer' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.6rem', fontSize: '0.82rem', color: '#a1a1aa' }}>
                                    <span>₹0</span>
                                    <span style={{ fontWeight: '800', color: '#ef4444' }}>
                                        {priceRange >= 5000 ? 'All Prices' : `Up to ₹${priceRange.toLocaleString()}`}
                                    </span>
                                </div>
                                {/* Quick Price Preset Buttons */}
                                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                                    {[
                                        { label: 'Under ₹499', val: 499 },
                                        { label: 'Under ₹999', val: 999 },
                                        { label: 'Under ₹1,999', val: 1999 }
                                    ].map(p => (
                                        <button
                                            key={p.val}
                                            onClick={() => setPriceRange(p.val)}
                                            style={{
                                                fontSize: '0.72rem',
                                                padding: '0.3rem 0.6rem',
                                                borderRadius: '6px',
                                                background: priceRange === p.val ? 'rgba(239, 68, 68, 0.2)' : '#18181b',
                                                border: priceRange === p.val ? '1px solid #ef4444' : '1px solid #27272a',
                                                color: priceRange === p.val ? '#ef4444' : '#a1a1aa',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Customer Ratings Filter */}
                            <div style={{ marginBottom: '1.75rem', borderTop: '1px solid #222', paddingTop: '1.25rem' }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', color: '#a1a1aa', letterSpacing: '1px', marginBottom: '0.85rem' }}>
                                    Customer Rating
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    {[4, 3].map(stars => (
                                        <button
                                            key={stars}
                                            onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                background: minRating === stars ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                                                border: minRating === stars ? '1px solid #f59e0b' : 'none',
                                                color: minRating === stars ? '#f59e0b' : '#d4d4d8',
                                                padding: '0.4rem 0.6rem',
                                                borderRadius: '6px',
                                                fontSize: '0.82rem',
                                                cursor: 'pointer',
                                                textAlign: 'left'
                                            }}
                                        >
                                            <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center' }}>
                                                {'★'.repeat(stars)}
                                                {'☆'.repeat(5 - stars)}
                                            </span>
                                            <span>& Above</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Discount Filter */}
                            <div style={{ borderTop: '1px solid #222', paddingTop: '1.25rem' }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', color: '#a1a1aa', letterSpacing: '1px', marginBottom: '0.85rem' }}>
                                    Discount
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    {[
                                        { label: '50% or more', val: 50 },
                                        { label: '30% or more', val: 30 },
                                        { label: '10% or more', val: 10 }
                                    ].map(d => (
                                        <button
                                            key={d.val}
                                            onClick={() => setMinDiscount(minDiscount === d.val ? 0 : d.val)}
                                            style={{
                                                background: minDiscount === d.val ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                                                border: minDiscount === d.val ? '1px solid #10b981' : 'none',
                                                color: minDiscount === d.val ? '#10b981' : '#d4d4d8',
                                                padding: '0.4rem 0.6rem',
                                                borderRadius: '6px',
                                                fontSize: '0.82rem',
                                                cursor: 'pointer',
                                                textAlign: 'left'
                                            }}
                                        >
                                            {d.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </aside>
                    )}

                    {/* MAIN PRODUCT CATALOG GRID (Amazon 4-Column Layout) */}
                    <div>
                        {(category !== 'All' && categoryStatusMap[category] === 'COMING_SOON') ? (
                            /* Amazon / Flipkart VIP Coming Soon Launch Card */
                            <div style={{
                                background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
                                borderRadius: '24px',
                                border: '1px solid #27272a',
                                padding: isMobile ? '3rem 1.5rem' : '4rem 3rem',
                                textAlign: 'center',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
                            }}>
                                <div style={{
                                    display: 'inline-flex',
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '100px',
                                    background: 'rgba(245, 158, 11, 0.15)',
                                    border: '1px solid rgba(245, 158, 11, 0.4)',
                                    color: '#f59e0b',
                                    fontSize: '0.85rem',
                                    fontWeight: '800',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    marginBottom: '1.25rem',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <Sparkles size={16} /> 🚀 COMING SOON COLLECTION
                                </div>

                                <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.4rem', fontWeight: '900', color: '#ffffff', marginBottom: '1rem' }}>
                                    {category} Launching Soon!
                                </h2>

                                <p style={{ color: '#a1a1aa', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
                                    We're hand-picking & stocking premium high-quality items for our <strong>{category}</strong> collection. Get ready for exclusive launch discounts!
                                </p>

                                {/* Interactive Notify Me Form */}
                                <div style={{ maxWidth: '440px', margin: '0 auto 2.5rem auto' }}>
                                    <form onSubmit={handleNotifyMe} style={{ display: 'flex', gap: '0.5rem', flexDirection: isMobile ? 'column' : 'row' }}>
                                        <input
                                            type="email"
                                            placeholder="Enter your email to get VIP early access"
                                            value={notifyEmail}
                                            onChange={(e) => setNotifyEmail(e.target.value)}
                                            style={{
                                                flex: 1,
                                                padding: '0.9rem 1.2rem',
                                                borderRadius: '10px',
                                                background: '#09090b',
                                                border: '1px solid #333',
                                                color: 'white',
                                                fontSize: '0.9rem'
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            style={{
                                                padding: '0.9rem 1.5rem',
                                                borderRadius: '10px',
                                                background: 'var(--primary-red)',
                                                border: 'none',
                                                color: 'white',
                                                fontWeight: '800',
                                                fontSize: '0.9rem',
                                                cursor: 'pointer',
                                                whiteSpace: 'nowrap',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.4rem'
                                            }}
                                        >
                                            <Bell size={16} /> Notify Me
                                        </button>
                                    </form>
                                    {notified && (
                                        <div style={{ marginTop: '0.75rem', color: '#10b981', fontSize: '0.85rem', fontWeight: '700' }}>
                                            ✓ You're on the VIP launch list! We'll notify you first.
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setSearchParams({ category: 'All' })}
                                    style={{
                                        padding: '0.85rem 2rem',
                                        borderRadius: '10px',
                                        background: '#18181b',
                                        border: '1px solid #444',
                                        color: 'white',
                                        fontWeight: '700',
                                        fontSize: '0.95rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    🛍️ Explore Available Live Products
                                </button>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            /* Amazon 3/4-Column Responsive Grid */
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(250px, 1fr))',
                                gap: '1.5rem'
                            }}>
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            /* No Matching Products State */
                            <div style={{ textAlign: 'center', padding: '5rem 1rem', background: '#121215', borderRadius: '16px', border: '1px solid #222' }}>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', fontWeight: '800' }}>No matching products found</h3>
                                <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Try clearing filters or searching for another item.</p>
                                <button
                                    onClick={resetFilters}
                                    style={{ padding: '0.75rem 2rem', background: 'var(--primary-red)', border: 'none', color: 'white', fontWeight: '800', borderRadius: '8px', cursor: 'pointer' }}
                                >
                                    Reset All Filters
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {showMobileFilters && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 2000, padding: '2rem' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Filters</h2>
                            <button onClick={() => setShowMobileFilters(false)} style={{ background: 'transparent', border: 'none', color: 'white' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ marginBottom: '3rem' }}>
                            <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '1.5rem', color: '#666' }}>Categories</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {['All', 'Men', 'Women', 'Unisex', 'Chocolates', 'Food', 'Gifts', 'Accessories'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            setSearchParams({ category: cat });
                                            setShowMobileFilters(false);
                                        }}
                                        style={{
                                            padding: '0.5rem 1.25rem',
                                            borderRadius: '999px',
                                            border: '1px solid #333',
                                            background: category === cat ? 'var(--primary-red)' : 'transparent',
                                            color: 'white',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '1.5rem', color: '#666' }}>Price Up To</h3>
                            <input
                                type="range" min="0" max="1000000" step="10000" value={priceRange}
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--primary-red)' }}
                            />
                            <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '1.25rem', fontWeight: '800' }}>
                                ₹{priceRange.toLocaleString()}
                            </div>
                        </div>

                        <button
                            onClick={() => setShowMobileFilters(false)}
                            style={{ width: '100%', marginTop: '4rem', padding: '1rem', background: 'var(--primary-red)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '800' }}
                        >
                            Apply Filters
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Shop;
