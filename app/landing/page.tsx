import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Statistics from './components/Statistics';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import PoolFeeTiers from './components/PoolFeeTiers';

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
        <PoolFeeTiers />
        <Testimonials />
        <Footer />
      </div>
    </div>
  );
}
