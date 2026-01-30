import dbConnect from './utils/db.js';
import Coupon from './models/Coupon.js';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        const { code, adminPass } = req.query;

        // Admin: Get all coupons
        if (adminPass === 'admin') {
            try {
                const coupons = await Coupon.find({}).sort({ createdAt: -1 });
                return res.status(200).json({ success: true, coupons });
            } catch (error) {
                return res.status(500).json({ success: false, error: error.message });
            }
        }

        // Public: Validate single coupon
        if (!code) {
            return res.status(400).json({ success: false, message: 'Coupon code is required' });
        }
        try {
            const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
            if (!coupon) return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
            if (new Date() > new Date(coupon.expiryDate)) return res.status(400).json({ success: false, message: 'Coupon has expired' });
            if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ success: false, message: 'Usage limit reached' });
            return res.status(200).json({ success: true, coupon });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    if (req.method === 'POST') {
        const { adminPass, couponData } = req.body;
        if (adminPass !== 'admin') return res.status(401).json({ success: false, message: 'Unauthorized' });
        try {
            const newCoupon = await Coupon.create(couponData);
            return res.status(201).json({ success: true, coupon: newCoupon });
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }

    if (req.method === 'DELETE') {
        const { id, adminPass } = req.query;
        if (adminPass !== 'admin') return res.status(401).json({ success: false, message: 'Unauthorized' });
        try {
            await Coupon.findByIdAndDelete(id);
            return res.status(200).json({ success: true, message: 'Coupon deleted' });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    res.status(405).end(`Method ${req.method} Not Allowed`);
}
