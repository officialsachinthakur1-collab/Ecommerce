// API Configuration
// Development: Uses local backend (proxy via Vite)
// Production (Vercel): Uses Render backend URL

const API_URL = import.meta.env.PROD
    ? 'https://ecommerce-eo7c.onrender.com'
    : '';

export default API_URL;
