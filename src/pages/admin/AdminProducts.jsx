import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
// import { products } from '../../data/products'; // Remove static import
import { useProducts } from '../../hooks/useProducts';
import API_URL from '../../config';

const AdminProducts = () => {
    const { products, loading, refetch } = useProducts(); // Use the hook with refetch
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ name: '', price: '', category: 'Men', description: '', image: '', sizes: '' });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description || '',
            image: product.image || '',
            sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || '')
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()) : []
            };

            const url = editingProduct
                ? `${API_URL}/api/products/${editingProduct.id}`
                : `${API_URL}/api/products`;
            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                alert(editingProduct ? 'Product Updated!' : 'Product Added!');
                setIsModalOpen(false);
                setEditingProduct(null);
                setFormData({ name: '', price: '', category: 'Men', description: '', image: '', sizes: '' });
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
                method: 'DELETE'
            });
            if (response.ok) {
                refetch();
            } else {
                alert("Failed to delete product");
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
                                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="admin-table-row">
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
                                    <td data-label="Status" style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            background: 'rgba(74, 222, 128, 0.1)',
                                            color: '#4ade80'
                                        }}>
                                            Active
                                        </span>
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
                                                onClick={() => handleDelete(product.id)}
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
                    <div style={{
                        background: '#111', padding: '2rem', borderRadius: '12px',
                        width: '100%', maxWidth: '500px', border: '1px solid #333'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => {
                                setIsModalOpen(false);
                                setEditingProduct(null);
                                setFormData({ name: '', price: '', category: 'Men', description: '', image: '', sizes: '' });
                            }} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                name="name" placeholder="Product Name" value={formData.name} onChange={handleInputChange}
                                style={{ padding: '0.75rem', background: '#050505', border: '1px solid #333', color: 'white', borderRadius: '8px' }} required
                            />
                            <input
                                name="image" placeholder="Image URL (optional)" value={formData.image} onChange={handleInputChange}
                                style={{ padding: '0.75rem', background: '#050505', border: '1px solid #333', color: 'white', borderRadius: '8px' }}
                            />
                            <input
                                name="sizes" placeholder="Available Sizes (7, 8, 9 or small, large)" value={formData.sizes} onChange={handleInputChange}
                                style={{ padding: '0.75rem', background: '#050505', border: '1px solid #333', color: 'white', borderRadius: '8px' }}
                            />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    name="price" placeholder="Price ($100)" value={formData.price} onChange={handleInputChange}
                                    style={{ flex: 1, padding: '0.75rem', background: '#050505', border: '1px solid #333', color: 'white', borderRadius: '8px' }} required
                                />
                                <select
                                    name="category" value={formData.category} onChange={handleInputChange}
                                    style={{ flex: 1, padding: '0.75rem', background: '#050505', border: '1px solid #333', color: 'white', borderRadius: '8px' }}
                                >
                                    <option value="Men">Men</option>
                                    <option value="Women">Women</option>
                                    <option value="Unisex">Unisex</option>
                                </select>
                            </div>
                            <textarea
                                name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} rows={3}
                                style={{ padding: '0.75rem', background: '#050505', border: '1px solid #333', color: 'white', borderRadius: '8px' }}
                            />
                            <button type="submit" className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                                {editingProduct ? 'Update Product' : 'Create Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
