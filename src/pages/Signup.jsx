import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await signup(formData.name, formData.email, formData.password);
        if (res.success) {
            navigate('/login', { state: { message: "Account created! Please login." } });
        } else {
            setError(res.error);
        }
        setLoading(false);
    };

    return (
        <div style={{ paddingTop: 'var(--header-height)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    width: '100%',
                    maxWidth: '450px',
                    padding: '3rem',
                    background: '#111',
                    borderRadius: '24px',
                    border: '1px solid #222',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>JOINT THE <span className="text-gradient">MOVEMENT</span></h1>
                    <p style={{ color: '#666' }}>Create your account to track orders and more.</p>
                </div>

                {error && <div style={{ background: 'rgba(255,0,0,0.1)', color: 'var(--primary-red)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'center', border: '1px solid rgba(255,0,0,0.2)' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                        <input
                            type="text"
                            placeholder="Full Name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 3.5rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', color: 'white', outline: 'none' }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Mail size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 3.5rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', color: 'white', outline: 'none' }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={{ width: '100%', padding: '1.1rem 3.5rem 1.1rem 3.5rem', background: '#111', border: '1px solid #222', borderRadius: '14px', color: 'white', outline: 'none' }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '1.25rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: '#666',
                                cursor: 'pointer',
                                padding: '0',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ padding: '1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem' }}
                    >
                        {loading ? "Creating account..." : "Create Account"} <ArrowRight size={20} />
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
                    Already have an account? <Link to="/login" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>Log in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
