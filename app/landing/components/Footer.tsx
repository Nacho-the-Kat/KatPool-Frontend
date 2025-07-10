import { Zap, Mail, MessageCircle, Twitter, Github, Shield, Award, Globe, MessageSquare, Send, Users } from "lucide-react";

// Custom Discord Icon Component
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.019 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z" />
  </svg>
);

const Footer = () => {
  return (
    <footer id="contact" className="border-t border-slate-800/50 relative overflow-hidden section-transition">
      {/* Section-specific overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-950/50 to-slate-950 overlay-transition"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 p-0.5 scale-transition">
                <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                  <Zap className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">KASPA Pool</span>
                <span className="text-sm text-teal-400">Enterprise Mining Infrastructure</span>
              </div>
            </div>
            <p className="text-gray-400 mb-8 max-w-md leading-relaxed text-transition">
              The world's most advanced KASPA mining pool, trusted by Fortune 500 companies
              and professional miners worldwide. Built for enterprise-scale operations with
              institutional-grade security and performance.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50 card-hover">
                <Shield className="w-4 h-4 text-teal-400" />
                <span className="text-sm text-gray-300">SOC 2 Certified</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50 card-hover">
                <Award className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-gray-300">99.98% SLA</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50 card-hover">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Global Infrastructure</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="https://x.com/NachotheKat" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-teal-400 transition-all duration-300 border border-slate-700/50 hover:border-teal-500/50 glow-effect focus-enhanced">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://discord.com/invite/nachothekat" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-teal-400 transition-all duration-300 border border-slate-700/50 hover:border-teal-500/50 glow-effect focus-enhanced">
                <DiscordIcon className="w-5 h-5" />
              </a>
              <a href="https://t.me/nachothecat" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-teal-400 transition-all duration-300 border border-slate-700/50 hover:border-teal-500/50 glow-effect focus-enhanced">
                <Send className="w-5 h-5" />
              </a>
              <a href="https://github.com/Nacho-the-Kat/katpool-app" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-teal-400 transition-all duration-300 border border-slate-700/50 hover:border-teal-500/50 glow-effect focus-enhanced">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Platform</h3>
            <ul className="space-y-3">
              <li><a href="/connect" className="text-gray-400 hover:text-teal-400 transition-colors text-transition">Getting Started</a></li>
              <li><a href="/miner" className="text-gray-400 hover:text-teal-400 transition-colors text-transition">Miner Dashboard</a></li>
              <li><a href="/pool" className="text-gray-400 hover:text-teal-400 transition-colors text-transition">Pool Statistics</a></li>
              <li><a href="/topMiners" className="text-gray-400 hover:text-teal-400 transition-colors text-transition">Top Miners</a></li>
              <li><a href="/blocks" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors text-transition">Found Blocks</a></li>
              <li><a href="/poolPayouts" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors text-transition">Payouts</a></li>
            </ul>
          </div>

          {/* Support & Community */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Support & Community</h3>
            <ul className="space-y-3">
              <li><a href="https://discord.gg/s6tXwKafFH" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors text-transition">Discord Community</a></li>
              <li><a href="/resources" className="text-gray-400 hover:text-teal-400 transition-colors text-transition">Resources</a></li>
              <li><a href="https://github.com/Nacho-the-Kat/katpool-app?tab=readme-ov-file#kaspa-mining-pool-using-rusty-kaspa-wasm" className="text-gray-400 hover:text-teal-400 transition-colors text-transition">Documentation</a></li>
              <li><a href="/status" className="text-gray-400 hover:text-teal-400 transition-colors text-transition">Network Status</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800/50 mt-16 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 lg:mb-0">
              © 2025 Kaspa Alliance for Transparency. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 