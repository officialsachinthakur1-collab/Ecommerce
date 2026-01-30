import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { products as initialProducts } from '../src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

console.log(">>> GetSetMart Server Starting - Express 5 Engine Active <<<");
console.log(">>> Current Commit Fix: Robust app.use Catch-all <<<");

// Razorpay Instance
const razorpay = new Razorpay({
    key_id: 'rzp_live_S7fi6DftRGCZQo',
    key_secret: 'l5UTCj7s9NG7keJ0YoiA4TdZ'
});

// In-memory database (reset on restart)
// In-memory database (reset on restart)
let products = [...initialProducts];
let orders = [];

app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('GetSetMart E-commerce API is running...');
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/orders', (req, res) => {
    res.json(orders);
});

app.post('/api/orders', (req, res) => {
    const { customer, items, total, address, city, zip, email } = req.body;

    const newOrder = {
        id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`, // Random 4-digit ID
        customer: customer || "Guest User",
        email,
        items,
        total,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Pending',
        address: `${address}, ${city} ${zip}`
    };

    orders.unshift(newOrder); // Add to beginning of array
    res.status(201).json({ success: true, order: newOrder });
});

app.put(['/api/orders/:id', '/api/orders'], (req, res) => {
    const id = req.params.id || req.query.id;
    const { status } = req.body;

    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        res.json({ success: true, order: orders[orderIndex] });
    } else {
        res.status(404).json({ success: false, message: 'Order not found' });
    }
});

app.delete(['/api/orders/:id', '/api/orders'], (req, res) => {
    const id = req.params.id || req.query.id;
    const initialLength = orders.length;
    // Handle URL encoded ID (e.g., #ORD-1234 might come as %23ORD-1234)
    // However, fastify/express usually handles this, but we need to match string exactness
    // The ID stored is "#ORD-xxxx". 
    // Let's assume the client sends the ID correctly.

    orders = orders.filter(o => o.id !== id);

    if (orders.length < initialLength) {
        res.json({ success: true, message: 'Order deleted' });
    } else {
        res.status(404).json({ success: false, message: 'Order not found' });
    }
});

app.post('/api/products', (req, res) => {
    try {
        const { name, price, category, description, image, sizes, tag } = req.body;
        const password = req.headers['x-admin-password'];

        if (password !== (process.env.ADMIN_PASSWORD || 'admin')) {
            return res.status(403).json({ success: false, message: 'Unauthorized - Admin Password Required' });
        }

        if (!name || !price) {
            return res.status(400).json({ success: false, message: 'Name and Price are required' });
        }

        const newProduct = {
            id: Date.now(), // More reliable ID generation
            name,
            price,
            category: category || 'Men',
            description: description || "Engineered for performance.",
            image: image || "",
            tag: tag || "New",
            sizes: sizes || [],
            reviews: 0,
            rating: 5
        };

        products.push(newProduct);
        console.log("Product added successfully:", newProduct.name);
        res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        console.error("Backend Error adding product:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.put(['/api/products/:id', '/api/products'], (req, res) => {
    const id = req.params.id || req.query.id;
    const { name, price, category, description, image, sizes, tag } = req.body;
    const password = req.headers['x-admin-password'];

    if (password !== (process.env.ADMIN_PASSWORD || 'admin')) {
        return res.status(403).json({ success: false, message: 'Unauthorized - Admin Password Required' });
    }

    const index = products.findIndex(p => p.id == id);
    if (index !== -1) {
        products[index] = {
            ...products[index],
            name: name || products[index].name,
            price: price || products[index].price,
            category: category || products[index].category,
            description: description || products[index].description,
            image: image || products[index].image,
            sizes: sizes || products[index].sizes,
            tag: tag || products[index].tag
        };
        res.json({ success: true, product: products[index] });
    } else {
        res.status(404).json({ success: false, message: 'Product not found' });
    }
});

app.delete(['/api/products/:id', '/api/products'], (req, res) => {
    const id = req.params.id || req.query.id;
    const password = req.headers['x-admin-password'];

    console.log(`[DELETE] Attempting to delete product with ID: ${id}`);

    if (password !== (process.env.ADMIN_PASSWORD || 'admin')) {
        console.warn(`[DELETE] Unauthorized attempt for product ID: ${id}`);
        return res.status(403).json({ success: false, message: 'Unauthorized - Admin Password Required' });
    }

    const initialLength = products.length;
    // Use string comparison to be safe with different ID types
    products = products.filter(p => String(p.id) !== String(id));

    if (products.length < initialLength) {
        console.log(`[DELETE] Successfully deleted product ID: ${id}`);
        res.json({ success: true, message: 'Product deleted' });
    } else {
        console.error(`[DELETE] Product not found for ID: ${id}`);
        res.status(404).json({ success: false, message: `Product with ID ${id} not found.` });
    }
});

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

    // Final Robust Catch-all for Express 5+ (Pathless middleware to bypass parser)
    app.use((req, res) => {
        // Only serve index.html for non-API routes
        if (!req.path.startsWith('/api')) {
            return res.sendFile(path.join(__dirname, '../dist/index.html'));
        }
        res.status(404).send('API Route Not Found');
    });
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
