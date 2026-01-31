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
            height: isMobile ? '500px' : '400px',
            background: 'linear-gradient(to right, #fff5f5, #ffffff)',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '24px',
            border: '1px solid #fee2e2',
            margin: '2rem 0',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center'
        }}>
            {/* 3D Background Canvas */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.6, pointerEvents: 'none' }}>
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />

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

            {/* Product Image (Teddy Bear) */}
            <div style={{
                flex: 1,
                height: isMobile ? '250px' : '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                position: 'relative'
            }}>
                <motion.img
                    src="/assets/vday/teddy.png" // We'll move the generated image here
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, type: 'spring' }}
                    style={{
                        height: '90%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))'
                    }}
                />

                {/* Discount Tag */}
                <motion.div
                    initial={{ rotate: -20, scale: 0 }}
                    animate={{ rotate: -10, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    style={{
                        position: 'absolute',
                        bottom: '20%',
                        right: '15%',
                        background: '#fff',
                        padding: '0.5rem 1rem',
                        border: '2px solid #ff4d4d',
                        borderRadius: '8px',
                        fontWeight: '900',
                        color: '#ff4d4d',
                        boxShadow: '10px 10px 20px rgba(0,0,0,0.05)',
                        zIndex: 3
                    }}
                >
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Discount</div>
                    <div style={{ fontSize: '1.5rem' }}>50% OFF</div>
                </motion.div>
            </div>

            {/* Content Section */}
            <div style={{
                flex: 1,
                padding: isMobile ? '1rem 2rem 3rem' : '4rem',
                zIndex: 2,
                textAlign: isMobile ? 'center' : 'left'
            }}>
                <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        color: '#ff4d4d',
                        fontSize: '1rem',
                        fontWeight: '800',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        marginBottom: '0.5rem'
                    }}
                >
                    Premium Gift Collection
                </motion.h3>
                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        fontSize: isMobile ? '2.5rem' : '3.5rem',
                        fontWeight: '900',
                        lineHeight: 1,
                        color: '#111',
                        marginBottom: '1.5rem'
                    }}
                >
                    HAPPY <br />
                    <span style={{ color: '#ff4d4d' }}>VALENTINE'S</span> <br />
                    DAY
                </motion.h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        background: '#111',
                        color: 'white',
                        padding: '1rem 2.5rem',
                        borderRadius: '999px',
                        border: 'none',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }}
                >
                    SHOP NOW
                </motion.button>
            </div>
        </div>
    );
};

export default ValentineBanner;
