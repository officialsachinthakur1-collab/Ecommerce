import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Float, Stars, PerspectiveCamera } from '@react-three/drei';
import TechCore from '../canvas/TechCore';
import SceneEffects from '../canvas/SceneEffects';
import { Suspense, useState, useEffect } from 'react';
import useMobile from '../../hooks/useMobile';

const Hero = () => {
    const isMobile = useMobile();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (!isMobile) return;
        const handleScroll = () => {
            // Pause 3D rendering when Hero is well off-screen
            setIsVisible(window.scrollY < 800);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile]);

    return (
        <section className="hero-section">
            {/* Full-Screen 3D Background */}
            <div className="hero-background-canvas">
                <Canvas
                    dpr={isMobile ? 1 : [1, 2]}
                    gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
                    frameloop={isVisible ? 'always' : 'never'}
                >
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
                    <color attach="background" args={['#050505']} />

                    <ambientLight intensity={0.2} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#ff0000" />
                    <pointLight position={[-10, -5, -10]} intensity={0.5} color="#555" />

                    <Suspense fallback={null}>
                        <Float speed={isMobile ? 1 : 2} rotationIntensity={isMobile ? 0.2 : 0.5} floatIntensity={isMobile ? 0.5 : 1}>
                            <TechCore />
                        </Float>
                        <Stars radius={100} depth={50} count={isMobile ? 1000 : 5000} factor={4} saturation={0} fade speed={1} />
                        {!isMobile && <SceneEffects />}
                    </Suspense>
                </Canvas>
            </div>

            <div className="container hero-container" style={{ position: 'relative', zIndex: 10 }}>
                {/* Centered Text Content */}
                <div className="hero-text-content" style={{ maxWidth: '1200px', width: '100%', textAlign: 'center', margin: '0 auto' }}>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{
                            fontSize: 'clamp(2.5rem, 10vw, 8rem)',
                            lineHeight: 1.1,
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            marginBottom: '2rem',
                            backgroundImage: 'linear-gradient(to bottom, #fff, #666)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.02em'
                        }}
                    >
                        Performance <br />
                        <span className="text-gradient">Undefined</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{
                            fontSize: '1.25rem',
                            color: 'var(--text-muted)',
                            marginBottom: '3rem',
                            maxWidth: '600px',
                            marginInline: 'auto'
                        }}
                    >
                        Experience the future of footwear. Engineered for speed, designed for the streets.
                    </motion.p>

                    <Link to="/shop">
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="btn-primary"
                            style={{ padding: '1.2rem 3.5rem', fontSize: '1.1rem', borderRadius: '4px' }}
                        >
                            Shop Collection
                        </motion.button>
                    </Link>
                </div>
            </div>

            {/* Bottom: Countdown Timer */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="hero-countdown"
            >
                <CountdownTimer />
            </motion.div>
        </section>
    );
};

const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        // Set target date to 2 days from now for demo purposes
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 2);
        targetDate.setHours(0, 0, 0, 0);

        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                // If timer ends, just reset to something or stay at 0
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const timeUnits = [
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.minutes },
        { label: 'Secs', value: timeLeft.seconds }
    ];

    return (
        <div style={{ display: 'flex', gap: '2rem', width: '100%', justifyContent: 'center' }}>
            {timeUnits.map((unit, i) => (
                <div key={i} style={{ textAlign: 'center', minWidth: '60px' }}>
                    <div style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        fontVariantNumeric: 'tabular-nums',
                        lineHeight: 1
                    }}>
                        {String(unit.value).padStart(2, '0')}
                    </div>
                    <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        marginTop: '0.25rem',
                        letterSpacing: '0.5px'
                    }}>
                        {unit.label}
                    </div>
                </div>
            ))}
        </div>
    );
};


export default Hero;
