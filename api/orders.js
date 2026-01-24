import dbConnect from './utils/db.js';
import Order from './models/Order.js';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const orders = await Order.find({}).sort({ createdAt: -1 });
            return res.status(200).json(orders);
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    if (req.method === 'POST') {
        try {
            const { customer, items, total, address, city, zip, email, payment_id } = req.body;

            const order = await Order.create({
                orderId: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
                customer: customer || "Guest User",
                email,
                items,
                total,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: 'Paid',
                address: `${address}, ${city} ${zip}`,
                payment_id
            });

            return res.status(201).json({ success: true, order });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    res.status(405).end(`Method ${req.method} Not Allowed`);
}
