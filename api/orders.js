let orders = [];

export default function handler(req, res) {
    if (req.method === 'GET') {
        return res.status(200).json(orders);
    }

    if (req.method === 'POST') {
        const { customer, items, total, address, city, zip, email, payment_id } = req.body;

        const newOrder = {
            id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            customer: customer || "Guest User",
            email,
            items,
            total,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Paid',
            address: `${address}, ${city} ${zip}`,
            payment_id
        };

        orders.unshift(newOrder);
        return res.status(201).json({ success: true, order: newOrder });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
