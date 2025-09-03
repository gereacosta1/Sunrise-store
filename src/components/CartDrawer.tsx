import React, { useEffect, useRef } from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (isOpen && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    try {
      // Prepare checkout data for Affirm
      const checkoutData = {
        items: items.map(item => ({
          display_name: item.name,
          sku: item.slug,
          unit_price: Math.round(item.price * 100), // Convert to cents
          qty: item.quantity,
          item_image_url: item.image,
          item_url: `${window.location.origin}/producto/${item.slug}`
        })),
        total: Math.round(getTotal() * 100), // Convert to cents
        currency: 'USD',
        merchant: {
          user_confirmation_url: `${window.location.origin}/orden-exitosa`,
          user_cancel_url: `${window.location.origin}/checkout-cancelado`,
          user_confirmation_url_action: 'GET',
          name: 'Sunrise Store'
        },
        shipping: {
          name: { first: 'Customer', last: 'Name' },
          address: {
            line1: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipcode: '12345',
            country: 'USA'
          }
        },
        billing: {
          name: { first: 'Customer', last: 'Name' },
          address: {
            line1: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipcode: '12345',
            country: 'USA'
          }
        }
      };

      const response = await fetch('/.netlify/functions/affirm-create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData)
      });

      if (!response.ok) {
        throw new Error('Error creating checkout');
      }

      const { checkout_token } = await response.json();

      // Load Affirm script and open checkout
      const script = document.createElement('script');
      script.src =
        process.env.NODE_ENV === 'production'
          ? 'https://cdn1.affirm.com/js/v2/affirm.js'
          : 'https://cdn1-sandbox.affirm.com/js/v2/affirm.js';

      script.onload = () => {
        // @ts-ignore
        affirm.ui.ready(() => {
          // @ts-ignore
          affirm.checkout(checkout_token);
        });
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error processing checkout. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2
            ref={titleRef}
            className="text-2xl font-bold text-gray-900 focus:outline-none"
            tabIndex={-1}
          >
            Shopping Cart
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-md"
            aria-label="Close cart"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-2">Add some products to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                    <p className="text-orange-500 font-bold">${item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-gray-500 hover:text-orange-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-gray-500 hover:text-orange-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    aria-label="Remove item"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span className="text-orange-500">${getTotal().toLocaleString()}</span>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Checkout
              </button>
              <button
                onClick={clearCart}
                className="w-full text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md py-2"
              >
                Clear cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
