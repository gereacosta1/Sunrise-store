import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Calculator, Clock, Shield } from 'lucide-react';

const FinancingSection: React.FC = () => {
  return (
    <section id="financing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Flexible
                </span>{' '}
                Financing
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Pay in installments with Affirm (subject to eligibility). Subject to approval.{' '}
                <a
                  href="https://www.affirm.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-600 underline focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
                >
                  See terms
                </a>.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <Calculator className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Payments from $89/month</h3>
                  <p className="text-gray-600">Flexible plans tailored to your budget.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <Clock className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Instant approval</h3>
                  <p className="text-gray-600">Know your approval in under 30 seconds.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <Shield className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">No prepayment penalties</h3>
                  <p className="text-gray-600">Pay off early with no extra fees.</p>
                </div>
              </div>
            </div>

            <Link
              to="/financiamiento" 
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              See payment options
            </Link>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white">
              <div className="flex items-center justify-center mb-8">
                <div className="bg-white/20 p-6 rounded-2xl">
                  <CreditCard className="h-16 w-16 text-white" />
                </div>
              </div>

              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">Powered by Affirm</h3>
                <p className="text-orange-100">Leading fintech for seamless checkout.</p>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-8">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">0%</div>
                      <div className="text-sm text-orange-100">Intro APR</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">24</div>
                      <div className="text-sm text-orange-100">Max months</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">5min</div>
                      <div className="text-sm text-orange-100">Process time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinancingSection;
