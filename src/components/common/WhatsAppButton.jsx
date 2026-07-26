import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
    // Replace with actual business number if provided
    const whatsappUrl = "https://wa.me/910000000000?text=Hii%2C%20I%20have%20a%20query%20regarding%20GetSetMart%21";

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
                position: 'fixed',
                bottom: '2rem',
                left: '2rem',
                width: '60px',
                height: '60px',
                background: '#25D366',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
                zIndex: 9999,
                cursor: 'pointer'
            }}
            title="Chat with us on WhatsApp"
        >
            <MessageCircle size={32} />
        </motion.a>
    );
};

export default WhatsAppButton;
