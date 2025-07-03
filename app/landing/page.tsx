import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Features from './components/Features';
import Statistics from './components/Statistics';
import GettingStarted from './components/GettingStarted';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <Hero />
      <Features />
      <Statistics />
      <GettingStarted />
      <Testimonials />
      <Footer />
    </div>
  );
}
