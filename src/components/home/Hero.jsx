import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { products } from '../../data/products';
import useMobile from '../../hooks/useMobile';

const Hero = () => {
    const isMobile = useMobile();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Select featured products for the hero
    const featuredProducts = products.slice(0, 3);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [featuredProducts.length]);

    const activeProduct = featuredProducts[currentIndex];

    return (
        <section className="hero-section">
            <div className="hero-background-gradient" />

            <div className="container hero-container">
                <div className="hero-content-grid">
                    {/* Text Content */}
                    <div className="hero-info">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeProduct.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="hero-tag">{activeProduct.tag}</span>
                                <h1 className="hero-title">
                                    {activeProduct.name.split(' ').map((word, i) => (
                                        <span key={i}>
                                            {word} {i === 1 && <br />}
                                        </span>
                                    ))}
                                </h1>
                                <p className="hero-description">
                                    {activeProduct.description}
                                </p>
                                <div className="hero-actions">
                                    <Link to={`/product/${activeProduct.id}`} className="btn-primary">
                                        Shop Now — {activeProduct.price}
                                    </Link>
                                    <Link to="/shop" className="btn-outline">
                                        View Collection
                                    </Link>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Slide Indicators */}
                        <div className="hero-indicators">
                            {featuredProducts.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`indicator ${index === currentIndex ? 'active' : ''}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Product Image Showcase */}
                    <div className="hero-visual">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeProduct.id}
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
