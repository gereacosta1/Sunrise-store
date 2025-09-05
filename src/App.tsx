import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductDetail from './pages/ProductDetail';
import ContactPage from './pages/ContactPage';
import FinancingPage from './pages/FinancingPage';
import OrderSuccess from './pages/OrderSuccess';
import CheckoutCanceled from './pages/CheckoutCanceled';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <CartProvider>
      <Router>
        {/* 👇 Se monta una vez y escucha cambios de ruta */}
        <ScrollToTop />
        <div className="min-h-screen">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/producto/:slug" element={<ProductDetail />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/financiamiento" element={<FinancingPage />} />
            <Route path="/orden-exitosa" element={<OrderSuccess />} />
            <Route path="/checkout-cancelado" element={<CheckoutCanceled />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
