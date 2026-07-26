import dbConnect from './utils/db.js';
import Newsletter from './models/Newsletter.js';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        try {
            // Check if already exists
            const existing = await Newsletter.findOne({ email: email.toLowerCase() });
            if (existing) {
                if (!existing.isActive) {
                    existing.isActive = true;
                    await existing.save();
                    return res.status(200).json({ success: true, message: 'Welcome back! You have been resubscribed.' });
                }
                // Determine if we should tell them they are already subscribed. 
                // Usually good UX to say "You're already on the list!"
                return res.status(200).json({ success: true, message: 'You are already subscribed!' });
            }

            await Newsletter.create({ email });
            return res.status(201).json({ success: true, message: 'Successfully subscribed to the newsletter!' });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(200).json({ success: true, message: 'You are already subscribed!' });
            }
            return res.status(400).json({ success: false, message: 'Invalid email address' });
        }
    }

    res.status(405).end(`Method ${req.method} Not Allowed`);
}
