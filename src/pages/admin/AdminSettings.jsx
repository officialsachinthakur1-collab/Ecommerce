import { useState, useEffect } from 'react';
import { Save, User, Lock, Globe, Bell } from 'lucide-react';
import API_URL from '../../config';

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        siteName: 'GETSETMART',
        contactEmail: 'support@getsetmart.com',
        maintenanceMode: false,
        orderNotifications: true,
        stockAlerts: true,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${API_URL}/api/settings`);
                const data = await res.json();
                if (data.success && data.settings) {
                    setFormData(prev => ({
                        ...prev,
                        ...data.settings
                    }));
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Filter out password fields from general settings save
            const settingsToSave = { ...formData };
            delete settingsToSave.currentPassword;
            delete settingsToSave.newPassword;
            delete settingsToSave.confirmPassword;

            const res = await fetch(`${API_URL}/api/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings: settingsToSave })
            });

            const data = await res.json();
            if (data.success) {
                alert('Settings updated successfully!');
            } else {
                alert('Failed to save settings: ' + data.message);
            }
        } catch (error) {
            console.error("Error saving settings:", error);
            alert('Error connecting to server.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            alert("New passwords don't match!");
            return;
        }
        setLoading(true);
        // Implementation for admin password update would go here
        // For now, we simulate success
        setTimeout(() => {
            alert('Password update functionality coming soon in production!');
            setLoading(false);
        }, 1000);
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Settings</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your store preferences</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 240px) 1fr', gap: '3rem' }}>
                {/* Settings Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                        onClick={() => setActiveTab('general')}
                        style={{
                            padding: '1rem',
                            textAlign: 'left',
                            borderRadius: '8px',
                            background: activeTab === 'general' ? '#111' : 'transparent',
                            color: activeTab === 'general' ? 'white' : 'var(--text-muted)',
                            border: '1px solid',
                            borderColor: activeTab === 'general' ? '#333' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontWeight: activeTab === 'general' ? '600' : '400'
                        }}
                    >
                        <Globe size={18} /> General
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        style={{
                            padding: '1rem',
                            textAlign: 'left',
                            borderRadius: '8px',
                            background: activeTab === 'security' ? '#111' : 'transparent',
                            color: activeTab === 'security' ? 'white' : 'var(--text-muted)',
                            border: '1px solid',
                            borderColor: activeTab === 'security' ? '#333' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontWeight: activeTab === 'security' ? '600' : '400'
                        }}
                    >
                        <Lock size={18} /> Security
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        style={{
                            padding: '1rem',
                            textAlign: 'left',
                            borderRadius: '8px',
                            background: activeTab === 'notifications' ? '#111' : 'transparent',
                            color: activeTab === 'notifications' ? 'white' : 'var(--text-muted)',
                            border: '1px solid',
                            borderColor: activeTab === 'notifications' ? '#333' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontWeight: activeTab === 'notifications' ? '600' : '400'
                        }}
                    >
                        <Bell size={18} /> Notifications
                    </button>
                </div>

                {/* Content Area */}
                <div style={{ background: '#111', padding: '2rem', borderRadius: '16px', border: '1px solid #222' }}>

                    {activeTab === 'general' && (
                        <form onSubmit={handleSave}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Globe color="var(--primary-red)" /> General Configuration
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888', fontSize: '0.875rem' }}>Store Name</label>
                                    <input
                                        type="text"
                                        value={formData.siteName}
                                        onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                                        style={{ width: '100%', padding: '1rem', background: '#050505', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888', fontSize: '0.875rem' }}>Support Email</label>
                                    <input
                                        type="email"
                                        value={formData.contactEmail}
                                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                        style={{ width: '100%', padding: '1rem', background: '#050505', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.maintenanceMode}
                                        onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                                        style={{ width: '20px', height: '20px', accentColor: 'var(--primary-red)' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>Maintenance Mode</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Temporarily disable the storefront</div>
                                    </div>
                                </div>
                            </div>
                            <button className="btn-primary" style={{ marginTop: '2rem' }} disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    )}

                    {activeTab === 'security' && (
                        <form onSubmit={handlePasswordUpdate}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Lock color="var(--primary-red)" /> Security Settings
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888', fontSize: '0.875rem' }}>Current Password</label>
                                    <input
                                        type="password"
                                        value={formData.currentPassword}
                                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                        style={{ width: '100%', padding: '1rem', background: '#050505', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888', fontSize: '0.875rem' }}>New Password</label>
                                    <input
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                        style={{ width: '100%', padding: '1rem', background: '#050505', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888', fontSize: '0.875rem' }}>Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        style={{ width: '100%', padding: '1rem', background: '#050505', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                    />
                                </div>
                            </div>
                            <button className="btn-primary" style={{ marginTop: '2rem' }} disabled={loading}>
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    )}

                    {activeTab === 'notifications' && (
                        <form onSubmit={handleSave}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Bell color="var(--primary-red)" /> Notification Preferences
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: '#080808', borderRadius: '12px', border: '1px solid #222' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>New Order Alerts</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Receive email when a new order is placed</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.orderNotifications}
                                        onChange={(e) => setFormData({ ...formData, orderNotifications: e.target.checked })}
                                        style={{ width: '20px', height: '20px', accentColor: 'var(--primary-red)' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: '#080808', borderRadius: '12px', border: '1px solid #222' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Low Stock Warnings</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Get notified when product stock drops below 10</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.stockAlerts}
                                        onChange={(e) => setFormData({ ...formData, stockAlerts: e.target.checked })}
                                        style={{ width: '20px', height: '20px', accentColor: 'var(--primary-red)' }}
                                    />
                                </div>
                            </div>
                            <button className="btn-primary" style={{ marginTop: '2rem' }} disabled={loading}>
                                {loading ? 'Saving...' : 'Save Preferences'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

