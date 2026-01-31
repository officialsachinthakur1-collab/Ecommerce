import { motion } from 'framer-motion';
import ProductCard from '../common/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import useMobile from '../../hooks/useMobile';

const RelatedProducts = ({ currentProduct }) => {
    const isMobile = useMobile();
    const { products: allProducts, loading } = useProducts();

    if (loading) return null;

    // Filter related products by category, excluding the current product
    const related = allProducts
        .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
        .slice(0, 4);

    // If no related products in the same category, show some best sellers or others
    const fallback = related.length === 0
        ? allProducts.filter(p => p.id !== currentProduct.id).slice(0, 4)
        : related;

    if (fallback.length === 0) return null;

    return (
        <section className="container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'end',
                marginBottom: '2rem'
            }}>
                <div>
                    <span style={{
                        color: 'var(--primary-red)',
                        fontSize: '0.8rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em'
                    }}>
                        Recommended
                    </span>
                    <h2 style={{
                        fontSize: isMobile ? '1.5rem' : '2.2rem',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em',
                        marginTop: '0.5rem'
                    }}>
                        You Might <span className="text-gradient">Also Like</span>
                    </h2>
                </div>
            </div>

            <div className="grid-4" style={{ gap: isMobile ? '1rem' : '1.5rem' }}>
                {fallback.map((product, idx) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default RelatedProducts;
