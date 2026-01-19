import { motion } from 'framer-motion';

const Marquee = () => {
    return (
        <div style={{
            padding: '4rem 0',
            background: 'var(--bg-secondary)',
            overflow: 'hidden',
            borderTop: '1px solid #222',
            borderBottom: '1px solid #222'
        }}>
            <motion.div
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                style={{ whiteSpace: 'nowrap', display: 'flex' }}
            >
                {[1, 2, 3, 4].map((i) => (
                    <span key={i} style={{
                        fontSize: '6rem',
                        fontWeight: '900',
                        color: 'transparent',
                        WebkitTextStroke: '1px rgba(255,255,255,0.2)',
                        marginRight: '4rem',
                        textTransform: 'uppercase'
                    }}>
                        Statement Not Subtle —
                    </span>
                ))}
            </motion.div>
        </div>
    );
};

export default Marquee;
