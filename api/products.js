import { initialProducts } from './_data.js';

let products = [...initialProducts];

export default function handler(req, res) {
    if (req.method === 'GET') {
        return res.status(200).json(products);
    }

    if (req.method === 'POST') {
        try {
            const { name, price, category, description, image } = req.body;
            if (!name || !price) {
                return res.status(400).json({ success: false, message: 'Name and Price are required' });
            }

            const newProduct = {
                id: Date.now(),
                name,
                price,
                category: category || 'Men',
                description: description || "Engineered for performance.",
                image: image || "",
                tag: "New",
                sizes: [7, 8, 9, 10, 11, 12],
                reviews: 0,
                rating: 5
            };

            products.push(newProduct);
            return res.status(201).json({ success: true, product: newProduct });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }

    if (req.method === 'PUT') {
        const { id } = req.query;
        const { name, price, category, description, image } = req.body;
        const index = products.findIndex(p => p.id == id);
        if (index !== -1) {
            products[index] = { ...products[index], name, price, category, description, image };
            return res.status(200).json({ success: true, product: products[index] });
        }
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.method === 'DELETE') {
        const { id } = req.query;
        products = products.filter(p => p.id != id);
        return res.status(200).json({ success: true, message: 'Product deleted' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
