# GETSETMART - Premium 3D E-commerce Platform

A high-performance, modern e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js). Features a sleek dark-themed UI, 3D product visualizations, and a comprehensive Admin Dashboard.

![Project Status](https://img.shields.io/badge/status-live-green) ![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Features

### Customer Experience
*   **Immersive UI**: Premium dark aesthetic with glassmorphism and 3D elements.
*   **Advanced Shop**: Filter by Category, Price Range, and Sort by Newest/Price.
*   **User Accounts**: Profile management, Order History, and Wishlist.
*   **Secure Auth**: JWT-based Login/Signup with **Forgot Password** (Email Token) flow.
*   **Smart Cart**: Real-time cart updates and seamless checkout.
*   **Coupons**: Apply promo codes at checkout for discounts.
*   **Newsletter**: "Join the Movement" subscription integration.

### Admin Dashboard (`/admin`)
*   **Business Intelligence**: Real-time Sales Analytics, Revenue Charts, and Top Products.
*   **Inventory Intelligence**: **Critical Stock Alerts** for low-inventory items.
*   **Product Management**: Create, Edit, Delete products with image URL support.
*   **Coupon Management**: Generate, track, and delete discount codes.
*   **Order Management**: View and manage customer orders.
*   **Review Management**: Moderate user reviews.

## 🛠️ Tech Stack

*   **Frontend**: React.js, Vite, Framer Motion (Animations), Lucide React (Icons).
*   **Backend**: Node.js, Express (Serverless via Vercel), Mongoose.
*   **Database**: MongoDB Atlas.
*   **Authentication**: JWT (JSON Web Tokens).

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/officialsachinthakur1-collab/Ecommerce.git
    cd Ecommerce
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    NEXT_PUBLIC_BASE_URL=http://localhost:5173
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```

## 🔐 Admin Access

To access the Admin Dashboard, navigate to `/admin`.
*   **Note**: Protected routes require admin privileges (currently configured via simple password/role checks in API).

## 🤝 Contribution

Contributions are welcome! Please fork the repository and submit a pull request.

---
&copy; 2026 GETSETMART Inc. All rights reserved.
