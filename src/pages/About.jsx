import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars, Float, MeshDistortMaterial } from '@react-three/drei';

const About = () => {
    return (
        <div style={{ paddingTop: 'var(--header-height)' }}>

            {/* Hero Section */}
            <section style={{
                height: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(to bottom, #050505, #111)'
            }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                    <Canvas>
                        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    </Canvas>
                </div>

                <div className="container" style={{ textAlign: 'center', zIndex: 10 }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            fontSize: 'clamp(3rem, 8vw, 6rem)',
                            fontWeight: '900',
                            lineHeight: 0.9,
                            marginBottom: '1rem',
                            textTransform: 'uppercase'
                        }}
                    >
                        Future <br />
                        <span className="text-gradient">Forward</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{
                            color: 'var(--text-muted)',
                            fontSize: '1.25rem',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}
                    >
                        We don't just design footwear. We engineer momentum.
                    </motion.p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="section-padding container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Our Mission</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            Born in 2024, Nivest was founded on a simple premise: motion is life. We noticed that while technology was evolving rapidly, footwear design was stagnant. We set out to change that.
                        </p>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
                            Our team of designers, engineers, and athletes work in unison to create products that don't just look fast—they make you feel fast. Every curve, every material, and every stitch is calculated for maximum performance and minimal drag.
                        </p>
                    </div>
                    <div style={{
                        height: '400px',
                        background: '#111',
                        borderRadius: '12px',
                        border: '1px solid #222',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                        <Canvas>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[2, 5, 2]} intensity={1} />
                            <Float speed={2} rotationIntensity={2} floatIntensity={2}>
                                <mesh scale={2.5}>
                                    <sphereGeometry args={[1, 64, 64]} />
                                    <MeshDistortMaterial
                                        color="#ff3333"
                                        attach="material"
                                        distort={0.5}
                                        speed={2}
                                        roughness={0.2}
                                        metalness={0.8}
                                    />
                                </mesh>
                            </Float>
                        </Canvas>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section style={{ background: '#0a0a0a', padding: '6rem 0' }}>
                <div className="container">
                    <div className="grid-3">
                        <div style={{ padding: '2rem', border: '1px solid #222', borderRadius: '8px', background: '#050505' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary-red)' }}>01. Innovation</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                We constantly push the boundaries of what's possible, using next-gen materials and 3D printing technology.
                            </p>
                        </div>
                        <div style={{ padding: '2rem', border: '1px solid #222', borderRadius: '8px', background: '#050505' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary-red)' }}>02. Sustainability</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                The future looks bright. We use 100% recycled polymers and zero-waste manufacturing processes.
                            </p>
                        </div>
                        <div style={{ padding: '2rem', border: '1px solid #222', borderRadius: '8px', background: '#050505' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary-red)' }}>03. Performance</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                Aesthetics never compromise function. Our gear is stress-tested by elite athletes in extreme conditions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Header (Placeholder) */}
            <section className="section-padding container" style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '3rem', textTransform: 'uppercase' }}>Global Design Team</h2>
                <p style={{ color: 'var(--text-muted)' }}>Locations: Tokyo • Berlin • New York • London</p>
            </section>

        </div>
    );
};

export default About;
