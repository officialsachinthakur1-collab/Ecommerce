import mongoose from 'mongoose';
import dbConnect from './utils/db.js';
import Product from './models/Product.js';
import { initialProducts } from './_data.js';

export default async function handler(req, res) {
    await dbConnect();

    // Only seed if the database is COMPLETELY empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
        console.log("Database empty. Seeding initial products...");
        const fullProducts = [
            ...initialProducts,
            { id: 4, name: "Premium Pink Traditional Earrings", price: "₹1,299", tag: "Bestseller", category: "Women", description: "Exquisite traditional Indian oxidized silver earrings with premium pink gemstones.", image: "/assets/products/earrings_pink.png" },
            { id: 5, name: "Premium Green Traditional Earrings", price: "₹1,299", tag: "Trending", category: "Women", description: "Elegant emerald green traditional earrings set in oxidized silver.", image: "/assets/products/earrings_green.png" },
            { id: 6, name: "Premium Red Traditional Earrings", price: "₹1,299", tag: "New", category: "Women", description: "Stunning ruby red traditional earrings with royal peacock motifs.", image: "/assets/products/earrings_red_user.jpg" }
        ];
        await Product.insertMany(fullProducts);
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
            const {
                name, price, category, description, image, images, tag,
                affiliateLink, isHero, heroTitle, isCombo, comboLinks, comboProducts
            } = req.body;
            const password = req.headers['x-admin-password'];

            if (password !== (process.env.ADMIN_PASSWORD || 'admin')) {
                return res.status(403).json({ success: false, message: 'Unauthorized' });
            }

            if (!name || !price) {
                return res.status(400).json({ success: false, message: 'Name and Price are required' });
            }

            // Handle multi-image logic
            const finalImages = Array.isArray(images) ? images : [];
            const primaryImage = image || (finalImages.length > 0 ? finalImages[0] : "");

            const product = await Product.create({
                id: Date.now(),
                name,
                price,
                category: category || 'Men',
                description: description || "Engineered for performance.",
                image: primaryImage,
                images: finalImages,
                tag: tag || "New",
                sizes: req.body.sizes || [],
                affiliateLink: affiliateLink || "",
                isHero: !!isHero,
                heroTitle: heroTitle || "",
                isCombo: !!isCombo,
                comboLinks: Array.isArray(comboLinks) ? comboLinks : [],
                comboProducts: Array.isArray(comboProducts) ? comboProducts : []
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

            if (password !== (process.env.ADMIN_PASSWORD || 'admin')) {
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

            // Sync primary image with images[0] if needed
            if (updateData.images && Array.isArray(updateData.images) && updateData.images.length > 0 && !updateData.image) {
                updateData.image = updateData.images[0];
            }

            if (updateData.isHero !== undefined) {
                updateData.isHero = !!updateData.isHero;
            }

            if (updateData.heroTitle !== undefined) {
                updateData.heroTitle = updateData.heroTitle || "";
            }

            // Explicitly handle combo fields if passed
            if (updateData.isCombo !== undefined) {
                updateData.isCombo = !!updateData.isCombo;
            }
            if (updateData.comboLinks !== undefined) {
                updateData.comboLinks = Array.isArray(updateData.comboLinks) ? updateData.comboLinks : [];
            }
            if (updateData.comboProducts !== undefined) {
                updateData.comboProducts = Array.isArray(updateData.comboProducts) ? updateData.comboProducts : [];
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

            if (password !== (process.env.ADMIN_PASSWORD || 'admin')) {
                return res.status(403).json({ success: false, message: 'Unauthorized' });
            }

            let product;

            // 1. Try deleting by numeric id (custom field)
            const numericId = Number(id);
            if (!isNaN(numericId) && id.length < 15) { // Likely our custom ID
                product = await Product.findOneAndDelete({ id: numericId });
            }

            // 2. Try deleting by name if id matches what I added earlier
            if (!product && typeof id === 'string' && id.includes('Purple Floral Kurta')) {
                product = await Product.findOneAndDelete({ name: id });
            }

            // 3. Try deleting by MongoDB _id (standard)
            if (!product && mongoose.Types.ObjectId.isValid(id)) {
                product = await Product.findByIdAndDelete(id);
            }

            if (!product) {
                return res.status(404).json({ success: false, message: `Product with ID ${id} not found in database.` });
            }

            return res.status(200).json({ success: true, message: 'Product deleted successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    res.status(405).end(`Method ${req.method} Not Allowed`);
}
