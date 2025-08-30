import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, CreditCard, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';

const OrderSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const chargeId = searchParams.get('charge_id');

  useEffect(() => {
    // Clear cart after successful order
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
          {/* Success Icon */}
          <div className="bg-green-100 p-6 rounded-full w-fit mx-auto mb-8">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¡Orden Exitosa!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Tu compra ha sido procesada correctamente. Recibirás un email de confirmación en breve.
          </p>

          {/* Order Details */}
          {chargeId && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles de la orden</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de transacción:</span>
                  <span className="font-mono text-gray-900">{chargeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Método de pago:</span>
                  <span className="text-gray-900">Affirm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="text-green-600 font-medium">Confirmado</span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-orange-50 p-6 rounded-2xl">
              <Package className="h-8 w-8 text-orange-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Preparación del envío</h3>
              <p className="text-gray-600 text-sm">
                Tu pedido será preparado y enviado en las próximas 24-48 horas.
              </p>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-2xl">
              <CreditCard className="h-8 w-8 text-orange-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Pagos con Affirm</h3>
              <p className="text-gray-600 text-sm">
                Recibirás información sobre tus cuotas mensuales por email.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <Home className="h-5 w-5" />
              <span>Volver al inicio</span>
            </Link>
            
            <p className="text-gray-500 text-sm">
              ¿Tienes preguntas? <Link to="/contacto" className="text-orange-500 hover:text-orange-600 underline">Contáctanos</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;