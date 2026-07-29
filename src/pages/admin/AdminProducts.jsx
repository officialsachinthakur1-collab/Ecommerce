import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Tag, DollarSign, Package, Layers, Sparkles, Check, Info } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import API_URL from '../../config';

export default function AdminProducts() {
    const { products, loading, refetch } = useProducts(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('basic');

    // Amazon / Flipkart Professional Form State
    const [formData, setFormData] = useState({
        name: '',
        brand: 'GetSetMart',
        price: '',
        mrp: '',
        costPrice: '',
        category: 'Men',
        subCategory: 'T-Shirts & Tops',
        tag: 'Bestseller',
        description: '',
        highlights: '100% Premium Material\nExpress 2-3 Day Delivery\n30 Days Quality Guarantee',
        image: '',
        images: ['', '', ''],
        sizes: ['M', 'L', 'XL'],
        color: 'Black',
        stock: 50,
        sku: '',
        affiliateLink: '',
        isHero: false,
        heroTitle: ''
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSizeToggle = (size) => {
        const currentSizes = Array.isArray(formData.sizes) ? formData.sizes : [];
        if (currentSizes.includes(size)) {
            setFormData(prev => ({ ...prev, sizes: currentSizes.filter(s => s !== size) }));
        } else {
            setFormData(prev => ({ ...prev, sizes: [...currentSizes, size] }));
        }
    };

    const handleGalleryImageChange = (index, value) => {
        const newImages = [...(formData.images || ['', '', ''])];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        const parsedPrice = (product.price || '').replace(/[^0-9.]/g, '');
        const parsedMrp = (product.mrp || '').replace(/[^0-9.]/g, '');

        setFormData({
            name: product.name || '',
            brand: product.brand || 'GetSetMart',
            price: parsedPrice ? `₹${parsedPrice}` : (product.price || ''),
            mrp: parsedMrp ? `₹${parsedMrp}` : (product.mrp || ''),
            costPrice: product.costPrice || '',
            category: product.category || 'Men',
            subCategory: product.subCategory || 'Clothing',
            tag: product.tag || 'Bestseller',
            description: product.description || '',
            highlights: product.highlights || '100% Premium Quality\nFast Express Delivery\nEasy Returns',
            image: product.image || '',
            images: Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image || '', '', ''],
            sizes: Array.isArray(product.sizes) ? product.sizes : (typeof product.sizes === 'string' ? product.sizes.split(',').map(s => s.trim()) : ['M', 'L', 'XL']),
            color: product.color || 'Multi',
            stock: product.stock !== undefined ? product.stock : 50,
            sku: product.sku || product.customId || `SKU-${Date.now().toString().slice(-6)}`,
            affiliateLink: product.affiliateLink || '',
            isHero: !!product.isHero,
            heroTitle: product.heroTitle || ''
        });
        setActiveTab('basic');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedPrice = formData.price.startsWith('₹') ? formData.price : `₹${formData.price}`;
            const formattedMrp = formData.mrp ? (formData.mrp.startsWith('₹') ? formData.mrp : `₹${formData.mrp}`) : '';

            const payload = {
                id: editingProduct ? (editingProduct.id || editingProduct._id) : `PROD-${Date.now()}`,
                ...formData,
                price: formattedPrice,
                mrp: formattedMrp,
                images: (formData.images || []).filter(img => img && img.trim() !== '')
            };

            // Update Local Storage Array
            const savedLocal = localStorage.getItem('gsm_custom_products');
            let currentLocal = savedLocal ? JSON.parse(savedLocal) : [];

            if (editingProduct) {
                currentLocal = currentLocal.map(p => (p.id === payload.id || p._id === payload.id) ? payload : p);
            } else {
                currentLocal = [payload, ...currentLocal];
            }
            localStorage.setItem('gsm_custom_products', JSON.stringify(currentLocal));

            // Try updating backend API
            try {
                const url = editingProduct
                    ? `${API_URL}/api/products?id=${editingProduct.id || editingProduct._id}`
                    : `${API_URL}/api/products`;
                const method = editingProduct ? 'PUT' : 'POST';

                await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'x-admin-password': 'admin'
                    },
                    body: JSON.stringify(payload)
                });
            } catch (err) {
                // API silent catch
            }

            alert(editingProduct ? 'Product Updated Successfully!' : 'Product Listed Successfully like Amazon/Flipkart!');
            setIsModalOpen(false);
            setEditingProduct(null);
            refetch();
        } catch (error) {
            console.error('Error handling product submit:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product listing?")) return;

        try {
            const savedLocal = localStorage.getItem('gsm_custom_products');
            if (savedLocal) {
                const currentLocal = JSON.parse(savedLocal).filter(p => p.id !== id && p._id !== id);
                localStorage.setItem('gsm_custom_products', JSON.stringify(currentLocal));
            }

            try {
                await fetch(`${API_URL}/api/products/${id}`, {
                    method: 'DELETE',
                    headers: { 'x-admin-password': 'admin' }
                });
            } catch (err) {
                // API silent catch
            }

            alert("Product Deleted Successfully!");
            refetch();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleClearAllProducts = async () => {
        if (window.confirm("Are you sure you want to DELETE ALL PRODUCTS? The website store will be completely empty for your new products.")) {
            localStorage.setItem('gsm_custom_products', JSON.stringify([]));
            try {
                const res = await fetch(`${API_URL}/api/products`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        for (const p of data) {
                            const pId = p._id || p.id;
                            await fetch(`${API_URL}/api/products/${pId}`, {
                                method: 'DELETE',
                                headers: { 'x-admin-password': 'admin' }
                            });
                        }
                    }
                }
            } catch (err) {
                // API silent catch
            }
            refetch();
            alert("All products cleared permanently!");
        }
    };

    // Calculate Discount %
    const spVal = parseFloat(formData.price.replace(/[^0-9.]/g, '') || 0);
    const mrpVal = parseFloat(formData.mrp.replace(/[^0-9.]/g, '') || 0);
    const cpVal = parseFloat(formData.costPrice || 0);

    const discountPercent = mrpVal > spVal ? Math.round(((mrpVal - spVal) / mrpVal) * 100) : 0;
    const profitMargin = spVal > cpVal && cpVal > 0 ? (spVal - cpVal) : 0;

    return (
        <div style={{ paddingBottom: '3rem' }}>
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Product Catalogue & Listing</h1>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Amazon & Flipkart Style Professional Seller Center</div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {products.length > 0 && (
                        <button
                            onClick={handleClearAllProducts}
                            style={{
                                padding: '0.65rem 1.25rem',
                                borderRadius: '8px',
                                border: '1px solid #333',
                                background: '#1c1917',
                                color: '#ef4444',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '0.85rem'
                            }}
                        >
                            Clear All Products
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            setFormData({
                                name: '',
                                brand: 'GetSetMart',
                                price: '',
                                mrp: '',
                                costPrice: '',
                                category: 'Men',
                                subCategory: 'T-Shirts & Tops',
                                tag: 'Bestseller',
                                description: '',
                                highlights: '100% Premium Material\nExpress 2-3 Day Delivery\n30 Days Quality Guarantee',
                                image: '',
                                images: ['', '', ''],
                                sizes: ['M', 'L', 'XL'],
                                color: 'Black',
                                stock: 50,
                                sku: `SKU-${Date.now().toString().slice(-6)}`,
                                affiliateLink: '',
                                isHero: false,
                                heroTitle: ''
                            });
                            setActiveTab('basic');
                            setIsModalOpen(true);
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', borderRadius: '8px', border: 'none', background: 'var(--primary-red)', color: 'white', fontWeight: '700', cursor: 'pointer' }}
                    >
                        <Plus size={20} /> Add Product Listing
                    </button>
                </div>
            </div>

            {/* Products Table */}
            {loading ? <div style={{ color: 'white' }}>Loading catalogue...</div> : (
                <div style={{ background: '#111', border: '1px solid #222', borderRadius: '14px', padding: '1.5rem' }}>
                    {products.length === 0 ? (
                        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <Package size={54} style={{ marginBottom: '1rem', opacity: 0.4, color: 'var(--primary-red)' }} />
                            <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Products Listed in Store</h3>
                            <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                                Click "+ Add Product Listing" above to publish your products with Amazon & Flipkart style professional pricing, images & tags!
                            </p>
                            <button
                                onClick={() => {
                                    setEditingProduct(null);
                                    setActiveTab('basic');
                                    setIsModalOpen(true);
                                }}
                                style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-red)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}
                            >
                                + Create First Product Listing
                            </button>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px', fontSize: '0.85rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #222', color: 'var(--text-muted)' }}>
                                        <th style={{ padding: '0.85rem' }}>Product Image</th>
                                        <th style={{ padding: '0.85rem' }}>Product Details</th>
                                        <th style={{ padding: '0.85rem' }}>Category & Tag</th>
                                        <th style={{ padding: '0.85rem' }}>Selling Price</th>
                                        <th style={{ padding: '0.85rem' }}>Stock Status</th>
                                        <th style={{ padding: '0.85rem', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id || product._id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                                            <td style={{ padding: '0.85rem' }}>
                                                <img
                                                    src={product.image || 'https://via.placeholder.com/60'}
                                                    alt={product.name}
                                                    style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #333' }}
                                                />
                                            </td>
                                            <td style={{ padding: '0.85rem' }}>
                                                <div style={{ fontWeight: '700', color: 'white', fontSize: '0.9rem' }}>{product.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>Brand: {product.brand || 'GetSetMart'} | SKU: {product.sku || product.id}</div>
                                            </td>
                                            <td style={{ padding: '0.85rem' }}>
                                                <div style={{ color: '#cbd5e1', fontWeight: '600' }}>{product.category}</div>
                                                <span style={{ display: 'inline-block', marginTop: '4px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--primary-red)', fontSize: '0.7rem', fontWeight: '700' }}>
                                                    {product.tag || 'Bestseller'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.85rem' }}>
                                                <div style={{ color: '#10b981', fontWeight: '800', fontSize: '0.95rem' }}>{product.price}</div>
                                                {product.mrp && <div style={{ fontSize: '0.75rem', color: '#666', textDecoration: 'line-through' }}>MRP: {product.mrp}</div>}
                                            </td>
                                            <td style={{ padding: '0.85rem' }}>
                                                <span style={{ color: (product.stock || 10) > 0 ? '#38bdf8' : '#ef4444', fontWeight: '700' }}>
                                                    {(product.stock || 10) > 0 ? `In Stock (${product.stock || 50})` : 'Out of Stock'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        style={{ background: '#222', border: '1px solid #333', color: '#38bdf8', cursor: 'pointer', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}
                                                    >
                                                        <Edit2 size={14} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id || product._id)}
                                                        style={{ background: '#222', border: '1px solid #333', color: '#ef4444', cursor: 'pointer', padding: '0.4rem 0.6rem', borderRadius: '6px' }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Flipkart / Amazon Style Professional Listing Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: '#121212', border: '1px solid #2a2a2a', borderRadius: '16px', width: '100%', maxWidth: '780px', maxHeight: '92vh', overflowY: 'auto', padding: '1.75rem', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
                        
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #222', paddingBottom: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Sparkles color="var(--primary-red)" size={20} /> {editingProduct ? 'Edit Product Listing' : 'Amazon / Flipkart Product Listing Center'}
                                </h3>
                                <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '2px' }}>Fill in details to publish high-converting product listings</div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: '#222', border: 'none', color: '#aaa', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Navigation Tabs */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #222', paddingBottom: '0.75rem', overflowX: 'auto' }}>
                            {[
                                { id: 'basic', label: '📌 1. Basic Info' },
                                { id: 'pricing', label: '💰 2. Pricing & Stock' },
                                { id: 'media', label: '🖼️ 3. Images & Media' },
                                { id: 'details', label: '✨ 4. Highlights & Sizes' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        padding: '0.55rem 1rem',
                                        borderRadius: '8px',
                                        border: '1px solid',
                                        borderColor: activeTab === tab.id ? 'var(--primary-red)' : 'transparent',
                                        background: activeTab === tab.id ? 'rgba(239,68,68,0.12)' : '#1a1a1a',
                                        color: activeTab === tab.id ? 'white' : '#aaa',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        fontWeight: activeTab === tab.id ? '700' : '500',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            
                            {/* TAB 1: BASIC INFO */}
                            {activeTab === 'basic' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem', fontWeight: '600' }}>Product Title / Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Premium Oversized Heavyweight Cotton Hoodie"
                                            required
                                            style={{ width: '100%', padding: '0.8rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '0.9rem' }}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Brand Name</label>
                                            <input
                                                type="text"
                                                name="brand"
                                                value={formData.brand}
                                                onChange={handleInputChange}
                                                placeholder="e.g. GetSetMart / UrbanWear"
                                                style={{ width: '100%', padding: '0.8rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Category *</label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                style={{ width: '100%', padding: '0.8rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                            >
                                                <option value="Men">Men's Apparel</option>
                                                <option value="Women">Women's Apparel</option>
                                                <option value="Kids">Kids Wear</option>
                                                <option value="Accessories">Accessories & Bags</option>
                                                <option value="Jewelry">Jewelry & Ornaments</option>
                                                <option value="Footwear">Footwear & Sneakers</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Sub-Category</label>
                                            <input
                                                type="text"
                                                name="subCategory"
                                                value={formData.subCategory}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Oversized Hoodies / Sweatshirts"
                                                style={{ width: '100%', padding: '0.8rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Promotional Tag Badge</label>
                                            <select
                                                name="tag"
                                                value={formData.tag}
                                                onChange={handleInputChange}
                                                style={{ width: '100%', padding: '0.8rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                            >
                                                <option value="Bestseller">🔥 Bestseller</option>
                                                <option value="Trending">⚡ Trending Now</option>
                                                <option value="New">✨ New Arrival</option>
                                                <option value="Hot Deal">🏷️ Hot Deal</option>
                                                <option value="Exclusive">👑 Exclusive Premium</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('pricing')}
                                            style={{ padding: '0.7rem 1.5rem', background: 'var(--primary-red)', border: 'none', color: 'white', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                                        >
                                            Next: Pricing & Stock ➔
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: PRICING & STOCK */}
                            {activeTab === 'pricing' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem', fontWeight: '600' }}>Selling Price (SP ₹) *</label>
                                            <input
                                                type="text"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                placeholder="999"
                                                required
                                                style={{ width: '100%', padding: '0.8rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: '#10b981', fontWeight: '800' }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Original MRP (Cutoff ₹)</label>
                                            <input
                                                type="text"
                                                name="mrp"
                                                value={formData.mrp}
                                                onChange={handleInputChange}
                                                placeholder="1999"
                                                style={{ width: '100%', padding: '0.8rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Cost Price (CP ₹ - For Admin P&L)</label>
                                            <input
                                                type="text"
                                                name="costPrice"
                                                value={formData.costPrice}
                                                onChange={handleInputChange}
                                                placeholder="350"
                                                style={{ width: '100%', padding: '0.8rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Discount & Profit Real-Time Preview Card */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#18181b', padding: '1rem', borderRadius: '10px', border: '1px solid #27272a' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#888' }}>Calculated Customer Discount</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: discountPercent > 0 ? '#10b981' : '#aaa', marginTop: '2px' }}>
                                                {discountPercent > 0 ? `🎉 ${discountPercent}% OFF Savings Tag` : 'No Discount Set'}
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#888' }}>Estimated Net Profit Margin</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: profitMargin > 0 ? '#38bdf8' : '#aaa', marginTop: '2px' }}>
                                                {profitMargin > 0 ? `💰 +₹${profitMargin} Profit/Item` : 'Enter Cost Price'}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Stock Quantity (Units)</label>
                                            <input
                                                type="number"
                                                name="stock"
                                                value={formData.stock}
                                                onChange={handleInputChange}
                                                placeholder="50"
                                                style={{ width: '100%', padding: '0.8rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>SKU Code</label>
                                            <input
                                                type="text"
                                                name="sku"
                                                value={formData.sku}
                                                onChange={handleInputChange}
                                                placeholder="SKU-HD-001"
                                                style={{ width: '100%', padding: '0.8rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                        <button type="button" onClick={() => setActiveTab('basic')} style={{ padding: '0.7rem 1.25rem', background: '#222', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>
                                            ⬅ Back
                                        </button>
                                        <button type="button" onClick={() => setActiveTab('media')} style={{ padding: '0.7rem 1.5rem', background: 'var(--primary-red)', border: 'none', color: 'white', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                                            Next: Images & Media ➔
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: IMAGES & MEDIA */}
                            {activeTab === 'media' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem', fontWeight: '600' }}>Main Cover Image URL *</label>
                                        <input
                                            type="text"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleInputChange}
                                            placeholder="https://..."
                                            required
                                            style={{ width: '100%', padding: '0.8rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.5rem', fontWeight: '600' }}>Additional Gallery Image URLs (Flipkart Style)</label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {[0, 1, 2].map(idx => (
                                                <input
                                                    key={idx}
                                                    type="text"
                                                    value={(formData.images || [])[idx] || ''}
                                                    onChange={(e) => handleGalleryImageChange(idx, e.target.value)}
                                                    placeholder={`Gallery Image ${idx + 2} URL (https://...)`}
                                                    style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '0.85rem' }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Image Thumbnails Live Preview Grid */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>Live Image Thumbnails Preview</label>
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                            {[formData.image, ...(formData.images || [])].filter(Boolean).map((imgUrl, i) => (
                                                <div key={i} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: i === 0 ? '2px solid var(--primary-red)' : '1px solid #333' }}>
                                                    <img src={imgUrl} alt={`Preview ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    {i === 0 && <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--primary-red)', color: 'white', fontSize: '0.6rem', textAlign: 'center', fontWeight: '700' }}>COVER</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                        <button type="button" onClick={() => setActiveTab('pricing')} style={{ padding: '0.7rem 1.25rem', background: '#222', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>
                                            ⬅ Back
                                        </button>
                                        <button type="button" onClick={() => setActiveTab('details')} style={{ padding: '0.7rem 1.5rem', background: 'var(--primary-red)', border: 'none', color: 'white', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                                            Next: Highlights & Sizes ➔
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: HIGHLIGHTS & SIZES */}
                            {activeTab === 'details' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    
                                    {/* Size Chips Selection */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.5rem', fontWeight: '600' }}>Available Sizes Selection</label>
                                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                                            {['S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'One Size'].map(sz => {
                                                const selected = Array.isArray(formData.sizes) && formData.sizes.includes(sz);
                                                return (
                                                    <button
                                                        key={sz}
                                                        type="button"
                                                        onClick={() => handleSizeToggle(sz)}
                                                        style={{
                                                            padding: '0.45rem 0.9rem',
                                                            borderRadius: '6px',
                                                            border: selected ? '1px solid var(--primary-red)' : '1px solid #333',
                                                            background: selected ? 'rgba(239, 68, 68, 0.2)' : '#080808',
                                                            color: selected ? 'white' : '#aaa',
                                                            cursor: 'pointer',
                                                            fontWeight: selected ? '700' : '500',
                                                            fontSize: '0.8rem'
                                                        }}
                                                    >
                                                        {sz} {selected && '✓'}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Amazon Style Key Bullet Highlights (One per line)</label>
                                        <textarea
                                            name="highlights"
                                            value={formData.highlights}
                                            onChange={handleInputChange}
                                            rows={3}
                                            placeholder="• 100% Premium Organic Cotton&#10;• Heavyweight 300 GSM Fabric&#10;• Easy Machine Wash"
                                            style={{ width: '100%', padding: '0.8rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '0.85rem' }}
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Full Product Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            placeholder="Write detailed product description..."
                                            style={{ width: '100%', padding: '0.8rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '0.85rem' }}
                                        ></textarea>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid #222', paddingTop: '1rem' }}>
                                        <button type="button" onClick={() => setActiveTab('media')} style={{ padding: '0.7rem 1.25rem', background: '#222', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>
                                            ⬅ Back
                                        </button>
                                        <button type="submit" style={{ padding: '0.8rem 2rem', background: 'var(--primary-red)', border: 'none', color: 'white', borderRadius: '8px', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer' }}>
                                            {editingProduct ? 'Save & Update Listing' : '🚀 Publish Product Listing'}
                                        </button>
                                    </div>
                                </div>
                            )}

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
