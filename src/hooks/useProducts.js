import { useState, useEffect } from 'react';
import API_URL from '../config';

export const useProducts = (includeFallback = false) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Check local storage saved products first
            const savedLocal = localStorage.getItem('gsm_custom_products');
            const localList = savedLocal ? JSON.parse(savedLocal) : [];

            let apiList = [];
            try {
                const response = await fetch(`${API_URL}/api/products`);
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        apiList = data.map(p => ({
                            ...p,
                            id: p.id || p._id || p.id
                        }));
                    }
                }
            } catch (err) {
                // API fetch failed silently, fallback to localList
            }

            // Combine API and local custom products without duplicate IDs
            const combinedMap = new Map();
            apiList.forEach(p => combinedMap.set(p.id, p));
            localList.forEach(p => combinedMap.set(p.id, p));

            setProducts(Array.from(combinedMap.values()));
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return { products, loading, error, refetch: fetchProducts };
};
