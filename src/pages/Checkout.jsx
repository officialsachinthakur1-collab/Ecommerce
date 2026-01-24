import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API_URL from '../config';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Mock form state
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        zip: '',
        cardColor: '#111' // just for fun visual
    });

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        try {
            // 1. Create Order on Backend
            const orderResponse = await fetch(`${API_URL}/api/razorpay?action=order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: cartTotal,
                    currency: 'INR'
                })
            });

            const orderData = await orderResponse.json();

            if (!orderData.success) {
                alert("Order creation failed");
                setLoading(false);
                return;
            }

            // 2. Open Razorpay Modal
            const options = {
                key: 'rzp_live_S7fi6DftRGCZQo',
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: 'GETSETMART',
                description: 'Order Payment',
                order_id: orderData.order.id,
                handler: async (response) => {
                    try {
                        const verifyRes = await fetch(`${API_URL}/api/razorpay?action=verify`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(response)
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            // 3. Create Local Order Record
                            const finalOrderData = {
                                customer: `${formData.firstName} ${formData.lastName}`,
                                email: formData.email,
                                items: cart,
                                total: `₹${cartTotal.toLocaleString()}`,
                                address: formData.address,
                                city: formData.city,
                                zip: formData.zip,
                                payment_id: response.razorpay_payment_id
                            };

                            await fetch(`${API_URL}/api/orders`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(finalOrderData)
                            });

                            clearCart();
                            navigate('/order-success');
                        } else {
                            alert("Payment verification failed");
                        }
                    } catch (err) {
                        console.error("Verification error:", err);
                    }
                },
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email
                },
                theme: {
                    color: '#FF0000'
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            setLoading(false);

        } catch (error) {
            console.error("Error submitting order:", error);
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div style={{ paddingTop: 'var(--header-height)', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h2>Your cart is empty</h2>
                <button onClick={() => navigate('/shop')} className="btn-primary" style={{ marginTop: '1rem' }}>Return to Shop</button>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: 'calc(var(--header-height) + 2rem)', minHeight: '100vh', background: 'var(--bg-color)', color: 'white', paddingBottom: '4rem' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '4rem', maxWidth: '1200px', margin: '0 auto' }}>

                {/* Left: Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>CHECKOUT</h1>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Contact Information</h3>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                required
                                style={{ width: '100%', padding: '1rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: 'white' }}
                            />
                        </section>

                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Shipping Address</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <input type="text" placeholder="First Name" required style={{ width: '100%', padding: '1rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: 'white' }} />
                                <input type="text" placeholder="Last Name" required style={{ width: '100%', padding: '1rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: 'white' }} />
                            </div>
                            <input type="text" placeholder="Address" required style={{ width: '100%', padding: '1rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: 'white', marginBottom: '1rem' }} />
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                                <input type="text" placeholder="City" required style={{ width: '100%', padding: '1rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: 'white' }} />
                                <input type="text" placeholder="ZIP Code" required style={{ width: '100%', padding: '1rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: 'white' }} />
                            </div>
                        </section>

                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Payment</h3>
                            <div style={{ padding: '1rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: 'var(--text-muted)' }}>
                                All transactions are secure and encrypted.
                            </div>
                        </section>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{
                                padding: '1.25rem',
                                marginTop: '1rem',
                                width: '100%',
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'wait' : 'pointer'
                            }}
                        >
                            {loading ? 'Processing...' : `Pay ₹${cartTotal.toLocaleString()}`}
                        </button>

                    </form>
                </motion.div>

                {/* Right: Summary */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ background: '#111', padding: '2rem', borderRadius: '8px', border: '1px solid #333', height: 'fit-content' }}
                >
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 800 }}>Order Summary</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', maxHeight: '400px', overflowY: 'auto' }}>
                        {cart.map((item, idx) => (
                            <div key={`${item.id}-${idx}`} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ width: '60px', height: '60px', background: '#222', borderRadius: '4px', position: 'relative' }}>
                                    <span style={{ position: 'absolute', top: -5, right: -5, background: '#666', color: 'white', width: '20px', height: '20px', borderRadius: '50%', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {item.quantity}
                                    </span>
                                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{item.name}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.selectedSize}</p>
                                </div>
                                <span style={{ fontSize: '0.9rem' }}>{item.price}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: '1px solid #333', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
                            <span>Total</span>
                            <span>₹{cartTotal.toLocaleString()}</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Checkout;
