import dbConnect from './utils/db.js';
import Order from './models/Order.js';
import Product from './models/Product.js';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const { email, userId } = req.query;
            let query = {};
            if (userId) query.userId = userId;
            else if (email) query.email = email;
            const orders = await Order.find(query).sort({ createdAt: -1 });
            return res.status(200).json(orders);
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const { status } = req.body;

            if (!id || !status) {
                return res.status(400).json({ success: false, message: 'Order ID and status are required' });
            }

            const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
            if (!order) {
                return res.status(404).json({ success: false, message: 'Order not found' });
            }

            return res.status(200).json({ success: true, order });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    if (req.method === 'POST') {
        try {
            const { customer, items, total, address, city, zip, email, payment_id, userId } = req.body;

            // Create the order
            const order = await Order.create({
                orderId: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
                customer: customer || "Guest User",
                email,
                items,
                total,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: 'Pending',
                address: `${address}, ${city} ${zip}`,
                payment_id,
                userId: userId || null
            });

            // Decrement stock for each item
            for (const item of items) {
                // Find product by id (assuming item.id matches Product.id field)
                const product = await Product.findOne({ id: item.id });
                if (product) {
                    product.stock = Math.max(0, product.stock - (item.quantity || 1));
                    await product.save();
                } else {
                    // Fallback to name search if id doesn't match
                    const productByName = await Product.findOne({ name: item.name });
                    if (productByName) {
                        productByName.stock = Math.max(0, productByName.stock - (item.quantity || 1));
                        await productByName.save();
                    }
                }
            }

            return res.status(201).json({ success: true, order });
        } catch (error) {
            console.error("Order Creation Error:", error);
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    res.status(405).end(`Method ${req.method} Not Allowed`);
}
