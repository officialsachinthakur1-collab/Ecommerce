import dbConnect from './utils/db.js';
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'unread' }
}, { timestamps: true });

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const { name, email, subject, message } = req.body;
            if (!name || !email || !message) {
                return res.status(400).json({ success: false, message: 'Please fill all required fields' });
            }

            const newContact = new Contact({ name, email, subject, message });
            await newContact.save();

            return res.status(200).json({ success: true, message: 'Message received! We will get back to you soon.' });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    if (req.method === 'GET') {
        // Admin view for contacts
        try {
            const contacts = await Contact.find({}).sort({ createdAt: -1 });
            return res.status(200).json({ success: true, contacts });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    res.status(405).json({ message: 'Method not allowed' });
}
