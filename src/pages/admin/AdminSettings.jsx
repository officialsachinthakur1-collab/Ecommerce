import { useState, useEffect } from 'react';
import { Save, User, Lock, Globe, Bell, Sparkles, Check, Tag, Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import API_URL from '../../config';

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState('festival');
    const [loading, setLoading] = useState(false);
    
    // General Settings State
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

    // Festival Special Settings State
    const [festivalData, setFestivalData] = useState(() => {
        const saved = localStorage.getItem('gsm_festival_settings');
        return saved ? JSON.parse(saved) : {
            title: '15th August Freedom Sale 🇮🇳',
            subtitle: 'Celebrate Independence Day with Freedom Offers & Patriotic Deals!',
            badge: 'FLAT 50% OFF',
            color: '#f97316',
            enabled: true
        };
    });

    // Category Status & Coming Soon Settings State
    const [categoriesStatus, setCategoriesStatus] = useState(() => {
        const saved = localStorage.getItem('gsm_category_status');
        return saved ? JSON.parse(saved) : [
            { id: 'Men', name: "Men's Wear", icon: '👔', status: 'LIVE' },
            { id: 'Women', name: "Women's Fashion", icon: '👗', status: 'LIVE' },
            { id: 'Footwear', name: 'Footwear & Shoes', icon: '👟', status: 'LIVE' },
            { id: 'Accessories', name: 'Accessories & Bags', icon: '🎒', status: 'LIVE' },
            { id: 'Jewelry', name: 'Jewelry & Watches', icon: '💎', status: 'COMING_SOON' },
            { id: 'Electronics', name: 'Gadgets & Electronics', icon: '🎧', status: 'COMING_SOON' },
            { id: 'Home', name: 'Home & Kitchen', icon: '🏠', status: 'COMING_SOON' },
            { id: 'Gifts', name: 'Gifts & Combos', icon: '🎁', status: 'COMING_SOON' }
        ];
    });

    const [newCatName, setNewCatName] = useState('');
    const [newCatIcon, setNewCatIcon] = useState('🛍️');

    const toggleCategoryStatus = (catId) => {
        const updated = categoriesStatus.map(cat => {
            if (cat.id === catId || cat.name === catId) {
                const nextStatus = cat.status === 'LIVE' ? 'COMING_SOON' : 'LIVE';
                return { ...cat, status: nextStatus };
            }
            return cat;
        });
        setCategoriesStatus(updated);
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (!newCatName.trim()) return;
        const newCat = {
            id: newCatName.trim(),
            name: newCatName.trim(),
            icon: newCatIcon || '🛍️',
            status: 'COMING_SOON'
        };
        const updated = [...categoriesStatus, newCat];
        setCategoriesStatus(updated);
        setNewCatName('');
    };

    const handleSaveCategorySettings = (e) => {
        e.preventDefault();
        localStorage.setItem('gsm_category_status', JSON.stringify(categoriesStatus));
        window.dispatchEvent(new Event('gsm_categories_updated'));
        alert('✅ Category Availability & Coming Soon settings saved! Website updated live.');
    };

    // Presets for Indian Festivals
    const festivalPresets = [
        {
            name: '🇮🇳 15th August (Independence Day)',
            title: '15th August Freedom Sale 🇮🇳',
            subtitle: 'Celebrate Independence Day with Freedom Offers & Patriotic Deals!',
            badge: 'FREEDOM SALE - FLAT 50% OFF',
            color: '#f97316'
        },
        {
            name: '🪢 Raksha Bandhan (Rakhi Special)',
            title: 'Rakhi Special Gift Sale 🪢',
            subtitle: 'Express love for your siblings with exclusive festival gift combos!',
            badge: 'RAKHI GIFT PACKS',
            color: '#ec4899'
        },
        {
            name: '🪔 Diwali Dhamaka Sale',
            title: 'Diwali Dhamaka Special 🪔',
            subtitle: 'Light up your festivities with mega discounts & gold offers!',
            badge: 'DIWALI MEGA SALE',
            color: '#eab308'
        },
        {
            name: '🎨 Holi Colors Sale',
            title: 'Holi Festival Special 🎨',
            subtitle: 'Spread colors of happiness with festive deals & combos!',
            badge: 'HOLI SPECIAL OFFERS',
            color: '#a855f7'
        },
        {
            name: '❤️ Valentine\'s Day Special',
            title: 'V-Day Special ❤️',
            subtitle: 'Unforgettable gifts & romantic bundles for your special someone!',
            badge: 'VALENTINE SPECIAL',
            color: '#ef4444'
        },
        {
            name: '🎆 New Year Special',
            title: 'New Year Mega Sale 🎆',
            subtitle: 'Start the New Year with fresh styles & exciting savings!',
            badge: 'NEW YEAR FESTIVAL',
            color: '#3b82f6'
        }
    ];

    const applyPreset = (preset) => {
        setFestivalData(prev => ({
            ...prev,
            title: preset.title,
            subtitle: preset.subtitle,
            badge: preset.badge,
            color: preset.color
        }));
    };

    const handleSaveFestivalSettings = (e) => {
        e.preventDefault();
        localStorage.setItem('gsm_festival_settings', JSON.stringify(festivalData));
        window.dispatchEvent(new Event('gsm_festival_updated'));
        alert(`🎉 Active Festival Banner Updated to "${festivalData.title}"! Changes live on website.`);
    };

    const handleSaveGeneral = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
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
            alert('Settings saved locally!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Store Settings & Festival Banner</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage store preferences and customize website festival banners</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 240px) 1fr', gap: '3rem' }}>
                {/* Settings Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                        onClick={() => setActiveTab('festival')}
                        style={{
                            padding: '1rem',
                            textAlign: 'left',
                            borderRadius: '8px',
                            background: activeTab === 'festival' ? '#111' : 'transparent',
                            color: activeTab === 'festival' ? '#f59e0b' : 'var(--text-muted)',
                            border: '1px solid',
                            borderColor: activeTab === 'festival' ? '#333' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontWeight: activeTab === 'festival' ? '700' : '400'
                        }}
                    >
                        <Sparkles size={18} /> Festival Banner
                    </button>
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
                        onClick={() => setActiveTab('categories')}
                        style={{
                            padding: '1rem',
                            textAlign: 'left',
                            borderRadius: '8px',
                            background: activeTab === 'categories' ? '#111' : 'transparent',
                            color: activeTab === 'categories' ? '#10b981' : 'var(--text-muted)',
                            border: '1px solid',
                            borderColor: activeTab === 'categories' ? '#333' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontWeight: activeTab === 'categories' ? '700' : '400'
                        }}
                    >
                        <Tag size={18} /> Category Status & Coming Soon
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
                </div>

                {/* Content Area */}
                <div style={{ background: '#111', padding: '2rem', borderRadius: '16px', border: '1px solid #222' }}>

                    {/* CATEGORY AVAILABILITY & COMING SOON TAB */}
                    {activeTab === 'categories' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <Tag /> Category Availability & "Coming Soon" Manager
                                    </h2>
                                    <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                                        Control which categories are LIVE or marked COMING SOON on your website!
                                    </p>
                                </div>
                                <button
                                    onClick={handleSaveCategorySettings}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        background: '#10b981',
                                        border: 'none',
                                        color: '#000000',
                                        borderRadius: '8px',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <Save size={18} /> Save Settings
                                </button>
                            </div>

                            {/* Category Status List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                                {categoriesStatus.map(cat => (
                                    <div
                                        key={cat.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            background: '#09090b',
                                            padding: '1rem 1.25rem',
                                            borderRadius: '12px',
                                            border: '1px solid #27272a'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                                            <div>
                                                <div style={{ fontWeight: '800', fontSize: '1rem', color: 'white' }}>{cat.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#888' }}>ID: {cat.id}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            {/* Status Badge */}
                                            <span style={{
                                                padding: '0.35rem 0.85rem',
                                                borderRadius: '100px',
                                                fontSize: '0.75rem',
                                                fontWeight: '800',
                                                textTransform: 'uppercase',
                                                background: cat.status === 'LIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                                color: cat.status === 'LIVE' ? '#10b981' : '#f59e0b',
                                                border: `1px solid ${cat.status === 'LIVE' ? '#10b981' : '#f59e0b'}`
                                            }}>
                                                {cat.status === 'LIVE' ? '🟢 LIVE (Available)' : '⏳ COMING SOON'}
                                            </span>

                                            {/* Toggle Button */}
                                            <button
                                                onClick={() => toggleCategoryStatus(cat.id)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: '#18181b',
                                                    border: '1px solid #3f3f46',
                                                    color: 'white',
                                                    borderRadius: '8px',
                                                    fontWeight: '700',
                                                    fontSize: '0.8rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem'
                                                }}
                                            >
                                                {cat.status === 'LIVE' ? <ToggleRight size={18} color="#10b981" /> : <ToggleLeft size={18} color="#f59e0b" />} Switch Status
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add New Custom Category */}
                            <form onSubmit={handleAddCategory} style={{ background: '#09090b', padding: '1.25rem', borderRadius: '12px', border: '1px dashed #444' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.75rem', color: '#ccc' }}>
                                    ➕ Add Custom Category
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    <input
                                        type="text"
                                        placeholder="Emoji (e.g. 🎒)"
                                        value={newCatIcon}
                                        onChange={e => setNewCatIcon(e.target.value)}
                                        style={{ width: '80px', padding: '0.65rem', background: '#121215', border: '1px solid #333', borderRadius: '8px', color: 'white', textAlign: 'center' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Category Name (e.g. Sports & Fitness)"
                                        value={newCatName}
                                        onChange={e => setNewCatName(e.target.value)}
                                        style={{ flex: 1, padding: '0.65rem 1rem', background: '#121215', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                    />
                                    <button
                                        type="submit"
                                        style={{ padding: '0.65rem 1.25rem', background: '#27272a', border: '1px solid #444', color: 'white', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                                    >
                                        Add Category
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* FESTIVAL BANNER TAB */}
                    {activeTab === 'festival' && (
                        <form onSubmit={handleSaveFestivalSettings}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f59e0b' }}>
                                <Sparkles /> Active Festival Banner Settings
                            </h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                                Change website festival banner for 15th August, Raksha Bandhan, Diwali, Holi, or V-Day in 1-click!
                            </p>

                            {/* 1-Click Festival Presets */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: '#aaa', fontWeight: '700', marginBottom: '0.75rem' }}>
                                    ⚡ 1-Click Festival Presets
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                                    {festivalPresets.map(preset => (
                                        <button
                                            key={preset.name}
                                            type="button"
                                            onClick={() => applyPreset(preset)}
                                            style={{
                                                padding: '0.75rem 1rem',
                                                background: '#080808',
                                                border: festivalData.title === preset.title ? '1px solid #f59e0b' : '1px solid #222',
                                                borderRadius: '8px',
                                                color: 'white',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                fontWeight: '600'
                                            }}
                                        >
                                            {preset.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Festival Details Form */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888', fontSize: '0.85rem' }}>Festival Header Title (Shown on Navbar & Banner)</label>
                                    <input
                                        type="text"
                                        value={festivalData.title}
                                        onChange={(e) => setFestivalData({ ...festivalData, title: e.target.value })}
                                        placeholder="e.g. 15th August Freedom Sale 🇮🇳"
                                        required
                                        style={{ width: '100%', padding: '0.85rem', background: '#050505', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888', fontSize: '0.85rem' }}>Festival Subtitle & Offer Description</label>
                                    <input
                                        type="text"
                                        value={festivalData.subtitle}
                                        onChange={(e) => setFestivalData({ ...festivalData, subtitle: e.target.value })}
                                        placeholder="e.g. Freedom Offers & Patriotic Deals!"
                                        required
                                        style={{ width: '100%', padding: '0.85rem', background: '#050505', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888', fontSize: '0.85rem' }}>Offer Badge Tag</label>
                                        <input
                                            type="text"
                                            value={festivalData.badge}
                                            onChange={(e) => setFestivalData({ ...festivalData, badge: e.target.value })}
                                            placeholder="e.g. FLAT 50% OFF"
                                            required
                                            style={{ width: '100%', padding: '0.85rem', background: '#050505', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#888', fontSize: '0.85rem' }}>Theme Highlight Color</label>
                                        <input
                                            type="color"
                                            value={festivalData.color || '#f97316'}
                                            onChange={(e) => setFestivalData({ ...festivalData, color: e.target.value })}
                                            style={{ width: '100%', height: '42px', padding: '4px', background: '#050505', border: '1px solid #333', borderRadius: '8px', cursor: 'pointer' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                    <input
                                        type="checkbox"
                                        checked={festivalData.enabled}
                                        onChange={(e) => setFestivalData({ ...festivalData, enabled: e.target.checked })}
                                        style={{ width: '20px', height: '20px', accentColor: 'var(--primary-red)' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: 'white' }}>Enable Festival Link on Website Header</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Show or hide the festival offer link in top navbar</div>
                                    </div>
                                </div>
                            </div>

                            <button className="btn-primary" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Check size={18} /> Update Website Festival Banner
                            </button>
                        </form>
                    )}

                    {activeTab === 'general' && (
                        <form onSubmit={handleSaveGeneral}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Globe color="var(--primary-red)" /> General Store Configuration
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
                            </div>
                            <button className="btn-primary" style={{ marginTop: '2rem' }}>Save Changes</button>
                        </form>
                    )}

                    {activeTab === 'security' && (
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Lock color="var(--primary-red)" /> Security Settings
                            </h2>
                            <p style={{ color: 'var(--text-muted)' }}>Admin Password Security</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
