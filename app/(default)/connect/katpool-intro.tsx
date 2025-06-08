'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

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

interface Location {
  name: string
  domain: string
  city: string
  country: string
  latitude: number
  longitude: number
  userCity?: string
  userCountry?: string
}

const POOL_PORTS: PortConfig[] = [
  {
    port: 1111,
    difficulty: 256,
    manufacturers: [
      { manufacturer: 'IceRiver', models: ['KS0', 'KS0 Pro'] }
    ],
    hashrate: '100 GH/s - 250 GH/s'
  },
  {
    port: 2222,
    difficulty: 1024,
    manufacturers: [
      { manufacturer: 'IceRiver', models: ['KS0 Ultra'] }
    ],
    hashrate: '300 GH/s - 800 GH/s'
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
      { manufacturer: 'IceRiver', models: ['KS5M'] },
      { manufacturer: 'Bitmain', models: ['KS5', 'KS5Pro'] }
    ],
    hashrate: '14 TH/s - 25 TH/s'
  },
  {
    port: 7777,
    difficulty: 65536,
    manufacturers: [
      { manufacturer: 'IceRiver', models: ['KS7'] },
      { manufacturer: 'Bitmain', models: ['KS7'] }
    ],
    hashrate: '30 TH/s - 50 TH/s'
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

const LOCATIONS: Location[] = [
  { name: 'North America West', domain: 'na-west.katpool.xyz', city: 'San Francisco', country: 'USA', latitude: 37.7749, longitude: -122.4194 },
  { name: 'North America East', domain: 'na-east.katpool.xyz', city: 'New York City', country: 'USA', latitude: 40.7128, longitude: -74.0060 },
  { name: 'Europe', domain: 'eu.katpool.xyz', city: 'Frankfurt', country: 'Germany', latitude: 50.1109, longitude: 8.6821 },
  { name: 'Asia', domain: 'ap.katpool.xyz', city: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
  { name: 'Oceania', domain: 'au.katpool.xyz', city: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093 },
  { name: 'South America', domain: 'sa.katpool.xyz', city: 'São Paulo', country: 'Brazil', latitude: -23.5505, longitude: -46.6333 },
  { name: 'China', domain: 'hkg.katpool.xyz', city: 'Hong Kong', country: 'China', latitude: 22.3193, longitude: 114.1694 }
]

// Function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

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
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [authType, setAuthType] = useState<'anonymous' | 'uphold' | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const [locationConfirmed, setLocationConfirmed] = useState(false)

  // Add refs for each step section
  const locationStepRef = useRef<HTMLDivElement>(null)
  const authStepRef = useRef<HTMLDivElement>(null)
  const minerStepRef = useRef<HTMLDivElement>(null)
  const configStepRef = useRef<HTMLDivElement>(null)
  const startStepRef = useRef<HTMLDivElement>(null)

  // Function to scroll to a ref with offset
  const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const yOffset = -80 // Increased offset to show more of the section title
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const response = await fetch('https://ipinfo.io/json')
        const data = await response.json()
        
        if (data.loc) {
          const [lat, lon] = data.loc.split(',').map(Number)
          
          // Find closest location based on coordinates
          let closestLocation = LOCATIONS[0]
          let minDistance = Infinity
          
          for (const location of LOCATIONS) {
            const distance = calculateDistance(
              lat,
              lon,
              location.latitude,
              location.longitude
            )
            
            if (distance < minDistance) {
              minDistance = distance
              closestLocation = location
            }
          }

          // Store both user's location and closest server
          setUserLocation({
            ...closestLocation,
            userCity: data.city,
            userCountry: data.country
          })
          setSelectedLocation(closestLocation)
        } else {
          // Fallback if location data is not available
          setUserLocation(LOCATIONS[0])
          setSelectedLocation(LOCATIONS[0])
        }
      } catch (error) {
        console.error('Error detecting location:', error)
        setUserLocation(LOCATIONS[0])
        setSelectedLocation(LOCATIONS[0])
      } finally {
        setIsLoadingLocation(false)
      }
    }

    detectLocation()
  }, [])

  const handleCopy = async () => {
    if (!selectedPort || !selectedLocation) return
    try {
      await navigator.clipboard.writeText(`stratum+tcp://${selectedLocation.domain}:${selectedPort}`)
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

  // Modify the location confirmation handler
  const handleLocationConfirm = () => {
    setLocationConfirmed(true)
    setTimeout(() => {
      scrollToRef(authStepRef)
    }, 100)
  }

  // Modify the auth type selection handler
  const handleAuthTypeSelect = (type: 'anonymous' | 'uphold') => {
    setAuthType(type)
    setTimeout(() => {
      scrollToRef(minerStepRef)
    }, 100)
  }

  // Modify the port selection handler
  const handlePortSelect = (port: number) => {
    setSelectedPort(port)
    setTimeout(() => {
      scrollToRef(configStepRef)
    }, 100)
  }

  return (
    <div className="col-span-10 col-start-2 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <div className="px-4 sm:px-8 py-6">
        {/* Header Section */}
        <div className="border-b border-gray-200 dark:border-gray-700/60 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
            <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
              👋 Welcome to Kat Pool!
            </div>
            <div className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium rounded-full w-fit">
              Easy Setup Guide
            </div>
          </div>
          <div className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Follow this simple guide to start mining with Kat Pool. We'll help you every step of the way!
          </div>
        </div>

        {/* Instructions Section */}
        <div className="mt-8 space-y-8">
          {/* Location Selection Step */}
          <div ref={locationStepRef} className="relative pl-8 sm:pl-12">
            <div className="absolute left-0 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-base sm:text-lg">1</div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Select Mining Location</h3>
              {isLoadingLocation ? (
                <div className="text-gray-600 dark:text-gray-400">Detecting your location...</div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 space-y-4 border border-gray-200 dark:border-gray-700">
                      <div>
                        <div className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2">Select Location</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {userLocation ? (
                            <>
                              We've detected you're in {userLocation.userCity}, {userLocation.userCountry} and you're closest to {userLocation.city}, {userLocation.country}. You can change this if needed.
                            </>
                          ) : (
                            'Please select your preferred mining location.'
                          )}
                        </p>
                        <select
                          value={selectedLocation?.domain || ''}
                          onChange={(e) => {
                            const location = LOCATIONS.find(loc => loc.domain === e.target.value)
                            if (location) {
                              setSelectedLocation(location)
                              setLocationConfirmed(false)
                              setAuthType(null)
                              setSelectedPort(null)
                              setHashrateValue('')
                              setShowCustomDifficulty(false)
                            }
                          }}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base"
                        >
                          {LOCATIONS.map((location) => (
                            <option key={location.domain} value={location.domain}>
                              {location.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={handleLocationConfirm}
                        className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium text-base"
                      >
                        Confirm Location
                      </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 space-y-4 border border-gray-200 dark:border-gray-700">
                      <div>
                        <div className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2">Why Choose Your Location?</div>
                        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                          <p>Selecting the right mining location is crucial for optimal performance:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Lower Latency:</strong> Mining closer to your physical location reduces network delay, leading to more efficient mining operations</li>
                            <li><strong>Better Stability:</strong> Reduced network distance means fewer connection issues and more consistent mining</li>
                            <li><strong>Higher Profitability:</strong> Lower latency can result in more shares being accepted, potentially increasing your mining rewards</li>
                            <li><strong>Network Reliability:</strong> Each region has optimized infrastructure to ensure stable mining operations</li>
                          </ul>
                          <p className="mt-3 text-gray-500 dark:text-gray-500">
                            We've automatically detected your location for the best possible mining experience, but you can change it if needed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Authentication Type Selection - Only show after location is confirmed */}
          {locationConfirmed && (
            <div ref={authStepRef} className="relative pl-8 sm:pl-12">
              <div className="absolute left-0 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-base sm:text-lg">2</div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Choose Authentication Method</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleAuthTypeSelect('anonymous')}
                      className={`p-4 sm:p-6 rounded-xl border-2 transition-all ${
                        authType === 'anonymous'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-500'
                      }`}
                    >
                      <div className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Anonymous</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Start mining immediately without registration
                      </div>
                    </button>
                    <button
                      disabled
                      className="p-4 sm:p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed"
                    >
                      <div className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">UpHold</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Coming soon - Enhanced features
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Miner Model Selection - Only show after location and auth type are selected */}
          {locationConfirmed && authType && (
            <div ref={minerStepRef} className="relative pl-8 sm:pl-12">
              <div className="absolute left-0 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-base sm:text-lg">3</div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Find Your Miner Model</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                  <p className="text-blue-700 dark:text-blue-300">
                    First, identify your miner model from the table below and select the appropriate port. 
                    {!selectedPort && " You must select a port to proceed with the setup."}
                  </p>
                </div>
                
                {/* Port Selection Table - Mobile Optimized */}
                <div className="overflow-x-auto mb-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="min-w-[800px]">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          <th className="px-3 sm:px-4 py-3 border-b dark:border-gray-700">Port</th>
                          <th className="px-3 sm:px-4 py-3 border-b dark:border-gray-700">Difficulty</th>
                          <th className="px-3 sm:px-4 py-3 border-b dark:border-gray-700">Supported Models</th>
                          <th className="px-3 sm:px-4 py-3 border-b dark:border-gray-700">Hashrate Range</th>
                          <th className="px-3 sm:px-4 py-3 border-b dark:border-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {POOL_PORTS.map((port) => (
                          <tr key={port.port} className={`text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                            selectedPort === port.port ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                          }`}>
                            <td className="px-3 sm:px-4 py-4 font-mono font-medium text-primary-600 dark:text-primary-400">{port.port}</td>
                            <td className="px-3 sm:px-4 py-4">{port.difficulty}</td>
                            <td className="px-3 sm:px-4 py-4 max-w-[200px] sm:max-w-md">{renderManufacturers(port.manufacturers)}</td>
                            <td className="px-3 sm:px-4 py-4">{port.hashrate}</td>
                            <td className="px-3 sm:px-4 py-4">
                              <button
                                onClick={() => handlePortSelect(port.port)}
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

                {selectedPort === 8888 && (
                  <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Custom Difficulty Calculator</div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-blue-700 dark:text-blue-400 mb-1">
                          Enter your miner's hashrate:
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
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
          )}

          {/* Step 2 - Configure Your Miner */}
          {selectedPort && selectedLocation && authType && (
            <div ref={configStepRef} className="relative pl-8 sm:pl-12">
              <div className="absolute left-0 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-base sm:text-lg">4</div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Configure Your Miner</h3>
                
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 sm:p-6 space-y-4 border border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2">Pool Address</div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <code className="flex-grow text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg font-mono text-sm break-all border border-gray-200 dark:border-gray-700">
                        stratum+tcp://{selectedLocation.domain}:{selectedPort}
                      </code>
                      <button
                        className="px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-base"
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
                        yourKaspaAddress.workerName
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

          {/* Step 3 - Start Mining */}
          {selectedPort && selectedLocation && authType && (
            <div ref={startStepRef} className="relative pl-8 sm:pl-12">
              <div className="absolute left-0 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-base sm:text-lg">5</div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Start Mining</h3>
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
