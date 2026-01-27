import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'

// Early Error Capture Handler
if (typeof window !== 'undefined') {
  window.onerror = function (msg, url, line, col, error) {
    const root = document.getElementById('root');
    if (root && root.innerHTML === '') {
      root.innerHTML = `<div style="color:white; background:black; padding:40px; height:100vh; font-family:sans-serif; text-align:center; display:flex; flex-direction:column; justify-content:center; align-items:center;">
        <h1 style="color:red; font-size:2rem; margin-bottom:1rem;">SITE LOAD ERROR</h1>
        <p style="color:#888;">${msg}</p>
        <p style="margin-top:1rem; font-size:0.8rem; color:#555;">File: ${url?.split('/').pop() || 'unknown'}:${line}</p>
        <button onclick="location.reload()" style="margin-top:30px; padding:12px 30px; background:red; border:none; color:white; border-radius:4px; cursor:pointer; font-weight:bold;">RELOAD SITE</button>
      </div>`;
    }
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
