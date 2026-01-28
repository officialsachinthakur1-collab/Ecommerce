export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password } = req.body;

    // Simple Mock Auth Logic (Matching server/index.js)
    if (email === 'admin@getsetmart.com' && password === 'admin') {
        return res.status(200).json({
            success: true,
            user: {
                email,
                name: 'Admin User',
                role: 'admin',
                token: 'mock-jwt-token-12345'
            }
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }
}
