import { motion } from 'framer-motion';
import useMobile from '../../hooks/useMobile';

const Marquee = () => {
    const isMobile = useMobile();
    const items = ["Statement Not Subtle", "Statement Not Subtle", "Statement Not Subtle", "Statement Not Subtle", "Statement Not Subtle", "Statement Not Subtle"];
    return (
        <section style={{ borderBottom: '1px solid #111', padding: isMobile ? '1rem 0' : '2.5rem 0', overflow: 'hidden', background: '#050505' }}>
            <div className="marquee-wrapper">
                <div className="marquee-content">
                    {items.map((item, index) => (
                        <div key={index} className="marquee-item">
                            <span className="marquee-dot" />
                            {item}
                        </div>
                    ))}
                    {/* Duplicate for seamless loop */}
                    {items.map((item, index) => (
                        <div key={`dup-${index}`} className="marquee-item">
                            <span className="marquee-dot" />
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Marquee;
