import { CheckCircle, Download, Settings, Play, Shield, Zap } from "lucide-react";

const GettingStarted = () => {
  const steps = [
    {
      icon: Download,
      title: "Download Enterprise Miner",
      description: "Get our optimized mining software with enterprise-grade features and monitoring capabilities.",
      action: "Download v2.4.1",
      features: ["GPU & ASIC Support", "Advanced Monitoring", "Auto-Optimization"]
    },
    {
      icon: Settings,
      title: "Configure & Deploy",
      description: "Simple configuration with our enterprise dashboard and automated deployment tools.",
      action: "Setup Guide",
      features: ["One-Click Setup", "Bulk Configuration", "Remote Management"]
    },
    {
      icon: Play,
      title: "Start Mining",
      description: "Launch your mining operation with real-time monitoring and instant notifications.",
      action: "Go Live",
      features: ["Live Analytics", "Instant Alerts", "24/7 Support"]
    }
  ];

  return (
    <section id="getting-started" className="py-32 bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6">
            <span className="text-sm font-medium text-teal-300">Enterprise Onboarding</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Deploy in
            <span className="block bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              3 Simple Steps
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Enterprise-grade deployment process designed for institutional miners. 
            Get your operation running in minutes with our automated setup tools.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group relative"
            >
              {/* Step Number */}
              <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-teal-500/25 z-10">
                {index + 1}
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Card */}
              <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-teal-500/50 transition-all duration-300 pt-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{step.description}</p>
                
                {/* Features */}
                <div className="space-y-2 mb-6">
                  {step.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-teal-400 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition-all duration-300">
                  {step.action}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Configuration Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pool Configuration */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 p-0.5 mr-4">
                <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white">Pool Configuration</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-teal-400 mb-3">Primary Stratum</h4>
                <div className="bg-slate-800/50 rounded-xl p-4 font-mono text-sm text-gray-300 border border-slate-600/50">
                  stratum+tcp://enterprise.kaspa-pool.com:4444
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-teal-400 mb-3">Failover Stratum</h4>
                <div className="bg-slate-800/50 rounded-xl p-4 font-mono text-sm text-gray-300 border border-slate-600/50">
                  stratum+tcp://backup.kaspa-pool.com:4444
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise Features */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 p-0.5 mr-4">
                <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white">Enterprise Benefits</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { icon: Shield, title: "Dedicated Infrastructure", desc: "Private mining nodes" },
                { icon: Zap, title: "Priority Support", desc: "24/7 technical assistance" },
                { icon: Settings, title: "Custom Integration", desc: "API & webhook support" },
                { icon: CheckCircle, title: "SLA Guarantee", desc: "99.98% uptime commitment" }
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-slate-800/30 rounded-lg">
                  <benefit.icon className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">{benefit.title}</div>
                    <div className="text-gray-400 text-sm">{benefit.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GettingStarted; 