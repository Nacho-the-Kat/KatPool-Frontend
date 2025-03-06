'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function KatpoolIntro() {
  const [copySuccess, setCopySuccess] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('stratum+tcp://kas.katpool.xyz:8888')
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
          <div className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
            👋 Welcome to Kat Pool!
          </div>
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Let's get you set up and mining. Follow the steps below to point your ASIC to Kat Pool.
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-500">
            IceRiver, Bitmain, and Goldshell ASICs are currently supported
          </div>
        </div>

        {/* Instructions Section */}
        <div className="mt-8 space-y-8">
          {/* Step 1 */}
          <div className="relative pl-10">
            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-sm">1</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Access Your Miner's Web Interface</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Open your web browser and enter your ASIC miner's local IP address to access its WebGUI.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-500 italic">
                Tip: If you're unsure about your miner's IP address, check your router's connected devices or consult your miner's manual.
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative pl-10">
            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-sm">2</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Configure Pool Settings</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Once logged in, navigate to your pool configuration settings and enter the following details into <strong>Pool1 only.</strong>
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-500 italic">
                Backup Pools: Do not add Kat Pool to more than 1 pool in settings. Leave Pool2 and Pool3 blank, or enter a another pool stratum address for failover.
                <br />
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pool Address</div>
                  <div className="flex items-center">
                    <code className="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-md font-mono text-sm break-all">
                      stratum+tcp://kas.katpool.xyz:8888
                    </code>
                    <button
                      className="ml-2 flex-shrink-0 text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 group relative"
                      onClick={handleCopy}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      {copySuccess && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg">
                          Copied!
                        </div>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Wallet/Worker Format</div>
                  <code className="block text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-md font-mono text-sm break-all">
                    Your-KRC20-Kaspa-Address.Unique-Worker-Name
                  </code>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Password</div>
                  <code className="block text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-md font-mono text-sm">
                    x
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative pl-10">
            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-sm">3</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Save and Start Mining</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Save your configuration and wait a few minutes. Your miner should connect to Kat Pool and begin mining.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-500 italic">
                Best Practice: Reboot your miner after changing your pool settings.
              </div>
            </div>
          </div>
        </div>

        {/* Video Tutorial Section */}
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700/60 pt-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Video Tutorial</h3>
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-900/50 rounded-lg overflow-hidden">
            {/* Replace the src with your actual YouTube embed URL */}
            <iframe
              className="w-full h-full"
              src="about:blank" // Replace with actual YouTube embed URL
              title="Kat Pool Setup Tutorial"
              style={{ border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}
