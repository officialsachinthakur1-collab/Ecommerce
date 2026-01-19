import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/common/ProductCard';

const Wishlist = () => {
    const { wishlist } = useWishlist();

    return (
        <div style={{
            paddingTop: 'var(--header-height)',
            minHeight: '100vh',
            background: 'var(--bg-color)',
            color: 'var(--text-color)',
            paddingBottom: '4rem'
        }}>
            <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        fontSize: '4rem',
                        fontWeight: 800,
                        marginBottom: '1rem',
                        background: 'linear-gradient(to right, #fff, #666)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textTransform: 'uppercase'
                    }}
                >
                    WISHLIST <span style={{ fontSize: '1.5rem', verticalAlign: 'middle', color: '#666', WebkitTextFillColor: 'initial' }}>({wishlist.length})</span>
                </motion.h1>

                {wishlist.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4rem' }}
                    >
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.5rem', marginBottom: '2rem' }}>
                            Your collection is empty.
                        </p>
                        <Link to="/shop" className="btn-primary" style={{ padding: '1rem 3rem' }}>
                            Browse Shop
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid-3" style={{ marginTop: '4rem', textAlign: 'left' }}>
                        {wishlist.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
