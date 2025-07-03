import { Zap, Mail, MessageCircle, Twitter, Github, Shield, Award, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-slate-950 border-t border-slate-800/50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                  <Zap className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">KASPA Pool</span>
                <span className="text-sm text-teal-400">Enterprise Mining Infrastructure</span>
              </div>
            </div>
            <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
              The world's most advanced KASPA mining pool, trusted by Fortune 500 companies 
              and professional miners worldwide. Built for enterprise-scale operations with 
              institutional-grade security and performance.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <Shield className="w-4 h-4 text-teal-400" />
                <span className="text-sm text-gray-300">SOC 2 Certified</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <Award className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-gray-300">99.98% SLA</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Global Infrastructure</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-teal-400 transition-all duration-300 border border-slate-700/50 hover:border-teal-500/50">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-teal-400 transition-all duration-300 border border-slate-700/50 hover:border-teal-500/50">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-teal-400 transition-all duration-300 border border-slate-700/50 hover:border-teal-500/50">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-teal-400 transition-all duration-300 border border-slate-700/50 hover:border-teal-500/50">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Platform</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-400 hover:text-teal-400 transition-colors">Features</a></li>
              <li><a href="#statistics" className="text-gray-400 hover:text-teal-400 transition-colors">Statistics</a></li>
              <li><a href="#getting-started" className="text-gray-400 hover:text-teal-400 transition-colors">Getting Started</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">API Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Mining Calculator</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Network Status</a></li>
            </ul>
          </div>

          {/* Enterprise */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Enterprise</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Enterprise Solutions</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Dedicated Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">SLA Agreements</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Custom Integration</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Security & Compliance</a></li>
              <li><a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Contact Sales</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800/50 mt-16 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 lg:mb-0">
              © 2024 KASPA Pool Enterprise. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6">
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Cookie Policy</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Security</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">Compliance</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 