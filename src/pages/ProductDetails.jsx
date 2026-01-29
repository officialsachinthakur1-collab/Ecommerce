import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowLeft, Star, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import useMobile from '../hooks/useMobile';

const ProductDetails = () => {
    const isMobile = useMobile();
    const { id } = useParams();
    const [selectedSize, setSelectedSize] = useState(null);
    const { addToCart } = useCart();
    const { products, loading } = useProducts();

    if (loading) {
        return (
            <div style={{ paddingTop: 'var(--header-height)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Loading Product...
            </div>
        );
    }

    const product = products.find(p => p.id === parseInt(id));

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
                <div style={{
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
                    position: 'relative',
                    height: isMobile ? '50vh' : '80vh',
                    minHeight: '400px',
                    marginTop: '2rem',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #222'
                }} className="product-image-container">

                    <motion.img
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        src={product.image}
                        alt={product.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            padding: isMobile ? '1rem' : '3rem'
                        }}
                    />
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#fbbf24' }}>
                                {[...Array(Math.floor(Number(product.rating) || 5))].map((_, i) => (
                                    <Star key={i} fill="#fbbf24" size={16} />
                                ))}
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: '0.5rem' }}>({product.reviews} Reviews)</span>
                            </div>

                            <h1 className="product-title" style={{ fontWeight: '800', lineHeight: 1, marginBottom: '0.5rem' }}>{product.name}</h1>
                            <p className="product-price" style={{ color: 'var(--primary-red)', fontWeight: '600', marginBottom: '2rem' }}>{product.price}</p>

                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '3rem' }}>
                                {product.description}
                            </p>

                            {/* Size Selector - Only show if valid sizes are available */}
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

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                                <button
                                    className="btn-primary"
                                    onClick={() => {
                                        const hasSizing = product.sizes && product.sizes.length > 0 && !(product.sizes.length === 1 && product.sizes[0] === "One Size");
                                        if (hasSizing && !selectedSize) {
                                            alert('Please select a size');
                                            return;
                                        }
                                        addToCart(product, selectedSize || "One Size");
                                    }}
                                    style={{ flex: 1, padding: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                                >
                                    <ShoppingBag size={20} /> Add to Cart
                                </button>
                                <button style={{
                                    padding: '1rem',
                                    border: '1px solid #333',
                                    borderRadius: '9999px',
                                    background: 'transparent',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}>
                                    <Star size={20} />
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
        </div>
    );
};

export default ProductDetails;
