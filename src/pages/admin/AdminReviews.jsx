import { useState, useEffect } from 'react';
import { Trash2, Search, Plus, Star } from 'lucide-react';
import RatingStars from '../../components/common/RatingStars';

export default function AdminReviews() {
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('gsm_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [revUser, setRevUser] = useState('');
  const [revProduct, setRevProduct] = useState('Oversized Anime Hoodie');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');

  useEffect(() => {
    localStorage.setItem('gsm_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const handleSaveReview = (e) => {
    e.preventDefault();
    if (!revUser || !revComment) return;

    const newRev = {
      id: `REV-${Date.now()}`,
      userName: revUser,
      productName: revProduct,
      rating: Number(revRating),
      comment: revComment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews([newRev, ...reviews]);
    setShowModal(false);
    setRevUser('');
    setRevComment('');
  };

  const handleDeleteReview = (id) => {
    if (window.confirm("Are you sure you want to delete this customer review?")) {
      setReviews(reviews.filter(r => r.id !== id && r._id !== id));
    }
  };

  const filteredReviews = reviews.filter(rev => {
    const user = (rev.userName || '').toLowerCase();
    const comment = (rev.comment || '').toLowerCase();
    const product = (rev.productName || '').toLowerCase();
    const query = searchTerm.toLowerCase();

    return user.includes(query) || comment.includes(query) || product.includes(query);
  });

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Product Reviews & Ratings</h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manage customer feedback, star ratings & product reviews</div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 1rem 0.55rem 2.4rem', background: '#111', border: '1px solid #222', color: 'white', borderRadius: '8px', fontSize: '0.85rem' }}
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--primary-red)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '600'
            }}
          >
            <Plus size={18} /> Add Review
          </button>
        </div>
      </div>

      {/* Reviews Table */}
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem' }}>
        {filteredReviews.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Star size={48} style={{ marginBottom: '1rem', opacity: 0.5, color: '#f59e0b' }} />
            <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.5rem' }}>No Product Reviews Added Yet</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Click "+ Add Review" above to manage customer ratings & reviews!</p>
            <button 
              onClick={() => setShowModal(true)}
              style={{ padding: '0.65rem 1.25rem', background: 'var(--primary-red)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
            >
              + Add Customer Review Now
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #222', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>User / Customer</th>
                  <th style={{ padding: '0.75rem' }}>Product Name</th>
                  <th style={{ padding: '0.75rem' }}>Rating</th>
                  <th style={{ padding: '0.75rem' }}>Comment / Feedback</th>
                  <th style={{ padding: '0.75rem' }}>Date</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((rev) => (
                  <tr key={rev.id || rev._id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '600', color: 'white' }}>{rev.userName || 'Verified Buyer'}</td>
                    <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>{rev.productName || 'General Product'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <RatingStars rating={rev.rating || 5} size={14} />
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)', maxWidth: '280px' }}>
                      {rev.comment}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#666', fontSize: '0.78rem' }}>
                      {rev.date || 'Recent'}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteReview(rev.id || rev._id)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        title="Delete Review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#141414', border: '1px solid #222', borderRadius: '14px', width: '100%', maxWidth: '480px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem', color: 'white' }}>Add Customer Review</h3>
            <form onSubmit={handleSaveReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Customer Name</label>
                <input type="text" value={revUser} onChange={e => setRevUser(e.target.value)} placeholder="e.g. Ananya Sharma" required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Product Name</label>
                <input type="text" value={revProduct} onChange={e => setRevProduct(e.target.value)} placeholder="e.g. Oversized Anime Hoodie" required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Star Rating</label>
                <select value={revRating} onChange={e => setRevRating(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white' }}>
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  <option value={2}>⭐⭐ (2 Stars)</option>
                  <option value={1}>⭐ (1 Star)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.35rem' }}>Review Comment / Feedback</label>
                <textarea value={revComment} onChange={e => setRevComment(e.target.value)} placeholder="e.g. Excellent fabric quality and super fast delivery!" required style={{ width: '100%', padding: '0.75rem', background: '#080808', border: '1px solid #333', borderRadius: '8px', color: 'white', height: '80px' }}></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.65rem 1.25rem', background: 'transparent', border: '1px solid #333', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.65rem 1.25rem', background: 'var(--primary-red)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Save Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
