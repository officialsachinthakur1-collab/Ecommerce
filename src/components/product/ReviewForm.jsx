import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../config';
import { Link } from 'react-router-dom';

export default function ReviewForm({ productId, refetch }) {
    const { user } = useAuth();
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return alert("Please enter a comment");

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id || user.email,
                    userName: user.name,
                    rating,
                    comment,
                    productId
                })
            });
            const data = await res.json();
            if (data.success) {
                setMsg({ type: 'success', text: 'Thank you! Your review has been submitted.' });
                setComment("");
                setRating(5);
                refetch();
            } else {
                setMsg({ type: 'error', text: data.message || 'Submission failed' });
            }
        } catch (error) {
            setMsg({ type: 'error', text: 'Server error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '1rem' }}>Rating</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                            key={star}
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                            fill={(hoverRating || rating) >= star ? "#fbbf24" : "transparent"}
                            stroke={(hoverRating || rating) >= star ? "none" : "#444"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className={(hoverRating || rating) >= star ? "scale-110" : ""}
                        >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    ))}
                </div>
            </div>

            <div>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '0.75rem' }}>Comment</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you like or dislike..."
                    style={{
                        width: '100%',
                        background: '#050505',
                        border: '1px solid #222',
                        borderRadius: '12px',
                        padding: '1rem',
                        color: 'white',
                        minHeight: '120px',
                        resize: 'none',
                        outline: 'none'
                    }}
                />
            </div>

            {msg.text && (
                <div style={{ padding: '1rem', borderRadius: '8px', fontSize: '0.875rem', background: msg.type === 'success' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: msg.type === 'success' ? '#4ade80' : '#ef4444' }}>
                    {msg.text}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
            >
                {loading ? 'Submitting...' : 'Post Review'}
            </button>
        </form>
    );
}

