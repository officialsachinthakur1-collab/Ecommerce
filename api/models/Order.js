import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    customer: { type: String, required: true },
    email: { type: String, required: true },
    items: { type: Array, required: true },
    total: { type: String, required: true },
    status: { type: String, default: 'Paid' },
    address: { type: String, required: true },
    payment_id: { type: String },
    date: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
