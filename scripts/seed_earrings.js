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

const earrings = [
    {
        name: "Premium Pink Traditional Earrings",
        price: "₹1,299",
        tag: "Bestseller",
        category: "Women",
        description: "Exquisite traditional Indian oxidized silver earrings with premium pink gemstones. Featuring intricate silver craftsmanship and delicate hanging beads for a timeless ethnic look.",
        sizes: ["One Size"],
        reviews: 145,
        rating: 4.9,
        image: "/assets/products/earrings_pink.png"
    },
    {
        name: "Premium Green Traditional Earrings",
        price: "₹1,299",
        tag: "Trending",
        category: "Women",
        description: "Elegant emerald green traditional earrings set in oxidized silver. High-contrast design with sophisticated silver bead tassels, perfect for festive occasions or luxury wear.",
        sizes: ["One Size"],
        reviews: 98,
        rating: 4.8,
        image: "/assets/products/earrings_green.png"
    },
    {
        name: "Premium Red Traditional Earrings",
        price: "₹1,299",
        tag: "New",
        category: "Women",
        description: "Stunning ruby red traditional earrings with royal peacock motifs in oxidized silver. Hand-finished with delicate silver bells and ultra-realistic gemstones for a regal appearance.",
        sizes: ["One Size"],
        reviews: 76,
        rating: 5,
        image: "/assets/products/earrings_red.png"
    }
];

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        for (const item of earrings) {
            // Check if product already exists to avoid duplicates
            const exists = await Product.findOne({ name: item.name });
            if (!exists) {
                await Product.create(item);
                console.log(`Added: ${item.name}`);
            } else {
                console.log(`Skipped (already exists): ${item.name}`);
                // Update image path just in case
                exists.image = item.image;
                exists.tag = item.tag;
                await exists.save();
                console.log(`Updated tag/image for: ${item.name}`);
            }
        }

        console.log('Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
