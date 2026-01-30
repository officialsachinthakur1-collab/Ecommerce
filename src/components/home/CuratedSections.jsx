import { Link } from 'react-router-dom';
import ProductCard from '../common/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { motion } from 'framer-motion';

const CuratedSections = ({ title, tag, limit = 4 }) => {
    const { products: allProducts, loading } = useProducts();

    if (loading) return (
        <section className="container section-padding">
            <div style={{ height: '300px', background: '#0a0a0a', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #111' }}>
                <p style={{ color: '#333' }}>Curating {title}...</p>
            </div>
        </section>
    );

    const products = allProducts
        .filter(p => !tag || p.tag === tag)
        .slice(0, limit);

    if (products.length === 0) return null;

    return (
        <section className="container section-padding">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2.5rem' }}>
                <div>
                    <span style={{ color: 'var(--primary-red)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                        Handpicked
                    </span>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.02em', marginTop: '0.5rem' }}>
                        {title.split(' ')[0]} <span className="text-gradient">{title.split(' ').slice(1).join(' ')}</span>
                    </h2>
                </div>
                <Link to="/shop" className="hover-link" style={{ fontSize: '0.9rem', fontWeight: '700', color: '#666', borderBottom: '1px solid #333' }}>
                    EXPLORE ALL
                </Link>
            </div>

            <div className="grid-4">
                {products.map((product, idx) => (
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

export default CuratedSections;
