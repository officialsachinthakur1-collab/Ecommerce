import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Tag } from 'lucide-react';
import BlogGrid from '../components/home/BlogGrid';
import { blogPosts } from '../data/blogData';

const Blog = () => {
    const featuredPost = blogPosts.find(post => post.featured);
    const otherPosts = blogPosts.filter(post => !post.featured);

    return (
        <div style={{ paddingTop: 'var(--header-height)', minHeight: '100vh', background: 'var(--bg-color)', color: 'white' }}>

            {/* Header */}
            <section style={{
                padding: '6rem 2rem 4rem',
                background: 'linear-gradient(to bottom, #111, var(--bg-color))',
                textAlign: 'center'
            }}>
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            fontSize: 'clamp(3rem, 6vw, 5rem)',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            marginBottom: '1rem',
                            letterSpacing: '-0.02em'
                        }}
                    >
                        Edge of <span className="text-gradient">Innovation</span>
                    </motion.h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        Deep dives into design, performance technology, and the future of streetwear culture.
                    </p>
                </div>
            </section>

            {/* Featured Article */}
            {featuredPost && (
                <section className="container section-padding" style={{ paddingTop: 0 }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '3rem',
                            background: '#111',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '1px solid #222'
                        }}
                    >
                        {/* Image */}
                        <div style={{
                            height: 'auto',
                            minHeight: '300px',
                            background: `url(${featuredPost.image}) center/cover no-repeat`
                        }}></div>

                        {/* Content */}
                        <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={14} /> {featuredPost.date}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Tag size={14} /> {featuredPost.category}</span>
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '1.5rem' }}>
                                {featuredPost.title}
                            </h2>
                            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
                                {featuredPost.excerpt}
                            </p>
                            <button className="btn-primary" style={{ alignSelf: 'start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Read Full Story <ArrowUpRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                </section>
            )}

            {/* More Articles */}
            <BlogGrid posts={otherPosts} />

            {/* Newsletter CTA */}
            <section style={{ padding: '6rem 0', background: '#050505', borderTop: '1px solid #222' }}>
                <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>NEVER MISS A DROP</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Sign up for exclusive access to new releases and insider content.</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input type="email" placeholder="Enter your email" style={{ flex: 1, padding: '1rem', background: '#111', border: '1px solid #333', color: 'white', borderRadius: '4px' }} />
                        <button className="btn-primary" style={{ whiteSpace: 'nowrap' }}>Subscribe</button>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Blog;
