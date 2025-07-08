import { ArrowRight, TrendingUp, Shield, Zap, Play } from "lucide-react";

const Hero = () => {
    return (
        <section className="relative overflow-hidden section-transition">
            {/* Section-specific overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-transparent to-transparent overlay-transition"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                <div className="text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-8 card-hover">
                        <Zap className="w-4 h-4 text-teal-400 mr-2" />
                        <span className="text-sm font-medium text-teal-300">Open-source mining pool for Kaspa</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
                        Kat Pool
                        <span className="block text-4xl md:text-6xl bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient-text">
                            MINE KASPA EARN $NACHO
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed text-transition">
                        Kat Pool is an open-source Kaspa mining pool that offers transparency, scalability, and freedom. Rewarding miners in $NACHO. Built on enterprise-grade infrastructure, it delivers unmatched reliability, security, and profitability.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
                        <button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-12 py-6 text-lg font-semibold shadow-2xl shadow-teal-500/25 transition-all duration-300 hover:shadow-teal-500/40 hover:scale-105 rounded-lg flex items-center btn-hover glow-effect focus-enhanced">
                            Start Mining
                            <ArrowRight className="ml-2 w-5 h-5 transform-transition" />
                        </button>
                        <a href="/pool" className="border-2 border-slate-600 text-white hover:bg-slate-800 hover:border-teal-400 px-12 py-6 text-lg font-semibold backdrop-blur-sm transition-all duration-300 rounded-lg flex items-center btn-hover border-transition focus-enhanced">
                            <TrendingUp className="mr-2 w-5 h-5 transform-transition" />
                            Pool Stats
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero; 