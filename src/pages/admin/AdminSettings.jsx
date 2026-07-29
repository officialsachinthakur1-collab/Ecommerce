import { useState, useEffect } from 'react';
import { Save, User, Lock, Globe, Bell, Sparkles, Check, Tag, Plus, ToggleLeft, ToggleRight, Image, Upload, Trash2 } from 'lucide-react';
import API_URL from '../../config';

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState('hero_slides');
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

    // Custom Hero Banner Slider State
    const [heroSlidesList, setHeroSlidesList] = useState(() => {
        const saved = localStorage.getItem('gsm_custom_hero_slides');
        return saved ? JSON.parse(saved) : [
            {
                id: 'coming-soon-hero-1',
                tag: '🚀 COMING SOON LAUNCH',
                title: 'ELECTRONICS & JEWELRY LAUNCHING SOON',
                description: 'WE ARE HAND-PICKING PREMIUM HIGH-QUALITY ITEMS. GET READY FOR EXCLUSIVE EARLY ACCESS DISCOUNTS!',
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
                btnText: 'GET VIP EARLY ACCESS ➔',
                btnLink: '/shop?category=Electronics',
                bgGradient: '#311b92',
                enabled: true
            }
        ];
    });

    const [newHeroForm, setNewHeroForm] = useState({
        tag: '🚀 COMING SOON LAUNCH',
        title: '',
        description: '',
        image: '',
        btnText: 'EXPLORE NOW ➔',
        btnLink: '/shop',
        bgGradient: '#311b92'
    });

    const handleAddHeroSlide = (e) => {
        e.preventDefault();
        if (!newHeroForm.title.trim()) {
            alert('Please enter a Hero Slide Title!');
            return;
        }
        const newSlide = {
            id: `hero-${Date.now()}`,
            ...newHeroForm,
            enabled: true
        };
        const updated = [newSlide, ...heroSlidesList];
        setHeroSlidesList(updated);
        localStorage.setItem('gsm_custom_hero_slides', JSON.stringify(updated));
        window.dispatchEvent(new Event('gsm_hero_slides_updated'));
        setNewHeroForm({
            tag: '🚀 COMING SOON LAUNCH',
            title: '',
            description: '',
            image: '',
            btnText: 'EXPLORE NOW ➔',
            btnLink: '/shop',
            bgGradient: '#311b92'
        });
        alert('✅ New Hero Banner Slide Added & Published Live to Homepage!');
    };

    const handleToggleHeroSlide = (id) => {
        const updated = heroSlidesList.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s);
        setHeroSlidesList(updated);
        localStorage.setItem('gsm_custom_hero_slides', JSON.stringify(updated));
        window.dispatchEvent(new Event('gsm_hero_slides_updated'));
    };

    const handleDeleteHeroSlide = (id) => {
        if (!window.confirm("Are you sure you want to delete this Hero Banner slide?")) return;
        const updated = heroSlidesList.filter(s => s.id !== id);
        setHeroSlidesList(updated);
        localStorage.setItem('gsm_custom_hero_slides', JSON.stringify(updated));
        window.dispatchEvent(new Event('gsm_hero_slides_updated'));
    };

    const handleHeroFileUpload = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewHeroForm(prev => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
    };

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
            title: 'Diwali Festive Light Sale 🪔',
            subtitle: 'Light up your life with festive discounts & mega cashback offers!',
            badge: 'DIWALI SPECIAL OFFERS',
            color: '#eab308'
        },
        {
            name: '🎅 Christmas & New Year Fest',
            title: 'Year-End Mega Carnival 🎅',
            subtitle: 'Grand end of year savings across all fashion & lifestyle categories!',
            badge: 'YEAR END MEGA SALE',
            color: '#ef4444'
        }
    ];

    const applyPreset = (preset) => {
        setFestivalData({
            title: preset.title,
            subtitle: preset.subtitle,
            badge: preset.badge,
            color: preset.color,
            enabled: true
        });
    };

    const handleFestivalSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('gsm_festival_settings', JSON.stringify(festivalData));
        window.dispatchEvent(new CustomEvent('gsm_festival_updated', { detail: festivalData }));
        alert('✅ Festival Banner settings saved! Hero section updated live.');
    };

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

    const handleGeneralSubmit = (e) => {
        e.preventDefault();
        alert('Settings updated successfully!');
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Store & Hero Settings</h1>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Configure Homepage Banners, Hero Slider & Category Availability</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 240px) 1fr', gap: '3rem' }}>
                {/* Settings Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                        onClick={() => setActiveTab('hero_slides')}
                        style={{
                            padding: '1rem',
                            textAlign: 'left',
                            borderRadius: '8px',
                            background: activeTab === 'hero_slides' ? '#111' : 'transparent',
                            color: activeTab === 'hero_slides' ? '#f59e0b' : 'var(--text-muted)',
                            border: '1px solid',
                            borderColor: activeTab === 'hero_slides' ? '#333' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontWeight: activeTab === 'hero_slides' ? '700' : '400'
                        }}
                    >
                        <Image size={18} /> Hero Banner Slider Manager
                    </button>
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
                        <Globe size={18} /> General Settings
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

                    {/* HERO SLIDER CUSTOM BANNERS MANAGER TAB */}
                    {activeTab === 'hero_slides' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <Image /> Custom Hero Banner Slider Manager
                                    </h2>
                                    <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                                        Manually add, edit, or toggle Coming Soon banners, Promos, or Sales slides in the Homepage Hero Section!
                                    </p>
                                </div>
                            </div>

                            {/* Add New Custom Hero Slide Form */}
                            <div style={{ background: '#18181b', padding: '1.5rem', borderRadius: '14px', border: '1px solid #27272a', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Plus color="#f59e0b" size={18} /> Add New Custom Banner Slide to Hero Section
                                </h3>

                                <form onSubmit={handleAddHeroSlide} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Badge Tag</label>
                                            <input
                                                type="text"
                                                value={newHeroForm.tag}
                                                onChange={(e) => setNewHeroForm(prev => ({ ...prev, tag: e.target.value }))}
                                                placeholder="e.g. 🚀 COMING SOON LAUNCH / 🔥 HOT SALE"
                                                required
                                                style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Banner Title (Capitalized)</label>
                                            <input
                                                type="text"
                                                value={newHeroForm.title}
                                                onChange={(e) => setNewHeroForm(prev => ({ ...prev, title: e.target.value }))}
                                                placeholder="e.g. ELECTRONICS & JEWELRY LAUNCHING SOON"
                                                required
                                                style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white', fontWeight: '700' }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Banner Description / Subtitle</label>
                                        <textarea
                                            value={newHeroForm.description}
                                            onChange={(e) => setNewHeroForm(prev => ({ ...prev, description: e.target.value }))}
                                            rows={2}
                                            placeholder="Write subtitle or promotion details..."
                                            style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '0.85rem' }}
                                        ></textarea>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Button Label Text</label>
                                            <input
                                                type="text"
                                                value={newHeroForm.btnText}
                                                onChange={(e) => setNewHeroForm(prev => ({ ...prev, btnText: e.target.value }))}
                                                placeholder="e.g. GET VIP EARLY ACCESS ➔"
                                                style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Button Link Path</label>
                                            <input
                                                type="text"
                                                value={newHeroForm.btnLink}
                                                onChange={(e) => setNewHeroForm(prev => ({ ...prev, btnLink: e.target.value }))}
                                                placeholder="e.g. /shop or /shop?category=Electronics"
                                                style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Background Theme</label>
                                            <select
                                                value={newHeroForm.bgGradient}
                                                onChange={(e) => setNewHeroForm(prev => ({ ...prev, bgGradient: e.target.value }))}
                                                style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                            >
                                                <option value="#311b92">💜 Royal Purple (Coming Soon)</option>
                                                <option value="#7f1d1d">🔴 Crimson Red (Festival/Sale)</option>
                                                <option value="#1e1b4b">💙 Midnight Indigo (Streetwear)</option>
                                                <option value="#064e3b">🟢 Emerald Green (Luxury)</option>
                                                <option value="#18181b">⚫ Dark Zinc (Product Focus)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Photo Upload Section */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Banner Slide Image (Upload or Paste Link)</label>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <label style={{ padding: '0.6rem 1rem', background: '#222', border: '1px solid #444', color: '#38bdf8', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Upload size={16} /> Upload Photo from Device
                                                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleHeroFileUpload(e.target.files[0])} />
                                            </label>
                                            <span style={{ fontSize: '0.8rem', color: '#666' }}>OR</span>
                                            <input
                                                type="text"
                                                value={newHeroForm.image}
                                                onChange={(e) => setNewHeroForm(prev => ({ ...prev, image: e.target.value }))}
                                                placeholder="Paste Image URL (https://...)"
                                                style={{ flex: 1, minWidth: '220px', padding: '0.65rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '0.85rem' }}
                                            />
                                        </div>
                                        {newHeroForm.image && (
                                            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#080808', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                                                <img src={newHeroForm.image} alt="Preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                                                <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '700' }}>✓ Photo Attached Preview</span>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                        <button type="submit" style={{ padding: '0.75rem 1.75rem', background: '#f59e0b', border: 'none', color: '#000', fontWeight: '800', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                            + Add Slide to Hero Banner
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Existing Custom Hero Banner Slides List */}
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'white', marginBottom: '1rem' }}>Active Hero Banner Slides ({heroSlidesList.length})</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {heroSlidesList.map((slide, idx) => (
                                        <div key={slide.id || idx} style={{ background: '#18181b', padding: '1.25rem', borderRadius: '12px', border: slide.enabled !== false ? '1px solid #333' : '1px solid #222', opacity: slide.enabled !== false ? 1 : 0.6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '280px' }}>
                                                <img src={slide.image || 'https://via.placeholder.com/70'} alt={slide.title} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #333' }} />
                                                <div>
                                                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', fontWeight: '800' }}>{slide.tag}</span>
                                                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'white', marginTop: '4px' }}>{slide.title}</div>
                                                    <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '2px' }}>{slide.description}</div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <button
                                                    onClick={() => handleToggleHeroSlide(slide.id)}
                                                    style={{ padding: '0.4rem 0.85rem', borderRadius: '6px', border: '1px solid #444', background: slide.enabled !== false ? 'rgba(16,185,129,0.2)' : '#222', color: slide.enabled !== false ? '#10b981' : '#aaa', cursor: 'pointer', fontWeight: '700', fontSize: '0.78rem' }}
                                                >
                                                    {slide.enabled !== false ? 'LIVE' : 'DISABLED'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteHeroSlide(slide.id)}
                                                    style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #333', background: '#222', color: '#ef4444', cursor: 'pointer' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FESTIVAL SPECIAL SETTINGS TAB */}
                    {activeTab === 'festival' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <Sparkles /> Festival Special Banner Manager
                                    </h2>
                                    <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                                        Customize Homepage Hero Sale Banner for Indian Festivals!
                                    </p>
                                </div>
                            </div>

                            {/* Presets Grid */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'white', marginBottom: '0.75rem' }}>
                                    ⚡ Quick Festival Presets (1-Click Apply)
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                                    {festivalPresets.map((preset, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => applyPreset(preset)}
                                            style={{
                                                padding: '0.85rem',
                                                background: '#18181b',
                                                border: '1px solid #333',
                                                borderRadius: '10px',
                                                color: 'white',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: preset.color }}>{preset.name}</div>
                                            <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '4px' }}>{preset.badge}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <form onSubmit={handleFestivalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#aaa', marginBottom: '0.5rem' }}>Festival Sale Title</label>
                                    <input
                                        type="text"
                                        value={festivalData.title}
                                        onChange={(e) => setFestivalData(prev => ({ ...prev, title: e.target.value }))}
                                        style={{ width: '100%', padding: '0.8rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '1rem', fontWeight: '700' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#aaa', marginBottom: '0.5rem' }}>Festival Banner Subtitle</label>
                                    <textarea
                                        value={festivalData.subtitle}
                                        onChange={(e) => setFestivalData(prev => ({ ...prev, subtitle: e.target.value }))}
                                        rows={2}
                                        style={{ width: '100%', padding: '0.8rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                    ></textarea>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#aaa', marginBottom: '0.5rem' }}>Offer Badge Text</label>
                                        <input
                                            type="text"
                                            value={festivalData.badge}
                                            onChange={(e) => setFestivalData(prev => ({ ...prev, badge: e.target.value }))}
                                            style={{ width: '100%', padding: '0.8rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#aaa', marginBottom: '0.5rem' }}>Theme Color Accent</label>
                                        <input
                                            type="color"
                                            value={festivalData.color}
                                            onChange={(e) => setFestivalData(prev => ({ ...prev, color: e.target.value }))}
                                            style={{ width: '100%', height: '44px', padding: '0.2rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', cursor: 'pointer' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                    <button
                                        type="submit"
                                        style={{ padding: '0.85rem 2rem', background: '#f59e0b', border: 'none', color: '#000000', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <Save size={18} /> Save Festival Banner
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

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
