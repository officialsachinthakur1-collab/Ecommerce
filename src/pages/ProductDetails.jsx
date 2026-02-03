import { Link, useParams, useLocation } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    ArrowLeft, ShoppingBag, Truck, ShieldCheck, Heart,
    ExternalLink, RotateCcw, ChevronRight, ChevronLeft, Minus, Plus,
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
    const queryParams = new URLSearchParams(location.search);
    const isPreview = queryParams.get('preview')?.toLowerCase() === 'true' || location.pathname.startsWith('/product-preview/');


    const [selectedSize, setSelectedSize] = useState(null);
    const [activeImage, setActiveImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { products, loading, refetch } = useProducts();
    const { user } = useAuth();
    const product = products.find(p => String(p.id) === String(id) || String(p._id) === String(id));

    // Support for affiliate links and combos
    const buyLink = product?.affiliateLink || (product?.isCombo && Array.isArray(product?.comboLinks) ? product.comboLinks.find(l => l && l.trim() !== '') : null);
    const allBuyLinks = product?.affiliateLink ? [product.affiliateLink] : (product?.isCombo && Array.isArray(product?.comboLinks) ? product.comboLinks.filter(l => l && l.trim() !== '') : []);

    const handleBuyNow = () => {
        if (allBuyLinks.length === 0) return;

        allBuyLinks.forEach((link, idx) => {
            // Adding a tiny delay might help some browsers not block them as popups
            setTimeout(() => {
                window.open(link, '_blank', 'noopener,noreferrer');
            }, idx * 200);
        });
    };

    // Image navigation logic
    const allImages = product ? [product.image, ...(product.images || [])].filter((v, i, a) => a.indexOf(v) === i) : [];

    const handleNextImage = () => {
        const currentIndex = allImages.indexOf(activeImage || product.image);
        const nextIndex = (currentIndex + 1) % allImages.length;
        setActiveImage(allImages[nextIndex]);
    };

    const handlePrevImage = () => {
        const currentIndex = allImages.indexOf(activeImage || product.image);
        const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
        setActiveImage(allImages[prevIndex]);
    };

    // Delivery Date Calculation
    const getDeliveryDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 4);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Initialize active image when product is found
    useEffect(() => {
        if (!loading && products.length > 0) {
            const p = products.find(prod => String(prod.id) === String(id) || String(prod._id) === String(id));
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


    if (!product) {
        return (
            <div style={{ paddingTop: 'var(--header-height)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <h2>Product Not Found</h2>
                <Link to="/shop" className="btn-primary" style={{ marginTop: '1rem' }}>Back to Shop</Link>
            </div>
        );
    }

    return (
        <div className="product-page-wrapper" style={{ background: '#050505', color: 'white', minHeight: '100vh', paddingTop: '2rem' }}>
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
                        <div style={{
                            background: '#fff',
                            borderRadius: '32px',
                            overflow: 'hidden',
                            aspectRatio: '1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #333',
                            position: 'relative'
                        }}>
                            {/* Gallery Nav Icons */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevImage}
                                        style={{ position: 'absolute', left: '1.25rem', zIndex: 10, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', transition: '0.3s' }}
                                        onMouseEnter={(e) => e.target.style.background = 'var(--primary-red)'}
                                        onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.6)'}
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        style={{ position: 'absolute', right: '1.25rem', zIndex: 10, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', transition: '0.3s' }}
                                        onMouseEnter={(e) => e.target.style.background = 'var(--primary-red)'}
                                        onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.6)'}
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}

                            <motion.img
                                key={activeImage}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={activeImage || product.image}
                                alt={product.name}
                                style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                            />
                            {product.tag && <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'var(--primary-red)', color: 'white', padding: '0.4rem 1rem', borderRadius: '100px', fontWeight: '800', fontSize: '0.75rem' }}>{product.tag}</div>}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                            {allImages.slice(0, 5).map((img, idx) => (
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
                                <span style={{ color: '#666', fontSize: '0.875rem' }}>{Array.isArray(product.reviews) ? product.reviews.length : product.reviews || 0} reviews</span>
                            </div>
                            <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: '900', lineHeight: '1', marginBottom: '0.5rem' }}>{product.name}</h1>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-red)' }}>{product.price}</div>
                        </div>

                        {/* Stock Info - Simplified */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', fontWeight: '700' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: product.stock < 5 ? '#ff4d4d' : '#4ade80' }} />
                            <span style={{ color: product.stock < 5 ? '#ff4d4d' : '#4ade80' }}>
                                {product.stock < 5 ? `Only ${product.stock} left in stock!` : 'In Stock & Ready to Ship'}
                            </span>
                        </div>

                        {/* Size & Qty - Only for Direct Purchase */}
                        {allBuyLinks.length === 0 && (
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
                        )}

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
                            {allBuyLinks.length > 1 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: '800', color: '#666', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                                            Combo Includes {allBuyLinks.length} Items:
                                        </p>
                                        {allBuyLinks.map((link, idx) => {
                                            const item = product.comboProducts?.[idx];
                                            return (
                                                <a
                                                    key={idx}
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-primary"
                                                    style={{
                                                        padding: '1rem 1.5rem',
                                                        borderRadius: '16px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        gap: '1rem',
                                                        fontSize: '0.9rem',
                                                        textDecoration: 'none',
                                                        fontWeight: '700',
                                                        background: idx === 0 ? 'var(--primary-red)' : '#111',
                                                        border: idx === 0 ? 'none' : '1px solid #333',
                                                        color: 'white',
                                                        transition: '0.3s'
                                                    }}
                                                >
                                                    <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {item?.name ? `Buy ${item.name}` : `Buy Item ${idx + 1}`}
                                                    </span>
                                                    <ExternalLink size={18} />
                                                </a>
                                            );
                                        })}
                                    </div>
                                    <motion.button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleWishlist(product);
                                        }}
                                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,0,0,0.1)', borderColor: 'var(--primary-red)' }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            border: '1px solid #222',
                                            background: 'radial-gradient(circle at center, rgba(255,0,0,0.15) 0%, rgba(255,255,255,0.02) 100%)',
                                            color: isInWishlist(product?._id || product?.id) ? 'var(--primary-red)' : 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            transition: '0.3s',
                                            marginTop: '1.8rem' // Align with first button
                                        }}
                                    >
                                        <Heart size={24} fill={isInWishlist(product?._id || product?.id) ? 'var(--primary-red)' : 'transparent'} />
                                    </motion.button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                                    {allBuyLinks.length === 1 ? (
                                        <a
                                            href={allBuyLinks[0]}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-primary"
                                            style={{
                                                flex: 1,
                                                padding: '1.1rem',
                                                borderRadius: '100px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.75rem',
                                                fontSize: '1rem',
                                                textDecoration: 'none',
                                                fontWeight: '800'
                                            }}
                                        >
                                            Buy Now <ExternalLink size={20} />
                                        </a>
                                    ) : (
                                        <button
                                            className="btn-primary"
                                            disabled={product.stock <= 0}
                                            style={{
                                                flex: 1,
                                                padding: '1.1rem',
                                                borderRadius: '100px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.75rem',
                                                fontSize: '1rem',
                                                opacity: product.stock <= 0 ? 0.5 : 1,
                                                cursor: product.stock <= 0 ? 'not-allowed' : 'pointer',
                                                fontWeight: '800'
                                            }}
                                            onClick={() => {
                                                const hasSizing = product.sizes && product.sizes.length > 0 && !(product.sizes.length === 1 && product.sizes[0] === "One Size");
                                                if (hasSizing && !selectedSize) {
                                                    alert('Please select a size');
                                                    return;
                                                }
                                                addToCart(product, selectedSize || "One Size");
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
                                    <motion.button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleWishlist(product);
                                        }}
                                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,0,0,0.1)', borderColor: 'var(--primary-red)' }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '50%',
                                            border: '1px solid #222',
                                            background: 'radial-gradient(circle at center, rgba(255,0,0,0.15) 0%, rgba(255,255,255,0.02) 100%)',
                                            color: isInWishlist(product?._id || product?.id) ? 'var(--primary-red)' : 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            transition: '0.3s'
                                        }}
                                    >
                                        <Heart size={24} fill={isInWishlist(product?._id || product?.id) ? 'var(--primary-red)' : 'transparent'} />
                                    </motion.button>
                                </div>
                            )}
                        </div>

                        {/* Accordions */}
                        <div style={{ marginTop: '1rem', borderTop: '1px solid #222' }}>
                            {[
                                { id: 'description', label: 'Description', icon: <Info size={16} />, content: product.description },
                                { id: 'details', label: 'Item Details & Specs', icon: <Package size={16} />, content: `Material: Premium Breathable Cotton\nFit: Modern Lifestyle Fit\nCare: Machine Wash Cold` },
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
                                                <p style={{ paddingBottom: '1.25rem', color: '#888', fontSize: '0.875rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{tab.content}</p>
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

            {/* Reviews Section */}
            <div className="container" style={{ padding: isMobile ? '4rem 0' : '8rem 0', borderTop: '1px solid #222' }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '4rem' }}>
                    {/* Review List */}
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2rem' }}>CUSTOMER REVIEWS</h2>
                        {(!Array.isArray(product.reviews) || product.reviews.length === 0) ? (
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

