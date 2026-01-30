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
        // Target Home Page explicitly for the auto-show
        const isHomePage = location.pathname === '/' || location.pathname === '/index.html';
        const isAuthPage = location.pathname.includes('signup') || location.pathname.includes('login') || location.pathname.includes('admin');

        if (!loading && !user && isHomePage && !isAuthPage) {
            const hasSeenModal = sessionStorage.getItem('gsm_auth_popup_fresh');

            if (!hasSeenModal) {
                const timer = setTimeout(() => {
                    setShowAuthModal(true);
                    sessionStorage.setItem('gsm_auth_popup_fresh', 'true');
                }, 2000); // 2-second delay for premium feel

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
