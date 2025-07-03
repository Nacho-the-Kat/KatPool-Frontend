import { ArrowRight, TrendingUp, Shield, Zap, Play } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-8">
            <Zap className="w-4 h-4 text-teal-400 mr-2" />
            <span className="text-sm font-medium text-teal-300">Enterprise Mining Infrastructure</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            <span className="block">Premium</span>
            <span className="block bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              KASPA Pool
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Enterprise-grade mining infrastructure built for institutional and professional miners. 
            Experience unmatched reliability, security, and profitability.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
            <button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-12 py-6 text-lg font-semibold shadow-2xl shadow-teal-500/25 transition-all duration-300 hover:shadow-teal-500/40 hover:scale-105 rounded-lg flex items-center">
              Start Mining
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="border-2 border-slate-600 text-white hover:bg-slate-800 hover:border-teal-400 px-12 py-6 text-lg font-semibold backdrop-blur-sm transition-all duration-300 rounded-lg flex items-center">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-2xl blur-xl transition-all duration-300 group-hover:blur-2xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-teal-500/50 transition-all duration-300">
                <TrendingUp className="w-12 h-12 text-teal-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">0.8%</div>
                <div className="text-teal-300 font-medium mb-1">Pool Fee</div>
                <p className="text-gray-400 text-sm">Industry's lowest</p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur-xl transition-all duration-300 group-hover:blur-2xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300">
                <Shield className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">99.98%</div>
                <div className="text-cyan-300 font-medium mb-1">Uptime SLA</div>
                <p className="text-gray-400 text-sm">Guaranteed reliability</p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-2xl blur-xl transition-all duration-300 group-hover:blur-2xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">60s</div>
                <div className="text-blue-300 font-medium mb-1">Payout Frequency</div>
                <p className="text-gray-400 text-sm">Instant settlements</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 