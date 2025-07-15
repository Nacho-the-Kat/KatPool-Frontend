import Link from 'next/link'
import React from 'react'

export const metadata = {
  title: 'Mining Hardware - Kat Pool',
  description: 'Recommended hardware for Kaspa mining.'
}

export default function MiningHardware() {
  return (
    <div>
      {/* Main Layout */}
      <div className="flex flex-col md:flex-row px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        {/* Sidebar Navigation */}
        <nav className="md:w-64 mb-8 md:mb-0 md:mr-8">
          <ul className="flex md:flex-col gap-4">
            <li>
              <Link href="/resources/kas-mining-tutorial" className="block px-4 py-2 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">KAS Mining Tutorial</Link>
            </li>
            <li>
              <Link href="/resources/mining-tools" className="block px-4 py-2 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">Mining Tools</Link>
            </li>
            <li>
              <Link href="/resources/documentation" className="block px-4 py-2 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">Documentation & Guides</Link>
            </li>
            <li>
              <Link href="/resources/mining-hardware" className="block px-4 py-2 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold">Mining Hardware</Link>
            </li>
          </ul>
        </nav>
        {/* Main Content */}
        <main className="flex-1">
          <div className="w-full max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-4">
            
          </div>
          <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700/60 p-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">Mining Hardware</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Recommended ASIC mining hardware for Kaspa. Compare models and specs below. Always check the latest profitability and power costs before buying hardware.
Beware of scams - buy from reputable sources only.
ASICs are much more efficient than GPUs for Kaspa, but require higher upfront investment.
Consider noise, heat, and power requirements for home mining.</p>
<div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-600 py-3 pr-3 rounded text-sm text-yellow-900 dark:text-yellow-100 shadow">
  <span className="pl-2">
    <svg className="w-5 h-5 mr-2 text-yellow-500 dark:text-yellow-300 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z" /></svg>
  </span>
  <span>Disclaimer: This is not financial advice. Do your own research before making any purchase decisions.</span>
</div>
            <br/>
            <div className="space-y-10">
              {/* ASIC Mining Hardware Comparison Table */}
              <section>
                {/* IceRiver Table */}
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-100">IceRiver</h3>
                  <div className="overflow-x-auto rounded-2xl shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                          <th className="w-40 px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Model</th>
                          <th className="w-44 px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Hashrate (GH/s)</th>
                          <th className="w-44 px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Power Usage (W)</th>
                          <th className="w-48 px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-primary-50/40 dark:hover:bg-primary-900/10 transition border-b border-gray-100 dark:border-gray-800">
                          <td className="w-40 px-6 py-4">KS0</td>
                          <td className="w-44 px-6 py-4">100</td>
                          <td className="w-44 px-6 py-4">65</td>
                          <td className="w-48 px-6 py-4"><a href="https://www.iceriver.io/product/iceriver-kas-ks0/" target="_blank" rel="noopener noreferrer" className="underline text-primary-600 dark:text-primary-300">Product Page</a></td>
                        </tr>
                        <tr className="hover:bg-primary-50/40 dark:hover:bg-primary-900/10 transition border-b border-gray-100 dark:border-gray-800">
                          <td className="w-40 px-6 py-4">KS0 Pro</td>
                          <td className="w-44 px-6 py-4">200</td>
                          <td className="w-44 px-6 py-4">100</td>
                          <td className="w-48 px-6 py-4"><a href="https://www.iceriver.io/product/iceriver-ks0-pro/" target="_blank" rel="noopener noreferrer" className="underline text-primary-600 dark:text-primary-300">Product Page</a></td>
                        </tr>
                        <tr className="hover:bg-primary-50/40 dark:hover:bg-primary-900/10 transition border-b border-gray-100 dark:border-gray-800">
                          <td className="w-40 px-6 py-4">KS1</td>
                          <td className="w-44 px-6 py-4">1000</td>
                          <td className="w-44 px-6 py-4">600</td>
                          <td className="w-48 px-6 py-4"><a href="https://www.iceriver.io/product/iceriver-ks1/" target="_blank" rel="noopener noreferrer" className="underline text-primary-600 dark:text-primary-300">Product Page</a></td>
                        </tr>
                        <tr className="hover:bg-primary-50/40 dark:hover:bg-primary-900/10 transition border-b border-gray-100 dark:border-gray-800">
                          <td className="w-40 px-6 py-4">KS2</td>
                          <td className="w-44 px-6 py-4">2000</td>
                          <td className="w-44 px-6 py-4">1200</td>
                          <td className="w-48 px-6 py-4"><a href="https://www.iceriver.io/product/iceriver-ks2/" target="_blank" rel="noopener noreferrer" className="underline text-primary-600 dark:text-primary-300">Product Page</a></td>
                        </tr>
                        <tr className="hover:bg-primary-50/40 dark:hover:bg-primary-900/10 transition border-b border-gray-100 dark:border-gray-800">
                          <td className="w-40 px-6 py-4">KS3M</td>
                          <td className="w-44 px-6 py-4">6000</td>
                          <td className="w-44 px-6 py-4">3400</td>
                          <td className="w-48 px-6 py-4"><a href="https://www.iceriver.io/product/iceriver-ks3m/" target="_blank" rel="noopener noreferrer" className="underline text-primary-600 dark:text-primary-300">Product Page</a></td>
                        </tr>
                        <tr className="hover:bg-primary-50/40 dark:hover:bg-primary-900/10 transition border-b border-gray-100 dark:border-gray-800">
                          <td className="w-40 px-6 py-4">KS3</td>
                          <td className="w-44 px-6 py-4">8000</td>
                          <td className="w-44 px-6 py-4">3200</td>
                          <td className="w-48 px-6 py-4"><a href="https://www.iceriver.io/product/iceriver-ks3/" target="_blank" rel="noopener noreferrer" className="underline text-primary-600 dark:text-primary-300">Product Page</a></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Bitmain Table */}
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-100">Bitmain</h3>
                  <div className="overflow-x-auto rounded-2xl shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                          <th className="w-40 px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Model</th>
                          <th className="w-44 px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Hashrate (GH/s)</th>
                          <th className="w-44 px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Power Usage (W)</th>
                          <th className="w-48 px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-primary-50/40 dark:hover:bg-primary-900/10 transition border-b border-gray-100 dark:border-gray-800">
                          <td className="w-40 px-6 py-4">KS3</td>
                          <td className="w-44 px-6 py-4">9400</td>
                          <td className="w-44 px-6 py-4">3500</td>
                          <td className="w-48 px-6 py-4"><a href="https://shop.bitmain.com/" target="_blank" rel="noopener noreferrer" className="underline text-primary-600 dark:text-primary-300">Shop page</a></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Goldshell Table */}
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-100">Goldshell</h3>
                  <div className="overflow-x-auto rounded-2xl shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                          <th className="w-40 px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Model</th>
                          <th className="w-44 px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Hashrate (GH/s)</th>
                          <th className="w-44 px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Power Usage (W)</th>
                          <th className="w-48 px-6 py-4 text-left font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-primary-50/40 dark:hover:bg-primary-900/10 transition border-b border-gray-100 dark:border-gray-800">
                          <td className="w-40 px-6 py-4">KA BOX</td>
                          <td className="w-44 px-6 py-4">1180</td>
                          <td className="w-44 px-6 py-4">400</td>
                          <td className="w-48 px-6 py-4"><a href="https://www.goldshell.com/product-category/projects/kas/" target="_blank" rel="noopener noreferrer" className="underline text-primary-600 dark:text-primary-300">Shop page</a></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 