import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
    const { isCartOpen, toggleCart, cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 999
                        }}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            width: '100%',
                            maxWidth: '450px',
                            background: '#0a0a0a',
                            borderLeft: '1px solid #222',
                            zIndex: 1000,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', textTransform: 'uppercase' }}>Your Cart ({cart.length})</h2>
                            <button onClick={toggleCart} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                            {cart.length === 0 ? (
                                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                    <p>Your cart is empty.</p>
                                    <button onClick={toggleCart} style={{ marginTop: '1rem', color: 'var(--primary-red)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {cart.map((item) => (
                                        <motion.div
                                            key={`${item.id}-${item.selectedSize}`}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            style={{ display: 'flex', gap: '1rem', background: '#111', padding: '1rem', borderRadius: '8px', border: '1px solid #222' }}
                                        >
                                            <div style={{ width: '80px', height: '80px', background: '#222', borderRadius: '4px' }}></div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                    <h3 style={{ fontWeight: 'bold' }}>{item.name}</h3>
                                                    <span style={{ fontWeight: '600', color: 'var(--primary-red)' }}>{item.price}</span>
                                                </div>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Size: {item.selectedSize}</p>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#050505', borderRadius: '4px', padding: '0.25rem' }}>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.selectedSize, -1)}
                                                            disabled={item.quantity <= 1}
                                                            style={{ padding: '0.25rem', color: item.quantity <= 1 ? '#333' : 'white', background: 'transparent', border: 'none', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer' }}
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span style={{ fontSize: '0.9rem', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.selectedSize, 1)}
                                                            style={{ padding: '0.25rem', color: 'white', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                                                        style={{ color: '#666', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div style={{ padding: '1.5rem', borderTop: '1px solid #222', background: '#050505' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                                    <span>Subtotal</span>
                                    <span>${cartTotal.toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        toggleCart();
                                        navigate('/checkout');
                                    }}
                                    className="btn-primary"
                                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem', cursor: 'pointer' }}
                                >
                                    Checkout Now <ArrowRight size={18} />
                                </button>
                                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                                    Shipping & taxes calculated at checkout.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
