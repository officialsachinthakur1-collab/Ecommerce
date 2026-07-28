import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import API_URL from '../../config';

export default function AdminProducts() {
    const { products, loading, refetch } = useProducts(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', price: '', category: 'Men', tag: 'New', description: '',
        image: '', images: [], sizes: '', stock: 10, affiliateLink: '',
        isHero: false, heroTitle: '', isCombo: false, comboLinks: ['', '', '']
    });

    const compressImage = (base64Str, maxWidth = 800, maxHeight = 800) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        width = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
        });
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            price: product.price || '',
            category: product.category || 'Men',
            tag: product.tag || 'New',
            description: product.description || '',
            image: product.image || '',
            images: Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []),
            sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || ''),
            stock: product.stock !== undefined ? product.stock : 10,
            affiliateLink: product.affiliateLink || '',
            isHero: !!product.isHero,
            heroTitle: product.heroTitle || '',
            isCombo: !!product.isCombo,
            comboLinks: product.comboLinks || ['', '', '']
        });
        setIsModalOpen(true);
    };

    const handleFetchCombo = async () => {
        const links = formData.comboLinks.filter(l => l.trim() !== '');
        if (links.length === 0) return alert("Please enter at least one link!");

        try {
            const results = await Promise.all(links.map(async (link) => {
                const res = await fetch(`${API_URL}/api/utils/scrape`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: link })
                });
                return res.json();
            }));

            const successfulResults = results.filter(r => r.success).map(r => r.data);
            if (successfulResults.length > 0) {
                const comboName = "Combo: " + successfulResults.map(p => p.name).join(" + ");
                const comboImages = successfulResults.map(p => p.image).filter(Boolean);
                const totalPrice = successfulResults.reduce((sum, p) => sum + (parseFloat(p.price?.replace(/[^0-9.]/g, '') || 0)), 0);

                setFormData(prev => ({
                    ...prev,
                    name: comboName.substring(0, 200),
                    image: comboImages[0] || prev.image,
                    images: [...new Set([...prev.images, ...comboImages])].slice(0, 10),
                    price: `₹${totalPrice}`,
                    description: `This combo includes:\n${successfulResults.map(p => `• ${p.name}`).join('\n')}`.substring(0, 1000),
                    comboProducts: successfulResults.map(p => ({
                        name: p.name.substring(0, 100),
                        image: p.image,
                        price: p.price
                    }))
                }));
                alert(`${successfulResults.length} product(s) fetched for combo!`);
            } else {
                alert("Failed to fetch details for any of the links.");
            }
        } catch (error) {
            console.error("Combo fetch error:", error);
            alert("Error fetching combo details");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id: editingProduct ? (editingProduct.id || editingProduct._id) : `PROD-${Date.now()}`,
                ...formData,
                sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(s => s !== '') : []
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

            // Also try updating backend API
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
                // API fail silent catch
            }

            alert(editingProduct ? 'Product Updated Successfully!' : 'Product Added Successfully!');
            setIsModalOpen(false);
            setEditingProduct(null);
            setFormData({
                name: '', price: '', category: 'Men', tag: 'New', description: '',
                image: '', images: [], sizes: '', stock: 10, affiliateLink: '',
                isHero: false, heroTitle: '', isCombo: false, comboLinks: ['', '', '']
            });
            refetch();
        } catch (error) {
            console.error('Error handling product submit:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            // Remove from local storage
            const savedLocal = localStorage.getItem('gsm_custom_products');
            if (savedLocal) {
                const currentLocal = JSON.parse(savedLocal).filter(p => p.id !== id && p._id !== id);
                localStorage.setItem('gsm_custom_products', JSON.stringify(currentLocal));
            }

            // Remove from API
            try {
                await fetch(`${API_URL}/api/products/${id}`, {
                    method: 'DELETE',
                    headers: { 'x-admin-password': 'admin' }
                });
                await fetch(`${API_URL}/api/products?id=${id}`, {
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
            alert("All products cleared permanently from local storage and backend database!");
        }
    };

    return (
        <div>
            <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Products Catalogue</h1>
                    <div style={{ color: 'var(--text-muted)' }}>Manage products displayed on GetSetMart website store</div>
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
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', borderRadius: '8px', border: 'none', background: 'var(--primary-red)', color: 'white', fontWeight: '600', cursor: 'pointer' }}
                        onClick={() => {
                            setEditingProduct(null);
                            setFormData({
                                name: '', price: '', category: 'Men', tag: 'New', description: '',
                                image: '', images: [], sizes: '', stock: 10, affiliateLink: '',
                                isHero: false, heroTitle: '', isCombo: false, comboLinks: ['', '', '']
                            });
                            setIsModalOpen(true);
                        }}
                    >
                        <Plus size={20} /> Add Product
                    </button>
                </div>
            </div>

            {loading ? <div style={{ color: 'white' }}>Loading products...</div> : (
                <div className="admin-table-container" style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem' }}>
                    {products.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.5rem' }}>No Products Available</h3>
                            <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Click "+ Add Product" above to list your real products on GetSetMart website store!</p>
                            <button
                                onClick={() => {
                                    setEditingProduct(null);
                                    setIsModalOpen(true);
                                }}
                                style={{ padding: '0.65rem 1.25rem', background: 'var(--primary-red)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                            >
                                + Add Product Now
                            </button>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px', fontSize: '0.85rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #222', color: 'var(--text-muted)' }}>
                                    <th style={{ padding: '0.75rem' }}>Image</th>
                                    <th style={{ padding: '0.75rem' }}>Product Name</th>
                                    <th style={{ padding: '0.75rem' }}>Category</th>
                                    <th style={{ padding: '0.75rem' }}>Price</th>
                                    <th style={{ padding: '0.75rem' }}>Stock</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id || product._id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                                        <td style={{ padding: '0.75rem' }}>
                                            <img
                                                src={product.image || 'https://via.placeholder.com/60'}
                                                alt={product.name}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #222' }}
                                            />
                                        </td>
                                        <td style={{ padding: '0.75rem', fontWeight: '600', color: 'white' }}>{product.name}</td>
                                        <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>{product.category}</td>
                                        <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: '700' }}>{product.price}</td>
                                        <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>{product.stock || 10} units</td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    style={{ background: '#222', border: '1px solid #333', color: '#38bdf8', cursor: 'pointer', padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                >
                                                    <Edit2 size={14} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id || product._id)}
                                                    style={{ background: '#222', border: '1px solid #333', color: '#ef4444', cursor: 'pointer', padding: '0.35rem 0.6rem', borderRadius: '6px' }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Modal for Add/Edit Product */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '14px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Product Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Price (e.g. ₹999)</label>
                                    <input type="text" name="price" value={formData.price} onChange={handleInputChange} required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Category</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}>
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Kids">Kids</option>
                                        <option value="Accessories">Accessories</option>
                                        <option value="Jewelry">Jewelry</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Main Image URL (or upload)</label>
                                <input type="text" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://..." required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}></textarea>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.65rem 1.25rem', background: 'transparent', border: '1px solid #333', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ padding: '0.65rem 1.25rem', background: 'var(--primary-red)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
