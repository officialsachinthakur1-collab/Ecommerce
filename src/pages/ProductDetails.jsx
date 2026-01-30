import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import RatingStars from '../components/common/RatingStars';
import { useAuth } from '../context/AuthContext';
import ReviewForm from '../components/product/ReviewForm';
import useMobile from '../hooks/useMobile';

export default function ProductDetails() {
    const isMobile = useMobile();
    const { id } = useParams();
    const [selectedSize, setSelectedSize] = useState(null);
    const [activeImage, setActiveImage] = useState("");
    const { addToCart } = useCart();
    const { products, loading, refetch } = useProducts();
    const { user } = useAuth();

    // Initialize active image when product is found
    useEffect(() => {
        if (!loading && products.length > 0) {
            const p = products.find(prod => String(prod.id) === String(id));
            if (p && !activeImage) {
                setActiveImage(p.image);
            }
        }
    }, [loading, products, id, activeImage]);

    if (loading) {
        return (
            <div style={{ paddingTop: 'var(--header-height)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Loading Product...
            </div>
        );
    }

    const product = products.find(p => String(p.id) === String(id));

    if (!product) {
        return (
            <div style={{ paddingTop: 'var(--header-height)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <h2>Product Not Found</h2>
                <Link to="/shop" className="btn-primary" style={{ marginTop: '1rem' }}>Back to Shop</Link>
            </div>
        );
    }

    return (
        <div className="product-page-wrapper">
            {/* Back Button - In Flow */}
            <div className="product-back-btn-container">
                <Link to="/shop" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-muted)',
                    transition: 'color 0.2s',
                    textDecoration: 'none'
                }}>
                    <ArrowLeft size={20} /> <span style={{ textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '1px' }}>Back to Shop</span>
                </Link>
            </div>

            <div className="product-main-grid">
                {/* Left: Product Image Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #181818 0%, #0a0a0a 100%)',
                        position: 'relative',
                        height: isMobile ? '350px' : '550px',
                        marginTop: '2rem',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #222'
                    }} className="product-image-container">

                        <motion.img
                            key={activeImage}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            src={activeImage || product.image}
                            alt={product.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                padding: isMobile ? '0.5rem' : '1.5rem'
                            }}
                        />
                    </div>

                    {/* Thumbnail Gallery */}
                    {product.images && product.images.length > 0 && (
                        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: '0.5rem 0', scrollbarWidth: 'none' }}>
                            {[product.image, ...product.images.filter(img => img !== product.image)].map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    style={{
                                        width: '70px',
                                        height: '70px',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        border: activeImage === img ? '2px solid var(--primary-red)' : '1px solid #333',
                                        background: '#111',
                                        cursor: 'pointer',
                                        padding: 0,
                                        flexShrink: 0,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <img src={img} alt={`view-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Product Info */}
                <div className="product-info-section" style={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <RatingStars rating={Number(product.rating) || 5} size={16} />
                                <a href="#review-form-section" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: '0.5rem', textDecoration: 'underline' }}>
                                    ({product.reviews?.length || 0} Reviews) - Write a Review
                                </a>
                            </div>

                            <h1 className="product-title" style={{ fontWeight: '800', lineHeight: 1, marginBottom: '0.5rem' }}>{product.name}</h1>
                            <p className="product-price" style={{ color: 'var(--primary-red)', fontWeight: '600', marginBottom: '2rem' }}>{product.price}</p>

                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '3rem' }}>
                                {product.description}
                            </p>

                            {/* Size Selector */}
                            {product.sizes && product.sizes.filter(s => s && s.trim() !== "").length > 0 && !(product.sizes.length === 1 && (product.sizes[0] === "One Size" || product.sizes[0] === "")) && (
                                <div style={{ marginBottom: '3rem' }}>
                                    <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '1px' }}>Select Size</h3>
                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                        {product.sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                style={{
                                                    minWidth: '50px',
                                                    height: '50px',
                                                    padding: '0 15px',
                                                    borderRadius: '8px',
                                                    border: selectedSize === size ? '2px solid var(--primary-red)' : '1px solid #333',
                                                    background: selectedSize === size ? 'rgba(255,0,0,0.1)' : 'transparent',
                                                    color: selectedSize === size ? 'var(--primary-red)' : 'var(--text-muted)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                                {product.affiliateLink ? (
                                    <a
                                        href={product.affiliateLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary"
                                        style={{
                                            flex: 1,
                                            padding: '1rem',
                                            textDecoration: 'none',
                                            textAlign: 'center',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        Buy Now <ExternalLink size={18} />
                                    </a>
                                ) : (
                                    <button
                                        className="btn-primary"
                                        disabled={product.stock <= 0}
                                        onClick={() => {
                                            const hasSizing = product.sizes && product.sizes.length > 0 && !(product.sizes.length === 1 && product.sizes[0] === "One Size");
                                            if (hasSizing && !selectedSize) {
                                                alert('Please select a size');
                                                return;
                                            }
                                            addToCart(product, selectedSize || "One Size");
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '1rem',
                                            fontSize: '1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.75rem',
                                            opacity: product.stock <= 0 ? 0.5 : 1,
                                            cursor: product.stock <= 0 ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {product.stock <= 0 ? (
                                            <>Out of Stock</>
                                        ) : (
                                            <>
                                                <ShoppingBag size={20} /> Add to Cart
                                            </>
                                        )}
                                    </button>
                                )}
                                <button style={{
                                    padding: '1rem',
                                    border: '1px solid #333',
                                    borderRadius: '9999px',
                                    background: 'transparent',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}>
                                    <Heart size={20} />
                                </button>
                            </div>

                            {/* Features */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '2rem', borderTop: '1px solid #222' }}>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <Truck className="text-muted" size={24} />
                                    <div>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Free Shipping</h4>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>On orders over $200</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <ShieldCheck className="text-muted" size={24} />
                                    <div>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Secure Checkout</h4>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>100% Protected</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Reviews Section Separator */}
            <div className="container" style={{ marginTop: '8rem' }}>
                <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #333, transparent)', marginBottom: '4rem' }}></div>
            </div>

            {/* Reviews Section */}
            <div className="container" style={{ paddingBottom: '6rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '4rem' }}>

                    {/* Review List */}
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2rem' }}>CUSTOMER REVIEWS</h2>
                        {(!product.reviews || product.reviews.length === 0) ? (
                            <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to share your experience!</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {product.reviews.map((rev, idx) => (
                                    <div key={idx} style={{ paddingBottom: '2rem', borderBottom: '1px solid #222' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                            <span style={{ fontWeight: '700', fontSize: '1rem' }}>{rev.userName}</span>
                                            <RatingStars rating={rev.rating} size={14} />
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>{rev.comment}</p>
                                        <span style={{ fontSize: '0.75rem', color: '#444', marginTop: '0.5rem', display: 'block' }}>
                                            {new Date(rev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Review Form */}
                    <div id="review-form-section" style={{ background: '#111', padding: '2.5rem', borderRadius: '24px', border: '1px solid #222', height: 'fit-content' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>SHARE YOUR THOUGHTS</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>How was your experience with this product?</p>

                        {!user ? (
                            <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed #333', borderRadius: '12px' }}>
                                <p style={{ color: '#888', marginBottom: '1rem' }}>Please log in to leave a review.</p>
                                <Link to="/login" className="btn-primary" style={{ display: 'inline-block' }}>Login Now</Link>
                            </div>
                        ) : (
                            <ReviewForm productId={product.id || product._id} refetch={refetch} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
