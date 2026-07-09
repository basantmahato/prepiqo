import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import UtilitiesSection from '../components/landing/UtilitiesSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import PricingSection from '../components/landing/PricingSection';
import FAQSection from '../components/landing/FAQSection';

import Footer from '../components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-secondary font-sans text-text-primary selection:bg-brand selection:text-white">
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-8 overflow-hidden">
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <UtilitiesSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />

      </main>
      <Footer />
    </div>
  );
}
