import React from 'react';
import { Truck, Shield, Headphones } from 'lucide-react';

const TrustSection: React.FC = () => {
  const features = [
    {
      icon: Truck,
      title: 'Envíos Rápidos',
      description: 'Entrega gratuita en 2-3 días hábiles a nivel nacional. Tracking en tiempo real.',
      color: 'bg-orange-100 text-orange-500'
    },
    {
      icon: Shield,
      title: 'Garantía Extendida',
      description: '2 años de garantía completa en todos nuestros productos. Tranquilidad total.',
      color: 'bg-orange-200 text-orange-600'
    },
    {
      icon: Headphones,
      title: 'Soporte 24/7',
      description: 'Atención al cliente especializada disponible todos los días del año.',
      color: 'bg-orange-300 text-orange-700'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir{' '}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Sunrise Store?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nos comprometemos a brindarte la mejor experiencia de compra y servicio
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className={`w-20 h-20 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-10 w-10" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-500 transition-colors duration-200">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">5000+</div>
              <div className="text-orange-100">Clientes satisfechos</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">99%</div>
              <div className="text-orange-100">Calificación positiva</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">24h</div>
              <div className="text-orange-100">Tiempo de respuesta</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">3</div>
              <div className="text-orange-100">Años en el mercado</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;