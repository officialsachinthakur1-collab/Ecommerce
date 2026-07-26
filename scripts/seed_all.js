import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually parse .env if it exists
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.join('=').trim();
        }
    });
}

// Import models
import Product from '../api/models/Product.js';
import Coupon from '../api/models/Coupon.js';

// Connection String
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env');
    process.exit(1);
}

const initialProducts = [
    {
        name: "Premium Purple Floral Kurta",
        price: "₹1,899",
        tag: "New Arrival",
        category: "Women",
        description: "A beautifully crafted purple floral kurta with delicate patterns and premium cotton fabric. Perfect for elegant everyday wear or special traditional occasions.",
        sizes: ["S", "M", "L", "XL"],
        reviews: 42,
        rating: 4.9,
        image: "/assets/products/floral_kurta.jpg",
        stock: 15
    },
    {
        name: "Classic White Cotton Kurta",
        price: "₹1,499",
        tag: "Bestseller",
        category: "Men",
        description: "Pure cotton white kurta with minimalist design. Breathable and perfect for summer.",
        sizes: ["M", "L", "XL", "XXL"],
        reviews: 28,
        rating: 4.7,
        image: "/assets/products/white_kurta_placeholder.jpg",
        stock: 20
    }
];

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected Successfully!');

        // Seed Products
        console.log('Seeding initial products...');
        for (const item of initialProducts) {
            const exists = await Product.findOne({ name: item.name });
            if (!exists) {
                await Product.create(item);
                console.log(`Added: ${item.name}`);
            } else {
                console.log(`Skipped (already exists): ${item.name}`);
            }
        }

        console.log('Database Seeding Complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
