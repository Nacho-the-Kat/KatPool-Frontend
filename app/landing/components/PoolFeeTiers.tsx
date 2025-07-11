import React from 'react';

// Reusable button component with consistent styling
const ActionButton = ({ href, text, className = "" }: { href: string; text: string; className?: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`block w-full py-4 px-6 rounded-xl font-semibold text-center transition-all duration-200 bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500 btn-hover glow-effect focus-enhanced ${className}`}
  >
    {text}
    <span className="ml-2 inline-block transition-transform group-hover:translate-x-1 transform-transition">→</span>
  </a>
);

const tiers = [
  {
    title: '0.25%',
    subtitle: 'Enterprise Fee',
    description: 'Premium tier for wallets holding 100M+ $NACHO tokens',
    button: {
      text: 'Explore $NACHO',
      href: 'https://nachothekat.xyz',
    },
    benefitsTitle: 'Enterprise Benefits',
    benefits: [
      'Maximum fee reduction',
      'Dedicated account manager',
      'Priority technical support',
      'Early feature access',
      'Custom integration support',
    ],
    additionalBenefitsTitle: 'Additional Holder Benefits',
    additionalBenefits: [
      'Discounted pool fee',
      'Priority tech support',
      'Early features access',
    ],
    icon: '🏆',
  },
  {
    title: '0.75%',
    subtitle: 'Standard Fee',
    description: 'Professional mining solution with industry-leading features',
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
    alwaysIncludedTitle: 'Always Included Features',
    alwaysIncluded: [
      'Support for all ASIC models',
      'Fair PPLNS pooling scheme',
      'Rewards paid out twice daily',
      '0.25% fee refunded as $NACHO',
      'Open source, secure, anonymous',
    ],
    icon: '⚡',
  },
  {
    title: '0.25%',
    subtitle: 'NFT Holder Fee',
    description: 'Exclusive pricing for Nacho Kats and KATCLAIM Level 3 NFT collection holders',
    buttons: [
      {
        text: 'View NACHO NFT',
        href: 'https://kaspa.com/nft/collections/NACHO',
      },
      {
        text: 'View KATCLAIM NFT',
        href: 'https://kaspa.com/nft/collections/KATCLAIM',
      }
    ],
    benefitsTitle: 'NFT Holder Perks',
    benefits: [
      'Premium fee structure',
      'Exclusive community access',
      'Priority support queue',
      'Early feature releases',
      'Special event invitations',
    ],
    additionalBenefitsTitle: 'Additional Benefits',
    additionalBenefits: [
      'Discounted pool fee',
      'Priority tech support',
      'Early features access',
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
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Earn more with Kat Pool
            <span className="block bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-text">
              Revolution
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed text-transition">
            Unlock additional $NACHO rewards through dual buyback rebates, complemented by real-time analytics, advanced metrics, optimized 12-hour PPLNS cycles, and a censorship-resistant, private, and secure platform.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`relative group ${idx === 1
                ? 'lg:scale-105 z-10'
                : 'lg:scale-95 hover:scale-100 transition-transform duration-300'
                }`}
            >
              {/* Card Background */}
              <div className={`relative h-full rounded-2xl p-8 ${idx === 1
                ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-teal-400/50 shadow-2xl shadow-teal-400/20'
                : 'bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300'
                } card-hover`}>
                {/* Icon */}
                <div className="text-4xl mb-4 scale-transition">{tier.icon}</div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-black ${idx === 1 ? 'text-white' : 'text-slate-200'
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

                {/* CTA Buttons */}
                {tier.buttons ? (
                  // Multiple buttons for NFT tier
                  <div className="space-y-3 mb-8">
                    {tier.buttons.map((button, buttonIdx) => (
                      <ActionButton
                        key={buttonIdx}
                        href={button.href}
                        text={button.text}
                        className="py-3"
                      />
                    ))}
                  </div>
                ) : (
                  // Single button for other tiers
                  <div className="mb-8">
                    {idx === 1 ? (
                      // Special styling for the middle tier (Standard)
                      <a
                        href={tier.button.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-4 px-6 rounded-xl font-semibold text-center transition-all duration-200 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-300 hover:to-teal-400 text-slate-900 shadow-lg shadow-teal-400/25 btn-hover glow-effect focus-enhanced"
                      >
                        {tier.button.text}
                        <span className="ml-2 inline-block transition-transform group-hover:translate-x-1 transform-transition">→</span>
                      </a>
                    ) : (
                      <ActionButton
                        href={tier.button.href}
                        text={tier.button.text}
                      />
                    )}
                  </div>
                )}

                {/* Additional Benefits for NFT Tier */}
                {idx === 2 && tier.additionalBenefits && (
                  <div>
                    <h4 className="font-semibold mb-4 text-slate-200">
                      {tier.additionalBenefitsTitle}
                    </h4>
                    <ul className="space-y-3">
                      {tier.additionalBenefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-300">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-teal-400/20 text-teal-300">
                            ✓
                          </span>
                          <span className="text-sm leading-relaxed">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Always Included Features for Standard Tier */}
                {idx === 1 && tier.alwaysIncluded && (
                  <div>
                    <h4 className="font-semibold mb-4 text-white">
                      {tier.alwaysIncludedTitle}
                    </h4>
                    <ul className="space-y-3">
                      {tier.alwaysIncluded.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-300">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-teal-400/20 text-teal-300">
                            ✓
                          </span>
                          <span className="text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Additional Benefits for Enterprise Tier */}
                {idx === 0 && tier.additionalBenefits && (
                  <div>
                    <h4 className="font-semibold mb-4 text-slate-200">
                      {tier.additionalBenefitsTitle}
                    </h4>
                    <ul className="space-y-3">
                      {tier.additionalBenefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-300">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-teal-400/20 text-teal-300">
                            ✓
                          </span>
                          <span className="text-sm leading-relaxed">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Glow Effect for Featured Card */}
                {idx === 1 && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400/10 to-blue-500/10 blur-xl -z-10"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 