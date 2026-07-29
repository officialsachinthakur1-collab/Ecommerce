import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '../../context/WishlistContext';
import useMobile from '../../hooks/useMobile';

const ProductCard = ({ product }) => {
    const isMobile = useMobile();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const spNum = parseFloat((product.price || '').replace(/[^0-9.]/g, '') || 0);
    const mrpNum = product.mrp ? parseFloat(product.mrp.replace(/[^0-9.]/g, '') || 0) : (spNum > 0 ? Math.round(spNum * 1.8) : 0);
    const discountPercent = mrpNum > spNum && spNum > 0 ? Math.round(((mrpNum - spNum) / mrpNum) * 100) : 0;

    const formattedSp = product.price?.startsWith('₹') ? product.price : `₹${product.price}`;

    return (
        <Link to={`/product/${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
            <motion.div
                whileHover={isMobile ? {} : { y: -8 }}
                style={{ position: 'relative', cursor: 'pointer' }}
            >
                {/* Product Image Container */}
                <div className="product-image-container" style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    position: 'relative',
                    marginBottom: '0.85rem',
                    border: '1px solid #222',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                    {/* Tag Badge */}
                    {product.tag && (
                        <div style={{
                            position: 'absolute',
                            top: '0.85rem',
                            left: '0.85rem',
                            background: product.tag.toLowerCase() === 'sale' ? '#ef4444' : 'var(--primary-red)',
                            color: 'white',
                            padding: '0.3rem 0.75rem',
                            fontSize: '0.7rem',
                            fontWeight: '800',
                            borderRadius: '8px',
                            textTransform: 'uppercase',
                            zIndex: 3,
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
                        }}>
                            {product.tag}
                        </div>
                    )}

                    {/* Low Stock Badge */}
                    {product.stock > 0 && product.stock < 5 && (
                        <motion.div
                            animate={{ opacity: [1, 0.6, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            style={{
                                position: 'absolute',
                                top: '2.8rem',
                                left: '0.85rem',
                                background: '#f59e0b',
                                color: 'black',
                                padding: '0.2rem 0.65rem',
                                fontSize: '0.65rem',
                                fontWeight: '900',
                                borderRadius: '8px',
                                textTransform: 'uppercase',
                                zIndex: 3
                            }}
                        >
                            Only {product.stock} Left
                        </motion.div>
                    )}

                    {/* Wishlist Icon */}
                    <div
                        onClick={(e) => {
                            e.preventDefault();
                            toggleWishlist(product);
                        }}
                        style={{
                            position: 'absolute',
                            top: '0.85rem',
                            right: '0.85rem',
                            background: 'rgba(0,0,0,0.6)',
                            padding: '0.5rem',
                            borderRadius: '50%',
                            zIndex: 4,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Heart
                            size={16}
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
                            transition: isMobile ? 'none' : 'transform 0.4s ease'
                        }}
                    />
                </div>

                {/* Product Meta & Amazon/Flipkart Professional Price Block */}
                <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.2rem', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.name}
                    </h3>
                    <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                        {product.brand || product.category || "GetSetMart"}
                    </div>

                    {/* Amazon / Flipkart Pricing Display */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffffff' }}>
                            {formattedSp}
                        </span>

                        {mrpNum > spNum && (
                            <span style={{ fontSize: '0.8rem', color: '#71717a', textDecoration: 'line-through' }}>
                                ₹{mrpNum.toLocaleString('en-IN')}
                            </span>
                        )}

                        {discountPercent > 0 && (
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                                {discountPercent}% OFF
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default ProductCard;
