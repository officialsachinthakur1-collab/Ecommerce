import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    id: { type: Number },
    name: { type: String, required: true },
    price: { type: String, required: true },
    category: { type: String, default: 'Men' },
    description: { type: String, default: 'Engineered for performance.' },
    image: { type: String, default: '' },
    images: { type: [String], default: [] },
    tag: { type: String, default: 'New' },
    sizes: { type: [mongoose.Schema.Types.Mixed], default: [7, 8, 9, 10, 11, 12] },
    reviews: { type: mongoose.Schema.Types.Mixed, default: [] },
    rating: { type: mongoose.Schema.Types.Mixed, default: 5 },
    stock: { type: Number, default: 10 },
    affiliateLink: { type: String, default: '' },
    isHero: { type: Boolean, default: false },
    heroTitle: { type: String, default: '' },
    isCombo: { type: Boolean, default: false },
    comboProducts: { type: [mongoose.Schema.Types.Mixed], default: [] }, // Stores details of 3 linked products
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
