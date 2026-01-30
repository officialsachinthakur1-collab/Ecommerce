import dbConnect from '../utils/db.js';
import User from '../models/User.js';
import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await dbConnect();
        const { email, password } = req.body;

        // Admin legacy support
        if (email === (process.env.ADMIN_EMAIL || 'admin@getsetmart.com') && password === (process.env.ADMIN_PASSWORD || 'admin')) {
            return res.status(200).json({
                success: true,
                user: {
                    email,
                    name: 'Admin User',
                    role: 'admin',
                    token: 'mock-jwt-token-12345'
                }
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if (user.password !== hashedPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}
