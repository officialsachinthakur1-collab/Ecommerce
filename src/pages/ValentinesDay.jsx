import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import useMobile from '../hooks/useMobile';
import CuratedSections from '../components/home/CuratedSections';
import '../styles/ValentinesDay.css';

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

const ValentinesDay = () => {
    const isMobile = useMobile();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="vday-page">
            {/* Hero Section */}
            <section className="vday-hero">
                <div className="vday-3d-bg">
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
                                <Heart position={[0, 7, -5]} rotation={[0.3, -0.7, Math.PI]} scale={0.07} color="#ff5e5e" speed={1.0} />
                            </>
                        )}
                    </Canvas>
                </div>

                <div className="container">
                    <div className="vday-hero-content">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="vday-tag">THE LOVE COLLECTION 2026</span>
                            <h1 className="vday-title">
                                Celebrate <br />
                                <span className="vday-italic">Love</span> In Style
                            </h1>
                            <p className="vday-description">
                                Discover our handpicked selection of premium gifts, designed to make your
                                Valentine's Day as extraordinary as your connection.
                            </p>
                            <div className="vday-actions">
                                <a href="#gifts-guide" className="btn-primary">Explore The Guide</a>
                                <Link to="/shop" className="btn-outline">View All Products</Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured Gift Categories */}
            <section className="vday-categories" id="gifts-guide">
                <div className="container">
                    <div className="vday-section-header">
                        <h2>Curated Gift Guides</h2>
                        <p>Perfect choices for every special person in your life.</p>
                    </div>

                    <div className="vday-category-grid">
                        <motion.div
                            className="vday-category-card"
                            whileHover={{ y: -10 }}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="vday-category-img">
                                <img src="/assets/banners/men_fashion.png" alt="Gifts for Him" />
                                <div className="vday-category-overlay">
                                    <h3>For Him</h3>
                                    <Link to="/shop?category=Men" className="btn-vday-sm">Shop Now</Link>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="vday-category-card"
                            whileHover={{ y: -10 }}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="vday-category-img">
                                <img src="/assets/banners/women_fashion.png" alt="Gifts for Her" />
                                <div className="vday-category-overlay">
                                    <h3>For Her</h3>
                                    <Link to="/shop?category=Women" className="btn-vday-sm">Shop Now</Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Specially Tagged Products */}
            <div className="vday-products">
                <CuratedSections title="Romantic Essentials" tag="New" limit={4} />
                <CuratedSections title="Bestsellers for V-Day" tag="Bestseller" limit={4} />
            </div>

            {/* Valentine's Promise */}
            <section className="vday-promise">
                <div className="container">
                    <div className="promise-box">
                        <div className="promise-glow" />
                        <h2>The Valentine's Promise</h2>
                        <p>Order by Feb 10th for guaranteed delivery before the big day. Every gift comes with premium seasonal packaging.</p>
                        <div className="timer-mockup">
                            {/* We can add a countdown here if needed */}
                            <span>Express Shipping Available</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ValentinesDay;
