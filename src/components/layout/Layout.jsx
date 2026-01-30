import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import AnnouncementBar from './AnnouncementBar';
import CartDrawer from '../cart/CartDrawer';
import AuthModal from '../auth/AuthModal';

const Layout = () => {
    const { user, loading } = useAuth();
    const location = useLocation();
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        // Don't show on auth pages or if already logged in
        const isAuthPage = location.pathname.includes('signup') || location.pathname.includes('login');

        if (!loading && !user && !isAuthPage) {
            const hasSeenModal = sessionStorage.getItem('gsm_auth_popup_v1');

            if (!hasSeenModal) {
                const timer = setTimeout(() => {
                    setShowAuthModal(true);
                    sessionStorage.setItem('gsm_auth_popup_v1', 'true');
                }, 2500); // Slightly faster trigger

                return () => clearTimeout(timer);
            }
        }
    }, [user, loading, location.pathname]);

    return (
        <div style={{ background: 'var(--bg-color)', minHeight: '100vh', color: 'white' }}>
            <AnnouncementBar />
            <Navbar />
            <CartDrawer />
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
