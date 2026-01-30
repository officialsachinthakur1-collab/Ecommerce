import { useState, useEffect } from 'react';
import API_URL from '../config';
import { products as localProductsFallback } from '../data/products.js';

export const useProducts = (includeFallback = false) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/products`);
            if (!response.ok) throw new Error('Failed to fetch products');

            const data = await response.json();

            if (Array.isArray(data)) {
                // Map MongoDB _id to id for frontend compatibility
                const mappedData = data.map(p => ({
                    ...p,
                    id: p.id || p._id || p.id
                }));

                // HYBRID STRATEGY: Merge API data with local items (only if requested)
                const mergedProducts = [...mappedData];

                if (includeFallback) {
                    localProductsFallback.forEach(lp => {
                        const exists = mergedProducts.some(mp => mp.name === lp.name || mp.id === lp.id);
                        if (!exists) mergedProducts.unshift(lp);
                    });
                }

                setProducts(mergedProducts);
            } else {
                setProducts(includeFallback ? localProductsFallback : []);
            }
            setLoading(false);
        } catch (err) {
            console.warn("API fetch failed, using local fallback:", err);
            setProducts(includeFallback ? localProductsFallback : []);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return { products, loading, error, refetch: fetchProducts };
};
