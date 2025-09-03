import React from 'react';
import { CreditCard, Calculator, Clock, Shield, CheckCircle, DollarSign } from 'lucide-react';

const FinancingPage: React.FC = () => {
  const plans = [
    {
      duration: '3 months',
      apr: '0%',
      monthlyFrom: '$533',
      description: 'Perfect for smaller purchases',
      features: ['No interest', 'Instant approval', 'No prepayment penalties'],
    },
    {
      duration: '6 months',
      apr: '0–15%',
      monthlyFrom: '$267',
      description: 'Ideal balance between time and payment',
      features: ['Comfortable installments', 'Payment flexibility', 'Simple process'],
    },
    {
      duration: '12 months',
      apr: '10–30%',
      monthlyFrom: '$142',
      description: 'Maximum payment comfort',
      features: ['Very low installments', 'Extended payment', 'Great for premium products'],
    },
  ];

  const benefits = [
    {
      icon: Calculator,
      title: 'Payments from $89/month',
      description: 'Flexible financing plans tailored to your budget',
    },
    {
      icon: Clock,
      title: 'Instant approval',
      description: 'Know your approval in under 30 seconds',
    },
    {
      icon: Shield,
      title: 'No prepayment penalties',
      description: 'Pay off early with no extra fees',
    },
    {
      icon: CheckCircle,
      title: 'Secure process',
      description: 'Bank-grade technology and encryption',
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Financing
            </span>{' '}
            Options
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get your electric vehicle today and pay in easy installments with Affirm. No hassle, no surprises—just the
            mobility you need.
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
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Financing Plans</h2>

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
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.duration}</h3>
                  <div className="text-4xl font-bold text-orange-500 mb-2">{plan.monthlyFrom}</div>
                  <p className="text-gray-600 text-sm">from / month</p>
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

                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    index === 1
                      ? 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500'
                      : 'border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white focus:ring-orange-500'
                  }`}
                >
                  Select plan
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How does it work?</h2>
            <p className="text-orange-100 text-lg">Simple 3-step process</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/20 p-6 rounded-2xl w-fit mx-auto mb-4">
                <span className="text-3xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose your product</h3>
              <p className="text-orange-100">Pick the scooter or motorcycle you like the most.</p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 p-6 rounded-2xl w-fit mx-auto mb-4">
                <span className="text-3xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Apply for financing</h3>
              <p className="text-orange-100">Complete the application in under 2 minutes.</p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 p-6 rounded-2xl w-fit mx-auto mb-4">
                <span className="text-3xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enjoy your purchase</h3>
              <p className="text-orange-100">Get your vehicle and start paying in installments.</p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Financing subject to credit approval. Terms may vary based on eligibility.{' '}
            <a
              href="https://www.affirm.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-600 underline focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
            >
              See Affirm’s full terms
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancingPage;
