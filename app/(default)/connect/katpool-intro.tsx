'use client'

import Image from 'next/image'
import { useState } from 'react'

const POOL_PORTS = [
  { port: 1111, difficulty: 256, models: 'IceRiver KS0-KS0 Pro', hashrate: '100GH/s - 200 GH/s' },
  { port: 2222, difficulty: 1024, models: 'IceRiver KS0 Ultra', hashrate: '400GH/s' },
  { port: 3333, difficulty: 4096, models: 'IceRiver KS1-KS2-KS2 Lite, Goldshell KA BOX,KA BOX PRO,E-KA1M', hashrate: '1TH/s - 5.5TH/s' },
  { port: 4444, difficulty: 8192, models: 'IceRiver KS3L-KS3M-KS3 Pro-KS3', hashrate: '5TH/s - 9 TH/s' },
  { port: 5555, difficulty: 16384, models: 'IceRiver KS5L, Bitmain KS3', hashrate: '9.4TH/s - 12 TH/s' },
  { port: 6666, difficulty: 32768, models: 'Iceriver KS5M, Bitmain KS5-KS5Pro', hashrate: '15 TH/s - 21 TH/s' },
  { port: 8888, difficulty: 'Variable', models: 'All Models (User-defined difficulty)', hashrate: 'Any' },
]

export default function KatpoolIntro() {
  const [copySuccess, setCopySuccess] = useState(false)
  const [selectedPort, setSelectedPort] = useState(8888)
  const [showDifficultyHelp, setShowDifficultyHelp] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`stratum+tcp://kas.katpool.xyz:${selectedPort}`)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="col-span-10 col-start-2 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="px-8 py-6">
        {/* Header Section */}
        <div className="border-b border-gray-200 dark:border-gray-700/60 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              👋 Welcome to Kat Pool!
            </div>
            <div className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium rounded-full">
              Easy Setup Guide
            </div>
          </div>
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Follow this simple guide to start mining with Kat Pool. We'll help you every step of the way!
          </div>
        </div>

        {/* Instructions Section */}
        <div className="mt-8 space-y-8">
          {/* Step 1 */}
          <div className="relative pl-12">
            <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-lg">1</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Find Your Miner Model</h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <p className="text-blue-700 dark:text-blue-300">
                  First, identify your miner model from the table below. This will help you choose the correct port settings.
                </p>
              </div>
              
              {/* Port Selection Table */}
              <div className="overflow-x-auto mb-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="min-w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <th className="px-4 py-3 border-b dark:border-gray-700">Port</th>
                      <th className="px-4 py-3 border-b dark:border-gray-700">Difficulty</th>
                      <th className="px-4 py-3 border-b dark:border-gray-700">Supported Models</th>
                      <th className="px-4 py-3 border-b dark:border-gray-700">Hashrate Range</th>
                      <th className="px-4 py-3 border-b dark:border-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {POOL_PORTS.map((port) => (
                      <tr key={port.port} className={`text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        selectedPort === port.port ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                      }`}>
                        <td className="px-4 py-4 font-mono font-medium text-primary-600 dark:text-primary-400">{port.port}</td>
                        <td className="px-4 py-4">{port.difficulty}</td>
                        <td className="px-4 py-4 max-w-md">{port.models}</td>
                        <td className="px-4 py-4">{port.hashrate}</td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => setSelectedPort(port.port)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedPort === port.port
                                ? 'bg-primary-500 text-white hover:bg-primary-600'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {selectedPort === port.port ? 'Selected' : 'Select'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative pl-12">
            <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-lg">2</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Configure Your Miner</h3>
              
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 space-y-4 border border-gray-200 dark:border-gray-700">
                <div>
                  <div className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2">Pool Address</div>
                  <div className="flex items-center">
                    <code className="flex-grow text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg font-mono text-sm break-all border border-gray-200 dark:border-gray-700">
                      stratum+tcp://kas.katpool.xyz:{selectedPort}
                    </code>
                    <button
                      className="ml-3 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center gap-2"
                      onClick={handleCopy}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2">Wallet/Worker Format</div>
                  <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <code className="text-primary-600 dark:text-primary-400 font-mono text-sm break-all">
                      Your-KRC20-Kaspa-Address.Unique-Worker-Name
                    </code>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Replace with your actual KRC20 Kaspa address and choose a unique name for this worker
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2">Password</div>
                    <button
                      className="text-primary-500 hover:text-primary-600"
                      onClick={() => setShowDifficultyHelp(!showDifficultyHelp)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <code className="text-primary-600 dark:text-primary-400 font-mono text-sm">
                      {selectedPort === 8888 ? 'd=<DESIRED_DIFFICULTY>' : 'x'}
                    </code>
                  </div>
                  {showDifficultyHelp && selectedPort === 8888 && (
                    <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        For port 8888, you can set your own difficulty by replacing &lt;DESIRED_DIFFICULTY&gt; with a number.
                        Example: d=1024
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Important Notes:</div>
                <ul className="list-disc pl-5 space-y-2 text-sm text-yellow-700 dark:text-yellow-400">
                  <li>Only configure Pool1 with these settings. Leave Pool2 and Pool3 empty or use different pools for backup.</li>
                  <li>After changing any settings, always restart your miner for the changes to take effect.</li>
                  <li>The worker name is mandatory - make sure to include it after your wallet address.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative pl-12">
            <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-lg">3</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Start Mining</h3>
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-700 dark:text-green-300">
                    Save your configuration and restart your miner. Within a few minutes, you should see your worker appearing in your dashboard.
                  </p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Need help? Join our Discord community for support.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Tutorial Section - Commented out until video is ready */}
        {/* <div className="mt-12 border-t border-gray-200 dark:border-gray-700/60 pt-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Video Tutorial</h3>
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-900/50 rounded-lg overflow-hidden">
            <iframe
              className="w-full h-full"
              src="about:blank"
              title="Kat Pool Setup Tutorial"
              style={{ border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div> */}
      </div>
    </div>
  )
}
