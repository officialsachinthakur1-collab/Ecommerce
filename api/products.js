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
            const { name, price, category, description, image } = req.body;
            if (!name || !price) {
                return res.status(400).json({ success: false, message: 'Name and Price are required' });
            }

            const product = await Product.create({
                name,
                price,
                category: category || 'Men',
                description: description || "Engineered for performance.",
                image: image || "",
            });

            return res.status(201).json({ success: true, product });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const updateData = req.body;
            const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
            if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
            return res.status(200).json({ success: true, product });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
            const product = await Product.findByIdAndDelete(id);
            if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
            return res.status(200).json({ success: true, message: 'Product deleted' });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    res.status(405).end(`Method ${req.method} Not Allowed`);
}
