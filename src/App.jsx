// Main App Component - Vercel Deployment Sync
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import ProductDetailsPreview from './pages/ProductDetailsPreview';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import ScrollToTop from './components/common/ScrollToTop';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Account from './pages/Account';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReviews from './pages/admin/AdminReviews';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminSettings from './pages/admin/AdminSettings';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import Shipping from './pages/Shipping';
import Returns from './pages/Returns';
import ValentinePreview from './pages/ValentinePreview';
import ValentinesDay from './pages/ValentinesDay';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Dynamic Title SEO Handler
const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const baseUrl = "https://getsetmart.com";
    const fullUrl = `${baseUrl}${path}`;

    let title = "GetSetMart | Affordable Premium Fashion";
    let description = "GetSetMart - Your destination for affordable, high-quality fashion, streetwear, and lifestyle essentials.";
    let image = "https://getsetmart.com/brand-logo-final.png";

    if (path === '/') {
      title = "GetSetMart | Streetwear & Lifestyle Essentials";
      description = "Shop premium streetwear and lifestyle essentials at GetSetMart. Affordable fashion for your daily lifestyle.";
    } else if (path.includes('/shop')) {
      title = "Shop Collection | GetSetMart";
      description = "Explore our latest collection of premium fashion and lifestyle products at GetSetMart.";
    } else if (path.includes('/product/')) {
      title = "Product Details | GetSetMart";
      description = "Check out the detailed features and premium quality of our products at GetSetMart.";
    } else if (path === '/wishlist') {
      title = "My Wishlist | GetSetMart";
      description = "Your favorite items saved in one place at GetSetMart.";
    } else if (path === '/valentines-day') {
      title = "Valentine's Special ❤️ | GetSetMart";
      description = "Celebrate love with our exclusive Valentine's Day collection and special offers.";
    }

    // Update Title
    document.title = title;

    // Helper to update/create meta tags
    const updateMeta = (selector, attr, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        if (selector.includes('meta')) {
          element = document.createElement('meta');
          if (selector.includes('name')) element.setAttribute('name', selector.split('"')[1]);
          if (selector.includes('property')) element.setAttribute('property', selector.split('"')[1]);
          document.head.appendChild(element);
        }
      }
      if (element) element.setAttribute(attr, value);
    };

    // Update Meta Description
    updateMeta('meta[name="description"]', 'content', description);

    // Update Open Graph (OG) Tags
    updateMeta('meta[property="og:title"]', 'content', title);
    updateMeta('meta[property="og:description"]', 'content', description);
    updateMeta('meta[property="og:url"]', 'content', fullUrl);
    updateMeta('meta[property="og:image"]', 'content', image);

    // Update Twitter Tags
    updateMeta('meta[property="twitter:title"]', 'content', title);
    updateMeta('meta[property="twitter:description"]', 'content', description);
    updateMeta('meta[property="twitter:url"]', 'content', fullUrl);

    // Update Canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    // Ensure no trailing slash mismatch for sub-pages to match sitemap
    const cleanUrl = fullUrl.endsWith('/') && fullUrl !== `${baseUrl}/` ? fullUrl.slice(0, -1) : fullUrl;
    linkCanonical.setAttribute('href', cleanUrl);
  }, [location]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <TitleUpdater />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="product-preview/:id" element={<ProductDetails />} />
          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogPost />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="signup" element={<Signup />} />
          <Route path="profile" element={<Profile />} />
          <Route path="account" element={<Account />} />
          <Route path="shipping" element={<Shipping />} />
          <Route path="returns" element={<Returns />} />
          <Route path="valentine-preview" element={<ValentinePreview />} />
          <Route path="valentines-day" element={<ValentinesDay />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Login & Reset Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
