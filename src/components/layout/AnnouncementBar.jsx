import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const AnnouncementBar = () => {
  return (
    <div style={{ 
      background: 'var(--accent-gradient)', 
      color: 'white', 
      padding: '0.5rem 0',
      overflow: 'hidden',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Sparkles size={14} fill="white" />
          <span>Free Worldwide Shipping on all orders over $200</span>
          <Sparkles size={14} fill="white" />
        </motion.div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
