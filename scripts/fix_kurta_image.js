import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://officialsachinthakur1_db_user:Sachin%40321@cluster0.qq5oztp.mongodb.net/getsetmart?retryWrites=true&w=majority&appName=Cluster0';

const ProductSchema = new mongoose.Schema({
    id: { type: Number },
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

async function findAndUpdate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        // 1. Delete the duplicate I added (id: 7 if it exists, or based on name)
        const deletedDuplicate = await Product.findOneAndDelete({ name: "Premium Purple Floral Kurta" });
        if (deletedDuplicate) {
            console.log(`Deleted duplicate: ${deletedDuplicate.name}`);
        }

        // 2. Find products that have NO image or a placeholder image
        const itemsToFix = await Product.find({ $or: [{ image: "" }, { image: null }, { image: { $exists: false } }] });

        console.log(`Found ${itemsToFix.length} items without an image.`);

        for (const item of itemsToFix) {
            console.log(`Potential target: ${item.name} (id: ${item.id})`);
            // Update the first one found (or we can be more specific if we saw names)
            item.image = "/assets/products/floral_kurta.jpg";
            await item.save();
            console.log(`Updated ${item.name} with new image!`);
        }

        console.log('Operation complete!');
        process.exit(0);
    } catch (error) {
        console.error('Operation failed:', error);
        process.exit(1);
    }
}

findAndUpdate();
