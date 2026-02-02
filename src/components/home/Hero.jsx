import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo, useRef } from 'react';
import { products as fallbackProducts } from '../../data/products';
import { useProducts } from '../../hooks/useProducts';
import useMobile from '../../hooks/useMobile';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const Heart = ({ position, rotation, scale, color, speed = 1 }) => {
    const mesh = useRef();
    const heartShape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.bezierCurveTo(0, -0.5, -1.1, -1, -1.1, -2);
        shape.bezierCurveTo(-1.1, -3, 0.5, -4.5, 1.5, -5.5);
        shape.bezierCurveTo(2.5, -4.5, 4.1, -3, 4.1, -2);
        shape.bezierCurveTo(4.1, -1, 3, -0.5, 3, 0);
        shape.bezierCurveTo(3, 0.5, 3, 1, 1.5, 1);
        shape.bezierCurveTo(0, 1, 0, 0.5, 0, 0);
        return shape;
    }, []);

    const extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (mesh.current) {
            mesh.current.rotation.y = Math.sin(t * speed) * 0.2;
            mesh.current.position.y += Math.sin(t * speed) * 0.005;
        }
    });

    return (
        <Float speed={speed * 2} rotationIntensity={1.5} floatIntensity={2}>
            <mesh ref={mesh} position={position} rotation={rotation} scale={scale}>
                <extrudeGeometry args={[heartShape, extrudeSettings]} />
                <MeshDistortMaterial
                    color={color}
                    speed={2}
                    distort={0.3}
                    radius={1}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>
        </Float>
    );
};

const Hero = () => {
    const isMobile = useMobile();
    const { products, loading } = useProducts(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Valentine Slide Data
    const valentineSlide = {
        isValentine: true,
        tag: "PREMIUM GIFTING",
        title: "HAPPY VALENTINE'S DAY",
        description: "Make this February unforgettable with our curated collection of love-inspired essentials.",
        image: "/assets/vday/teddy.png",
        btnText: "EXPLORE THE GUIDE",
        btnLink: "/valentines-day"
    };

    const heroSlides = useMemo(() => {
        const dbHeroProducts = products.filter(p => p.isHero).map(p => ({ ...p, isValentine: false }));
        let slides = dbHeroProducts.length > 0 ? dbHeroProducts : fallbackProducts.slice(0, 3).map(p => ({ ...p, isValentine: false }));

        // Always add Valentine slide at the beginning
        return [valentineSlide, ...slides];
    }, [products]);

    useEffect(() => {
        if (heroSlides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
        }, 6000); // 6 seconds for better viewing
        return () => clearInterval(timer);
    }, [heroSlides.length]);

    useEffect(() => {
        if (currentIndex >= heroSlides.length) {
            setCurrentIndex(0);
        }
    }, [heroSlides.length, currentIndex]);

    if (loading && heroSlides.length <= 1) {
        return <div style={{ height: '80vh', background: '#050505' }} />;
    }

    const activeSlide = heroSlides[currentIndex];

    // Preload images to prevent flickering
    useEffect(() => {
        heroSlides.forEach(slide => {
            if (slide.image) {
                const img = new Image();
                img.src = slide.image;
            }
        });
    }, [heroSlides]);

    return (
        <section className={`hero-section ${activeSlide.isValentine ? 'valentine-theme' : ''}`}>
            {activeSlide.isValentine ? (
                <div style={{ position: 'absolute', inset: 0, opacity: 0.8, pointerEvents: 'none', zIndex: 1 }}>
                    <Canvas>
                        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                        <ambientLight intensity={0.7} />
                        <pointLight position={[10, 10, 10]} intensity={1.5} />
                        <Heart position={[-6, 2, 0]} rotation={[0, 0, Math.PI]} scale={0.15} color="#ff4d4d" speed={0.5} />
                        <Heart position={[5, -1, 2]} rotation={[0, 0.5, Math.PI]} scale={0.1} color="#ff8080" speed={0.8} />
                        <Heart position={[-2, -3, 1]} rotation={[0.2, -0.2, Math.PI]} scale={0.12} color="#cc0000" speed={0.6} />
                        {!isMobile && (
                            <>
                                <Heart position={[8, 3, -2]} rotation={[0, 0.2, Math.PI]} scale={0.08} color="#ff3333" speed={1.2} />
                                <Heart position={[-8, -2, 0]} rotation={[0, -0.5, Math.PI]} scale={0.1} color="#ffb3b3" speed={0.7} />
                            </>
                        )}
                    </Canvas>
                </div>
            ) : (
                <div className="hero-background-gradient" />
            )}

            <div className="container hero-container" style={{ position: 'relative', zIndex: 10 }}>
                <div className="hero-content-grid">
                    <div className="hero-info">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                <span className="hero-tag">{activeSlide.tag}</span>
                                {activeSlide.isValentine ? (
                                    <h1 className="hero-title valentine-title">
                                        HAPPY <br />
                                        <span className="valentine-italic">Valentine's</span> <br />
                                        DAY
                                    </h1>
                                ) : (
                                    <h1 className="hero-title">
                                        {(activeSlide.heroTitle || activeSlide.name || '').split(' ').map((word, i) => (
                                            <span key={i}>
                                                {word} {i === 1 && <br />}
                                            </span>
                                        ))}
                                    </h1>
                                )}

                                <p className="hero-description">
                                    {activeSlide.description}
                                </p>

                                <div className="hero-actions">
                                    <Link
                                        to={activeSlide.isValentine ? activeSlide.btnLink : `/product/${activeSlide.id || activeSlide._id}`}
                                        className="btn-primary"
                                    >
                                        {activeSlide.isValentine ? activeSlide.btnText : `Shop Now — ${activeSlide.price}`}
                                    </Link>
                                    {!activeSlide.isValentine && (
                                        <Link to="/shop" className="btn-outline">
                                            View Collection
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {heroSlides.length > 1 && (
                            <div className="hero-indicators">
                                {heroSlides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`indicator ${index === currentIndex ? 'active' : ''}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="hero-visual">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, scale: 0.8, rotate: activeSlide.isValentine ? 0 : -5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 1.1, rotate: activeSlide.isValentine ? 0 : 5 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="product-image-container"
                            >
                                <div className={activeSlide.isValentine ? "valentine-glow" : "image-glow"} />
                                <img
                                    src={activeSlide.image}
                                    alt={activeSlide.title || activeSlide.name}
                                    className={`hero-product-img ${activeSlide.isValentine ? 'valentine-img' : ''}`}
                                />
                                {activeSlide.isValentine && (
                                    <motion.div
                                        initial={{ rotate: -20, scale: 0 }}
                                        animate={{ rotate: -12, scale: 1 }}
                                        transition={{ delay: 0.8, type: 'spring' }}
                                        className="valentine-badge"
                                    >
                                        <div className="badge-small">Limited Offer</div>
                                        <div className="badge-large">50% OFF</div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
