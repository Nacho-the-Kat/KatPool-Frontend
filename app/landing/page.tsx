import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Statistics from './components/Statistics';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import PoolFeeTiers from './components/PoolFeeTiers';
import PoolCalculator from './components/PoolCalculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kat Pool - Open Source Kaspa Mining',
  description: 'Kat Pool is the first open-source mining pool built for Kaspa, empowering miners with transparency, scalability, and freedom.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Unified Background System */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Top gradient orbs with floating animation */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-smooth-pulse animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-smooth-pulse animate-float" style={{animationDelay: '2s'}}></div>
          
          {/* Middle gradient orbs */}
          <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-smooth-pulse animate-float" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-2/3 right-1/3 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl animate-smooth-pulse animate-float" style={{animationDelay: '6s'}}></div>
          
          {/* Bottom gradient orbs */}
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl animate-smooth-pulse animate-float" style={{animationDelay: '8s'}}></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl animate-smooth-pulse animate-float" style={{animationDelay: '10s'}}></div>
        </div>
        
        {/* Unified Grid Pattern with subtle animation */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] animate-grid"></div>
        
        {/* Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/30 overlay-transition"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        <Hero />
        <Statistics />
        {/* Mining Calculator Section - Styled as a block */}
        <section className="relative py-16 overflow-hidden section-transition">
          {/* Section-specific overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-transparent to-slate-800/10 overlay-transition"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch justify-center">
              {/* Info Section */}
              <div className="col-span-1 md:col-span-6 min-w-0 bg-slate-900/50 backdrop-blur-enhanced rounded-2xl p-8 border border-slate-700/50 card-hover flex flex-col justify-center mb-6 md:mb-0">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Estimate Your Kaspa Mining Rewards</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                    <span className="text-teal-400 text-sm font-medium">Live</span>
                  </div>
                </div>
                <p className="text-slate-300 mb-4 text-lg leading-relaxed">
                  Use our mining calculator to estimate your daily, weekly, and yearly rewards based on your hashrate. For more tools, guides, and hardware info, check out our resources page.
                </p>
                <a
                  href="/resources"
                  className="inline-block mt-2 px-5 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-900 font-semibold text-base transition-colors shadow-lg shadow-teal-400/25 btn-hover glow-effect focus-enhanced"
                >
                  Explore Mining Resources
                </a>
              </div>
              {/* Calculator Section */}
              <div className="col-span-1 md:col-span-6 min-w-0 flex items-center justify-center">
                <div className="w-full max-w-5xl mx-auto bg-slate-900/50 backdrop-blur-enhanced rounded-2xl p-8 border border-slate-700/50 card-hover">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">Mining Calculator</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                      <span className="text-teal-400 text-sm font-medium">Live</span>
                    </div>
                  </div>
                  <PoolCalculator />
                </div>
              </div>
            </div>
          </div>
        </section>
        <PoolFeeTiers />
        <Testimonials />
        <Footer />
      </div>
    </div>
  );
}
