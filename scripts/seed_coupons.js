import dbConnect from '../api/utils/db.js';
import Coupon from '../api/models/Coupon.js';

const coupons = [
    {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountAmount: 10,
        minOrderAmount: 500,
        expiryDate: '2026-12-31',
        isActive: true
    },
    {
        code: 'SAVE100',
        discountType: 'fixed',
        discountAmount: 100,
        minOrderAmount: 1000,
        expiryDate: '2026-12-31',
        isActive: true
    },
    {
        code: 'MAXOFF',
        discountType: 'percentage',
        discountAmount: 25,
        minOrderAmount: 2000,
        expiryDate: '2026-12-31',
        isActive: true
    }
];

async function seedCoupons() {
    await dbConnect();
    try {
        await Coupon.deleteMany();
        await Coupon.insertMany(coupons);
        console.log('Coupons Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('Seed Failed:', error);
        process.exit(1);
    }
}

seedCoupons();
