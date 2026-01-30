import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dbConnect from '../api/utils/db.js';
import Product from '../api/models/Product.js';
import Order from '../api/models/Order.js';
import { products as initialProducts } from '../src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

console.log(">>> GetSetMart Server Starting - Express 5 Engine Active <<<");
console.log(">>> Current Commit Fix: Robust app.use Catch-all <<<");
// Deployment Trigger: 2026-01-30T21:15

// Database Connection
dbConnect().then(() => {
    console.log(">>> MongoDB Connected Successfully <<<");
}).catch(err => {
    console.error(">>> MongoDB Connection Failed <<<", err);
});

// Razorpay Instance
const razorpay = new Razorpay({
    key_id: 'rzp_live_S7fi6DftRGCZQo',
    key_secret: 'l5UTCj7s9NG7keJ0YoiA4TdZ'
});
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('GetSetMart E-commerce API is running...');
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const { customer, items, total, address, city, zip, email } = req.body;

        const newOrder = await Order.create({
            orderId: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            customer: customer || "Guest User",
            email,
            items,
            total,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Pending',
            address: `${address}, ${city} ${zip}`
        });

        res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update Order
app.put('/api/orders/:id', async (req, res) => handleUpdateOrder(req.params.id, req, res));
app.put('/api/orders', async (req, res) => handleUpdateOrder(req.query.id, req, res));

async function handleUpdateOrder(id, req, res) {
    const { status } = req.body;
    try {
        const order = await Order.findOneAndUpdate(
            { $or: [{ orderId: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] },
            { status },
            { new: true }
        );
        if (order) res.json({ success: true, order });
        else res.status(404).json({ success: false, message: 'Order not found' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Delete Order
app.delete('/api/orders/:id', async (req, res) => handleDeleteOrder(req.params.id, req, res));
app.delete('/api/orders', async (req, res) => handleDeleteOrder(req.query.id, req, res));

async function handleDeleteOrder(id, req, res) {
    try {
        const order = await Order.findOneAndDelete({
            $or: [{ orderId: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }]
        });
        if (order) res.json({ success: true, message: 'Order deleted' });
        else res.status(404).json({ success: false, message: 'Order not found' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

app.post('/api/products', async (req, res) => {
    try {
        const { name, price, category, description, image, images, sizes, tag, affiliateLink } = req.body;
        const password = req.headers['x-admin-password'];

        if (password !== (process.env.ADMIN_PASSWORD || 'admin')) {
            return res.status(403).json({ success: false, message: 'Unauthorized - Admin Password Required' });
        }

        if (!name || !price) {
            return res.status(400).json({ success: false, message: 'Name and Price are required' });
        }

        const newProduct = await Product.create({
            id: Date.now(),
            name,
            price,
            category: category || 'Men',
            description: description || "Engineered for performance.",
            image: image || "",
            images: images || [],
            tag: tag || "New",
            sizes: sizes || [],
            affiliateLink: affiliateLink || ""
        });

        console.log("Product added successfully:", newProduct.name);
        res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        console.error("Backend Error adding product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update Product
app.put('/api/products/:id', async (req, res) => handleUpdateProduct(req.params.id, req, res));
app.put('/api/products', async (req, res) => handleUpdateProduct(req.query.id, req, res));

async function handleUpdateProduct(id, req, res) {
    const { _id, id: bodyId, ...updateData } = req.body; // Strip immutable fields
    const password = req.headers['x-admin-password'];

    console.log(`[UPDATE] Attempting to update product. Received ID: "${id}", Name in body: "${updateData.name}"`);

    if (password !== (process.env.ADMIN_PASSWORD || 'admin')) {
        return res.status(403).json({ success: false, message: 'Unauthorized - Admin Password Required' });
    }

    try {
        const queryOr = [];
        if (id && !isNaN(id)) queryOr.push({ id: Number(id) });
        if (id && mongoose.Types.ObjectId.isValid(id)) queryOr.push({ _id: id });
        if (id) queryOr.push({ id: String(id) });
        if (id) queryOr.push({ name: String(id) });

        if (queryOr.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid Product ID' });
        }

        let product = await Product.findOneAndUpdate({ $or: queryOr }, updateData, { new: true });

        if (product) {
            console.log(`[UPDATE] Successfully updated product: ${product.name}`);
            res.json({ success: true, product });
        } else {
            console.error(`[UPDATE] Product not found for ID: ${id}`);
            res.status(404).json({ success: false, message: `Product not found for ID: ${id}` });
        }
    } catch (error) {
        console.error(`[UPDATE] Error updating product ID: ${id}:`, error);
        res.status(500).json({ success: false, message: error.message || 'Error updating product' });
    }
}

// Delete Product
app.delete('/api/products/:id', async (req, res) => handleDeleteProduct(req.params.id, req, res));
app.delete('/api/products', async (req, res) => handleDeleteProduct(req.query.id, req, res));

async function handleDeleteProduct(id, req, res) {
    const password = req.headers['x-admin-password'];

    console.log(`[DELETE] Attempting to delete product. Received ID: "${id}"`);

    if (password !== (process.env.ADMIN_PASSWORD || 'admin')) {
        console.warn(`[DELETE] Unauthorized attempt for product ID: ${id}`);
        return res.status(403).json({ success: false, message: 'Unauthorized - Admin Password Required' });
    }

    try {
        const queryOr = [];
        if (id && !isNaN(id)) queryOr.push({ id: Number(id) });
        if (id && mongoose.Types.ObjectId.isValid(id)) queryOr.push({ _id: id });
        if (id) queryOr.push({ id: String(id) });
        if (id) queryOr.push({ name: String(id) });

        const product = await Product.findOneAndDelete({ $or: queryOr });

        if (product) {
            console.log(`[DELETE] Successfully deleted product: ${product.name}`);
            res.json({ success: true, message: 'Product deleted' });
        } else {
            console.error(`[DELETE] Product not found for ID: ${id} in MongoDB`);
            res.status(404).json({ success: false, message: `Product with ID ${id} not found in database.` });
        }
    } catch (error) {
        console.error(`[DELETE] Error deleting product ID: ${id}`, error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Auth Route
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt received for:", email);

    // Simple Mock Auth Logic
    if (email === (process.env.ADMIN_EMAIL || 'admin@getsetmart.com') && password === (process.env.ADMIN_PASSWORD || 'admin')) {
        res.json({
            success: true,
            user: {
                email,
                name: 'Admin User',
                role: 'admin',
                token: 'mock-jwt-token-12345'
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }
});

// Razorpay: Create Order
app.post('/api/razorpay/order', async (req, res) => {
    try {
        const { amount, currency = 'INR' } = req.body;

        const options = {
            amount: Math.round(amount * 100), // convert to paise
            currency,
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.json({ success: true, order });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ success: false, message: 'Could not create order' });
    }
});

// Razorpay: Verify Payment
app.post('/api/razorpay/verify', (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', 'l5UTCj7s9NG7keJ0YoiA4TdZ')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            res.json({ success: true, message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ success: false, message: 'Server error during verification' });
    }
});

// Serve static files from React build (Production)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));

    app.use((req, res) => {
        // Only serve index.html for non-API routes
        if (!req.path.startsWith('/api')) {
            return res.sendFile(path.join(__dirname, '../dist/index.html'));
        }
        res.status(404).send('API Route Not Found');
    });
}

// Global JSON Error Handler
app.use((err, req, res, next) => {
    console.error(">>> UNHANDLED ERROR <<<", err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
