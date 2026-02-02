import { Link, useParams, useLocation } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    ArrowLeft, ShoppingBag, Truck, ShieldCheck, Heart,
    ExternalLink, RotateCcw, ChevronRight, Minus, Plus,
    Info, Star, Package, Clock
} from 'lucide-react';
import RatingStars from '../components/common/RatingStars';
import { useAuth } from '../context/AuthContext';
import ReviewForm from '../components/product/ReviewForm';
import useMobile from '../hooks/useMobile';
import RelatedProducts from '../components/product/RelatedProducts';

export default function ProductDetails() {
    const isMobile = useMobile();
    const { id } = useParams();
    const location = useLocation();
    const isPreview = new URLSearchParams(location.search).get('preview') === 'true';

    const [selectedSize, setSelectedSize] = useState(null);
    const [activeImage, setActiveImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    const { addToCart } = useCart();
    const { products, loading, refetch } = useProducts();
    const { user } = useAuth();

    // Delivery Date Calculation
    const getDeliveryDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 4);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

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

    if (isPreview) {
        return (
            <div className="product-page-wrapper preview-mode" style={{ background: '#050505', color: 'white', minHeight: '100vh', paddingTop: '2rem' }}>
                {/* Breadcrumbs */}
                <div className="container">
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: '#888', marginBottom: '2rem' }}>
                        <Link to="/" style={{ color: '#888' }}>Home</Link>
                        <ChevronRight size={12} />
                        <Link to="/shop" style={{ color: '#888' }}>Shop</Link>
                        <ChevronRight size={12} />
                        <span style={{ color: 'var(--primary-red)', fontWeight: '600' }}>{product.name}</span>
                    </nav>
                </div>

                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 0.8fr', gap: isMobile ? '2rem' : '4rem', alignItems: 'start' }}>
                        {/* IMAGES */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ background: '#fff', borderRadius: '32px', overflow: 'hidden', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #333', position: 'relative' }}>
                                <motion.img key={activeImage} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} src={activeImage || product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: isMobile ? '1rem' : '2rem' }} />
                                {product.tag && <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'var(--primary-red)', color: 'white', padding: '0.4rem 1rem', borderRadius: '100px', fontWeight: '800', fontSize: '0.75rem' }}>{product.tag}</div>}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                                {[product.image, ...(product.images || [])].filter((v, i, a) => a.indexOf(v) === i).slice(0, 5).map((img, idx) => (
                                    <button key={idx} onClick={() => setActiveImage(img)} style={{ aspectRatio: '1', borderRadius: '16px', overflow: 'hidden', border: activeImage === img ? '2px solid var(--primary-red)' : '1px solid #333', background: '#fff', cursor: 'pointer', padding: '4px' }}>
                                        <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* INFO - Sticky */}
                        <div style={{ position: isMobile ? 'relative' : 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(255,183,0,0.1)', color: '#ffb700', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '800' }}>
                                        <Star size={12} fill="#ffb700" /> {product.rating || 5}
                                    </div>
                                    <span style={{ color: '#666', fontSize: '0.875rem' }}>{product.reviews?.length || 0} reviews</span>
                                </div>
                                <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: '900', lineHeight: '1', marginBottom: '0.5rem' }}>{product.name}</h1>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-red)' }}>{product.price}</div>
                            </div>

                            {/* Stock Bar */}
                            <div style={{ background: '#111', padding: '1.25rem', borderRadius: '20px', border: '1px solid #222' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                                    <span style={{ color: product.stock < 5 ? '#ff4d4d' : '#4ade80', fontWeight: '800' }}>{product.stock < 5 ? `Only ${product.stock} left!` : 'In Stock'}</span>
                                    <span style={{ color: '#444' }}>{product.stock} available</span>
                                </div>
                                <div style={{ height: '4px', background: '#222', borderRadius: '10px' }}>
                                    <div style={{ height: '100%', width: `${Math.min(100, (product.stock / 20) * 100)}%`, background: product.stock < 5 ? '#ff4d4d' : 'var(--primary-red)', borderRadius: '10px' }} />
                                </div>
                            </div>

                            {/* Size & Qty */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {product.sizes?.length > 0 && !(product.sizes.length === 1 && product.sizes[0] === "One Size") && (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: '#888' }}>
                                            <span>Select Size</span>
                                            <span style={{ color: 'var(--primary-red)', cursor: 'pointer', textDecoration: 'underline' }}>Guide</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {product.sizes.map(s => (
                                                <button key={s} onClick={() => setSelectedSize(s)} style={{ minWidth: '45px', padding: '0.6rem 1rem', borderRadius: '10px', border: selectedSize === s ? '2px solid var(--primary-red)' : '1px solid #222', background: selectedSize === s ? 'rgba(255,0,0,0.1)' : 'transparent', color: selectedSize === s ? 'var(--primary-red)' : 'white', fontWeight: '700', cursor: 'pointer' }}>{s}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <span style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: '#888' }}>Quantity</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#111', width: 'fit-content', padding: '0.4rem 0.8rem', borderRadius: '100px', border: '1px solid #222' }}>
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Minus size={16} /></button>
                                        <span style={{ fontWeight: '800', width: '20px', textAlign: 'center' }}>{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Plus size={16} /></button>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button className="btn-primary" style={{ flex: 1, padding: '1rem', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem' }} onClick={() => addToCart(product, selectedSize || "One Size")}>
                                    <ShoppingBag size={20} /> Add to Cart
                                </button>
                                <button style={{ width: '55px', borderRadius: '100px', border: '1px solid #333', background: 'transparent', color: 'white' }}><Heart size={20} /></button>
                            </div>

                            {/* Accordions */}
                            <div style={{ marginTop: '1rem', borderTop: '1px solid #222' }}>
                                {[
                                    { id: 'description', label: 'Description', icon: <Info size={16} />, content: product.description },
                                    { id: 'shipping', label: 'Shipping & Returns', icon: <Truck size={16} />, content: 'Free delivery on orders over ₹500. 7-day easy returns policy.' }
                                ].map(tab => (
                                    <div key={tab.id} style={{ borderBottom: '1px solid #222' }}>
                                        <button onClick={() => setActiveTab(activeTab === tab.id ? '' : tab.id)} style={{ width: '100%', padding: '1.25rem 0', display: 'flex', justifyContent: 'space-between', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700', fontSize: '0.9rem' }}>{tab.icon} {tab.label}</div>
                                            <ChevronRight size={16} style={{ transform: activeTab === tab.id ? 'rotate(90deg)' : 'none', transition: '0.3s' }} />
                                        </button>
                                        <AnimatePresence>
                                            {activeTab === tab.id && (
                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                                                    <p style={{ paddingBottom: '1.25rem', color: '#888', fontSize: '0.875rem', lineHeight: '1.6' }}>{tab.content}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>

                            {/* Badges */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', fontSize: '0.8rem', fontWeight: '700' }}>
                                    <ShieldCheck size={16} /> 100% Secure Transaction
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.8rem' }}>
                                    <Clock size={16} /> Get it by <b>{getDeliveryDate()}</b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related */}
                <RelatedProducts currentProduct={product} />
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
                        background: '#fff',
                        position: 'relative',
                        height: isMobile ? '350px' : '550px',
                        marginTop: '2rem',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #333'
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
                                        background: '#fff',
                                        cursor: 'pointer',
                                        padding: 0,
                                        flexShrink: 0,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <img src={img} alt={`view-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
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

                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
                                {product.description}
                            </p>

                            {/* Combo Items Section */}
                            {product.isCombo && product.comboProducts && product.comboProducts.length > 0 && (
                                <div style={{
                                    marginBottom: '3rem',
                                    padding: '1.5rem',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <h3 style={{ fontSize: '0.875rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '2px', color: 'var(--primary-red)' }}>
                                        What's in this combo?
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {product.comboProducts.map((p, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div style={{ width: '50px', height: '50px', background: '#111', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                                                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'white' }}>{p.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.price}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
                                        Bundled together for a special price 🎁
                                    </div>
                                </div>
                            )}

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
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', paddingTop: '2rem', borderTop: '1px solid #222' }}>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <Truck className="text-muted" size={24} color="var(--primary-red)" />
                                    <div>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Free Delivery</h4>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>On orders over ₹500</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <ShieldCheck className="text-muted" size={24} color="var(--primary-red)" />
                                    <div>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>100% Genuine</h4>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trusted Quality</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <ShoppingBag className="text-muted" size={24} />
                                    <div>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>COD Available</h4>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pay at Doorstep</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <RotateCcw className="text-muted" size={24} />
                                    <div>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Easy Returns</h4>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>7-Day Returns</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Recommended Products */}
            <RelatedProducts currentProduct={product} />

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

