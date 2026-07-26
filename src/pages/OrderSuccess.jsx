import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
    return (
        <div style={{
            paddingTop: 'var(--header-height)',
            minHeight: '100vh',
            background: 'var(--bg-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ color: 'var(--primary-red)', marginBottom: '2rem' }}
            >
                <CheckCircle size={80} />
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}
            >
                ORDER CONFIRMED
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '500px' }}
            >
                Thank you for your purchase. We've sent a confirmation email to you. Your gear is pending dispatch.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Link to="/shop" className="btn-primary" style={{ padding: '1rem 3rem' }}>
                    Continue Shopping
                </Link>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
