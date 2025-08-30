import React from 'react';
import { Link } from 'react-router-dom';
import { featuredProducts } from '../data/products';
import { Eye, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductGrid: React.FC = () => {
  const { addItem } = useCart();

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <section id="catalog" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Productos{' '}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Destacados
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra selección de vehículos eléctricos de alta calidad, diseñados para la movilidad del futuro
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Link
              to={`/producto/${product.slug}`}
              key={product.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden h-64">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-2">
                    <button className="bg-white/90 backdrop-blur-sm text-orange-500 p-3 rounded-full hover:bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <Eye className="h-6 w-6" />
                    </button>
                    <button 
                      onClick={(e) => handleAddToCart(product, e)}
                      className="bg-orange-500/90 backdrop-blur-sm text-white p-3 rounded-full hover:bg-orange-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                      aria-label="Agregar al carrito"
                    >
                      <ShoppingCart className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
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

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors duration-200">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-500">
                    ${product.price.toLocaleString()}
                  </span>
                  <span className="bg-orange-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-orange-600 transition-colors duration-200 transform hover:scale-105 cursor-pointer">
                    Ver más
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;