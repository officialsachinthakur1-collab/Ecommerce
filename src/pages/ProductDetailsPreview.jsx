import { Link, useParams } from 'react-router-dom';
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

export default function ProductDetailsPreview() {
    const isMobile = useMobile();
    const { id } = useParams();
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

    useEffect(() => {
        if (!loading && products.length > 0) {
            const p = products.find(prod => String(prod.id) === String(id));
            if (p && !activeImage) {
                setActiveImage(p.image);
            }
        }
    }, [loading, products, id, activeImage]);

    if (loading) return <div className="loading-screen">Loading Premium Preview...</div>;

    const product = products.find(p => String(p.id) === String(id));
    if (!product) return <div className="not-found">Product Not Found</div>;

    return (
        <div className="product-page-wrapper preview-mode" style={{ background: '#050505', color: 'white', minHeight: '100vh' }}>

            {/* 1. Breadcrumbs */}
            <div className="container" style={{ paddingTop: '2rem' }}>
                <nav style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: '#888', marginBottom: '2rem' }}>
                    <Link to="/" style={{ hover: { color: 'white' } }}>Home</Link>
                    <ChevronRight size={12} />
                    <Link to="/shop">Shop</Link>
                    <ChevronRight size={12} />
                    <span style={{ color: 'var(--primary-red)', fontWeight: '600' }}>{product.name}</span>
                </nav>
            </div>

            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1.2fr 0.8fr',
                    gap: '4rem',
                    alignItems: 'start'
                }}>

                    {/* LEFT: IMAGES (Scrollable) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{
                            background: '#fff',
                            borderRadius: '32px',
                            overflow: 'hidden',
                            aspectRatio: '1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #222',
                            position: 'relative'
                        }}>
                            <motion.img
                                key={activeImage}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={activeImage || product.image}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2rem' }}
                            />
                            {product.tag && (
                                <div style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'var(--primary-red)', padding: '0.5rem 1.2rem', borderRadius: '100px', fontWeight: '800', fontSize: '0.75rem' }}>
                                    {product.tag}
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                            {[product.image, ...(product.images || [])].filter((v, i, a) => a.indexOf(v) === i).map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    style={{
                                        aspectRatio: '1',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        border: activeImage === img ? '2px solid var(--primary-red)' : '1px solid #222',
                                        background: '#fff',
                                        cursor: 'pointer',
                                        padding: '4px'
                                    }}
                                >
                                    <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: INFO (Sticky) */}
                    <div style={{
                        position: isMobile ? 'relative' : 'sticky',
                        top: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2.5rem'
                    }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(255,183,0,0.1)', color: '#ffb700', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.875rem', fontWeight: '700' }}>
                                    <Star size={14} fill="#ffb700" /> {product.rating || 5}
                                </div>
                                <span style={{ color: '#888', fontSize: '0.875rem' }}>{product.reviews?.length || 0} global ratings</span>
                            </div>

                            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: '1.1', marginBottom: '0.5rem' }}>{product.name}</h1>
                            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-red)' }}>{product.price}</div>
                        </div>

                        {/* Stock Status */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '20px', border: '1px solid #222' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                                <span style={{ color: product.stock < 5 ? '#ff4d4d' : '#4ade80', fontWeight: '700' }}>
                                    {product.stock < 5 ? `Only ${product.stock} left in stock!` : 'In Stock & Ready to Ship'}
                                </span>
                                <span style={{ color: '#888' }}>{product.stock} units</span>
                            </div>
                            <div style={{ height: '6px', background: '#222', borderRadius: '10px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(product.stock / 20) * 100}%` }}
                                    style={{ height: '100%', background: product.stock < 5 ? '#ff4d4d' : 'var(--primary-red)' }}
                                />
                            </div>
                        </div>

                        {/* Sizing & Quantity */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {product.sizes?.length > 0 && !(product.sizes.length === 1 && product.sizes[0] === "One Size") && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <span style={{ fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase' }}>Select Size</span>
                                        <span style={{ color: 'var(--primary-red)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>Size Guide</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                        {product.sizes.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setSelectedSize(s)}
                                                style={{
                                                    minWidth: '50px', p: '0.75rem', borderRadius: '12px', border: selectedSize === s ? '2px solid var(--primary-red)' : '1px solid #222',
                                                    background: selectedSize === s ? 'rgba(255,0,0,0.1)' : 'transparent', color: selectedSize === s ? 'var(--primary-red)' : 'white', fontWeight: '700', cursor: 'pointer'
                                                }}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <span style={{ fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>Quantity</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#111', width: 'fit-content', padding: '0.5rem 1rem', borderRadius: '100px', border: '1px solid #222' }}>
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Minus size={18} /></button>
                                    <span style={{ fontWeight: '800', width: '20px', textAlign: 'center' }}>{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Plus size={18} /></button>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className="btn-primary"
                                style={{ flex: 1, padding: '1.25rem', fontSize: '1.1rem', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                                onClick={() => addToCart(product, selectedSize || "One Size")}
                            >
                                <ShoppingBag /> Add to Cart
                            </button>
                            <button style={{ width: '60px', borderRadius: '100px', border: '1px solid #222', background: 'transparent', color: 'white' }}>
                                <Heart />
                            </button>
                        </div>

                        {/* Professional Tabs / Accordions */}
                        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #222' }}>
                            {[
                                { id: 'description', label: 'Description', icon: <Info size={18} />, content: product.description },
                                { id: 'details', label: 'Item Details', icon: <Package size={18} />, content: 'Premium quality materials. Expertly crafted for longevity and style.' },
                                { id: 'shipping', label: 'Shipping & Returns', icon: <Clock size={18} />, content: 'Free standard delivery on orders above ₹500. 7-day easy returns policy.' }
                            ].map(tab => (
                                <div key={tab.id} style={{ borderBottom: '1px solid #222' }}>
                                    <button
                                        onClick={() => setActiveTab(activeTab === tab.id ? '' : tab.id)}
                                        style={{ width: '100%', padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700' }}>
                                            {tab.icon} {tab.label}
                                        </div>
                                        <ChevronRight size={18} style={{ transform: activeTab === tab.id ? 'rotate(90deg)' : 'none', transition: '0.3s' }} />
                                    </button>
                                    <AnimatePresence>
                                        {activeTab === tab.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                style={{ overflow: 'hidden' }}
                                            >
                                                <p style={{ paddingBottom: '1.5rem', color: '#888', lineHeight: '1.6', fontSize: '0.95rem' }}>{tab.content}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>

                        {/* Trust Badges */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#888', fontSize: '0.8rem' }}>
                                <Truck size={18} color="var(--primary-red)" />
                                <span>Get it by <b>{getDeliveryDate()}</b></span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#888', fontSize: '0.8rem' }}>
                                <ShieldCheck size={18} color="var(--primary-red)" />
                                <span>100% Secure Payment</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            <div style={{ marginTop: '8rem', borderTop: '1px solid #222' }}>
                <RelatedProducts currentProduct={product} />
            </div>

            {/* User Review Section Placeholder */}
            <div className="container" style={{ padding: '8rem 0' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '3rem', textAlign: 'center' }}>WHAT CUSTOMERS ARE SAYING</h2>
                <div style={{ background: '#111', borderRadius: '32px', padding: '4rem', textAlign: 'center', border: '1px solid #222' }}>
                    <p style={{ color: '#888', marginBottom: '2rem' }}>Login to view verified reviews for this product.</p>
                    <Link to="/login" className="btn-primary">Sign In</Link>
                </div>
            </div>

        </div>
    );
}
