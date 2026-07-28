import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, X, Ticket, MessageSquare, Receipt, Scissors, ShieldAlert, DollarSign, AlertOctagon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useMobile from '../../hooks/useMobile';

const AdminSidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const isMobile = useMobile();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Package, label: 'Products', path: '/admin/products' },
        { icon: ShoppingBag, label: 'Channel Orders', path: '/admin/orders' },
        { icon: Scissors, label: 'Label Cropper (4x6)', path: '/admin/label-cropper' },
        { icon: Receipt, label: 'Hisab-Kitab', path: '/admin/hisab-kitab' },
        { icon: ShieldAlert, label: 'Return Claims (RTO)', path: '/admin/return-claims' },
        { icon: DollarSign, label: 'Payment Audit', path: '/admin/reconciliation' },
        { icon: AlertOctagon, label: 'Loss Alerts', path: '/admin/loss-alerts' },
        { icon: MessageSquare, label: 'Reviews', path: '/admin/reviews' },
        { icon: Ticket, label: 'Coupons', path: '/admin/coupons' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{
                    fontSize: '1.2rem',
                    fontWeight: '900',
                    letterSpacing: '-0.05em',
                    whiteSpace: 'nowrap'
                }}>
                    GETSETMART <span style={{ color: 'var(--primary-red)' }}>ADMIN</span>
                </div>
                {/* Mobile Close Button */}
                {isMobile && (
                    <button
                        onClick={onClose}
                        className="mobile-close-btn"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={24} />
                    </button>
                )}
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1, overflowY: 'auto' }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        end={item.path === '/admin'}
                        className={({ isActive }) =>
                            isActive ? "admin-nav-item active" : "admin-nav-item"
                        }
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.85rem',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '8px',
                            color: isActive ? 'white' : 'var(--text-muted)',
                            background: isActive ? 'var(--primary-red)' : 'transparent',
                            transition: 'all 0.3s',
                            textDecoration: 'none',
                            fontSize: '0.85rem',
                            fontWeight: isActive ? '600' : '400'
                        })}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <button
                onClick={handleLogout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.65rem 0.85rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    marginTop: 'auto',
                    fontSize: '0.85rem'
                }}
            >
                <LogOut size={18} />
                Logout
            </button>
        </aside>
    );
};

export default AdminSidebar;
