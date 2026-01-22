import ProductCard from '../components/common/ProductCard';
import { motion } from 'framer-motion';

import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';

const Shop = () => {
    const [searchParams] = useSearchParams();
    const { products: allProducts, loading } = useProducts();
    const category = searchParams.get('category');
    const searchQuery = searchParams.get('search');

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                Loading Collection...
            </div>
        );
    }

    // Filter products
    const filteredProducts = allProducts.filter(p => {
        const matchesCategory = category ? (p.category === category || category === 'All') : true;
        const matchesSearch = searchQuery
            ? (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase()))
            : true;
        return matchesCategory && matchesSearch;
    });

    return (
        <div style={{ paddingTop: 'var(--header-height)' }}>
            {/* Page Header */}
            <section className="shop-header" style={{
                padding: '6rem 2rem',
                textAlign: 'center',
                background: 'linear-gradient(to bottom, #111, var(--bg-color))',
                borderBottom: '1px solid #222'
            }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        marginBottom: '1rem'
                    }}
                >
                    {searchQuery ? `Search: "${searchQuery}"` : (category ? `${category} Collection` : 'All Products')}
                </motion.h1>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    Explore our latest collection of performance-engineered footwear. Designed for the undefined.
                </p>
            </section>

            {/* Main Container */}
            <div className="container shop-container">
                {/* Sidebar (Filters) */}
                <aside className="shop-sidebar">
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Category</h3>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)' }}>
                            <li><Link to="/shop" style={{ color: !category ? 'white' : 'inherit' }}>All Products</Link></li>
                            <li><Link to="/shop?category=Men" style={{ color: category === 'Men' ? 'white' : 'inherit' }}>Men's Collection</Link></li>
                            <li><Link to="/shop?category=Women" style={{ color: category === 'Women' ? 'white' : 'inherit' }}>Women's Collection</Link></li>
                            <li><Link to="/shop?category=Unisex" style={{ color: category === 'Unisex' ? 'white' : 'inherit' }}>Unisex</Link></li>
                        </ul>
                    </div>
                </aside>

                {/* Main Grid */}
                <div style={{ flex: 1 }}>
                    <div className="grid-3">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
