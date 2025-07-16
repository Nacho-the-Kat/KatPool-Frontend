import PoolCalculator from './PoolCalculator';

export default function MiningCalculatorSection() {
  return (
    <section className="relative overflow-hidden section-transition">
      {/* Section-specific overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-transparent to-slate-800/10 overlay-transition"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch justify-center">
          {/* Info Section */}
          <div className="col-span-1 md:col-span-6 min-w-0 bg-slate-900/50 backdrop-blur-enhanced rounded-2xl p-8 border border-slate-700/50 card-hover flex flex-col justify-center mb-6 md:mb-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Kaspa Mining Resources & Guides</h3>
            </div>
            <p className="text-slate-300 mb-4 text-lg leading-relaxed">
              Discover essential resources for Kaspa mining: step-by-step guides, mining tools, and recommended hardware. Whether you’re a beginner or pro, our resources page has everything you need to get started and optimize your mining experience.
            </p>
            <a
              href="/resources/kas-mining-tutorial"
              className="inline-block mt-2 px-5 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-900 font-semibold text-base transition-colors shadow-lg shadow-teal-400/25 btn-hover glow-effect focus-enhanced"
            >
              Explore Mining Resources
            </a>
          </div>
          {/* Calculator Section */}
          <div className="col-span-1 md:col-span-6 min-w-0 flex items-center justify-center">
            <div className="w-full max-w-5xl mx-auto bg-slate-900/50 backdrop-blur-enhanced rounded-2xl p-8 border border-slate-700/50 card-hover">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Mining Calculator</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                  <span className="text-teal-400 text-sm font-medium">Live</span>
                </div>
              </div>
              <PoolCalculator />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 