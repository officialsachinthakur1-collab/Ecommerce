import dbConnect from '../utils/db.js';
import User from '../models/User.js';
import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await dbConnect();
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all fields' });
        }

        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Simple hash
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'user' // Default role
        });

        return res.status(201).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}
