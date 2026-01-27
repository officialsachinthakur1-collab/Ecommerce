import { Suspense, lazy } from 'react';
const Hero = lazy(() => import('../components/home/Hero'));
import useMobile from '../hooks/useMobile';

import ValueProps from '../components/home/ValueProps';
import ProductGrid from '../components/home/ProductGrid';
import SplitFeatured from '../components/home/SplitFeatured';
import Marquee from '../components/home/Marquee';
import Testimonials from '../components/home/Testimonials';
import BlogGrid from '../components/home/BlogGrid';

const Home = () => {
    const isMobile = useMobile();
    return (
        <>
            {isMobile ? (
                <div style={{ height: '40vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, #111, #050505)', padding: '2rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(2rem, 10vw, 3.5rem)', fontWeight: 900, textTransform: 'uppercase', color: 'white', lineHeight: 1 }}>GetSet<span style={{ color: 'var(--primary-red)' }}>Mart</span></h1>
                    <p style={{ color: '#888', marginTop: '1rem', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>Performance Undefined</p>
                </div>
            ) : (
                <Suspense fallback={<div style={{ height: '80vh', background: '#050505' }} />}>
                    <Hero />
                </Suspense>
            )}
            <ValueProps />
            <ProductGrid />
            <SplitFeatured
                title="For Him"
                subtitle="Engineered for the modern athlete. Precision meets power."
                buttonText="Shop Men"
                linkTo="/shop?category=Men"
                imageLeft={false}
                image="/assets/banners/men_fashion.png"
            />
            <Marquee />
            <SplitFeatured
                title="For Her"
                subtitle="Uncompromising style and performance. Defined by you."
                buttonText="Shop Women"
                linkTo="/shop?category=Women"
                imageLeft={true}
                image="/assets/banners/women_fashion.png"
            />
            <Testimonials />
            <BlogGrid />
        </>
    );
};

export default Home;
