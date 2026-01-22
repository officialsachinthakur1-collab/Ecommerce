import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Package, label: 'Products', path: '/admin/products' },
        { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.05em' }}>
                    NIVEST <span style={{ color: 'var(--primary-red)' }}>ADMIN</span>
                </div>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="mobile-close-btn"
                    style={{
                        display: 'none', /* Hidden by default, explicit CSS can override */
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    <X size={24} />
                </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose} // Close sidebar on mobile nav
                        end={item.path === '/admin'}
                        className={({ isActive }) =>
                            isActive ? "admin-nav-item active" : "admin-nav-item"
                        }
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            color: isActive ? 'white' : 'var(--text-muted)',
                            background: isActive ? 'var(--primary-red)' : 'transparent',
                            transition: 'all 0.3s',
                            textDecoration: 'none',
                            fontWeight: isActive ? '600' : '400'
                        })}
                    >
                        <item.icon size={20} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <button
                onClick={handleLogout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    marginTop: 'auto'
                }}
            >
                <LogOut size={20} />
                Logout
            </button>
        </aside>
    );
};

export default AdminSidebar;
