const Testimonials = () => {
    return (
        <section style={{ padding: '8rem 0', textAlign: 'center', background: '#080808' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <h2 className="testimonial-quote" style={{ fontWeight: '900', textTransform: 'uppercase', marginBottom: '2rem', lineHeight: '1.1' }}>
                    "The most comfortable <span className="text-gradient">performance</span> gear I've ever worn."
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '64px', height: '64px', background: '#333', borderRadius: '50%' }} />
                    <div>
                        <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>Alex Thompson</div>
                        <div style={{ color: 'var(--text-muted)' }}>Professional Athlete</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '3rem', height: '4px' }}>
                    <div style={{ width: '40px', background: 'var(--primary-red)' }} />
                    <div style={{ width: '40px', background: '#222' }} />
                    <div style={{ width: '40px', background: '#222' }} />
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
