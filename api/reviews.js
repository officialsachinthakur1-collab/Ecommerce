import dbConnect from './utils/db.js';
import Product from './models/Product.js';

export default async function handler(req, res) {
    await dbConnect();

    const { id } = req.query; // Product ID (numeric custom id or mongo _id)

    if (req.method === 'POST') {
        try {
            const { userId, userName, rating, comment, productId } = req.body;

            if (!productId || !userId || !userName || !rating || !comment) {
                return res.status(400).json({ success: false, message: 'All fields are required' });
            }

            // Find product by numeric id or _id
            const product = await Product.findOne({ $or: [{ id: productId }, { _id: productId }] });

            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            // Add review
            const newReview = { userId, userName, rating: Number(rating), comment, date: new Date() };
            product.reviews.push(newReview);

            // Calculate new average rating
            const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0);
            product.rating = (totalRating / product.reviews.length).toFixed(1);

            await product.save();

            return res.status(201).json({ success: true, product });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { productId, reviewId, adminPass } = req.body;

            if (adminPass !== 'admin') {
                return res.status(403).json({ success: false, message: 'Unauthorized' });
            }

            const product = await Product.findOne({ $or: [{ id: productId }, { _id: productId }] });
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            product.reviews = product.reviews.filter(rev => rev._id.toString() !== reviewId);

            // Recalculate rating
            if (product.reviews.length > 0) {
                const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0);
                product.rating = (totalRating / product.reviews.length).toFixed(1);
            } else {
                product.rating = 5; // Default reset
            }

            await product.save();
            return res.status(200).json({ success: true, product });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    res.status(405).end(`Method ${req.method} Not Allowed`);
}
