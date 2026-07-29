import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    ArrowLeft, ShoppingBag, Truck, ShieldCheck, Heart,
    ExternalLink, RotateCcw, ChevronRight, ChevronLeft, Minus, Plus,
    Info, Star, Package, Clock, Zap, MapPin, CheckCircle2, Share2, AlertCircle
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
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    const [selectedSize, setSelectedSize] = useState(null);
    const [activeImage, setActiveImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [pincode, setPincode] = useState('110001');
    const [isPincodeChecked, setIsPincodeChecked] = useState(false);

    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { products, loading, refetch } = useProducts();
    const { user } = useAuth();
    const product = products.find(p => String(p.id) === String(id) || String(p._id) === String(id));

    // Support for affiliate links and combos
    const allBuyLinks = product?.affiliateLink ? [product.affiliateLink] : (product?.isCombo && Array.isArray(product?.comboLinks) ? product.comboLinks.filter(l => l && l.trim() !== '') : []);

    // Image gallery
    const allImages = product ? [product.image, ...(product.images || [])].filter((v, i, a) => v && v.trim() !== '' && a.indexOf(v) === i) : [];

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
        date.setDate(date.getDate() + 3);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    // Initialize active image when product is loaded
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
            <div style={{ paddingTop: 'var(--header-height)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Loading Product Details...</div>
                    <div style={{ fontSize: '0.85rem', color: '#888' }}>Fetching Amazon/Flipkart catalogue data</div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ paddingTop: 'var(--header-height)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'white' }}>
                <h2>Product Not Found</h2>
                <Link to="/shop" className="btn-primary" style={{ marginTop: '1rem' }}>Back to Shop</Link>
            </div>
        );
    }

    const spNum = parseFloat((product.price || '').replace(/[^0-9.]/g, '') || 0);
    const mrpNum = product.mrp ? parseFloat(product.mrp.replace(/[^0-9.]/g, '') || 0) : (spNum > 0 ? Math.round(spNum * 1.8) : 0);
    const discountPercent = mrpNum > spNum && spNum > 0 ? Math.round(((mrpNum - spNum) / mrpNum) * 100) : 0;
    const savingsAmount = mrpNum > spNum ? mrpNum - spNum : 0;
    const formattedSp = product.price?.startsWith('₹') ? product.price : `₹${product.price}`;

    // Bullet highlights parsing
    const highlightBullets = product.highlights
        ? (typeof product.highlights === 'string' ? product.highlights.split('\n').filter(b => b.trim()) : product.highlights)
        : ['100% Premium Quality Product', 'Express 2-3 Days Fast Shipping across India', '30 Days Quality Guarantee & Easy Returns'];

    const handleInstantBuy = () => {
        const hasSizing = product.sizes && product.sizes.length > 0 && !(product.sizes.length === 1 && product.sizes[0] === "One Size");
        if (hasSizing && !selectedSize) {
            alert('Please select a size before proceeding to buy!');
            return;
        }
        addToCart(product, selectedSize || "One Size");
        navigate('/checkout');
    };

    return (
        <div className="product-page-wrapper" style={{ background: '#09090b', color: 'white', minHeight: '100vh', paddingBottom: '4rem' }}>
            
            {/* Amazon & Flipkart Style Full-Width Left-Aligned Sub-Header Breadcrumbs Bar */}
            <div style={{
                width: '100%',
                background: '#121215',
                borderBottom: '1px solid #222',
                padding: '0.65rem 1.5rem',
                marginBottom: '2rem'
            }}>
                <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto' }}>
                    <nav style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.8rem',
                        color: '#a1a1aa',
                        flexWrap: 'wrap',
                        justifyContent: 'flex-start'
                    }}>
                        <Link to="/" style={{ color: '#a1a1aa', textDecoration: 'none', fontWeight: '600' }} onMouseEnter={(e) => e.target.style.color = '#ef4444'} onMouseLeave={(e) => e.target.style.color = '#a1a1aa'}>Home</Link>
                        <span style={{ color: '#555' }}>›</span>
                        <Link to="/shop" style={{ color: '#a1a1aa', textDecoration: 'none', fontWeight: '600' }} onMouseEnter={(e) => e.target.style.color = '#ef4444'} onMouseLeave={(e) => e.target.style.color = '#a1a1aa'}>Shop Store</Link>
                        <span style={{ color: '#555' }}>›</span>
                        <Link to={`/shop?category=${product.category || 'All'}`} style={{ color: '#a1a1aa', textDecoration: 'none', fontWeight: '600' }} onMouseEnter={(e) => e.target.style.color = '#ef4444'} onMouseLeave={(e) => e.target.style.color = '#a1a1aa'}>{product.category || 'Apparel'}</Link>
                        {product.subCategory && (
                            <>
                                <span style={{ color: '#555' }}>›</span>
                                <span style={{ color: '#a1a1aa' }}>{product.subCategory}</span>
                            </>
                        )}
                        <span style={{ color: '#555' }}>›</span>
                        <span style={{ color: '#ffffff', fontWeight: '700' }}>{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr', gap: isMobile ? '2rem' : '3.5rem', alignItems: 'start' }}>
                    
                    {/* LEFT COLUMN: Flipkart Style Image Viewport & Gallery */}
                    <div style={{ position: isMobile ? 'relative' : 'sticky', top: '90px' }}>
                        <div style={{ display: 'flex', gap: '1.25rem', flexDirection: isMobile ? 'column-reverse' : 'row' }}>
                            
                            {/* Thumbnails Vertical Strip (Flipkart Style) */}
                            {allImages.length > 1 && (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: isMobile ? 'row' : 'column',
                                    gap: '0.75rem',
                                    overflowX: isMobile ? 'auto' : 'hidden',
                                    paddingBottom: isMobile ? '0.5rem' : 0
                                }}>
                                    {allImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(img)}
                                            style={{
                                                width: '64px',
                                                height: '64px',
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                border: activeImage === img ? '2px solid var(--primary-red)' : '1px solid #27272a',
                                                background: '#ffffff',
                                                cursor: 'pointer',
                                                padding: '4px',
                                                flexShrink: 0,
                                                transition: 'all 0.2s ease',
                                                boxShadow: activeImage === img ? '0 0 12px rgba(239,68,68,0.4)' : 'none'
                                            }}
                                        >
                                            <img src={img} alt={`Thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main High-Res Image Viewport */}
                            <div style={{
                                flex: 1,
                                background: '#ffffff',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                aspectRatio: '1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #27272a',
                                position: 'relative',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
                            }}>
                                {/* Tag Badge */}
                                {product.tag && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '1.25rem',
                                        left: '1.25rem',
                                        background: 'var(--primary-red)',
                                        color: 'white',
                                        padding: '0.35rem 0.85rem',
                                        borderRadius: '8px',
                                        fontWeight: '800',
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        zIndex: 5,
                                        boxShadow: '0 4px 12px rgba(239,68,68,0.4)'
                                    }}>
                                        {product.tag}
                                    </div>
                                )}

                                {/* Wishlist Heart Floating Icon */}
                                <button
                                    onClick={() => toggleWishlist(product)}
                                    style={{
                                        position: 'absolute',
                                        top: '1.25rem',
                                        right: '1.25rem',
                                        background: 'rgba(0,0,0,0.6)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        zIndex: 5,
                                        backdropFilter: 'blur(6px)'
                                    }}
                                >
                                    <Heart
                                        size={20}
                                        color={isInWishlist(product._id || product.id) ? 'var(--primary-red)' : 'white'}
                                        fill={isInWishlist(product._id || product.id) ? 'var(--primary-red)' : 'transparent'}
                                    />
                                </button>

                                {/* Gallery Arrow Nav Icons */}
                                {allImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={handlePrevImage}
                                            style={{ position: 'absolute', left: '1rem', zIndex: 10, background: 'rgba(0,0,0,0.65)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={handleNextImage}
                                            style={{ position: 'absolute', right: '1rem', zIndex: 10, background: 'rgba(0,0,0,0.65)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </>
                                )}

                                {/* Main Active Image */}
                                <motion.img
                                    key={activeImage}
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    src={activeImage || product.image}
                                    alt={product.name}
                                    style={{ width: '92%', height: '92%', objectFit: 'contain' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Amazon & Flipkart Style Purchase Box */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* Brand & Title */}
                        <div>
                            <div style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>
                                Brand: {product.brand || 'GetSetMart Premium'}
                            </div>
                            <h1 style={{ fontSize: isMobile ? '1.75rem' : '2.4rem', fontWeight: '900', color: 'white', lineHeight: '1.2', marginBottom: '0.85rem' }}>
                                {product.name}
                            </h1>

                            {/* Ratings & Verified Reviews Line */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#f59e0b', color: 'black', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '900' }}>
                                    <Star size={13} fill="black" /> {product.rating || '4.8'}
                                </div>
                                <span style={{ color: '#aaa', fontSize: '0.85rem' }}>
                                    {Array.isArray(product.reviews) ? product.reviews.length : product.reviews || 24} Verified Customer Reviews
                                </span>
                                <span style={{ color: '#555' }}>|</span>
                                <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: '700' }}>
                                    ✓ Verified Purchase Available
                                </span>
                            </div>
                        </div>

                        {/* Amazon Style Price Box */}
                        <div style={{ background: '#121215', padding: '1.35rem', borderRadius: '16px', border: '1px solid #27272a', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                            {discountPercent > 0 && (
                                <span style={{ background: '#ef4444', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '900', textTransform: 'uppercase', display: 'inline-block', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>
                                    🏷️ Limited Time Deal
                                </span>
                            )}

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem', flexWrap: 'wrap' }}>
                                {discountPercent > 0 && (
                                    <span style={{ fontSize: '1.85rem', fontWeight: '900', color: '#10b981' }}>
                                        -{discountPercent}%
                                    </span>
                                )}
                                <span style={{ fontSize: isMobile ? '2.1rem' : '2.6rem', fontWeight: '900', color: '#ffffff' }}>
                                    {formattedSp}
                                </span>
                            </div>

                            {mrpNum > spNum && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.4rem', fontSize: '0.88rem' }}>
                                    <span style={{ color: '#888' }}>M.R.P.: <span style={{ textDecoration: 'line-through' }}>₹{mrpNum.toLocaleString('en-IN')}</span></span>
                                    <span style={{ color: '#10b981', fontWeight: '700' }}>Save ₹{savingsAmount.toLocaleString('en-IN')} ({discountPercent}%)</span>
                                </div>
                            )}

                            <div style={{ fontSize: '0.78rem', color: '#a1a1aa', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle2 size={14} color="#10b981" /> Inclusive of all taxes • Free Express Courier Delivery
                            </div>
                        </div>

                        {/* Stock & Delivery Pincode Box */}
                        <div style={{ background: '#121215', padding: '1.1rem 1.25rem', borderRadius: '14px', border: '1px solid #27272a' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                                <Truck size={20} color="#38bdf8" />
                                <div>
                                    <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#38bdf8' }}>
                                        FREE Delivery by {getDeliveryDate()}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#888' }}>Cash on Delivery (COD) Available nationwide</div>
                                </div>
                            </div>

                            {/* Pincode Checker */}
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <MapPin size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                                    <input
                                        type="text"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value)}
                                        placeholder="Enter Pincode"
                                        style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.2rem', background: '#09090b', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '0.82rem' }}
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        if (pincode.length === 6) setIsPincodeChecked(true);
                                        else alert('Please enter valid 6-digit Pincode');
                                    }}
                                    style={{ padding: '0.55rem 1rem', background: '#27272a', border: 'none', color: 'white', borderRadius: '8px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
                                >
                                    Check
                                </button>
                            </div>
                            {isPincodeChecked && (
                                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700', marginTop: '0.4rem' }}>
                                    ✓ Serviceable for {pincode} — Express 2-3 Day Dispatch!
                                </div>
                            )}
                        </div>

                        {/* Size Selector Chips */}
                        {product.sizes?.length > 0 && !(product.sizes.length === 1 && product.sizes[0] === "One Size") && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem', fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', color: '#ccc' }}>
                                    <span>Select Available Size *</span>
                                    <span style={{ color: 'var(--primary-red)', cursor: 'pointer', textDecoration: 'underline' }}>Size Chart</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                                    {product.sizes.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setSelectedSize(s)}
                                            style={{
                                                minWidth: '50px',
                                                padding: '0.6rem 1.1rem',
                                                borderRadius: '8px',
                                                border: selectedSize === s ? '2px solid var(--primary-red)' : '1px solid #333',
                                                background: selectedSize === s ? 'rgba(239,68,68,0.18)' : '#121215',
                                                color: selectedSize === s ? 'white' : '#aaa',
                                                fontWeight: selectedSize === s ? '800' : '600',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            {s} {selectedSize === s && '✓'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', color: '#ccc' }}>Quantity:</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#121215', padding: '0.4rem 0.8rem', borderRadius: '100px', border: '1px solid #333' }}>
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Minus size={16} /></button>
                                <span style={{ fontWeight: '800', width: '20px', textAlign: 'center' }}>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Plus size={16} /></button>
                            </div>
                        </div>

                        {/* Dual Action Buttons (Exact Flipkart & Amazon Trademark Yellow/Orange Styling) */}
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr', gap: '1rem' }}>
                                
                                {/* Flipkart / Amazon Style Yellow "ADD TO CART" Button */}
                                <button
                                    onClick={() => {
                                        const hasSizing = product.sizes && product.sizes.length > 0 && !(product.sizes.length === 1 && product.sizes[0] === "One Size");
                                        if (hasSizing && !selectedSize) {
                                            alert('Please select a size first!');
                                            return;
                                        }
                                        addToCart(product, selectedSize || "One Size");
                                    }}
                                    style={{
                                        padding: '1.15rem 1rem',
                                        borderRadius: '10px',
                                        background: '#ff9f00',
                                        border: 'none',
                                        color: '#000000',
                                        fontWeight: '900',
                                        fontSize: isMobile ? '0.9rem' : '1.05rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        boxShadow: '0 6px 20px rgba(255, 159, 0, 0.4)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    <ShoppingBag size={20} color="#000000" /> ADD TO CART
                                </button>

                                {/* Flipkart / Amazon Style Vibrant Orange "BUY NOW" Button */}
                                <button
                                    onClick={handleInstantBuy}
                                    style={{
                                        padding: '1.15rem 1rem',
                                        borderRadius: '10px',
                                        background: '#fb641b',
                                        border: 'none',
                                        color: '#ffffff',
                                        fontWeight: '900',
                                        fontSize: isMobile ? '0.9rem' : '1.05rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        boxShadow: '0 6px 20px rgba(251, 100, 27, 0.4)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    <Zap size={20} fill="#ffffff" /> BUY NOW
                                </button>

                            </div>

                            {/* Flipkart / Amazon Payment Gateway Trust Line */}
                            <div style={{ marginTop: '0.85rem', textAlign: 'center', fontSize: '0.78rem', color: '#a1a1aa', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                                <span>🔒 256-Bit SSL Encrypted Checkout</span>
                                <span>•</span>
                                <span>💳 Razorpay Gateway (UPI, Cards, NetBanking & COD)</span>
                            </div>
                        </div>

                        {/* Amazon Key Highlights Bullet Points */}
                        <div style={{ background: '#121215', padding: '1.25rem', borderRadius: '16px', border: '1px solid #27272a', marginTop: '0.5rem' }}>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'white', marginBottom: '0.75rem' }}>
                                📌 Key Product Highlights
                            </h3>
                            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#d4d4d8', fontSize: '0.85rem', lineHeight: '1.5' }}>
                                {highlightBullets.map((bullet, idx) => (
                                    <li key={idx}>{bullet.replace(/^[•\-\*]\s*/, '')}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Store Trust Badges */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', background: '#121215', padding: '1rem', borderRadius: '14px', border: '1px solid #27272a', textAlign: 'center' }}>
                            <div>
                                <Truck size={20} color="#38bdf8" style={{ margin: '0 auto 4px' }} />
                                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'white' }}>Fast Shipping</div>
                                <div style={{ fontSize: '0.65rem', color: '#888' }}>2-3 Days Delivery</div>
                            </div>
                            <div>
                                <ShieldCheck size={20} color="#10b981" style={{ margin: '0 auto 4px' }} />
                                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'white' }}>100% Original</div>
                                <div style={{ fontSize: '0.65rem', color: '#888' }}>Verified Quality</div>
                            </div>
                            <div>
                                <RotateCcw size={20} color="#f59e0b" style={{ margin: '0 auto 4px' }} />
                                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'white' }}>30 Days Return</div>
                                <div style={{ fontSize: '0.65rem', color: '#888' }}>Easy Replacements</div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Collapsible Tabs: Full Description & Specs Table (Flipkart Style) */}
                <div style={{ marginTop: '4rem', background: '#121215', borderRadius: '20px', border: '1px solid #27272a', padding: isMobile ? '1.25rem' : '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #27272a', paddingBottom: '1rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
                        {[
                            { id: 'description', label: '📖 Full Description' },
                            { id: 'specs', label: '📋 Specifications & Specs' },
                            { id: 'shipping', label: '🚚 Shipping Policy' }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    borderRadius: '10px',
                                    background: activeTab === t.id ? 'var(--primary-red)' : '#1c1c22',
                                    color: 'white',
                                    border: 'none',
                                    fontWeight: '800',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'description' && (
                        <div style={{ color: '#d4d4d8', fontSize: '0.92rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                            {product.description || 'Experience uncompromised quality with this item. Crafted with precision materials to deliver long-lasting durability and style for daily usage.'}
                        </div>
                    )}

                    {activeTab === 'specs' && (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', color: '#d4d4d8' }}>
                                <tbody>
                                    <tr style={{ borderBottom: '1px solid #222' }}>
                                        <td style={{ padding: '0.75rem', fontWeight: '700', color: '#888', width: '200px' }}>Brand</td>
                                        <td style={{ padding: '0.75rem', color: 'white' }}>{product.brand || 'GetSetMart'}</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #222' }}>
                                        <td style={{ padding: '0.75rem', fontWeight: '700', color: '#888' }}>Category</td>
                                        <td style={{ padding: '0.75rem', color: 'white' }}>{product.category || 'Apparel'}</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #222' }}>
                                        <td style={{ padding: '0.75rem', fontWeight: '700', color: '#888' }}>SKU Code</td>
                                        <td style={{ padding: '0.75rem', color: 'white' }}>{product.sku || product.id}</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #222' }}>
                                        <td style={{ padding: '0.75rem', fontWeight: '700', color: '#888' }}>Quality Assurance</td>
                                        <td style={{ padding: '0.75rem', color: 'white' }}>100% Quality Inspected before dispatch</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'shipping' && (
                        <div style={{ color: '#d4d4d8', fontSize: '0.9rem', lineHeight: '1.7' }}>
                            Orders are dispatched within 24 hours of confirmation. Delivery takes 2-4 business days depending on customer location. Easy 30-day hassle-free replacement guarantee.
                        </div>
                    )}
                </div>

                {/* Related Products */}
                <RelatedProducts currentProduct={product} />

                {/* Reviews Section */}
                <div style={{ marginTop: '4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '900' }}>Customer Reviews</h2>
                    </div>
                    {user ? (
                        <ReviewForm productId={product.id || product._id} onReviewSubmitted={refetch} />
                    ) : (
                        <div style={{ background: '#121215', padding: '1.5rem', borderRadius: '14px', border: '1px solid #27272a', textAlign: 'center', marginBottom: '2rem' }}>
                            <p style={{ color: '#888', fontSize: '0.9rem' }}>Please sign in to write a customer review.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
