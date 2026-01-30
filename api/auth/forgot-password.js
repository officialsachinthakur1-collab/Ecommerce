import dbConnect from '../utils/db';
import User from '../models/User';
import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await dbConnect();
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Please provide an email' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Return success anyway for security (don't reveal if user exists)
            return res.status(200).json({ success: true, message: 'If an account exists with that email, a reset link has been sent.' });
        }

        // Generate token
        const token = crypto.randomBytes(20).toString('hex');
        const expiry = Date.now() + 3600000; // 1 hour

        user.resetPasswordToken = token;
        user.resetPasswordExpires = expiry;
        await user.save();

        // MOCK EMAIL LOGIC
        // In production, you would send an actual email here.
        const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

        console.log("-----------------------------------------");
        console.log("FORGOT PASSWORD REQUEST");
        console.log(`User: ${user.email}`);
        console.log(`Reset Link: ${resetUrl}`);
        console.log("-----------------------------------------");

        return res.status(200).json({
            success: true,
            message: 'If an account exists with that email, a reset link has been sent.'
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}
