import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '../../context/WishlistContext';

import useMobile from '../../hooks/useMobile';

const ProductCard = ({ product }) => {
    const isMobile = useMobile();
    const { toggleWishlist, isInWishlist } = useWishlist();

    return (
        <Link to={`/product/${product.id}`} style={{ display: 'block' }}>
            <motion.div
                whileHover={isMobile ? {} : { y: -10 }}
                style={{ position: 'relative', cursor: 'pointer' }}
            >
                {/* Image Placeholder */}
                <div className="product-image-container" style={{
                    background: '#fff',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    position: 'relative',
                    marginBottom: '1rem',
                    border: '1px solid #333'
                }}>
                    {product.tag && (
                        <div style={{
                            position: 'absolute',
                            top: '1rem',
                            left: '1rem',
                            background: product.tag.toLowerCase() === 'sale' ? '#ff4444' : 'var(--primary-red)',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            borderRadius: '12px',
                            textTransform: 'uppercase',
                            zIndex: 3
                        }}>
                            {product.tag}
                        </div>
                    )}

                    {product.stock > 0 && product.stock < 5 && (
                        <motion.div
                            animate={{ opacity: [1, 0.5, 1], scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{
                                position: 'absolute',
                                top: '3rem',
                                left: '1rem',
                                background: '#f59e0b',
                                color: 'black',
                                padding: '0.25rem 0.75rem',
                                fontSize: '0.65rem',
                                fontWeight: '900',
                                borderRadius: '12px',
                                textTransform: 'uppercase',
                                zIndex: 3,
                                boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
                            }}
                        >
                            Low Stock
                        </motion.div>
                    )}
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
                            color={isInWishlist(product._id || product.id) ? 'var(--primary-red)' : 'white'}
                            fill={isInWishlist(product._id || product.id) ? 'var(--primary-red)' : 'transparent'}
                        />
                    </div>

                    {/* Product Image */}
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            padding: '1rem',
                            transition: isMobile ? 'none' : 'transform 0.5s ease'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>{product.name}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{product.category || "Lifestyle"}</p>
                    </div>
                    <span style={{ fontWeight: '600', color: 'var(--primary-red)' }}>{product.price}</span>
                </div>
            </motion.div>
        </Link>
    );
};

export default ProductCard;
