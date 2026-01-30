import { useState, useEffect } from 'react';
import { Trash2, Search, ExternalLink } from 'lucide-react';
import RatingStars from '../../components/common/RatingStars';
import { useProducts } from '../../hooks/useProducts';
import API_URL from '../../config';

const AdminReviews = () => {
    const { products, loading, refetch } = useProducts(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleting, setDeleting] = useState(false);

    // Flatten all reviews from all products
    const allReviews = products.flatMap(product =>
        (product.reviews || []).map(review => ({
            ...review,
            productName: product.name,
            productId: product.id || product._id
        }))
    ).sort((a, b) => new Date(b.date) - new Date(a.date));

    const filteredReviews = allReviews.filter(rev =>
        rev.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (productId, reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        setDeleting(true);
        try {
            const res = await fetch(`${API_URL}/api/reviews`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    reviewId,
                    adminPass: 'admin'
                })
            });
            const data = await res.json();
            if (data.success) {
                refetch();
            } else {
                alert(data.message || "Delete failed");
            }
        } catch (error) {
            alert("Error deleting review");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <div className="admin-page-header">
                <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Reviews</h1>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', background: '#111', border: '1px solid #333', color: 'white', borderRadius: '999px' }}
                    />
                </div>
            </div>

            {loading ? <div style={{ color: 'white' }}>Loading reviews...</div> : (
                <div className="admin-table-container">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #222', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                <th style={{ padding: '1rem 1.5rem' }}>User</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Product</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Rating</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Comment</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Date</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReviews.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: '#666' }}>No reviews found</td>
                                </tr>
                            ) : (
                                filteredReviews.map((rev) => (
                                    <tr key={rev._id} className="admin-table-row">
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{rev.userName}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {rev.productName}
                                                <a href={`/shop/product/${rev.productId}`} target="_blank" rel="noreferrer" style={{ color: '#666' }}>
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <RatingStars rating={rev.rating} size={14} />
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {rev.comment}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', color: '#666', fontSize: '0.875rem' }}>
                                            {new Date(rev.date).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleDelete(rev.productId, rev._id)}
                                                disabled={deleting}
                                                style={{ background: 'transparent', border: 'none', color: '#ff3333', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminReviews;
// Forced reload
