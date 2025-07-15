import Link from 'next/link'
import React from 'react'
import { Github } from 'lucide-react'

export const metadata = {
  title: 'Kat Pool - Open Source Kaspa Mining',
  description: 'Kat Pool is the first open-source mining pool built for Kaspa, empowering miners with transparency, scalability, and freedom.'
}

const docs = [
  {
    title: 'Kaspa Mining Wiki',
    description: 'Comprehensive guide to mining Kaspa, including setup instructions and best practices',
    link: 'https://wiki.kaspa.org/en/mining',
    icon: (
      <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: 'Hashrate Tables',
    description: 'Detailed performance data for various mining hardware, including ASICs and GPUs',
    link: 'https://wiki.kaspa.org/en/hashrate-tables',
    icon: (
      <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Emission Schedule',
    description: 'Official Kaspa emission schedule detailing the coin distribution and mining rewards',
    link: 'https://kaspa.org/wp-content/uploads/2022/09/KASPA-EMISSION-SCHEDULE.pdf',
    icon: (
      <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Source Code',
    description: 'Katpool is open-source KASPA mining pool offering transparency, scalability, and $NACHO rewards.',
    link: 'https://github.com/Nacho-the-Kat/katpool-app',
    icon: (
      <Github className="w-8 h-8 text-primary-400" />
    ),
  }
]

export default function Documentation() {
  return (
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
            <Link href="/resources/documentation" className="block px-4 py-2 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold">Documentation & Guides</Link>
          </li>
          <li>
            <Link href="/resources/mining-hardware" className="block px-4 py-2 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">Mining Hardware</Link>
          </li>
        </ul>
      </nav>
      {/* Main Content */}
      <main className="flex-1">
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700/60 p-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">Documentation & Guides</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Guides and documentation for Kaspa mining.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.map((doc) => (
              <a
                key={doc.title}
                href={doc.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-7 bg-gradient-to-br from-gray-50/80 to-white dark:from-gray-800/80 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-2xl hover:border-primary-400 dark:hover:border-primary-500/70 transition-all focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <div className="flex items-center mb-4">
                  {doc.icon}
                  <span className="ml-3 text-2xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-primary-500 transition-colors">{doc.title}</span>
                </div>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-4">{doc.description}</p>
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