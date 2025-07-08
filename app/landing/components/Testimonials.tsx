import { Star, Quote, Building2, User, Award } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO, Mining Dynamics Corp",
      company: "Fortune 500 Mining Company",
      content: "Switched our entire 500+ rig operation to this pool. The enterprise infrastructure and dedicated support exceeded our expectations. ROI improved by 23% in the first quarter.",
      rating: 5,
      avatar: "SC",
      type: "enterprise",
      metrics: "500+ Miners"
    },
    {
      name: "Marcus Rodriguez",
      role: "Blockchain Infrastructure Lead",
      company: "Tech Ventures Inc",
      content: "The advanced analytics and real-time monitoring tools are game-changing. Their API integration allowed us to automate our entire mining operation seamlessly.",
      rating: 5,
      avatar: "MR",
      type: "enterprise",
      metrics: "2.5 TH/s"
    },
    {
      name: "Elena Petrov",
      role: "Operations Director",
      company: "Digital Asset Mining",
      content: "Unmatched reliability and performance. Their 99.98% uptime SLA isn't just a promise - they deliver. Best mining pool decision we've made in 5 years.",
      rating: 5,
      avatar: "EP",
      type: "enterprise",
      metrics: "Enterprise Client"
    },
    {
      name: "David Kim",
      role: "Senior Mining Engineer",
      company: "HashRate Solutions",
      content: "The enterprise-grade security and compliance features were crucial for our institutional clients. SOC 2 compliance and audit trails make reporting seamless.",
      rating: 5,
      avatar: "DK",
      type: "enterprise",
      metrics: "Multi-facility"
    },
    {
      name: "Alex Thompson",
      role: "Founder & CEO",
      company: "CryptoMine Innovations",
      content: "Their dedicated account manager and priority support have been invaluable. When we had a configuration issue at 2 AM, they resolved it within 15 minutes.",
      rating: 5,
      avatar: "AT",
      type: "enterprise",
      metrics: "24/7 Operations"
    },
    {
      name: "Lisa Wang",
      role: "Mining Operations Manager",
      company: "Distributed Mining LLC",
      content: "The performance optimization recommendations from their team increased our efficiency by 18%. True partnership, not just a service provider.",
      rating: 5,
      avatar: "LW",
      type: "enterprise",
      metrics: "18% Efficiency Gain"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden section-transition">
      {/* Section-specific overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/10 via-transparent to-slate-900/10 overlay-transition"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            What Our
            <span className="block bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-text">
              Clients Say
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed text-transition">
            Join Fortune 500 companies and leading mining operations who trust our 
            enterprise-grade infrastructure for their mission-critical mining operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="group relative"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Card */}
              <div className="relative bg-slate-900/50 backdrop-blur-enhanced rounded-2xl p-8 border border-slate-700/50 hover:border-teal-500/50 transition-all duration-300 h-full flex flex-col card-hover">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <Quote className="w-8 h-8 text-teal-400 flex-shrink-0" />
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <p className="text-gray-300 mb-6 leading-relaxed flex-grow text-transition">
                  "{testimonial.content}"
                </p>
                
                {/* Metrics Badge */}
                <div className="mb-6">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30">
                    <Building2 className="w-3 h-3 text-teal-400 mr-1" />
                    <span className="text-teal-300 text-xs font-medium">{testimonial.metrics}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold scale-transition">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{testimonial.name}</div>
                      <div className="text-teal-400 text-sm font-medium">{testimonial.role}</div>
                      <div className="text-gray-400 text-xs">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 