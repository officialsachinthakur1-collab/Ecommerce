import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#050505', color: 'white' }}>
            <AdminSidebar />
            <main style={{ flex: 1, marginLeft: '250px', padding: '2rem' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
