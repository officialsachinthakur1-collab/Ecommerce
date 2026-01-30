import { Truck, ShieldCheck, RefreshCw, Zap } from 'lucide-react';

const ValueProps = () => {
    const props = [
        { icon: <Truck size={32} />, title: "Free Shipping", desc: "On all orders over ₹1,999" },
        { icon: <ShieldCheck size={32} />, title: "Secure Payment", desc: "100% secure checkout" },
        { icon: <RefreshCw size={32} />, title: "Free Returns", desc: "30-day return policy" },
        { icon: <Zap size={32} />, title: "Fast Delivery", desc: "2-3 business days" }
    ];

    return (
        <section className="container" style={{ padding: '4rem 2rem', borderBottom: '1px solid #111' }}>
            <div className="grid-4">
                {props.map((item, index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
                        <div style={{
                            color: 'var(--primary-red)',
                            background: 'rgba(255,0,0,0.1)',
                            padding: '1rem',
                            borderRadius: '50%'
                        }}>
                            {item.icon}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ValueProps;
