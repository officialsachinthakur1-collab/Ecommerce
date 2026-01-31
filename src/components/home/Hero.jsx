import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { products as fallbackProducts } from '../../data/products';
import { useProducts } from '../../hooks/useProducts';
import useMobile from '../../hooks/useMobile';

const Hero = () => {
    const isMobile = useMobile();
    const { products, loading } = useProducts(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Select hero products: products with isHero: true, or fallback to first 3
    const heroProducts = useMemo(() => {
        const filtered = products.filter(p => p.isHero);
        if (filtered.length > 0) return filtered;
        // Fallback to local products if no DB products are marked as Hero
        return fallbackProducts.slice(0, 3);
    }, [products]);

    useEffect(() => {
        if (heroProducts.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroProducts.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroProducts.length]);

    // Handle index out of bounds if products change
    useEffect(() => {
        if (currentIndex >= heroProducts.length) {
            setCurrentIndex(0);
        }
    }, [heroProducts.length, currentIndex]);

    if (loading && heroProducts.length === 0) {
        return <div style={{ height: '80vh', background: '#050505' }} />;
    }

    const activeProduct = heroProducts[currentIndex] || heroProducts[0] || fallbackProducts[0];

    return (
        <section className="hero-section">
            <div className="hero-background-gradient" />

            <div className="container hero-container">
                <div className="hero-content-grid">
                    {/* Text Content */}
                    <div className="hero-info">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeProduct.id || activeProduct._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="hero-tag">{activeProduct.tag}</span>
                                <h1 className="hero-title">
                                    {(activeProduct.heroTitle || activeProduct.name || '').split(' ').map((word, i) => (
                                        <span key={i}>
                                            {word} {i === 1 && <br />}
                                        </span>
                                    ))}
                                </h1>
                                <p className="hero-description">
                                    {activeProduct.description}
                                </p>
                                <div className="hero-actions">
                                    <Link to={`/product/${activeProduct.id || activeProduct._id}`} className="btn-primary">
                                        Shop Now — {activeProduct.price}
                                    </Link>
                                    <Link to="/shop" className="btn-outline">
                                        View Collection
                                    </Link>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Slide Indicators */}
                        {heroProducts.length > 1 && (
                            <div className="hero-indicators">
                                {heroProducts.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`indicator ${index === currentIndex ? 'active' : ''}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Image Showcase */}
                    <div className="hero-visual">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeProduct.id || activeProduct._id}
                                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                                className="product-image-container"
                            >
                                <div className="image-glow" />
                                <img
                                    src={activeProduct.image}
                                    alt={activeProduct.name}
                                    className="hero-product-img"
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
