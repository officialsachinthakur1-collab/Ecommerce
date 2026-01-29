import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://officialsachinthakur1_db_user:Sachin%40321@cluster0.qq5oztp.mongodb.net/getsetmart?retryWrites=true&w=majority&appName=Cluster0';

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    category: { type: String, default: 'Men' },
    description: { type: String, default: 'Engineered for performance.' },
    image: { type: String, default: '' },
    tag: { type: String, default: 'New' },
    sizes: { type: [mongoose.Schema.Types.Mixed], default: [7, 8, 9, 10, 11, 12] },
    reviews: { type: Number, default: 0 },
    rating: { type: Number, default: 5 },
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const clothing = [
    {
        name: "Premium Purple Floral Kurta",
        price: "₹1,899",
        tag: "New Arrival",
        category: "Women",
        description: "A beautifully crafted purple floral kurta with delicate patterns and premium cotton fabric. Perfect for elegant everyday wear or special traditional occasions.",
        sizes: ["S", "M", "L", "XL"],
        reviews: 42,
        rating: 4.9,
        image: "/assets/products/floral_kurta.jpg"
    }
];

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        for (const item of clothing) {
            const exists = await Product.findOne({ name: item.name });
            if (!exists) {
                await Product.create(item);
                console.log(`Added: ${item.name}`);
            } else {
                console.log(`Updating: ${item.name}`);
                exists.image = item.image;
                exists.description = item.description;
                await exists.save();
            }
        }

        console.log('Seed clothing complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
