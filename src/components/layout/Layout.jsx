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
        const isAuthOrAdmin = location.pathname.includes('login') || location.pathname.includes('signup') || location.pathname.includes('admin');

        console.log("Modal Trigger Check:", { user: !!user, isAuthOrAdmin, path: location.pathname });

        if (!user && !isAuthOrAdmin) {
            const key = 'gsm_final_v9';
            if (!sessionStorage.getItem(key)) {
                console.log("Modal timer starting...");
                const timer = setTimeout(() => {
                    console.log("Setting showAuthModal to true");
                    setShowAuthModal(true);
                    sessionStorage.setItem(key, 'true');
                }, 2000);
                return () => clearTimeout(timer);
            }
        }
    }, [user, location.pathname]);

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
