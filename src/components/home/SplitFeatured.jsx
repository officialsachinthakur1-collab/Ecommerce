import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SplitFeatured = ({ title, subtitle, buttonText, imageLeft = false, linkTo = "/shop" }) => {
    return (
        <section>
            <div className="split-section split-section-container">
                {/* Content Side */}
                <div className="split-content" style={{ order: imageLeft ? 2 : 1 }}>
                    <h2 className="split-title">
                        {title}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '400px' }}>
                        {subtitle}
                    </p>
                    <div>
                        <Link to={linkTo} className="btn-primary" style={{ padding: '1rem 3rem', display: 'inline-block' }}>{buttonText}</Link>
                    </div>
                </div>

                {/* Image Side */}
                <div className="split-image" style={{ order: imageLeft ? 1 : 2 }}>
                    {/* Placeholder visual */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(45deg, #222 25%, #111 25%, #111 50%, #222 50%, #222 75%, #111 75%, #111 100%)',
                        backgroundSize: '40px 40px',
                        opacity: 0.1
                    }} />

                    {/* Glowing Center */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '60%',
                        height: '60%',
                        background: 'radial-gradient(circle, rgba(255,0,0,0.15) 0%, rgba(0,0,0,0) 70%)',
                    }} />
                </div>
            </div>
        </section>
    );
};

export default SplitFeatured;
