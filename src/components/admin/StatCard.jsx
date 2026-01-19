import { motion } from 'framer-motion';

const StatCard = ({ title, value, change, icon: Icon, color = "var(--primary-red)" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                background: '#111',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid #222',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>{title}</h3>
                    <div style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.5rem' }}>{value}</div>
                </div>
                <div style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    background: `${color}20`,
                    color: color
                }}>
                    <Icon size={24} />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ color: '#4ade80', fontWeight: '600' }}>{change}</span>
                <span style={{ color: 'var(--text-muted)' }}>vs last month</span>
            </div>
        </motion.div>
    );
};

export default StatCard;
