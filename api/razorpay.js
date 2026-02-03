import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_SBaXSYbdg2lOOO',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'vbDmFHP2TUxKFDUOw4kIE6MM'
});

export default async function handler(req, res) {
    // Determine action from query or body (Vercel serverless doesn't have app.post routes)
    const { action } = req.query;

    if (req.method === 'POST') {
        if (action === 'order') {
            try {
                const { amount, currency = 'INR' } = req.body;
                const options = {
                    amount: Math.round(amount * 100),
                    currency,
                    receipt: `receipt_${Date.now()}`
                };
                const order = await razorpay.orders.create(options);
                return res.status(200).json({ success: true, order });
            } catch (error) {
                return res.status(500).json({ success: false, message: 'Order creation failed' });
            }
        }

        if (action === 'verify') {
            try {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
                const body = razorpay_order_id + "|" + razorpay_payment_id;
                const expectedSignature = crypto
                    .createHmac('sha256', 'vbDmFHP2TUxKFDUOw4kIE6MM')
                    .update(body.toString())
                    .digest('hex');

                if (expectedSignature === razorpay_signature) {
                    return res.status(200).json({ success: true });
                } else {
                    return res.status(400).json({ success: false, message: 'Invalid signature' });
                }
            } catch (error) {
                return res.status(500).json({ success: false });
            }
        }
    }

    res.status(404).json({ message: 'Action not found' });
}
