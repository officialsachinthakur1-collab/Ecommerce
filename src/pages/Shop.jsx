import { useState, useMemo } from 'react';
import ProductCard from '../components/common/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import useMobile from '../hooks/useMobile';
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react';

const Shop = () => {
    const isMobile = useMobile();
    const [searchParams, setSearchParams] = useSearchParams();
    const { products: allProducts, loading } = useProducts();

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
                    {category === 'All' ? 'Our Collection' : `${category} Style`}
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
                                    {['All', 'Men', 'Women', 'Unisex', 'Clothes', 'Accessories'].map(cat => (
                                        <li key={cat}>
                                            <button
                                                onClick={() => setSearchParams({ category: cat })}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: category === cat ? 'white' : '#666',
                                                    cursor: 'pointer',
                                                    fontSize: '1rem',
                                                    fontWeight: category === cat ? '600' : '400',
                                                    padding: 0,
                                                    transition: 'color 0.2s'
                                                }}
                                            >
                                                {cat === 'All' ? 'All Products' : cat}
                                            </button>
                                        </li>
                                    ))}
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

                    {/* Main Grid */}
                    <div style={{ flex: 1 }}>
                        {filteredProducts.length > 0 ? (
                            <div className="grid-3" style={{ gap: '2rem' }}>
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No products found</h3>
                                <p style={{ color: '#666' }}>Try adjusting your filters or search terms.</p>
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
                                {['All', 'Men', 'Women', 'Unisex', 'Clothes'].map(cat => (
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
