import { TrendingUp, Users, Zap, DollarSign, Server, Globe, Award, BarChart3 } from "lucide-react";

const Statistics = () => {
  const mainStats = [
    {
      icon: TrendingUp,
      value: "12.8 TH/s",
      label: "Total Hashrate",
      change: "+18.5%",
      description: "Network hashrate"
    },
    {
      icon: Users,
      value: "50,000+",
      label: "Active Miners",
      change: "+12.3%",
      description: "Global community"
    },
    {
      icon: Server,
      value: "99.98%",
      label: "Uptime SLA",
      change: "Guaranteed",
      description: "Service reliability"
    },
    {
      icon: DollarSign,
      value: "25M KAS",
      label: "Total Paid Out",
      change: "+24.7%",
      description: "Lifetime payouts"
    }
  ];

  const performanceMetrics = [
    { label: "Average Block Time", value: "1.2s", trend: "optimal" },
    { label: "Stale Share Rate", value: "0.8%", trend: "excellent" },
    { label: "Network Difficulty", value: "2.4T", trend: "stable" },
    { label: "Pool Efficiency", value: "99.7%", trend: "excellent" }
  ];

  return (
    <section id="statistics" className="py-20 relative overflow-hidden section-transition">
      {/* Section-specific overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/10 via-transparent to-slate-900/10 overlay-transition"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6 card-hover">
            <BarChart3 className="w-4 h-4 text-teal-400 mr-2" />
            <span className="text-sm font-medium text-teal-300">Real-time Analytics</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Pool
            <span className="block bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-text">
              Performance
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto text-transition">
            Transparent, real-time metrics showcasing our enterprise-grade infrastructure performance
          </p>
        </div>

        {/* Main Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {mainStats.map((stat, index) => (
            <div 
              key={index}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-enhanced rounded-2xl p-8 border border-slate-700/50 hover:border-teal-500/50 transition-all duration-300 text-center card-hover">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 p-0.5 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 scale-transition">
                  <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-300 font-medium mb-2">{stat.label}</div>
                <div className="text-teal-400 text-sm font-medium mb-1">{stat.change}</div>
                <div className="text-gray-500 text-xs">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Blocks */}
          <div className="bg-slate-900/50 backdrop-blur-enhanced rounded-2xl p-8 border border-slate-700/50 card-hover">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Recent Blocks</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                <span className="text-teal-400 text-sm font-medium">Live</span>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { height: "15,847,392", time: "32s ago", reward: "125.50 KAS", difficulty: "2.4T" },
                { height: "15,847,391", time: "1m 18s ago", reward: "125.50 KAS", difficulty: "2.4T" },
                { height: "15,847,390", time: "2m 45s ago", reward: "125.50 KAS", difficulty: "2.4T" },
                { height: "15,847,389", time: "3m 12s ago", reward: "125.50 KAS", difficulty: "2.4T" },
              ].map((block, index) => (
                <div key={index} className="flex items-center justify-between py-4 border-b border-slate-700/50 last:border-b-0 hover:bg-slate-800/30 rounded-lg px-4 transition-colors duration-200 bg-transition">
                  <div className="flex flex-col">
                    <div className="text-white font-semibold">{block.height}</div>
                    <div className="text-gray-400 text-sm">{block.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-teal-400 font-semibold">{block.reward}</div>
                    <div className="text-gray-500 text-sm">{block.difficulty}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-slate-900/50 backdrop-blur-enhanced rounded-2xl p-8 border border-slate-700/50 card-hover">
            <h3 className="text-2xl font-bold text-white mb-8">Performance Metrics</h3>
            <div className="space-y-6">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg bg-transition">
                  <div className="text-gray-300">{metric.label}</div>
                  <div className="flex items-center space-x-3">
                    <div className="text-white font-semibold">{metric.value}</div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      metric.trend === 'excellent' ? 'bg-teal-500/20 text-teal-400' :
                      metric.trend === 'optimal' ? 'bg-cyan-500/20 text-cyan-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {metric.trend}
                    </div>
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

export default Statistics; 