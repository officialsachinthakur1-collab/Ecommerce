import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
    const { toggleWishlist, isInWishlist } = useWishlist();

    return (
        <Link to={`/product/${product.id}`} style={{ display: 'block' }}>
            <motion.div
                whileHover={{ y: -10 }}
                style={{ position: 'relative', cursor: 'pointer' }}
            >
                {/* Image Placeholder */}
                <div style={{
                    height: '400px',
                    background: '#111',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    position: 'relative',
                    marginBottom: '1rem',
                    border: '1px solid #222'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        background: 'var(--primary-red)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                    }}>
                        {product.tag}
                    </div>
                    <div
                        onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(product);
                        }}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'rgba(0,0,0,0.5)',
                            padding: '0.5rem',
                            borderRadius: '50%',
                            zIndex: 2,
                            cursor: 'pointer'
                        }}
                    >
                        <Heart
                            size={18}
                            color={isInWishlist(product.id) ? 'var(--primary-red)' : 'white'}
                            fill={isInWishlist(product.id) ? 'var(--primary-red)' : 'transparent'}
                        />
                    </div>

                    {/* Red Glow on Hover (handled via CSS sibling usually, but inline here for simplicity) */}
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle at center, rgba(30,30,30,1) 0%, rgba(10,10,10,1) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#333',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                    }}>
                        PRODUCT {product.id}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>{product.name}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Men's Running</p>
                    </div>
                    <span style={{ fontWeight: '600', color: 'var(--primary-red)' }}>{product.price}</span>
                </div>
            </motion.div>
        </Link>
    );
};

export default ProductCard;
