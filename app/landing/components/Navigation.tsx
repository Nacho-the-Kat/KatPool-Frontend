'use client';

import { useState } from "react";
import { Menu, X, Zap, ChevronDown } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 p-0.5">
              <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">KASPA Pool</span>
              <span className="text-xs text-teal-400">Enterprise Mining</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-teal-400 transition-colors font-medium">
              Features
            </a>
            <a href="#statistics" className="text-gray-300 hover:text-teal-400 transition-colors font-medium">
              Statistics
            </a>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-gray-300 hover:text-teal-400 transition-colors font-medium"
              >
                Resources
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-lg shadow-xl">
                  <a href="#getting-started" className="block px-4 py-3 text-gray-300 hover:text-teal-400 hover:bg-slate-700/50 transition-colors">
                    Getting Started
                  </a>
                  <a href="#" className="block px-4 py-3 text-gray-300 hover:text-teal-400 hover:bg-slate-700/50 transition-colors">
                    API Documentation
                  </a>
                  <a href="#" className="block px-4 py-3 text-gray-300 hover:text-teal-400 hover:bg-slate-700/50 transition-colors">
                    Mining Guide
                  </a>
                </div>
              )}
            </div>
            <a href="#contact" className="text-gray-300 hover:text-teal-400 transition-colors font-medium">
              Contact
            </a>
            <button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-6 py-2 font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300 rounded-lg">
              Start Mining
            </button>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden border-t border-slate-800">
            <div className="px-2 pt-4 pb-6 space-y-1 bg-slate-900/50">
              <a href="#features" className="block px-3 py-3 text-gray-300 hover:text-teal-400 font-medium">
                Features
              </a>
              <a href="#statistics" className="block px-3 py-3 text-gray-300 hover:text-teal-400 font-medium">
                Statistics
              </a>
              <a href="#getting-started" className="block px-3 py-3 text-gray-300 hover:text-teal-400 font-medium">
                Getting Started
              </a>
              <a href="#contact" className="block px-3 py-3 text-gray-300 hover:text-teal-400 font-medium">
                Contact
              </a>
              <button className="w-full mt-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-2 rounded-lg">
                Start Mining
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 