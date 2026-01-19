import { ArrowRight } from 'lucide-react';
import { blogPosts } from '../../data/blogData';

const BlogGrid = ({ posts }) => {
    const displayPosts = posts || blogPosts.slice(0, 3);

    return (
        <section className="container section-padding">
            <h2 style={{ fontSize: '2rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '3rem' }}>Latest Insights</h2>
            <div className="grid-3">
                {displayPosts.map((post) => (
                    <div key={post.id} style={{ cursor: 'pointer', group: 'hover' }}>
                        <div style={{
                            height: '250px',
                            background: `url(${post.image}) center/cover no-repeat`,
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            border: '1px solid #222',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', transition: 'background 0.3s' }} className="hover-overlay" />
                        </div>
                        <div style={{ color: 'var(--primary-red)', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                            {post.category}
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', lineHeight: '1.2', marginBottom: '1rem' }}>
                            {post.title}
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                            {post.excerpt}
                        </p>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Read Article <ArrowRight size={16} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BlogGrid;
