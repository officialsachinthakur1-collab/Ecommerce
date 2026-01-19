import express from 'express';
import cors from 'cors';
import { products as initialProducts } from '../src/data/products.js';

const app = express();
const PORT = 5000;

// In-memory database (reset on restart)
// In-memory database (reset on restart)
let products = [...initialProducts];
let orders = [];

app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('Nivest E-commerce API is running...');
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

app.put('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        res.json({ success: true, order: orders[orderIndex] });
    } else {
        res.status(404).json({ success: false, message: 'Order not found' });
    }
});

app.delete('/api/orders/:id', (req, res) => {
    const { id } = req.params;
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
    const { name, price, category, description, image } = req.body;

    const newProduct = {
        id: products.length + 1, // Simple ID generation
        name,
        price,
        category,
        description: description || "Engineered for performance.",
        image, // Add image URL
        tag: "New", // Default tag
        sizes: [7, 8, 9, 10, 11, 12], // Default sizes
        reviews: 0,
        rating: 5
    };

    products.push(newProduct);
    res.status(201).json({ success: true, product: newProduct });
});

app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = products.length;
    products = products.filter(p => p.id != id);

    if (products.length < initialLength) {
        res.json({ success: true, message: 'Product deleted' });
    } else {
        res.status(404).json({ success: false, message: 'Product not found' });
    }
});

// Auth Route
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Simple Mock Auth Logic
    if (email === 'admin@nivest.com' && password === 'admin') {
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
