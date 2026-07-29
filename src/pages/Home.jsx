import { Suspense, lazy } from 'react';
const Hero = lazy(() => import('../components/home/Hero'));
import useMobile from '../hooks/useMobile';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/auth/AuthModal';

import CuratedSections from '../components/home/CuratedSections';
import BlogGrid from '../components/home/BlogGrid';

const Home = () => {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
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

            {/* Product Sections */}
            <CuratedSections title="Trending Now" tag="Trending" limit={8} />

            <CuratedSections title="Best Sellers" tag="Bestseller" limit={8} />

            <CuratedSections title="New Arrivals" tag="New" limit={8} />

            <CuratedSections title="Men's Fashion" category="Men" limit={8} />

            <CuratedSections title="Women's Fashion" category="Women" limit={8} />

            <CuratedSections title="All Store Products" limit={12} />

            <BlogGrid />
        </>
    );
};

export default Home;
