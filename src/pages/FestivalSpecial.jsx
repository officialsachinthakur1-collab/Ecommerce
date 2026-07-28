import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CuratedSections from '../components/home/CuratedSections';
import { Sparkles, Gift, Tag, Clock, ArrowRight } from 'lucide-react';

export default function FestivalSpecial() {
  const [festivalSettings, setFestivalSettings] = useState(() => {
    const saved = localStorage.getItem('gsm_festival_settings');
    return saved ? JSON.parse(saved) : {
      title: '15th August Freedom Sale 🇮🇳',
      subtitle: 'Celebrate Independence Day with Freedom Offers & Patriotic Deals!',
      badge: 'FLAT 50% OFF',
      color: '#f97316',
      enabled: true
    };
  });

  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 22 });

  useEffect(() => {
    window.scrollTo(0, 0);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    const handleUpdate = () => {
      const saved = localStorage.getItem('gsm_festival_settings');
      if (saved) setFestivalSettings(JSON.parse(saved));
    };
    window.addEventListener('gsm_festival_updated', handleUpdate);

    return () => {
      clearInterval(timer);
      window.removeEventListener('gsm_festival_updated', handleUpdate);
    };
  }, []);

  return (
    <div style={{ background: '#050505', color: '#ffffff', minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* Festive Hero Banner */}
      <div style={{ 
        position: 'relative', 
        padding: '5rem 2rem 4rem', 
        textAlign: 'center', 
        background: `radial-gradient(circle at center, ${festivalSettings.color || '#ef4444'}33 0%, #050505 70%)`,
        borderBottom: '1px solid #222'
      }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span style={{ 
            background: festivalSettings.color || 'var(--primary-red)', 
            color: 'white', 
            fontSize: '0.8rem', 
            fontWeight: '800', 
            padding: '0.4rem 1rem', 
            borderRadius: '999px', 
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={14} /> {festivalSettings.badge || 'FESTIVAL SPECIAL OFFER'}
          </span>

          <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '1rem', color: '#fff' }}>
            {festivalSettings.title || 'Festival Special Sale 🎉'}
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
            {festivalSettings.subtitle || 'Exclusive festival collections & limited time gift offers at unbeatable prices!'}
          </p>

          {/* Countdown Timer */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            {[
              { label: 'HOURS', val: timeLeft.hours },
              { label: 'MINUTES', val: timeLeft.minutes },
              { label: 'SECONDS', val: timeLeft.seconds }
            ].map((unit, i) => (
              <div key={i} style={{ background: '#111', border: '1px solid #222', padding: '0.75rem 1.25rem', borderRadius: '12px', minWidth: '80px' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: festivalSettings.color || 'var(--primary-red)' }}>
                  {String(unit.val).padStart(2, '0')}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#666', fontWeight: '700', letterSpacing: '1px' }}>{unit.label}</div>
              </div>
            ))}
          </div>

          <Link to="/shop" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            background: festivalSettings.color || 'var(--primary-red)', 
            color: 'white', 
            padding: '0.85rem 2rem', 
            borderRadius: '999px', 
            textDecoration: 'none', 
            fontWeight: '700',
            fontSize: '0.95rem'
          }}>
            Shop Festival Collection <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>

      {/* Festive Feature Cards */}
      <div style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: '#111', border: '1px solid #222', padding: '1.5rem', borderRadius: '14px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Gift size={32} color={festivalSettings.color || 'var(--primary-red)'} />
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'white', marginBottom: '0.25rem' }}>Festive Gift Packing</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Complimentary luxury gift wrapping available</p>
          </div>
        </div>

        <div style={{ background: '#111', border: '1px solid #222', padding: '1.5rem', borderRadius: '14px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Tag size={32} color={festivalSettings.color || 'var(--primary-red)'} />
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'white', marginBottom: '0.25rem' }}>Instant Coupons</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Apply FESTIVAL10 for extra 10% discount</p>
          </div>
        </div>

        <div style={{ background: '#111', border: '1px solid #222', padding: '1.5rem', borderRadius: '14px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Clock size={32} color={festivalSettings.color || 'var(--primary-red)'} />
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'white', marginBottom: '0.25rem' }}>Fast Express Delivery</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Guaranteed dispatch within 24 hours</p>
          </div>
        </div>
      </div>

      {/* Curated Festive Products */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <CuratedSections title={`${festivalSettings.title || 'Festival'} Bestsellers`} tag="Bestseller" limit={8} />
      </div>

    </div>
  );
}
