import dbConnect from './utils/db.js';
import Product from './models/Product.js';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const products = await Product.find({}).sort({ createdAt: -1 });
            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    if (req.method === 'POST') {
        try {
            const {
                id, name, price, category, description, image, images, tag,
                affiliateLink, isHero, heroTitle, isCombo, comboLinks, comboProducts, sizes
            } = req.body;
            const password = req.headers['x-admin-password'];

            if (password !== (process.env.ADMIN_PASSWORD || 'admin')) {
                return res.status(403).json({ success: false, message: 'Unauthorized' });
            }

            const newProd = await Product.create({
                customId: id || `PROD-${Date.now()}`,
                name, price, category, description, image, images, tag,
                affiliateLink, isHero, heroTitle, isCombo, comboLinks, comboProducts, sizes
            });

            return res.status(201).json({ success: true, product: newProd });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
            const password = req.headers['x-admin-password'];

            if (password !== (process.env.ADMIN_PASSWORD || 'admin')) {
                return res.status(403).json({ success: false, message: 'Unauthorized' });
            }

            if (id === 'ALL') {
                await Product.deleteMany({});
                return res.status(200).json({ success: true, message: 'All products deleted' });
            }

            await Product.deleteOne({ $or: [{ _id: id }, { customId: id }] });
            return res.status(200).json({ success: true, message: 'Product deleted' });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
