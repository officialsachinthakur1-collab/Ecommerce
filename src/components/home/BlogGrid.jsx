import { ArrowRight } from 'lucide-react';
import { blogPosts } from '../../data/blogData';
import useMobile from '../../hooks/useMobile';
import { Link } from 'react-router-dom';

const BlogGrid = ({ posts }) => {
    const isMobile = useMobile();
    const displayPosts = posts || blogPosts.slice(0, isMobile ? 2 : 3);

    return (
        <section className="container section-padding">
            <h2 className="section-header-title" style={{ fontSize: '2rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '3rem' }}>Latest Insights</h2>
            <div className="grid-3 home-product-grid">
                {displayPosts.map((post) => (
                    <Link
                        key={post.id}
                        to={`/blog/${post.id}`}
                        style={{ textDecoration: 'none', color: 'white', display: 'block' }}
                    >
                        <div style={{ cursor: 'pointer', group: 'hover' }}>
                            <div style={{
                                height: '250px',
                                borderRadius: '8px',
                                marginBottom: '1.5rem',
                                border: '1px solid #222',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    loading="lazy"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'rgba(0,0,0,0.2)',
                                    transition: isMobile ? 'none' : 'background 0.3s'
                                }} className="hover-overlay" />
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
                            <div className="section-header-link" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Read Article <ArrowRight size={16} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default BlogGrid;
