import React from 'react';
import ValentineBanner from '../components/home/ValentineBanner';

const ValentinePreview = () => {
    return (
        <div style={{
            paddingTop: 'var(--header-height)',
            minHeight: '100vh',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <h1 style={{ color: '#111', marginBottom: '2rem', fontWeight: '900', textTransform: 'uppercase' }}>Valentine's Day Banner Preview</h1>

            <div style={{ width: '100%' }}>
                <ValentineBanner />
            </div>

            <div style={{ marginTop: '3rem', color: '#666', textAlign: 'center', maxWidth: '600px' }}>
                <p><strong>Note:</strong> Isme 3D hearts float kar rahe hain aur mouse ke saath react karenge. Banner fully responsive h mobile ke liye bhi.</p>
                <p style={{ marginTop: '1rem' }}>Bahar click karke site par wapas ja sakte ho.</p>
            </div>
        </div>
    );
};

export default ValentinePreview;
