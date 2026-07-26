import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AnnouncementBar from './AnnouncementBar';
import CartDrawer from '../cart/CartDrawer';
import WhatsAppButton from '../common/WhatsAppButton';
import { useAuth } from '../../context/AuthContext';

const Layout = () => {
    const { loading } = useAuth(); // Keep for sync if needed or remove
    return (
        <div style={{ background: 'var(--bg-color)', minHeight: '100vh', color: 'white' }}>
            <AnnouncementBar />
            <Navbar />
            <CartDrawer />
            <main>
                <Outlet />
            </main>
            <WhatsAppButton />
            <Footer />
        </div>
    );
};

export default Layout;
