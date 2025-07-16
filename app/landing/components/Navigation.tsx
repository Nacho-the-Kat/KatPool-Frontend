'use client';

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ExternalLink } from "lucide-react";
import Image from "next/image";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: "/connect", label: "Getting Started" },
    { href: "/miner", label: "Miner Dashboard" },
    { href: "/pool", label: "Pool Statistics" },
    { href: "/topMiners", label: "Top Miners" },
    { href: "/resources/kas-mining-tutorial", label: "Resources" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image
              src="/images/navLogo.png"
              alt="KatPool Logo"
              width={154}
              height={38}
              className="h-10 w-auto"
            />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isScrolled
                    ? 'text-white/90'
                    : 'text-white/90'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="/connect"
              className={`inline-flex items-center px-6 py-2.5 rounded-lg text-sm font-semibold ${
                isScrolled
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-white backdrop-blur-sm'
              }`}
            >
              Start Mining
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg ${
                isScrolled
                  ? 'text-white/90'
                  : 'text-white/90'
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden">
            <div className={`px-4 py-6 space-y-2 rounded-b-2xl ${
              isScrolled 
                ? 'bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 shadow-lg' 
                : 'bg-slate-900/95 backdrop-blur-xl border-t border-white/10'
            }`}>
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                    isScrolled
                      ? 'text-white/90'
                      : 'text-white/90'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              
              {/* Mobile CTA */}
              <div className="pt-4 border-t border-gray-200/50">
                <a
                  href="/connect"
                  className={`inline-flex items-center justify-center w-full px-6 py-3 rounded-lg text-sm font-semibold ${
                    isScrolled
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Start Mining
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 