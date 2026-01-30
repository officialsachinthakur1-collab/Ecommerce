import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    customer: { type: String, required: true },
    email: { type: String, required: true },
    items: { type: Array, required: true },
    total: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    address: { type: String, required: true },
    payment_id: String,
    userId: {
        type: String,
        default: null
    },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: null },
    date: { type: String }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
