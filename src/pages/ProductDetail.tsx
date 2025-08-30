import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { getProductBySlug } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = slug ? getProductBySlug(slug) : null;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
          <Link 
            to="/"
            className="text-orange-500 hover:text-orange-600 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 rounded px-2 py-1"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const images = product.gallery || [product.image];

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link 
            to="/"
            className="hover:text-orange-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded px-1"
          >
            Inicio
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors duration-200 mb-8 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded px-2 py-1"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Volver al catálogo</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      selectedImage === index 
                        ? 'border-orange-500' 
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} vista ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.category === 'scooter' 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'bg-orange-200 text-orange-700'
                }`}>
                  {product.category === 'scooter' ? 'Scooter' : 'Motocicleta'}
                </span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-2xl font-bold text-orange-500 mb-6">
                ${product.price.toLocaleString()}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {product.longDescription || product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="font-medium text-gray-900">
                  Cantidad:
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    aria-label="Disminuir cantidad"
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-0 focus:ring-0 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full flex items-center justify-center space-x-2 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                }`}
              >
                <ShoppingCart className="h-6 w-6" />
                <span>{addedToCart ? '¡Agregado al carrito!' : 'Agregar al carrito'}</span>
              </button>
            </div>

            {/* Technical Specs Accordion */}
            {product.specs && (
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                  className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Especificaciones Técnicas</h3>
                  {isSpecsOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                {isSpecsOpen && (
                  <div className="p-6 bg-white">
                    <dl className="grid grid-cols-1 gap-4">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                          <dt className="font-medium text-gray-900">{key}:</dt>
                          <dd className="text-gray-600">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;