import React from 'react';
import { ArrowRight, CreditCard } from 'lucide-react';

const HeroSection: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg')`,
        }}
      >
        {/* Orange Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/90 via-orange-600/80 to-orange-500/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Welcome to{' '}
            <span className="block bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
              Sunrise Store
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-orange-100 font-light max-w-2xl mx-auto leading-relaxed">
            The new era of electric mobility is here. Discover our next-generation electric scooters and motorcycles.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <button
              onClick={() => scrollToSection('catalog')}
              className="group bg-white text-orange-500 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
            >
              <span>Explore now</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            <button
              onClick={() => scrollToSection('financing')}
              className="group flex items-center space-x-3 text-white hover:text-orange-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500 rounded-xl px-4 py-2"
            >
              <div className="bg-white/20 p-3 rounded-full group-hover:bg-white/30 transition-colors duration-300">
                <CreditCard className="h-6 w-6" />
              </div>
              <span className="font-medium">Learn about financing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
