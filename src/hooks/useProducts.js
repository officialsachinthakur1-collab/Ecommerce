import { useState, useEffect } from 'react';
import API_URL from '../config';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Use centralized API URL to switch between local and production automatically
            const response = await fetch(`${API_URL}/api/products`);

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            const { products: localProducts } = await import('../data/products.js');

            if (Array.isArray(data)) {
                // Map MongoDB _id to id for frontend compatibility
                const mappedData = data.map(p => ({
                    ...p,
                    id: p.id || p._id || p.id
                }));

                // HYBRID STRATEGY: Merge API data with local items that are missing from the API
                const mergedProducts = [...mappedData];
                localProducts.forEach(lp => {
                    const exists = mergedProducts.some(mp => mp.name === lp.name || mp.id === lp.id);
                    if (!exists) {
                        mergedProducts.unshift(lp); // Add new local items to the top
                    }
                });

                setProducts(mergedProducts);
            } else {
                setProducts(localProducts);
            }
            setLoading(false);
        } catch (err) {
            console.warn("API fetch failed, using local fallback:", err);
            try {
                const { products: localProducts } = await import('../data/products.js');
                setProducts(localProducts);
                setError(null); // Clear error since we have fallback data
            } catch (importErr) {
                setError("Failed to load products");
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return { products, loading, error, refetch: fetchProducts };
};
