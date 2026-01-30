import { Suspense, lazy } from 'react';
const Hero = lazy(() => import('../components/home/Hero'));
import useMobile from '../hooks/useMobile';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/auth/AuthModal';

import ValueProps from '../components/home/ValueProps';
import CuratedSections from '../components/home/CuratedSections';
import SplitFeatured from '../components/home/SplitFeatured';
import Marquee from '../components/home/Marquee';
import Testimonials from '../components/home/Testimonials';
import BlogGrid from '../components/home/BlogGrid';

const Home = () => {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Simple trigger for the landing page
        if (!user) {
            const key = 'gsm_landing_popup_v10';
            if (!sessionStorage.getItem(key)) {
                const timer = setTimeout(() => {
                    setShowModal(true);
                    sessionStorage.setItem(key, 'true');
                }, 1500);
                return () => clearTimeout(timer);
            }
        }
    }, [user]);

    return (
        <>
            <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
            <Suspense fallback={<div style={{ height: '80vh', background: '#050505' }} />}>
                <Hero />
            </Suspense>
            <ValueProps />

            <CuratedSections title="New Arrivals" tag="New" limit={4} />

            <CuratedSections title="Trending Now" tag="Trending" limit={4} />

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

            <CuratedSections title="Best Sellers" tag="Bestseller" limit={4} />

            <Testimonials />
            <BlogGrid />
        </>
    );
};

export default Home;
