import Link from 'next/link'
import React from 'react'
import DocCard from '../components/DocCard'
import SidebarNavigation from '../components/SidebarNavigation'

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
      <SidebarNavigation />
      {/* Main Content */}
      <main className="flex-1">
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700/60 p-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">Mining Tools</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Essential tools for Kaspa mining.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <DocCard
                key={tool.title}
                title={tool.title}
                description={tool.description}
                link={tool.link}
                icon={tool.icon}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 