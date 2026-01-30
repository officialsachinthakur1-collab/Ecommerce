import dbConnect from './utils/db.js';
import Order from './models/Order.js';
import Product from './models/Product.js';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const orders = await Order.find({});

            // 1. Total Stats
            const totalRevenue = orders.reduce((acc, order) => {
                const price = parseFloat(order.total.replace(/[^0-9.-]+/g, ""));
                return acc + (isNaN(price) ? 0 : price);
            }, 0);

            // 2. Daily Sales (Last 7 Days)
            const dailySales = {};
            const last7Days = [...Array(7)].map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }).reverse();

            last7Days.forEach(date => dailySales[date] = 0);

            orders.forEach(order => {
                if (dailySales[order.date] !== undefined) {
                    const price = parseFloat(order.total.replace(/[^0-9.-]+/g, ""));
                    dailySales[order.date] += isNaN(price) ? 0 : price;
                }
            });

            const chartData = Object.keys(dailySales).map(date => ({
                date,
                revenue: dailySales[date]
            }));

            // 3. Top Products
            const productSales = {};
            orders.forEach(order => {
                order.items.forEach(item => {
                    productSales[item.name] = (productSales[item.name] || 0) + (item.quantity || 1);
                });
            });

            const topProducts = Object.keys(productSales)
                .map(name => ({ name, sales: productSales[name] }))
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 5);

            // 4. Low Stock Products
            const lowStockProducts = await Product.find({ stock: { $lte: 10 } }).limit(5);

            return res.status(200).json({
                success: true,
                stats: {
                    totalRevenue,
                    totalOrders: orders.length,
                    avgOrderValue: orders.length > 0 ? (totalRevenue / orders.length) : 0
                },
                chartData,
                topProducts,
                lowStockProducts
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    res.status(405).end(`Method ${req.method} Not Allowed`);
}
