import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
// import { products } from '../../data/products'; // Remove static import
import { useProducts } from '../../hooks/useProducts';
import API_URL from '../../config';

export default function AdminProducts() {
    const { products, loading, refetch } = useProducts(false); // Only show DB products to avoid 404 deletion errors
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', price: '', category: 'Men', tag: 'New', description: '',
        image: '', images: [], sizes: '', stock: 10, affiliateLink: '',
        isHero: false, heroTitle: '', isCombo: false, comboLinks: ['', '', '']
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
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
                // Combine names for title
                const comboName = "Combo: " + successfulResults.map(p => p.name).join(" + ");
                const comboImages = successfulResults.map(p => p.image).filter(Boolean);
                const totalPrice = successfulResults.reduce((sum, p) => sum + (parseFloat(p.price?.replace(/[^0-9.]/g, '') || 0)), 0);

                setFormData(prev => ({
                    ...prev,
                    name: comboName,
                    image: comboImages[0] || prev.image,
                    images: [...new Set([...prev.images, ...comboImages])],
                    price: `₹${totalPrice}`,
                    description: `This combo includes:\n${successfulResults.map(p => `• ${p.name}`).join('\n')}`,
                    comboProducts: successfulResults // Store full products for frontend display
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
                ...formData,
                sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(s => s !== '') : []
            };

            const url = editingProduct
                ? `${API_URL}/api/products?id=${editingProduct.id || editingProduct._id}`
                : `${API_URL}/api/products`;
            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-password': 'admin'
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                alert(editingProduct ? 'Product Updated!' : 'Product Added!');
                setIsModalOpen(false);
                setEditingProduct(null);
                setFormData({
                    name: '', price: '', category: 'Men', tag: 'New', description: '',
                    image: '', images: [], sizes: '', stock: 10, affiliateLink: '',
                    isHero: false, heroTitle: '', isCombo: false, comboLinks: ['', '', '']
                });
                refetch(); // Refetch products to update the list
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Operation failed'}`);
            }
        } catch (error) {
            console.error('Error handling product submit:', error);
            alert(`Network Error: ${error.message}. Is the backend server running?`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await fetch(`${API_URL}/api/products?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'x-admin-password': 'admin'
                }
            });
            if (response.ok) {
                alert("Product Deleted Successfully!");
                refetch();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Failed to delete product'}`);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <div>
            <div className="admin-page-header">
                <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Products</h1>
                <button
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={20} /> Add Product
                </button>
            </div>

            {loading ? <div style={{ color: 'white' }}>Loading...</div> : (
                <div className="admin-table-container">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}> {/* added minWidth to force scroll */}
                        <thead>
                            <tr style={{ borderBottom: '1px solid #222', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                <th style={{ padding: '1rem 1.5rem' }}>Product Name</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Category</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Price</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Stock</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Hero?</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id || product._id} className="admin-table-row">
                                    <td data-label="Product Name" style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            {/* Simple color block for image placeholder if no image */}
                                            {/* Image placeholder or actual image */}
                                            <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: '#333', overflow: 'hidden' }}>
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : null}
                                            </div>
                                            {product.name}
                                        </div>
                                    </td>
                                    <td data-label="Category" style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{product.category}</td>
                                    <td data-label="Price" style={{ padding: '1rem 1.5rem' }}>{product.price}</td>
                                    <td data-label="Stock" style={{ padding: '1rem 1.5rem', color: product.stock <= 0 ? '#ff3333' : 'var(--text-muted)' }}>
                                        {product.stock !== undefined ? product.stock : 10}
                                    </td>
                                    <td data-label="Hero?" style={{ padding: '1rem 1.5rem' }}>
                                        {product.isHero ? (
                                            <span style={{ color: '#ff3333', fontWeight: 'bold', fontSize: '0.75rem' }}>YES</span>
                                        ) : (
                                            <span style={{ color: '#444', fontSize: '0.75rem' }}>No</span>
                                        )}
                                    </td>
                                    <td data-label="Status" style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '999px',
                                                fontSize: '0.65rem',
                                                background: 'rgba(74, 222, 128, 0.1)',
                                                color: '#4ade80',
                                                width: 'fit-content',
                                                fontWeight: 'bold'
                                            }}>
                                                Active
                                            </span>
                                            {product.stock <= 10 && (
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '999px',
                                                    fontSize: '0.65rem',
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    color: '#ef4444',
                                                    width: 'fit-content',
                                                    fontWeight: 'bold'
                                                }}>
                                                    Low Stock
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td data-label="Actions" style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                            <button
                                                onClick={() => handleEdit(product)}
                                                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id || product._id)}
                                                style={{ background: 'transparent', border: 'none', color: '#ff3333', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Simple Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div className="custom-scrollbar" style={{
                        background: '#111', padding: '2rem', borderRadius: '24px',
                        width: '95%', maxWidth: '500px', border: '1px solid #333',
                        maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => {
                                setIsModalOpen(false);
                                setEditingProduct(null);
                                setFormData({ name: '', price: '', category: 'Men', tag: 'New', description: '', image: '', images: [], sizes: '', stock: 10, affiliateLink: '', isHero: false });
                            }} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                name="name" placeholder="Product Name" value={formData.name} onChange={handleInputChange}
                                style={{ padding: '0.75rem', background: '#050505', border: '1px solid #333', color: 'white', borderRadius: '8px' }} required
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Primary Thumbnail Image URL</label>
                                <input
                                    name="image" placeholder="Main Product Image URL (Thumbnail)" value={formData.image} onChange={handleInputChange}
                                    style={{ padding: '0.75rem', background: '#050505', border: '1px solid #333', color: 'white', borderRadius: '8px' }}
                                />
                                {formData.image && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', background: '#1a1a1a', borderRadius: '8px' }}>
                                        <img src={formData.image} alt="Thumbnail Preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <span style={{ fontSize: '0.7rem', color: '#4ade80' }}>✓ Thumbnail Active</span>
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: '0.75rem', background: '#050505', border: '1px solid #333', color: 'white', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Product Gallery</h3>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const url = prompt("Enter image URL:");
                                            if (url) {
                                                setFormData({ ...formData, images: [...formData.images, url] });
                                            }
                                        }}
                                        style={{ background: 'var(--primary-red)', color: 'white', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                                    >
                                        Add URL
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '0.5rem' }}>
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #444' }}>
                                            <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newImages = [...formData.images];
                                                    newImages.splice(idx, 1);
                                                    setFormData({ ...formData, images: newImages });
                                                }}
                                                style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,0,0,0.8)', border: 'none', color: 'white', padding: '0.1rem', cursor: 'pointer', fontSize: '10px' }}
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    {/* Real Upload Button */}
                                    <label style={{
                                        width: '60px', height: '60px', borderRadius: '4px', background: '#1a1a1a',
                                        border: '1px dashed #444', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', cursor: 'pointer', color: '#666'
                                    }}>
                                        <Plus size={20} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files);
                                                files.forEach(file => {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            images: [...prev.images, reader.result]
                                                        }));
                                                    };
                                                    reader.readAsDataURL(file);
                                                });
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    name="price" placeholder="Price (₹100)" value={formData.price} onChange={handleInputChange}
                                    style={{ flex: 1, padding: '0.75rem', background: '#050505', border: '1px solid #333', color: 'white', borderRadius: '8px' }} required
                                />
                                <input
                                    type="number"
                                    name="stock" placeholder="Stock" value={formData.stock} onChange={handleInputChange}
                                    style={{ flex: 1, padding: '0.75rem', background: '#050505', border: '1px solid #333', color: 'white', borderRadius: '8px' }} required
                                />
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid #333' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.isCombo}
                                    onChange={(e) => setFormData({ ...formData, isCombo: e.target.checked })}
                                    style={{ width: '20px', height: '20px', accentColor: 'var(--primary-red)' }}
                                />
                                <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary-red)' }}>MAKE THIS A COMBO PRODUCT</span>
                            </label>

                            {formData.isCombo ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: '#0a0a0a', border: '1px solid #333', borderRadius: '12px' }}>
                                    <h3 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Combo Product Links</h3>
                                    {[0, 1, 2].map((idx) => (
                                        <input
                                            key={idx}
                                            placeholder={`Product Link ${idx + 1}`}
                                            value={formData.comboLinks[idx]}
                                            onChange={(e) => {
                                                const newLinks = [...formData.comboLinks];
                                                newLinks[idx] = e.target.value;
                                                setFormData({ ...formData, comboLinks: newLinks });
                                            }}
                                            style={{ padding: '0.75rem', background: '#050505', border: '1px solid #222', color: 'white', borderRadius: '8px', fontSize: '0.85rem' }}
                                        />
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleFetchCombo}
                                        style={{ background: 'var(--primary-red)', color: 'white', border: 'none', borderRadius: '8px', padding: '0.75rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}
                                    >
                                        FETCH ALL COMBO DETAILS
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        name="affiliateLink" placeholder="Affiliate Link (Optional - e.g. Amazon URL)" value={formData.affiliateLink} onChange={handleInputChange}
                                        style={{ flex: 1, padding: '0.75rem', background: '#050505', border: '1px solid #333', color: 'white', borderRadius: '8px' }}
                                    />
                                    {formData.affiliateLink && formData.affiliateLink.startsWith('http') && (
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                const res = await fetch(`${API_URL}/api/utils/scrape`, {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ url: formData.affiliateLink })
                                                });
                                                const result = await res.json();
                                                if (result.success) {
                                                    const { name, image, description, price } = result.data;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        name: name || prev.name,
                                                        image: image || prev.image,
                                                        images: image ? [...new Set([...prev.images, image])] : prev.images,
                                                        description: description || prev.description,
                                                        price: price || prev.price
                                                    }));
                                                    alert("Product details fetched!");
                                                }
                                            }}
                                            style={{ background: '#333', color: 'white', border: '1px solid #444', borderRadius: '8px', padding: '0 1rem', cursor: 'pointer', fontSize: '0.75rem' }}
                                        >
                                            Fetch Details
                                        </button>
                                    )}
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <select
                                    name="category" value={formData.category} onChange={handleInputChange}
                                    style={{ flex: 1, padding: '0.75rem', background: '#050505', border: '1px solid #333', color: 'white', borderRadius: '8px' }}
                                >
                                    <option value="Men">Men</option>
                                    <option value="Women">Women</option>
                                    <option value="Unisex">Unisex</option>
                                    <option value="Chocolates">Chocolates</option>
                                    <option value="Food">Food</option>
                                    <option value="Gifts">Gifts</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                                <select
                                    name="tag" value={formData.tag} onChange={handleInputChange}
                                    style={{ flex: 1, padding: '0.75rem', background: '#050505', border: '1px solid #333', color: 'white', borderRadius: '8px' }}
                                >
                                    <option value="New">New</option>
                                    <option value="Trending">Trending</option>
                                    <option value="Bestseller">Best Seller</option>
                                    <option value="Hot">Hot</option>
                                    <option value="Exclusive">Exclusive</option>
                                </select>
                            </div>
                            <input
                                name="sizes" placeholder="Sizes (e.g. S, M, L, XL or 7, 8, 9, 10)" value={formData.sizes} onChange={handleInputChange}
                                style={{ padding: '0.75rem', background: '#050505', border: '1px solid #333', color: 'white', borderRadius: '8px' }}
                            />
                            <textarea
                                name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} rows={3}
                                style={{ padding: '0.75rem', background: '#050505', border: '1px solid #333', color: 'white', borderRadius: '8px' }}
                            />
                            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    name="isHero"
                                    checked={formData.isHero}
                                    onChange={(e) => setFormData({ ...formData, isHero: e.target.checked })}
                                    style={{ width: '20px', height: '20px', accentColor: 'var(--primary-red)' }}
                                />
                                <span style={{ fontSize: '1rem', fontWeight: '600' }}>Show in Hero Section</span>
                            </label>
                            {formData.isHero && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Hero Display Name (Short)</label>
                                    <input
                                        name="heroTitle" placeholder="e.g. Premium Kurta" value={formData.heroTitle} onChange={handleInputChange}
                                        style={{ padding: '0.75rem', background: '#050505', border: '1px solid #333', color: 'white', borderRadius: '8px' }}
                                    />
                                </div>
                            )}
                            <button type="submit" className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                                {editingProduct ? 'Update Product' : 'Create Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

