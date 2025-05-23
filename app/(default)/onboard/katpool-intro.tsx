'use client'

import { useRouter } from 'next/navigation'

export default function KatpoolIntro() {
  const router = useRouter()

  const handleAnonymousMining = () => {
    router.push('/connect')
  }

  const handleUpholdMining = () => {
    router.push('/profile')
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
              Choose Your Path
            </div>
          </div>
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Select how you want to mine and get paid with Kat Pool
          </div>
        </div>

        {/* Options Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option 1 */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer h-full"
               onClick={handleAnonymousMining}>
            <div className="flex flex-col h-full">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Anonymous Mining</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Mine anonymously and get paid directly in KAS. Perfect for those who value privacy and simplicity.
                  </p>
                </div>
              </div>
              <div className="mt-auto">
                <button className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-lg font-medium">
                  Start Anonymous Mining
                </button>
              </div>
            </div>
          </div>

          {/* Option 2 */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer h-full"
               onClick={handleUpholdMining}>
            <div className="flex flex-col h-full">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Connect with Uphold</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Complete KYC verification with Uphold to get paid in any supported asset. Ideal for those who want more payment flexibility.
                  </p>
                </div>
              </div>
              <div className="mt-auto">
                <button className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-lg font-medium flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg"
                    aria-label="Uphold" role="img"
                    viewBox="0 0 512 512"
                    className="w-5 h-5">
                    <path d="M360 277c-9 19-20 36-33 50 9-34 5-78-15-120-10-22-24-42-40-59 25-19 51-25 71-16 13 6 23 17 28 33 12 31 7 72-11 112m-208 0c-18-40-23-81-11-112 5-16 15-27 28-33 20-9 46-3 71 16-16 17-30 37-40 59-20 42-24 86-15 120-13-14-24-31-33-50m123 86a47 47 0 01-38 0c-38-17-46-85-17-148 10-20 22-37 36-52 14 15 26 32 36 52 29 63 21 131-17 148m52-256c-23-1-48 8-71 27-23-19-48-28-71-27a126 126 0 01142 0m66 51c-20-56-74-94-137-94s-118 38-137 94v1c-13 35-8 82 12 127 28 60 79 102 124 102h2c45 0 96-42 124-102 20-45 25-92 12-128m-98 263c-13 4-26 6-38 6h-2c-12 0-25-2-37-6-6-1-13 2-14 7-2 6 1 12 7 14 15 4 30 6 44 6h2c14 0 29-2 44-6 6-2 9-8 8-13-2-6-9-9-14-8" fill="currentColor"/>
                  </svg>
                  Connect with Uphold
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
