import React from 'react';
import HeroSection from '../components/HeroSection';
import ProductGrid from '../components/ProductGrid';
import FinancingSection from '../components/FinancingSection';
import TrustSection from '../components/TrustSection';
import ContactSection from '../components/ContactSection';

const HomePage: React.FC = () => {
  return (
    <main>
      <HeroSection />
      <ProductGrid />
      <FinancingSection />
      <TrustSection />
      <ContactSection />
    </main>
  );
};

export default HomePage;