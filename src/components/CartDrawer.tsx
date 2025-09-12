import React, { useEffect, useRef } from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

declare global {
  interface Window {
    affirm?: any;
  }
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SITE = 'https://www.sunrisestore.info'; // usa www porque ese es el que está cargado en Affirm

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (isOpen && titleRef.current) titleRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && isOpen && onClose();
    if (isOpen) {
      document.addEventListener('keydown', onEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleCheckout = async () => {
  if (items.length === 0) return;

  try {
    const origin = window.location.origin;
    const toAbs = (u: string) =>
      u?.startsWith("http") ? u : `${origin}${u?.startsWith("/") ? "" : "/"}${u || ""}`;

    // Items en formato Affirm (centavos + URLs absolutas)
    const affItems = items.map((item) => ({
      display_name: item.name,
      sku: item.slug || String(item.id),
      unit_price: Math.round(Number(item.price) * 100), // USD -> centavos
      qty: item.quantity,
      item_image_url: toAbs(item.image),                // absoluta
      item_url: origin,                                  // usa home; si tienes PDP, cámbialo aquí
    }));

    const totalCents = affItems.reduce((sum, it) => sum + it.unit_price * it.qty, 0);

    // Llamamos a la Function en Netlify
    const res = await fetch("/.netlify/functions/affirm-create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: affItems,
        total: totalCents,
        currency: "USD",
        // Estas URLs se sobre-escriben en la Function con AFFIRM_SITE_BASE_URL si las dejas vacías
        merchant: {
          user_confirmation_url: `${origin}/orden-exitosa`,
          user_cancel_url: `${origin}/checkout-cancelado`,
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("create-checkout error:", data);
      alert(data?.details || "Affirm: no se pudo crear el checkout.");
      return;
    }

    // ✅ flujo recomendado: redirigir
    if (data.redirect_url) {
      window.location.href = data.redirect_url;
      return;
    }

    // Fallback por si no viniera redirect_url
    if (data.checkout_token && (window as any).affirm) {
      (window as any).affirm.checkout({ checkout_token: data.checkout_token });
      (window as any).affirm.checkout.open();
    } else {
      alert("Affirm no está disponible.");
    }
  } catch (err) {
    console.error("Checkout error:", err);
    alert("Error procesando el checkout. Intenta de nuevo.");
  }
};


  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 ref={titleRef} className="text-2xl font-bold text-gray-900 focus:outline-none" tabIndex={-1}>
            Shopping Cart
          </h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 rounded-md" aria-label="Close cart">
            <X className="h-6 w-6" />
          </button>
        </div>

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
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-gray-500 hover:text-orange-500 rounded">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-gray-500 hover:text-orange-500 rounded">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-2 text-red-500 hover:text-red-700 rounded" aria-label="Remove item">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span className="text-orange-500">${getTotal().toLocaleString()}</span>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold"
              >
                Pay with Affirm
              </button>
              <button onClick={clearCart} className="w-full text-gray-500 hover:text-gray-700">
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
