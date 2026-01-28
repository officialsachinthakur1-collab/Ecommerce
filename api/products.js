import mongoose from 'mongoose';
import dbConnect from './utils/db.js';
import Product from './models/Product.js';
import { initialProducts } from './_data.js';

export default async function handler(req, res) {
    await dbConnect();

    // Auto-seed required products if missing
    const requiredIds = [4, 5, 6];
    const existingIds = await Product.find({ id: { $in: requiredIds } }).distinct('id');

    if (existingIds.length < requiredIds.length) {
        console.log("Seeding missing products...");
        const fullProducts = [
            ...initialProducts,
            {
                id: 4,
                name: "Premium Pink Traditional Earrings",
                price: "₹1,299",
                tag: "Bestseller",
                category: "Women",
                description: "Exquisite traditional Indian oxidized silver earrings with premium pink gemstones. Featuring intricate silver craftsmanship and delicate hanging beads for a timeless ethnic look.",
                image: "/assets/products/earrings_pink.png"
            },
            {
                id: 5,
                name: "Premium Green Traditional Earrings",
                price: "₹1,299",
                tag: "Trending",
                category: "Women",
                description: "Elegant emerald green traditional earrings set in oxidized silver. High-contrast design with sophisticated silver bead tassels, perfect for festive occasions or luxury wear.",
                image: "/assets/products/earrings_green.png"
            },
            {
                id: 6,
                name: "Premium Red Traditional Earrings",
                price: "₹1,299",
                tag: "New",
                category: "Women",
                description: "Stunning ruby red traditional earrings with royal peacock motifs in oxidized silver. Hand-finished with delicate silver bells and ultra-realistic gemstones for a regal appearance.",
                image: "/assets/products/earrings_red_user.jpg"
            }
        ];

        for (const item of fullProducts) {
            const exists = await Product.findOne({ $or: [{ id: item.id }, { name: item.name }] });
            if (!exists) {
                await Product.create(item);
            }
        }
    }

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
            const { name, price, category, description, image, tag } = req.body;
            const password = req.headers['x-admin-password'];

            if (password !== 'admin') {
                return res.status(403).json({ success: false, message: 'Unauthorized' });
            }

            if (!name || !price) {
                return res.status(400).json({ success: false, message: 'Name and Price are required' });
            }

            const product = await Product.create({
                id: Date.now(),
                name,
                price,
                category: category || 'Men',
                description: description || "Engineered for performance.",
                image: image || "",
                tag: tag || "New",
                sizes: req.body.sizes || []
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
            const password = req.headers['x-admin-password'];

            if (password !== 'admin') {
                return res.status(403).json({ success: false, message: 'Unauthorized' });
            }

            // Try updating by custom id first if it's a number
            let product;
            if (!isNaN(id)) {
                product = await Product.findOneAndUpdate({ id: Number(id) }, updateData, { new: true });
            }

            // If not found by custom id, try by _id
            if (!product && mongoose.Types.ObjectId.isValid(id)) {
                product = await Product.findByIdAndUpdate(id, updateData, { new: true });
            }

            if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
            return res.status(200).json({ success: true, product });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
            const password = req.headers['x-admin-password'];

            if (password !== 'admin') {
                return res.status(403).json({ success: false, message: 'Unauthorized' });
            }

            let product;
            if (!isNaN(id)) {
                product = await Product.findOneAndDelete({ id: Number(id) });
            }

            if (!product && mongoose.Types.ObjectId.isValid(id)) {
                product = await Product.findByIdAndDelete(id);
            }

            if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
            return res.status(200).json({ success: true, message: 'Product deleted' });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    res.status(405).end(`Method ${req.method} Not Allowed`);
}
