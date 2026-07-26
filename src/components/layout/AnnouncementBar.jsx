import { motion } from 'framer-motion';
import { Sparkles, Truck, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnnouncementBar = () => {
  const marqueeVariant = {
    animate: {
      x: [0, -1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 25,
          ease: "linear",
        },
      },
    },
  };

  const messages = [
    { icon: <Sparkles size={14} />, text: "VALENTINE'S SPECIAL: FREE GIFT PACKS ON ALL V-DAY ORDERS ❤️" },
    { icon: <Truck size={14} />, text: "FREE PAN-INDIA DELIVERY ON ORDERS ABOVE ₹999 🚚" },
    { icon: <Gift size={14} />, text: "USE CODE: LOVE10 FOR FLAT 10% OFF ON CHOCOLATES 🍫" },
    { icon: <Sparkles size={14} />, text: "PREMIUM STREETWEAR COLLECTIONS NOW LIVE 👕" },
  ];

  return (
    <div style={{
      background: 'var(--primary-red)',
      color: 'white',
      padding: '8px 0',
      overflow: 'hidden',
      fontSize: 'max(0.65rem, 10px)',
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
      whiteSpace: 'nowrap',
      position: 'relative',
      zIndex: 1001,
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <motion.div
        variants={marqueeVariant}
        animate="animate"
        style={{ display: 'flex', gap: '4rem', width: 'fit-content' }}
      >
        {[...messages, ...messages, ...messages].map((item, index) => (
          <Link
            key={index}
            to="/valentines-day"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {item.icon}
            <span>{item.text}</span>
          </Link>
        ))}
      </motion.div>
    </div>
  );
};

export default AnnouncementBar;
