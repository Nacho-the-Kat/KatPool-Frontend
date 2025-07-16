import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import SidebarNavigation from '../components/SidebarNavigation';

export const metadata = {
    title: 'KAS Mining Tutorial - Kat Pool',
    description: 'Step-by-step guide for mining Kaspa with Kat Pool.'
};

export default function KasMiningTutorial() {
    return (
        <div className="flex flex-col md:flex-row px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
            {/* Sidebar Navigation */}
            <SidebarNavigation />
            {/* Main Content */}
            <main className="flex-1">
                <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700/60 p-8">
                    <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">KAS Mining Tutorial</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Welcome to the KatPool KAS Mining Tutorial. Follow these simple steps to start mining KAS with KatPool using our easy setup guide. This tutorial will walk you through the process of connecting your miner on the Connect page and help you generate your personalized configuration. <Link href="/connect" className="text-primary-600 dark:text-primary-400 hover:underline" target="_blank" rel="noopener noreferrer">
                        Connect your miner</Link>.</p>
                    {/* Step 1: Location Selection */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Step 1: Select Your Mining Location</h2>
                        <div className="mb-4">
                            <Image
                                src="/images/tutorial01.png"
                                alt="Location Selection Tutorial"
                                width={800}
                                height={400}
                                className="rounded-lg border border-gray-200 dark:border-gray-700"
                            />
                        </div>
                                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              KatPool operates multiple mining locations worldwide to provide optimal performance for miners in different regions. Choose the location closest to your ASIC miners for the best connection stability and lowest latency.
            </p>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Available Locations:</h3>
                            <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-1">
                                <li>North America West</li>
                                <li>North America East</li>
                                <li>Europe</li>
                                <li>Asia</li>
                                <li>Oceania</li>
                                <li>South America</li>
                                <li>China</li>
                            </ul>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            Tip: Select the location closest to your physical mining hardware, not necessarily where you are located. This ensures the lowest network latency and most stable connection.
                        </p>
                    </section>

                    {/* Step 2: Authentication Method */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Step 2: Choose Authentication Method</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            Currently, KatPool offers anonymous mining as the primary authentication method. This allows you to start mining immediately without registration.
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Anonymous Mining:</h3>
                            <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-1">
                                <li>Start mining immediately without account registration</li>
                                <li>Use your KAS wallet address as the worker identifier</li>
                                <li>Direct payouts to your wallet address</li>
                                <li>No personal information required</li>
                            </ul>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            Note: Enhanced features with additional authentication methods are coming soon.
                        </p>
                    </section>

                    {/* Step 3: Device Selection */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Step 3: Select Your Mining Device</h2>
                        <div className="mb-4">
                            <Image
                                src="/images/tutorial02.png"
                                alt="Device Selection Tutorial"
                                width={800}
                                height={400}
                                className="rounded-lg border border-gray-200 dark:border-gray-700"
                            />
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            Based on your specific mining device model, KatPool will provide the optimal connection URL and configuration settings. Different devices require different ports and difficulty settings for optimal performance.
                        </p>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            Note: If you have multiple different devices, you'll need to configure each device with its specific connection URL. Each device type requires different port settings for optimal performance.
                        </p>
                    </section>

                    {/* Step 4: Configuration */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Step 4: Configure Your Mining Settings</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            Once you've selected your device, KatPool will generate a specific connection URL that you need to configure in your miner's settings. This URL is optimized for your selected location and device type. Use those urls in your miner settings UI.
                        </p>
                        <div className="mb-4">
                            <Image
                                src="/images/tutorial03.png"
                                alt="Mining Configuration Tutorial"
                                width={800}
                                height={400}
                                className="rounded-lg border border-gray-200 dark:border-gray-700"
                            />
                        </div>
                    </section>

                    {/* Step 5: Start Mining */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Step 5: Start Mining</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            After configuring your miner with the provided settings, save the configuration and restart your miner. The pool connection may take up to 10 minutes to establish, depending on your ASIC model.
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">What to Expect:</h3>
                            <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-1">
                                <li>Your worker will appear on the <Link href="/miner" className="text-primary-600 dark:text-primary-400 hover:underline" target="_blank" rel="noopener noreferrer">KatPool dashboard</Link> once connected</li>
                                <li>Mining rewards will be automatically accumulated in your account</li>
                                <li>Payouts occur automatically twice daily</li>
                                <li>Monitor your mining performance through the <Link href="/miner" className="text-primary-600 dark:text-primary-400 hover:underline" target="_blank" rel="noopener noreferrer">KatPool dashboard</Link></li>
                            </ul>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            Need Help? Join our <Link href="https://discord.com/invite/nachothekat" className="text-primary-600 dark:text-primary-400 hover:underline" target="_blank" rel="noopener noreferrer">Discord community</Link> for support and troubleshooting assistance.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
} 