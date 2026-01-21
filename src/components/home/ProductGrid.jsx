import { Link } from 'react-router-dom';
import ProductCard from '../common/ProductCard';
import { useProducts } from '../../hooks/useProducts';

const ProductGrid = () => {
    const { products: allProducts, loading } = useProducts();

    if (loading) return null; // Or a skeleton loader

    const products = allProducts.filter(p => ["Popular", "New", "Exclusive", "Bestseller", "Trending", "Hot"].includes(p.tag)).slice(0, 3);
    return (
        <section className="container section-padding">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 className="section-header-title" style={{ fontSize: '2rem', fontWeight: '800', textTransform: 'uppercase' }}>Most Popular</h2>
                <Link to="/shop" style={{ textDecoration: 'underline', color: 'var(--text-muted)' }}>View All</Link>
            </div>

            <div className="grid-3 home-product-grid">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default ProductGrid;
