import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, Environment, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowLeft, Star, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';

const ProductDetails = () => {
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
        <div style={{
            paddingTop: 'var(--header-height)',
            minHeight: '100vh',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
        }}>
            {/* Left: 3D Interaction Area */}
            <div style={{
                background: '#111',
                position: 'relative',
                height: '60vh', // Default for mobile
                minHeight: '400px'
            }} className="product-canvas-container">

                {/* Back Button */}
                <Link to="/shop" style={{
                    position: 'absolute',
                    top: '2rem',
                    left: '2rem',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'white',
                    background: 'rgba(0,0,0,0.5)',
                    padding: '0.5rem 1rem',
                    borderRadius: '2rem',
                    backdropFilter: 'blur(4px)'
                }}>
                    <ArrowLeft size={16} /> Back to Shop
                </Link>

                <Canvas camera={{ position: [0, 0, 4] }}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <OrbitControls enableZoom={false} />

                    {/* Placeholder 3D Object */}
                    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                        <Sphere args={[1.2, 32, 32]}>
                            <MeshDistortMaterial
                                color="#ff0000"
                                distort={0.6}
                                speed={1.5}
                                roughness={0.1}
                                metalness={0.8}
                            />
                        </Sphere>
                    </Float>

                    <Environment preset="city" />
                </Canvas>
            </div>

            {/* Right: Product Info */}
            <div style={{
                padding: '4rem 2rem',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
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

                        <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, marginBottom: '0.5rem' }}>{product.name}</h1>
                        <p style={{ fontSize: '1.5rem', color: 'var(--primary-red)', fontWeight: '600', marginBottom: '2rem' }}>{product.price}</p>

                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '3rem' }}>
                            {product.description}
                        </p>

                        {/* Size Selector */}
                        <div style={{ marginBottom: '3rem' }}>
                            <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '1px' }}>Select Size</h3>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '8px',
                                            border: selectedSize === size ? '2px solid var(--primary-red)' : '1px solid #333',
                                            background: selectedSize === size ? 'rgba(255,0,0,0.1)' : 'transparent',
                                            color: selectedSize === size ? 'var(--primary-red)' : 'var(--text-muted)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                            <button
                                className="btn-primary"
                                onClick={() => {
                                    if (!selectedSize) {
                                        alert('Please select a size');
                                        return;
                                    }
                                    addToCart(product, selectedSize);
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
    );
};

export default ProductDetails;
