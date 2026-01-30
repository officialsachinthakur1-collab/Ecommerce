import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import AnnouncementBar from './AnnouncementBar';
import CartDrawer from '../cart/CartDrawer';
import AuthModal from '../auth/AuthModal';

const Layout = () => {
    const { user, loading } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        // Only trigger if not loading and user is a guest
        if (!loading && !user) {
            const hasSeenModal = sessionStorage.getItem('hasSeenAuthModal');

            if (!hasSeenModal) {
                const timer = setTimeout(() => {
                    setShowAuthModal(true);
                    sessionStorage.setItem('hasSeenAuthModal', 'true');
                }, 3000); // 3-second delay like Amazon/Premium sites

                return () => clearTimeout(timer);
            }
        }
    }, [user, loading]);

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
