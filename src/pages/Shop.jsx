import { useState, useMemo, useEffect } from 'react';
import ProductCard from '../components/common/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import useMobile from '../hooks/useMobile';
import { Search, SlidersHorizontal, ChevronDown, X, Sparkles, Bell } from 'lucide-react';

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

    // States for filtering
    const category = searchParams.get('category') || 'All';
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
    const [priceRange, setPriceRange] = useState(1000000); // Massive default to show all affiliate items
    const [sortBy, setSortBy] = useState('Newest');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Derived filtering and sorting logic
    const filteredProducts = useMemo(() => {
        let result = allProducts.filter(p => {
            // Trim and fix category name mismatch
            const rawCategory = (p.category || "").trim();
            const productCategory = rawCategory === 'Clothing' ? 'Clothes' : rawCategory;
            const matchesCategory = category === 'All' ? true : productCategory === category;

            // Robust checks for name and description
            const nameMatch = (p.name || "").toLowerCase().includes(searchQuery.toLowerCase());
            const descMatch = (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSearch = nameMatch || descMatch;

            // Extract numeric price for comparison
            const numericPrice = parseInt(String(p.price || "0").replace(/[^0-9]/g, '')) || 0;
            const matchesPrice = numericPrice <= priceRange;

            return matchesCategory && matchesSearch && matchesPrice;
        });

        // Robust Sorting
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
        } else {
            // "Newest" - Sort by createdAt (Date) or fall back to ID string comparison
            result.sort((a, b) => {
                const dateA = new Date(a.createdAt || 0).getTime();
                const dateB = new Date(b.createdAt || 0).getTime();
                if (dateA !== dateB) return dateB - dateA;
                return String(b.id || "").localeCompare(String(a.id || ""));
            });
        }

        return result;
    }, [allProducts, category, searchQuery, priceRange, sortBy]);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <div className="loader">Loading Collection...</div>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: 'var(--header-height)' }}>
            {/* Page Header */}
            <section className="shop-header" style={{
                textAlign: 'center',
                background: 'linear-gradient(to bottom, #111, var(--bg-color))',
                borderBottom: '1px solid #222',
                padding: isMobile ? '3rem 1rem' : '4rem 2rem'
            }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        fontSize: 'clamp(2rem, 5vw, 4rem)',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        marginBottom: '1rem'
                    }}
                >
                    {category === 'All' ? 'Our Catalog' : `${category} Style`}
                </motion.h1>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
                    Engineered for performance, tailored for the street.
                </p>
            </section>

            {/* Main Discovery Area */}
            <div className="container" style={{ marginTop: '2rem' }}>
                {/* Search & Utility Bar */}
                <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: '1rem',
                    marginBottom: '2rem',
                    alignItems: isMobile ? 'stretch' : 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: isMobile ? 'none' : '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem 0.875rem 3rem',
                                background: '#111',
                                border: '1px solid #222',
                                borderRadius: '12px',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{
                                padding: '0.875rem 1.5rem',
                                background: '#111',
                                border: '1px solid #222',
                                borderRadius: '12px',
                                color: 'white',
                                cursor: 'pointer',
                                outline: 'none'
                            }}
                        >
                            <option>Newest</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>

                        {isMobile && (
                            <button
                                onClick={() => setShowMobileFilters(true)}
                                style={{
                                    padding: '0.875rem',
                                    background: 'var(--primary-red)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <SlidersHorizontal size={20} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="shop-container" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '280px 1fr', gap: '3rem' }}>
                    {/* Sidebar Filters - Desktop Only */}
                    {!isMobile && (
                        <aside>
                            <div style={{ marginBottom: '3rem' }}>
                                <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Category</h3>
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none' }}>
                                    {['All', 'Men', 'Women', 'Footwear', 'Accessories', 'Jewelry', 'Electronics', 'Home', 'Gifts'].map(cat => {
                                        const isCatSoon = cat !== 'All' && categoryStatusMap[cat] === 'COMING_SOON';
                                        return (
                                            <li key={cat}>
                                                <button
                                                    onClick={() => setSearchParams({ category: cat })}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: category === cat ? 'white' : isCatSoon ? '#888' : '#aaa',
                                                        cursor: 'pointer',
                                                        fontSize: '0.95rem',
                                                        fontWeight: category === cat ? '700' : '400',
                                                        padding: 0,
                                                        transition: 'color 0.2s',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}
                                                >
                                                    <span>{cat === 'All' ? 'All Products' : cat}</span>
                                                    {isCatSoon && (
                                                        <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.4)', fontWeight: '800' }}>
                                                            Soon
                                                        </span>
                                                    )}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Price Range</h3>
                                <div style={{ padding: '0 0.5rem' }}>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000000"
                                        step="10000"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                        style={{ width: '100%', accentColor: 'var(--primary-red)', cursor: 'pointer' }}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'white', fontSize: '0.9rem' }}>
                                        <span>₹0</span>
                                        <span style={{ fontWeight: 'bold', color: 'var(--primary-red)' }}>Up to ₹{priceRange.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    )}

                    {/* Main Grid or Coming Soon Hero Section */}
                    <div style={{ flex: 1 }}>
                        {(category !== 'All' && categoryStatusMap[category] === 'COMING_SOON') || (filteredProducts.length === 0 && !searchQuery) ? (
                            /* Amazon/Flipkart Style VIP "Coming Soon" Launch Banner */
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
                                    {category === 'All' ? 'New Collection' : category} Launching Soon!
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

                                {/* Back to All Live Products */}
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
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    🛍️ Explore Available Live Products
                                </button>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid-3" style={{ gap: '2rem' }}>
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No products found</h3>
                                <p style={{ color: '#666' }}>Try adjusting your search terms or filters.</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setPriceRange(1000000);
                                        setSearchParams({ category: 'All' });
                                    }}
                                    style={{ marginTop: '2rem', padding: '0.75rem 2rem', background: 'transparent', border: '1px solid #333', color: 'white', borderRadius: '8px', cursor: 'pointer' }}
                                >
                                    Clear All Filters
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
