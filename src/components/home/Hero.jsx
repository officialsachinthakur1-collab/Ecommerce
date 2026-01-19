import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Float, Stars, PerspectiveCamera } from '@react-three/drei';
import TechCore from '../canvas/TechCore';
import SceneEffects from '../canvas/SceneEffects';
import { Suspense } from 'react';

const Hero = () => {
    return (
        <section className="hero-section">
            <div className="container hero-container">

                {/* Left: Text Content */}
                <div className="hero-text" style={{ zIndex: 10 }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{
                            fontSize: '5rem', // Fallback for desktop, overridden by CSS clamp
                            lineHeight: 0.9,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            marginBottom: '1.5rem',
                            backgroundImage: 'linear-gradient(to right, #fff, #aaa)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        Performance <br />
                        <span className="text-gradient">Undefined</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '500px' }}
                    >
                        Experience the future of footwear. Engineered for speed, designed for the streets.
                    </motion.p>

                    <Link to="/shop">
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="btn-primary"
                            style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}
                        >
                            Shop Collection
                        </motion.button>
                    </Link>
                </div>

                {/* Right: 3D Tech Core */}
                <div className="hero-canvas" style={{ height: '100%', width: '100%', position: 'relative' }}>
                    <Canvas dpr={[1, 2]} gl={{ antialias: false }}>
                        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
                        <color attach="background" args={['#050505']} />

                        <ambientLight intensity={0.2} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#ff0000" />
                        <pointLight position={[-10, -5, -10]} intensity={0.5} color="#555" />

                        <Suspense fallback={null}>
                            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                                <TechCore />
                            </Float>
                            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                            <SceneEffects />
                        </Suspense>
                    </Canvas>

                    {/* Red Glow Behind */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '600px',
                        height: '600px',
                        background: 'radial-gradient(circle, rgba(200,0,0,0.15) 0%, rgba(0,0,0,0) 70%)',
                        zIndex: -1,
                        pointerEvents: 'none'
                    }} />
                </div>
            </div>

            {/* Bottom: Countdown Timer */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="hero-countdown"
            >
                {['02', '14', '35', '58'].map((num, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{num}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            {['Days', 'Hours', 'Mins', 'Secs'][i]}
                        </div>
                    </div>
                ))}
            </motion.div>
        </section>
    );
};

export default Hero;
