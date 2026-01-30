import { useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
// Temporarily disabled: Stars component causing "Star is not defined" error
// import { Stars } from '@react-three/drei';
import API_URL from '../config';

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
                        {/* <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /> */}
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
                            Born in 2024, GetSetMart was founded on a simple premise: motion is life. We noticed that while technology was evolving rapidly, footwear design was stagnant. We set out to change that.
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
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', color: 'var(--text-muted)' }}>
                    <span>Tokyo</span> • <span>Berlin</span> • <span>New York</span> • <span>London</span>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" style={{ padding: '8rem 0', background: 'linear-gradient(to top, #050505, #000)' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '2rem', textTransform: 'uppercase' }}>Get in <span className="text-gradient">Touch</span></h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '3rem' }}>
                            Have questions about our technology or a specific order? Our specialist team is here to help you move forward.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>HQ Address</h4>
                                <p style={{ color: 'var(--text-muted)' }}>123 Innovation Drive, Tech City, Metaverse 404</p>
                            </div>
                            <div>
                                <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Email</h4>
                                <p style={{ color: 'var(--text-muted)' }}>hello@getsetmart.com</p>
                            </div>
                            <div>
                                <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Support Line</h4>
                                <p style={{ color: 'var(--text-muted)' }}>+1 (800) GET-SET-NOW</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: '#0a0a0a', padding: '3rem', borderRadius: '24px', border: '1px solid #1a1a1a' }}>
                        <ContactForm />
                    </div>
                </div>
            </section>
        </div>
    );
};

const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });

        try {
            const res = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setMsg({ type: 'success', text: data.message });
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setMsg({ type: 'error', text: data.message || 'Error sending message' });
            }
        } catch (error) {
            setMsg({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ padding: '1rem', background: '#111', border: '1px solid #222', borderRadius: '8px', color: 'white' }}
                    required
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ padding: '1rem', background: '#111', border: '1px solid #222', borderRadius: '8px', color: 'white' }}
                    required
                />
            </div>
            <input
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                style={{ padding: '1rem', background: '#111', border: '1px solid #222', borderRadius: '8px', color: 'white' }}
                required
            />
            <textarea
                placeholder="Your Message"
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{ padding: '1rem', background: '#111', border: '1px solid #222', borderRadius: '8px', color: 'white', resize: 'none' }}
                required
            ></textarea>

            {msg.text && (
                <div style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    background: msg.type === 'success' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: msg.type === 'success' ? '#4ade80' : '#ef4444'
                }}>
                    {msg.text}
                </div>
            )}

            <button
                className="btn-primary"
                style={{ padding: '1.25rem', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
                disabled={loading}
            >
                {loading ? 'Sending...' : 'Send Message'}
            </button>
        </form>
    );
};

export default About;
