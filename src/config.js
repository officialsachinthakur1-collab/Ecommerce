// API Configuration
// Development: Uses local backend (proxy via Vite)
// Production (Vercel): Uses Render backend URL

const API_URL = import.meta.env.PROD
    ? 'https://your-render-app.onrender.com' // Replace with actual Render URL
    : '';

export default API_URL;
