import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, Environment, Sphere, MeshDistortMaterial } from '@react-three/drei';
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
                {/* Left: 3D Interaction Area */}
                <div style={{
                    background: '#111',
                    position: 'relative',
                    height: '60vh', // Default for mobile
                    minHeight: '400px',
                    marginTop: '2rem',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} className="product-canvas-container">

                    {/* Fixed Image Display */}
                    <img
                        src={product.image}
                        alt={product.name}
                        style={{
                            position: 'absolute',
                            width: '80%',
                            height: '80%',
                            objectFit: 'contain',
                            zIndex: 1,
                            pointerEvents: 'none'
                        }}
                    />

                    <Canvas camera={{ position: [0, 0, 4] }} dpr={isMobile ? 1 : [1, 2]} gl={{ antialias: !isMobile }} style={{ position: 'relative', zIndex: 2 }}>
                        <ambientLight intensity={0.5} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                        <OrbitControls enableZoom={false} />

                        {/* Placeholder 3D Object - Made Transparent to see image through it */}
                        <Float speed={isMobile ? 1 : 2} rotationIntensity={isMobile ? 0.5 : 1} floatIntensity={isMobile ? 0.5 : 1}>
                            <Sphere args={[1.2, isMobile ? 16 : 32, isMobile ? 16 : 32]}>
                                <MeshDistortMaterial
                                    color="#ff0000"
                                    distort={isMobile ? 0.3 : 0.6}
                                    speed={isMobile ? 1 : 1.5}
                                    roughness={1}
                                    metalness={1}
                                    opacity={0.3}
                                    transparent={true}
                                />
                            </Sphere>
                        </Float>

                        <Environment preset="city" />
                    </Canvas>
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
                                {[...Array(product.rating || 5)].map((_, i) => (
                                    <Star key={i} fill="#fbbf24" size={16} />
                                ))}
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: '0.5rem' }}>({product.reviews} Reviews)</span>
                            </div>

                            <h1 className="product-title" style={{ fontWeight: '800', lineHeight: 1, marginBottom: '0.5rem' }}>{product.name}</h1>
                            <p className="product-price" style={{ color: 'var(--primary-red)', fontWeight: '600', marginBottom: '2rem' }}>{product.price}</p>

                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '3rem' }}>
                                {product.description}
                            </p>

                            {/* Size Selector - Only show if sizes follow-up are available and not "One Size" */}
                            {product.sizes && product.sizes.length > 0 && !(product.sizes.length === 1 && product.sizes[0] === "One Size") && (
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
