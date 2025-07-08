import React from 'react';

const tiers = [
  {
    title: '0.25%',
    subtitle: 'Enterprise Fee',
    description: 'Premium tier for wallets holding 100M+ $NACHO tokens',
    badge: 'Premium',
    button: {
      text: 'Explore $NACHO Benefits',
      href: '#',
    },
    benefitsTitle: 'Enterprise Benefits',
    benefits: [
      'Maximum fee reduction',
      'Dedicated account manager',
      'Priority technical support',
      'Early feature access',
      'Custom integration support',
    ],
    icon: '🏆',
  },
  {
    title: '0.75%',
    subtitle: 'Standard Fee',
    description: 'Professional mining solution with industry-leading features',
    badge: 'Recommended',
    button: {
      text: 'Start Mining Now',
      href: '#',
    },
    benefitsTitle: 'Core Features',
    benefits: [
      'Enterprise-grade infrastructure',
      'Advanced PPLNS pooling algorithm',
      'Automated daily payouts',
      '0.25% fee rebate in $NACHO',
      '99.9% uptime guarantee',
      'Real-time monitoring dashboard',
    ],
    icon: '⚡',
  },
  {
    title: '0.25%',
    subtitle: 'NFT Holder Fee',
    description: 'Exclusive pricing for Nacho Kats NFT collection holders',
    badge: 'Exclusive',
    button: {
      text: 'View NFT Collection',
      href: '#',
    },
    benefitsTitle: 'NFT Holder Perks',
    benefits: [
      'Premium fee structure',
      'Exclusive community access',
      'Priority support queue',
      'Early feature releases',
      'Special event invitations',
    ],
    icon: '🎨',
  },
];

export default function PoolFeeTiers() {
  return (
    <section className="relative py-16 overflow-hidden section-transition">
      {/* Section-specific overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-transparent to-slate-800/10 overlay-transition"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-6 card-hover">
            <span className="w-2 h-2 bg-teal-400 rounded-full mr-2"></span>
            Enterprise Mining Solutions
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Join the Kat Pool
            <span className="block bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent animate-gradient-text">
              Revolution
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed text-transition">
            Experience enterprise-grade mining infrastructure with competitive fees, 
            advanced features, and dedicated support for professional miners.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`relative group ${
                idx === 1 
                  ? 'lg:scale-105 z-10' 
                  : 'lg:scale-95 hover:scale-100 transition-transform duration-300'
              }`}
            >
              {/* Card Background */}
              <div className={`relative h-full rounded-2xl p-8 ${
                idx === 1
                  ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-teal-400/50 shadow-2xl shadow-teal-400/20'
                  : 'bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300'
              } card-hover`}>
                
                {/* Badge */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-6 ${
                  idx === 1
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-400/30'
                    : 'bg-slate-700/50 text-slate-300 border border-slate-600/50'
                }`}>
                  {tier.badge}
                </div>

                {/* Icon */}
                <div className="text-4xl mb-4 scale-transition">{tier.icon}</div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-black ${
                      idx === 1 ? 'text-white' : 'text-slate-200'
                    }`}>
                      {tier.title}
                    </span>
                    <span className="text-lg text-slate-400 font-medium">
                      {tier.subtitle}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 mb-8 leading-relaxed text-transition">
                  {tier.description}
                </p>

                {/* CTA Button */}
                <a
                  href={tier.button.href}
                  className={`block w-full py-4 px-6 rounded-xl font-semibold text-center transition-all duration-200 mb-8 ${
                    idx === 1
                      ? 'bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-300 hover:to-teal-400 text-slate-900 shadow-lg shadow-teal-400/25'
                      : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500'
                  } btn-hover glow-effect focus-enhanced`}
                >
                  {tier.button.text}
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1 transform-transition">→</span>
                </a>

                {/* Benefits */}
                <div>
                  <h4 className={`font-semibold mb-4 ${
                    idx === 1 ? 'text-white' : 'text-slate-200'
                  }`}>
                    {tier.benefitsTitle}
                  </h4>
                  <ul className="space-y-3">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-300">
                        <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx === 1
                            ? 'bg-teal-400/20 text-teal-300'
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          ✓
                        </span>
                        <span className="text-sm leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Glow Effect for Featured Card */}
                {idx === 1 && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400/10 to-blue-500/10 blur-xl -z-10"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm card-hover">
            <span className="text-slate-300">Ready to start mining?</span>
            <a
              href="#"
              className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-900 font-semibold px-6 py-2 rounded-lg transition-all duration-200 btn-hover glow-effect focus-enhanced"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 