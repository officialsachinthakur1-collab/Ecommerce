import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [successMsg, setSuccessMsg] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, signup, forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        if (showForgot) {
            const res = await forgotPassword(formData.email);
            if (res.success) {
                setSuccessMsg(res.message);
                // Optionally close after timeout or let them see the message
            } else {
                setError(res.error);
            }
            setLoading(false);
            return;
        }

        const res = isLogin
            ? await login(formData.email, formData.password)
            : await signup(formData.name, formData.email, formData.password);

        if (res.success) {
            onClose();
        } else {
            setError(res.error);
        }
        setLoading(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)' }}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '450px',
                            background: '#0a0a0a',
                            borderRadius: '32px',
                            border: '1px solid #333',
                            padding: '3rem',
                            boxShadow: '0 0 100px rgba(255,0,0,0.1), 0 30px 60px rgba(0,0,0,0.8)'
                        }}
                    >
                        <button
                            onClick={onClose}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <div style={{
                                width: '60px', height: '60px', background: 'var(--primary-red)', borderRadius: '18px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
                            }}>
                                <User size={30} color="white" />
                            </div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                                {showForgot ? 'RESET PASSWORD' : (isLogin ? 'WELCOME BACK' : 'JOIN THE CLUB')}
                            </h2>
                            <p style={{ color: '#666', fontSize: '0.95rem' }}>
                                {showForgot ? 'Enter your email to receive a reset link.' : (isLogin ? 'Sign in to track your gear.' : 'Create an account for the best experience.')}
                            </p>
                        </div>

                        {successMsg && (
                            <div style={{
                                background: 'rgba(0,255,0,0.1)', color: '#4ade80',
                                padding: '1rem', borderRadius: '12px', marginBottom: '2rem',
                                fontSize: '0.85rem', textAlign: 'center', border: '1px solid rgba(0,255,0,0.2)'
                            }}>
                                {successMsg}
                            </div>
                        )}

                        {error && (
                            <div style={{
                                background: 'rgba(255,0,0,0.1)', color: 'var(--primary-red)',
                                padding: '1rem', borderRadius: '12px', marginBottom: '2rem',
                                fontSize: '0.85rem', textAlign: 'center', border: '1px solid rgba(255,0,0,0.2)'
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {!isLogin && (
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={{ width: '100%', padding: '1.1rem 1.1rem 1.1rem 3.5rem', background: '#111', border: '1px solid #222', borderRadius: '14px', color: 'white', outline: 'none' }}
                                    />
                                </div>
                            )}

                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={{ width: '100%', padding: '1.1rem 1.1rem 1.1rem 3.5rem', background: '#111', border: '1px solid #222', borderRadius: '14px', color: 'white', outline: 'none' }}
                                />
                            </div>

                            {!showForgot && (
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        style={{ width: '100%', padding: '1.1rem 1.1rem 1.1rem 3.5rem', background: '#111', border: '1px solid #222', borderRadius: '14px', color: 'white', outline: 'none' }}
                                    />
                                </div>
                            )}

                            {isLogin && !showForgot && (
                                <div style={{ textAlign: 'right' }}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForgot(true);
                                            setError('');
                                            setSuccessMsg('');
                                        }}
                                        style={{ background: 'transparent', border: 'none', color: '#666', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                                style={{ padding: '1.1rem', borderRadius: '14px', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                            >
                                {loading ? 'Processing...' : (showForgot ? 'Send Reset Link' : (isLogin ? 'Log In' : 'Sign Up'))} <ArrowRight size={20} />
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666', fontSize: '0.9rem' }}>
                            {showForgot ? (
                                <button
                                    onClick={() => {
                                        setShowForgot(false);
                                        setError('');
                                        setSuccessMsg('');
                                    }}
                                    style={{ background: 'transparent', border: 'none', color: 'white', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                                >
                                    Back to Login
                                </button>
                            ) : (
                                <>
                                    {isLogin ? "New here?" : "Already a member?"} {' '}
                                    <button
                                        onClick={() => {
                                            setIsLogin(!isLogin);
                                            setError('');
                                            setSuccessMsg('');
                                        }}
                                        style={{ background: 'transparent', border: 'none', color: 'white', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                                    >
                                        {isLogin ? 'Create Account' : 'Sign In'}
                                    </button>
                                </>
                            )}
                        </p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
