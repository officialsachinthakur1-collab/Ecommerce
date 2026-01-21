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
            if (Array.isArray(data) && data.length > 0) {
                setProducts(data);
            } else {
                // Fallback if empty array returned
                console.log("API returned empty, using local fallback");
                const { products: localProducts } = await import('../data/products.js');
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
