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
import User from '../api/models/User.js';
import { products as initialProducts } from '../src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

console.log(">>> GetSetMart Server Starting - Express 5 Engine Active <<<");
console.log(">>> Current Commit Fix: Robust app.use Catch-all <<<");
// Deployment Trigger: 2026-01-30T21:15

// Database Connection
dbConnect().then(async () => {
    console.log(">>> MongoDB Connected Successfully <<<");

    // Auto-seed if database is empty
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            console.log(">>> Database is empty. Seeding initial products... <<<");
            await Product.insertMany(initialProducts);
            console.log(">>> Seeding complete! <<<");
        }
    } catch (seedErr) {
        console.error(">>> Auto-seeding failed <<<", seedErr);
    }
}).catch(err => {
    console.error(">>> MongoDB Connection Failed <<<", err);
});

// Razorpay Instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_S7fi6DftRGCZQo',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'l5UTCj7s9NG7keJ0YoiA4TdZ'
});
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
        console.log("[POST] Adding new product. Data:", JSON.stringify(req.body));
        const {
            name, price, category, description, image, images, sizes, tag, stock,
            affiliateLink, isHero, heroTitle, isCombo, comboLinks, comboProducts
        } = req.body;
        const password = req.headers['x-admin-password'];

        if (password !== (process.env.ADMIN_PASSWORD || 'admin')) {
            return res.status(403).json({ success: false, message: 'Unauthorized - Admin Password Required' });
        }

        if (!name || !price) {
            return res.status(400).json({ success: false, message: 'Name and Price are required' });
        }

        // Explicitly parse and validate numeric fields
        const parsedStock = parseInt(stock) || 0;
        const cleanPrice = String(price).startsWith('₹') ? price : `₹${price}`;

        const newProduct = await Product.create({
            id: Date.now(),
            name,
            price: cleanPrice,
            category: category || 'Men',
            description: description || "Engineered for performance.",
            image: image || "",
            images: Array.isArray(images) ? images : [],
            tag: tag || "New",
            sizes: Array.isArray(sizes) ? sizes : [],
            stock: parsedStock,
            affiliateLink: affiliateLink || "",
            isHero: !!isHero,
            heroTitle: heroTitle || "",
            isCombo: !!isCombo,
            comboLinks: Array.isArray(comboLinks) ? comboLinks : [],
            comboProducts: Array.isArray(comboProducts) ? comboProducts : []
        });

        console.log("Product added successfully:", newProduct.name);
        res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        console.error("Backend Error adding product:", error);
        res.status(500).json({ success: false, message: error.message, error: error });
    }
});

// Update Product
app.put('/api/products/:id', async (req, res) => handleUpdateProduct(req.params.id, req, res));
app.put('/api/products', async (req, res) => handleUpdateProduct(req.query.id, req, res));

async function handleUpdateProduct(id, req, res) {
    const { _id, id: bodyId, reviews, rating, ...updateData } = req.body; // Strip immutable and sensitive fields
    const password = req.headers['x-admin-password'];

    console.log(`[UPDATE] Attempting to update product. Received ID: "${id}", Name in body: "${updateData.name}", isHero: ${req.body.isHero}`);

    if (password !== (process.env.ADMIN_PASSWORD || 'admin')) {
        return res.status(403).json({ success: false, message: 'Unauthorized - Admin Password Required' });
    }

    try {
        const queryOr = [];
        if (id && !isNaN(id)) queryOr.push({ id: Number(id) });
        if (id && mongoose.Types.ObjectId.isValid(id)) queryOr.push({ _id: id });
        if (id) queryOr.push({ name: String(id) });

        if (queryOr.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid Product ID' });
        }

        // Clean price and stock if present
        if (updateData.price) {
            updateData.price = String(updateData.price).startsWith('₹') ? updateData.price : `₹${updateData.price}`;
        }
        if (updateData.stock !== undefined) {
            updateData.stock = parseInt(updateData.stock) || 0;
        }

        // Explicitly handle isHero if passed
        if (req.body.isHero !== undefined) {
            updateData.isHero = !!req.body.isHero;
        }

        // Explicitly handle heroTitle if passed
        if (req.body.heroTitle !== undefined) {
            updateData.heroTitle = req.body.heroTitle || "";
        }

        // Explicitly handle combo fields if passed
        if (req.body.isCombo !== undefined) {
            updateData.isCombo = !!req.body.isCombo;
        }
        if (req.body.comboLinks !== undefined) {
            updateData.comboLinks = Array.isArray(req.body.comboLinks) ? req.body.comboLinks : [];
        }
        if (req.body.comboProducts !== undefined) {
            updateData.comboProducts = Array.isArray(req.body.comboProducts) ? req.body.comboProducts : [];
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

// --- AUTHENTICATION ROUTES ---

// Signup
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all fields' });
        }

        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'user'
        });

        res.status(201).json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ success: false, message: 'Server error during signup' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    try {
        // 1. Admin Legacy Support (Environment Variables)
        if (email === (process.env.ADMIN_EMAIL || 'admin@getsetmart.com') && password === (process.env.ADMIN_PASSWORD || 'admin')) {
            return res.json({
                success: true,
                user: { email, name: 'Admin User', role: 'admin', token: 'mock-jwt-token-12345' }
            });
        }

        // 2. Database User Check
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if (user.password !== hashedPassword) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        res.json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Security: Don't reveal user existence
            return res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

        console.log("\n--- [FORGOT PASSWORD] ---");
        console.log(`User: ${user.email}`);
        console.log(`Link: ${resetUrl}`);
        console.log("--------------------------\n");

        res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) return res.status(400).json({ success: false, message: 'Token and new password required' });

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

        user.password = crypto.createHash('sha256').update(password).digest('hex');
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ success: true, message: 'Password reset successful. You can now login.' });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
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
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'l5UTCj7s9NG7keJ0YoiA4TdZ')
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

// Utility: Scrape Metadata
app.post('/api/utils/scrape', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, message: 'URL is required' });

    try {
        console.log(`[SCRAPE] Fetching metadata for: ${url}`);
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) throw new Error('Failed to fetch URL');

        // Check content size - limit to 5MB for scraping
        const contentLength = response.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > 5 * 1024 * 1024) {
            throw new Error('Page too large to scrape safely');
        }

        let html = await response.text();
        if (html.length > 2 * 1024 * 1024) { // Truncate if > 2MB
            html = html.substring(0, 2 * 1024 * 1024);
        }

        // Basic Regex Based Extraction (Improved truncation)
        const title = (html.match(/<meta property="og:title" content="(.*?)"/i)?.[1] ||
            html.match(/<title>(.*?)<\/title>/i)?.[1] || "").substring(0, 200);

        const image = html.match(/<meta property="og:image" content="(.*?)"/i)?.[1] || "";

        const description = (html.match(/<meta property="og:description" content="(.*?)"/i)?.[1] ||
            html.match(/<meta name="description" content="(.*?)"/i)?.[1] || "").substring(0, 500);

        const priceMatch = html.match(/<meta property="product:price:amount" content="(.*?)"/i)?.[1] ||
            html.match(/priceAmount":(.*?),/i)?.[1];

        res.json({
            success: true,
            data: {
                name: title.trim(),
                image: image.trim(),
                description: description.trim(),
                price: priceMatch ? `₹${priceMatch}` : ""
            }
        });
    } catch (error) {
        console.error(`[SCRAPE] Error:`, error.message);
        res.status(500).json({ success: false, message: 'Could not fetch metadata' });
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
