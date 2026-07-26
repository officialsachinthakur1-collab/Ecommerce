import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        try {
            const storedWishlist = localStorage.getItem('wishlist');
            return storedWishlist ? JSON.parse(storedWishlist) : [];
        } catch (error) {
            console.error('Failed to parse wishlist from local storage', error);
            return [];
        }
    });

    // Save wishlist to local storage on change
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product) => {
        setWishlist(prev => {
            const id = product._id || product.id;
            if (prev.some(item => (item._id || item.id) === id)) return prev;
            return [...prev, product];
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlist(prev => prev.filter(item => (item._id || item.id) !== productId));
    };

    const toggleWishlist = (product) => {
        const id = product._id || product.id;
        const exists = wishlist.some(item => (item._id || item.id) === id);
        if (exists) {
            removeFromWishlist(id);
        } else {
            addToWishlist(product);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => (item._id || item.id) === productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isInWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
