import React from 'react';
import { CreditCard, Calculator, Clock, Shield, CheckCircle, DollarSign } from 'lucide-react';

const FinancingPage: React.FC = () => {
  const plans = [
    {
      duration: '3 meses',
      apr: '0%',
      monthlyFrom: '$533',
      description: 'Perfecto para compras menores',
      features: ['Sin intereses', 'Aprobación instantánea', 'Sin penalizaciones']
    },
    {
      duration: '6 meses',
      apr: '0-15%',
      monthlyFrom: '$267',
      description: 'Equilibrio ideal entre tiempo y cuota',
      features: ['Cuotas cómodas', 'Flexibilidad de pago', 'Proceso simple']
    },
    {
      duration: '12 meses',
      apr: '10-30%',
      monthlyFrom: '$142',
      description: 'Máxima comodidad de pago',
      features: ['Cuotas muy bajas', 'Pago extendido', 'Ideal para productos premium']
    }
  ];

  const benefits = [
    {
      icon: Calculator,
      title: 'Cuotas desde $89/mes',
      description: 'Planes de financiamiento flexibles adaptados a tu presupuesto'
    },
    {
      icon: Clock,
      title: 'Aprobación instantánea',
      description: 'Conoce tu aprobación en menos de 30 segundos'
    },
    {
      icon: Shield,
      title: 'Sin penalizaciones',
      description: 'Paga antes de tiempo sin cargos adicionales'
    },
    {
      icon: CheckCircle,
      title: 'Proceso seguro',
      description: 'Tecnología bancaria de nivel empresarial'
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Opciones de{' '}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Financiamiento
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compra tu vehículo eléctrico hoy y paga en cómodas cuotas con Affirm. 
            Sin complicaciones, sin sorpresas, solo la movilidad que necesitas.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center p-6 bg-gray-50 rounded-2xl hover:bg-orange-50 transition-colors duration-300"
            >
              <div className="bg-orange-100 p-4 rounded-2xl w-fit mx-auto mb-4">
                <benefit.icon className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Financing Plans */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Planes de Financiamiento
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-3xl border-2 transition-all duration-300 hover:shadow-lg ${
                  index === 1 
                    ? 'border-orange-500 bg-orange-50 transform scale-105' 
                    : 'border-gray-200 bg-white hover:border-orange-300'
                }`}
              >
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Más Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.duration}</h3>
                  <div className="text-4xl font-bold text-orange-500 mb-2">{plan.monthlyFrom}</div>
                  <p className="text-gray-600 text-sm">desde / mes</p>
                  <p className="text-orange-600 font-medium mt-2">APR {plan.apr}</p>
                </div>
                
                <p className="text-gray-600 text-center mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  index === 1
                    ? 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500'
                    : 'border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white focus:ring-orange-500'
                }`}>
                  Seleccionar plan
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">¿Cómo funciona?</h2>
            <p className="text-orange-100 text-lg">Proceso simple en 3 pasos</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/20 p-6 rounded-2xl w-fit mx-auto mb-4">
                <span className="text-3xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Elige tu producto</h3>
              <p className="text-orange-100">Selecciona el scooter o motocicleta que más te guste</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 p-6 rounded-2xl w-fit mx-auto mb-4">
                <span className="text-3xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Solicita financiamiento</h3>
              <p className="text-orange-100">Completa la solicitud en menos de 2 minutos</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 p-6 rounded-2xl w-fit mx-auto mb-4">
                <span className="text-3xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">¡Disfruta tu compra!</h3>
              <p className="text-orange-100">Recibe tu vehículo y comienza a pagar en cuotas</p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Financiamiento sujeto a aprobación crediticia. Los términos pueden variar según elegibilidad.{' '}
            <a 
              href="https://www.affirm.com/terms" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-600 underline focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
            >
              Ver términos completos de Affirm
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancingPage;