// API Configuration
// Development: Uses local backend (proxy via Vite)
// Production (Vercel): Uses Render backend URL

const API_URL = import.meta.env.PROD
    ? 'https://ecommerce-eo7c.onrender.com'
    : '';

export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || 'rzp_live_SBaXSYbdg2lOOO';

export default API_URL;
