import React from 'react';

const RatingStars = ({ rating, size = 16, color = "#fbbf24" }) => {
    return (
        <div style={{ display: 'flex', gap: '2px' }}>
            {[...Array(5)].map((_, i) => (
                <svg
                    key={i}
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill={i < rating ? color : "none"}
                    stroke={i < rating ? "none" : "#444"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}
        </div>
    );
};

export default RatingStars;
