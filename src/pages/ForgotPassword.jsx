import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const res = await forgotPassword(email);

        if (res.success) {
            setSuccess(true);
        } else {
            setError(res.message || 'Failed to send reset link');
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#050505',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    width: '100%',
                    maxWidth: '450px',
                    background: '#0a0a0a',
                    borderRadius: '32px',
                    border: '1px solid #333',
                    padding: '3rem',
                    textAlign: 'center',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.8)'
                }}
            >
                <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.85rem', marginBottom: '2rem', textDecoration: 'none' }}>
                    <ArrowLeft size={16} /> Back to Login
                </Link>

                {success ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <div style={{
                            width: '80px', height: '80px', background: 'rgba(74, 222, 128, 0.1)',
                            borderRadius: '50%', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', margin: '0 auto 2rem'
                        }}>
                            <CheckCircle size={40} color="#4ade80" />
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1rem' }}>SENT!</h2>
                        <p style={{ color: '#666', marginBottom: '2rem' }}>
                            If an account exists with that email, a reset link has been sent.
                        </p>
                        <Link to="/login" className="btn-primary" style={{ display: 'inline-block', padding: '1rem 2rem', borderRadius: '12px' }}>
                            Return to Login
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        <div style={{
                            width: '60px', height: '60px', background: 'var(--primary-red)',
                            borderRadius: '18px', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', margin: '0 auto 1.5rem'
                        }}>
                            <Mail size={30} color="white" />
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '1rem' }}>FORGOT PASSWORD?</h2>
                        <p style={{ color: '#666', marginBottom: '2.5rem' }}>
                            No worries, we'll send you reset instructions.
                        </p>

                        {error && (
                            <div style={{
                                background: 'rgba(255,0,0,0.1)', color: 'var(--primary-red)',
                                padding: '1rem', borderRadius: '12px', marginBottom: '2rem',
                                fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                border: '1px solid rgba(255,0,0,0.2)'
                            }}>
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ width: '100%', padding: '1.1rem 1.1rem 1.1rem 3.5rem', background: '#111', border: '1px solid #222', borderRadius: '14px', color: 'white', outline: 'none' }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                                style={{ padding: '1.1rem', borderRadius: '14px', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'} <ArrowRight size={20} />
                            </button>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
