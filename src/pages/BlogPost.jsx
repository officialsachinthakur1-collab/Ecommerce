import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogPosts } from '../data/blogData';
import { ArrowLeft, Calendar, Tag, Share2 } from 'lucide-react';
import { useEffect } from 'react';

const BlogPost = () => {
    const { id } = useParams();
    const post = blogPosts.find(p => String(p.id) === String(id));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!post) {
        return (
            <div style={{ paddingTop: 'var(--header-height)', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h2>Article Not Found</h2>
                <Link to="/blog" className="btn-primary" style={{ marginTop: '1rem' }}>Back to Blog</Link>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--bg-color)', color: 'white', minHeight: '100vh', paddingBottom: '6rem' }}>
            {/* Hero Section */}
            <section style={{ position: 'relative', height: '60vh', minHeight: '400px', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `url(${post.image}) center/cover no-repeat`,
                    filter: 'brightness(0.4)'
                }} />
                <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '4rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <ArrowLeft size={16} /> Back to Blog
                        </Link>
                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--primary-red)', fontWeight: 'bold', fontSize: '0.875rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Tag size={14} /> {post.category}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.5)' }}><Calendar size={14} /> {post.date}</span>
                        </div>
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: '900', lineHeight: 1.1, maxWidth: '900px' }}>{post.title}</h1>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="container" style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'minmax(0, 800px) 1fr', gap: '4rem', alignItems: 'start' }}>
                <motion.article
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' }}
                >
                    <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

                    <div style={{ marginTop: '4rem', padding: '2rem', background: '#111', borderRadius: '12px', border: '1px solid #222' }}>
                        <h4 style={{ color: 'white', marginBottom: '1rem' }}>Share this article</h4>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button style={{ background: '#222', border: 'none', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Share2 size={18} /> Twitter
                            </button>
                            <button style={{ background: '#222', border: 'none', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Share2 size={18} /> LinkedIn
                            </button>
                        </div>
                    </div>
                </motion.article>

                <aside style={{ position: 'sticky', top: '100px' }}>
                    <div style={{ padding: '2rem', background: '#111', borderRadius: '16px', border: '1px solid #222' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Related Posts</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {blogPosts.filter(p => p.id !== post.id).slice(0, 2).map(p => (
                                <Link key={p.id} to={`/blog/${p.id}`} style={{ textDecoration: 'none', color: 'white', display: 'block' }}>
                                    <div style={{ height: '120px', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                                        <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <h4 style={{ fontSize: '1rem', lineHeight: 1.4, fontWeight: '600' }}>{p.title}</h4>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>
            </section>
        </div>
    );
};

export default BlogPost;
