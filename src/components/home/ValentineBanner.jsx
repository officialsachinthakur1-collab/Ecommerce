import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import useMobile from '../../hooks/useMobile';

const Heart = ({ position, rotation, scale, color, speed = 1 }) => {
    const mesh = useRef();

    // Create a heart shape
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
        mesh.current.rotation.y = Math.sin(t * speed) * 0.2;
        mesh.current.position.y += Math.sin(t * speed) * 0.005;
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

const ValentineBanner = () => {
    const isMobile = useMobile();

    return (
        <div style={{
            width: '100%',
            height: isMobile ? '700px' : '650px',
            background: 'radial-gradient(circle at 30% 50%, #fffafa 0%, #ffffff 50%, #fff0f0 100%)',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: isMobile ? '0' : '32px',
            border: '1px solid #fee2e2',
            margin: isMobile ? '0' : '2rem 0',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            boxShadow: '0 40px 100px rgba(255,0,0,0.05)'
        }}>
            {/* Soft Ambient Glows */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '20%',
                width: '40%',
                height: '60%',
                background: 'radial-gradient(circle, rgba(255,0,0,0.03) 0%, transparent 70%)',
                filter: 'blur(50px)',
                pointerEvents: 'none'
            }} />

            {/* 3D Background Canvas with Bokeh Effect */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.8, pointerEvents: 'none' }}>
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                    <ambientLight intensity={0.7} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} />
                    <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

                    {/* Main Hearts (Crisp) */}
                    <Heart position={[-6, 2, 0]} rotation={[0, 0, Math.PI]} scale={0.15} color="#ff4d4d" speed={0.5} />
                    <Heart position={[5, -1, 2]} rotation={[0, 0.5, Math.PI]} scale={0.1} color="#ff8080" speed={0.8} />
                    <Heart position={[-2, -3, 1]} rotation={[0.2, -0.2, Math.PI]} scale={0.12} color="#cc0000" speed={0.6} />

                    {/* Bokeh Hearts (Large & Blurred) */}
                    <Heart position={[-8, -4, -5]} rotation={[0, 0, Math.PI]} scale={0.4} color="#ffdada" speed={0.3} />
                    <Heart position={[10, 5, -8]} rotation={[0, 0.5, Math.PI]} scale={0.5} color="#ffcccc" speed={0.2} />
                    <Heart position={[0, -8, -10]} rotation={[0.5, 0.2, Math.PI]} scale={0.6} color="#ffeeee" speed={0.1} />

                    {/* Floating Particles */}
                    {!isMobile && (
                        <>
                            <Heart position={[8, 3, -2]} rotation={[0, 0.2, Math.PI]} scale={0.08} color="#ff3333" speed={1.2} />
                            <Heart position={[-8, -2, 0]} rotation={[0, -0.5, Math.PI]} scale={0.1} color="#ffb3b3" speed={0.7} />
                            <Heart position={[0, 7, -5]} rotation={[0.3, -0.7, Math.PI]} scale={0.07} color="#ff5e5e" speed={1.0} />
                        </>
                    )}

                    <mesh>
                        <sphereGeometry args={[20, 32, 32]} />
                        <meshBasicMaterial color="#ff4d4d" wireframe transparent opacity={0.015} />
                    </mesh>
                </Canvas>
            </div>

            {/* Top Corner Details (Reference Mockup style) */}
            <div style={{ position: 'absolute', top: '40px', left: '40px', display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.6, zIndex: 10 }}>
                <div style={{ width: '24px', height: '24px', background: '#111', borderRadius: '4px' }} />
                <span style={{ fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.1em' }}>GETSETMART 2026</span>
            </div>
            {!isMobile && (
                <div style={{ position: 'absolute', top: '40px', right: '40px', display: 'flex', gap: '15px', opacity: 0.4, zIndex: 10 }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>INSTAGRAM</span>
                    <span style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>FACEBOOK</span>
                    <span style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>YOUTUBE</span>
                </div>
            )}

            {/* Product Image (Teddy Bear) */}
            <div style={{
                flex: 1,
                height: isMobile ? '350px' : '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                position: 'relative'
            }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, type: 'spring' }}
                    style={{ position: 'relative', height: '85%' }}
                >
                    <img
                        src="/assets/vday/teddy.png"
                        style={{
                            height: '100%',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.12))'
                        }}
                    />
                    {/* Shadow underneath */}
                    <div style={{
                        position: 'absolute',
                        bottom: '5%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60%',
                        height: '20px',
                        background: 'radial-gradient(ellipse, rgba(0,0,0,0.1) 0%, transparent 70%)',
                        filter: 'blur(10px)',
                        zIndex: -1
                    }} />
                </motion.div>

                {/* Discount Tag */}
                <motion.div
                    initial={{ rotate: -20, scale: 0 }}
                    animate={{ rotate: -12, scale: 1 }}
                    transition={{ delay: 0.8, type: 'spring' }}
                    style={{
                        position: 'absolute',
                        bottom: isMobile ? '10%' : '15%',
                        right: isMobile ? '10%' : '12%',
                        background: 'linear-gradient(135deg, #ff4d4d, #cc0000)',
                        padding: '0.8rem 1.5rem',
                        borderRadius: '12px',
                        fontWeight: '900',
                        color: '#fff',
                        boxShadow: '0 20px 40px rgba(204,0,0,0.3)',
                        zIndex: 3,
                        textAlign: 'center'
                    }}
                >
                    <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.8 }}>Limited Offer</div>
                    <div style={{ fontSize: '1.8rem', lineHeight: 1 }}>50% OFF</div>
                </motion.div>
            </div>

            {/* Content Section */}
            <div style={{
                flex: 1,
                padding: isMobile ? '1rem 2rem 4rem' : '4rem',
                zIndex: 2,
                textAlign: isMobile ? 'center' : 'left',
                position: 'relative'
            }}>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        justifyContent: isMobile ? 'center' : 'flex-start',
                        marginBottom: '1rem'
                    }}
                >
                    <div style={{ width: '40px', height: '1px', background: '#ff4d4d' }} />
                    <span style={{
                        color: '#ff4d4d',
                        fontSize: '0.8rem',
                        fontWeight: '800',
                        letterSpacing: '0.4em',
                        textTransform: 'uppercase'
                    }}>
                        PREMIUM GIFTING
                    </span>
                </motion.div>

                <div style={{ position: 'relative' }}>
                    <motion.h2
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        style={{
                            fontSize: isMobile ? '4rem' : '6.5rem',
                            fontWeight: '1000',
                            lineHeight: 0.85,
                            color: '#111',
                            margin: 0,
                            letterSpacing: '-0.04em'
                        }}
                    >
                        HAPPY <br />
                        <span style={{
                            fontFamily: 'serif',
                            fontStyle: 'italic',
                            color: '#ff4d4d',
                            fontSize: isMobile ? '4.5rem' : '7.5rem',
                            fontWeight: '400',
                            display: 'block',
                            margin: '0.5rem 0'
                        }}>Valentine's</span>
                        DAY
                    </motion.h2>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 0.6 }}
                    style={{ fontSize: '1rem', color: '#333', marginTop: '2rem', maxWidth: '400px', lineHeight: 1.6 }}
                >
                    Make this February unforgettable with our curated collection of love-inspired essentials.
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    style={{ marginTop: '3rem' }}
                >
                    <motion.button
                        whileHover={{ scale: 1.05, background: '#ff4d4d' }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            background: '#111',
                            color: 'white',
                            padding: '1.2rem 3.5rem',
                            borderRadius: '16px',
                            border: 'none',
                            fontWeight: '800',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                            transition: 'background 0.3s'
                        }}
                    >
                        EXPLORE THE GUIDE
                    </motion.button>
                </motion.div>
            </div>

            {/* Bottom Corner Details */}
            {!isMobile && (
                <div style={{ position: 'absolute', bottom: '40px', right: '40px', textAlign: 'right', opacity: 0.3 }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>WWW.GETSETMART.COM</div>
                    <div style={{ fontSize: '0.6rem' }}>© DESIGNED FOR LOVE</div>
                </div>
            )}
        </div>
    );
};

export default ValentineBanner;
