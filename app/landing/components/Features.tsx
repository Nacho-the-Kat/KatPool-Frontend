import { Shield, Zap, TrendingUp, Users, Globe, Clock, Server, Award, BarChart3 } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Military-grade encryption, multi-layer DDoS protection, and SOC 2 compliance with 24/7 security monitoring.",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: Server,
      title: "High-Performance Infrastructure",
      description: "Cutting-edge hardware with dedicated mining nodes, optimized stratum protocols, and sub-millisecond latency.",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time performance dashboards, predictive analytics, and comprehensive reporting tools for data-driven decisions.",
      color: "from-blue-500 to-teal-500"
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "Premium 24/7 technical support with dedicated account managers and priority response times.",
      color: "from-teal-500 to-blue-500"
    },
    {
      icon: Globe,
      title: "Global Infrastructure",
      description: "Strategically located data centers across 5 continents with intelligent load balancing and failover systems.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Award,
      title: "Industry Leading Performance",
      description: "Consistently ranked #1 in mining efficiency with transparent statistics and proven track record.",
      color: "from-cyan-500 to-teal-500"
    }
  ];

  return (
    <section id="features" className="py-32 bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6">
            <span className="text-sm font-medium text-teal-300">Enterprise Features</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Why Choose Our
            <span className="block bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Mining Platform
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Built for enterprise-scale operations with institutional-grade infrastructure, 
            advanced security protocols, and unmatched performance optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative"
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-all duration-500`}></div>
              
              {/* Card */}
              <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105 h-full">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-teal-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 