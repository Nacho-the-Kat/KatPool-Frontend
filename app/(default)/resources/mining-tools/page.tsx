import Link from 'next/link'
import React from 'react'

export const metadata = {
  title: 'Mining Tools - Kat Pool',
  description: 'Essential tools for Kaspa mining.'
}

const tools = [
  {
    title: 'Profit Calculator',
    description: 'Calculate your potential mining rewards and profitability with this community mining calculator',
    link: 'https://kaspacalc.net/',
    icon: (
      <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  }
]

export default function MiningTools() {
  return (
    <div className="flex flex-col md:flex-row px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Sidebar Navigation */}
      <nav className="md:w-64 mb-8 md:mb-0 md:mr-8">
        <ul className="flex md:flex-col gap-4">
          <li>
            <Link href="/resources/kas-mining-tutorial" className="block px-4 py-2 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">KAS Mining Tutorial</Link>
          </li>
          <li>
            <Link href="/resources/mining-tools" className="block px-4 py-2 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold">Mining Tools</Link>
          </li>
          <li>
            <Link href="/resources/documentation" className="block px-4 py-2 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">Documentation & Guides</Link>
          </li>
          <li>
            <Link href="/resources/mining-hardware" className="block px-4 py-2 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">Mining Hardware</Link>
          </li>
        </ul>
      </nav>
      {/* Main Content */}
      <main className="flex-1">
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700/60 p-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">Mining Tools</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Essential tools for Kaspa mining.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <a
                key={tool.title}
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-7 bg-gradient-to-br from-gray-50/80 to-white dark:from-gray-800/80 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-2xl hover:border-primary-400 dark:hover:border-primary-500/70 transition-all focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <div className="flex items-center mb-4">
                  {tool.icon}
                  <span className="ml-3 text-2xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-primary-500 transition-colors">{tool.title}</span>
                </div>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-4">{tool.description}</p>
                <span className="mt-auto text-primary-500 font-medium group-hover:underline flex items-center">
                  Learn More
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 