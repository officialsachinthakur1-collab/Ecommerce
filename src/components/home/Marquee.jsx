import { motion } from 'framer-motion';

import useMobile from '../../hooks/useMobile';

const Marquee = () => {
    const isMobile = useMobile();
    return (
        <div style={{
            padding: isMobile ? '2rem 0' : '4rem 0',
            background: 'var(--bg-secondary)',
            overflow: 'hidden',
            borderTop: '1px solid #222',
            borderBottom: '1px solid #222'
        }}>
            <motion.div
                animate={{ x: isMobile ? [0, -500] : [0, -1000] }}
                transition={{ repeat: Infinity, duration: isMobile ? 30 : 20, ease: 'linear' }}
                style={{ whiteSpace: 'nowrap', display: 'flex' }}
            >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <span key={i} style={{
                        fontSize: isMobile ? '3rem' : '6rem',
                        fontWeight: '900',
                        color: 'transparent',
                        WebkitTextStroke: '1px rgba(255,255,255,0.2)',
                        marginRight: '2rem',
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
