'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ManufacturerModels {
  manufacturer: string
  models: string[]
}

interface PortConfig {
  port: number
  difficulty: number | 'Variable'
  manufacturers: ManufacturerModels[]
  hashrate: string
}

const POOL_PORTS: PortConfig[] = [
  {
    port: 1111,
    difficulty: 256,
    manufacturers: [
      { manufacturer: 'IceRiver', models: ['KS0', 'KS0 Pro'] }
    ],
    hashrate: '100 GH/s - 200 GH/s'
  },
  {
    port: 2222,
    difficulty: 1024,
    manufacturers: [
      { manufacturer: 'IceRiver', models: ['KS0 Ultra'] }
    ],
    hashrate: '300 GH/s - 500 GH/s'
  },
  {
    port: 3333,
    difficulty: 4096,
    manufacturers: [
      { manufacturer: 'IceRiver', models: ['KS1', 'KS2', 'KS2 Lite', 'KS7 Lite'] },
      { manufacturer: 'Goldshell', models: ['KA BOX', 'KA BOX PRO', 'E-KA1M'] }
    ],
    hashrate: '1 TH/s - 5.5TH/s'
  },
  {
    port: 4444,
    difficulty: 8192,
    manufacturers: [
      { manufacturer: 'IceRiver', models: ['KS3', 'KS3L', 'KS3M'] }
    ],
    hashrate: '5 TH/s - 9 TH/s'
  },
  {
    port: 5555,
    difficulty: 16384,
    manufacturers: [
      { manufacturer: 'IceRiver', models: ['KS5L'] },
      { manufacturer: 'Bitmain', models: ['KS3'] }
    ],
    hashrate: '9 TH/s - 12 TH/s'
  },
  {
    port: 6666,
    difficulty: 32768,
    manufacturers: [
      { manufacturer: 'IceRiver', models: ['KS5M', 'KS7'] },
      { manufacturer: 'Bitmain', models: ['KS5', 'KS5Pro'] }
    ],
    hashrate: '15 TH/s - 30 TH/s'
  },
  {
    port: 8888,
    difficulty: 'Variable',
    manufacturers: [
      { manufacturer: 'All Manufacturers', models: ['All Models (User-defined difficulty)'] }
    ],
    hashrate: 'Any'
  }
]

const getDifficultyRecommendation = (hashrate: number, unit: 'GH/s' | 'TH/s'): string => {
  // Convert everything to GH/s for calculation
  const hashRateInGH = unit === 'TH/s' ? hashrate * 1000 : hashrate
  return Math.max(256, Math.pow(2, Math.floor(Math.log2(hashRateInGH * 4)))).toString()
}

export default function KatpoolIntro() {
  const [copySuccess, setCopySuccess] = useState(false)
  const [selectedPort, setSelectedPort] = useState<number | null>(null)
  const [showDifficultyHelp, setShowDifficultyHelp] = useState(false)
  const [hashrateValue, setHashrateValue] = useState('')
  const [hashrateUnit, setHashrateUnit] = useState<'GH/s' | 'TH/s'>('TH/s')
  const [showCustomDifficulty, setShowCustomDifficulty] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  // New state for asset_code, chain_type, and username
  const [assetCode, setAssetCode] = useState('KAS')
  const [chainType, setChainType] = useState('ethereum')
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState(false)

  const handleSave = () => {
    // Validate username
    if (!username.trim()) {
      setUsernameError(true)
      return
    }
    setUsernameError(false)
    
    // Here you can add the logic to save the selections
    console.log('Saving selections:', { assetCode, chainType, username })
    setShowUpdateModal(true)
  }

  const handleCloseModal = () => {
    setShowUpdateModal(false)
  }

  const handleCopy = async () => {
    if (!selectedPort) return
    try {
      await navigator.clipboard.writeText(`stratum+tcp://kas.katpool.xyz:${selectedPort}`)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleHashrateChange = (value: string) => {
    // Only allow numbers and decimal points
    const filtered = value.replace(/[^\d.]/g, '')
    // Prevent multiple decimal points
    const parts = filtered.split('.')
    if (parts.length > 2) {
      return
    }
    setHashrateValue(filtered)
  }

  const isValidHashrate = hashrateValue !== '' && !isNaN(Number(hashrateValue)) && Number(hashrateValue) > 0

  const recommendedDifficulty = isValidHashrate 
    ? getDifficultyRecommendation(Number(hashrateValue), hashrateUnit)
    : ''

  const renderManufacturers = (manufacturers: ManufacturerModels[]) => {
    return (
      <div className="space-y-1">
        {manufacturers.map((mfg, idx) => (
          <div key={idx} className={idx > 0 ? 'border-t border-gray-100 dark:border-gray-700 pt-1' : ''}>
            <span className="font-medium">{mfg.manufacturer}:</span>{' '}
            <span className="text-gray-600 dark:text-gray-400">{mfg.models.join(', ')}</span>
          </div>
        ))}
      </div>
    )
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
        <br/>
        {/* Step 1: Asset, Chain, Username Selection */}
        <div className="relative pl-12 mb-8">
          <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-lg">1</div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Uphold Payout Setup</h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <p className="text-blue-700 dark:text-blue-300">
                Your mining rewards will be sent to your Uphold account. You can update your payout settings at any time on this page.
              </p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-6 items-center">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">Asset</label>
                <select
                  value={assetCode}
                  onChange={e => setAssetCode(e.target.value)}
                  className="px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="KAS">KAS</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">Chain Type</label>
                <select
                  value={chainType}
                  onChange={e => setChainType(e.target.value)}
                  className="px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="ethereum">Ethereum</option>
                  <option value="arbitrum">Arbitrum</option>
                  <option value="base">Base</option>
                  <option value="optimism">Optimism</option>
                  <option value="polygon">Polygon</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => {
                    setUsername(e.target.value)
                    if (e.target.value.trim()) {
                      setUsernameError(false)
                    }
                  }}
                  placeholder="Enter username"
                  className={`px-4 py-2 rounded-lg border ${
                    usernameError 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-700 focus:ring-primary-500'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2`}
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200 opacity-0">Save</label>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Update Success Modal */}
        {showUpdateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Uphold payout settings updated</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Asset:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">{assetCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Chain Type:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">{chainType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Username:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">{username}</span>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Instructions Section */}
        <div className="mt-8 space-y-8">
          {/* Step 2 */}
          <div className="relative pl-12">
            <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-lg">2</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Find Your Miner Model</h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <p className="text-blue-700 dark:text-blue-300">
                  First, identify your miner model from the table below and select the appropriate port. 
                  {!selectedPort && " You must select a port to proceed with the setup."}
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
                        <td className="px-4 py-4 max-w-md">{renderManufacturers(port.manufacturers)}</td>
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

              {selectedPort === 8888 && (
                <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Custom Difficulty Calculator</div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-blue-700 dark:text-blue-400 mb-1">
                        Enter your miner's hashrate:
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-grow flex gap-2">
                          <input
                            type="text"
                            value={hashrateValue}
                            onChange={(e) => handleHashrateChange(e.target.value)}
                            placeholder="Enter number..."
                            className="flex-grow px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-blue-900 dark:text-blue-100 placeholder-blue-400 dark:placeholder-blue-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <select
                            value={hashrateUnit}
                            onChange={(e) => setHashrateUnit(e.target.value as 'GH/s' | 'TH/s')}
                            className="px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-blue-900 dark:text-blue-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="GH/s">GH/s</option>
                            <option value="TH/s">TH/s</option>
                          </select>
                        </div>
                        <button
                          onClick={() => setShowCustomDifficulty(true)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isValidHashrate
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-blue-100 text-blue-400 cursor-not-allowed'
                          }`}
                          disabled={!isValidHashrate}
                        >
                          Calculate
                        </button>
                      </div>
                      {hashrateValue !== '' && !isValidHashrate && (
                        <p className="mt-1 text-xs text-red-500">Please enter a valid number greater than 0</p>
                      )}
                    </div>
                    
                    {showCustomDifficulty && isValidHashrate && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                        <div className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
                          <p>For your hashrate of <strong>{hashrateValue} {hashrateUnit}</strong>:</p>
                          <p>Recommended difficulty: <strong>{recommendedDifficulty}</strong></p>
                          <p>To use this difficulty, set your password to: <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">d={recommendedDifficulty}</code></p>
                        </div>
                      </div>
                    )}

                    <div className="text-sm text-blue-700 dark:text-blue-400">
                      <p className="font-semibold mb-1">How to choose your difficulty:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Higher difficulty = fewer shares but larger rewards per share</li>
                        <li>Lower difficulty = more shares but smaller rewards per share</li>
                        <li>Recommended: Set difficulty to ~4x your hashrate in GH/s</li>
                        <li>Example: For 1 TH/s (1000 GH/s), use difficulty ≈ 4096</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 3 */}
          {selectedPort && (
            <div className="relative pl-12">
              <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-lg">3</div>
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
                        username.workerName
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
          )}

          {/* Step 4 */}
          {selectedPort && (
            <div className="relative pl-12">
              <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-lg">4</div>
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
          )}
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
