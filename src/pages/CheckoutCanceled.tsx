import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';

const CheckoutCanceled: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
          {/* Cancel Icon */}
          <div className="bg-red-100 p-6 rounded-full w-fit mx-auto mb-8">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>

          {/* Cancel Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Checkout canceled</h1>
          <p className="text-xl text-gray-600 mb-8">
            No payment was processed. Your items are still in the cart waiting for you.
          </p>

          {/* Information */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What happened?</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• The payment process was canceled</p>
              <p>• No charges were made to your account</p>
              <p>• Your products remain in the cart</p>
              <p>• You can try again whenever you like</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Continue shopping</span>
              </Link>

              <Link
                to="/contacto" /* keep existing route anchor */
                className="inline-flex items-center space-x-2 border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-orange-500 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                <span>Need help?</span>
              </Link>
            </div>

            <p className="text-gray-500 text-sm">
              If you’re having issues with the payment process, feel free to contact us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCanceled;
