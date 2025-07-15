import Link from 'next/link'

interface ResourceCardProps {
  title: string
  description: string
  link: string
  icon: React.ReactNode
  isAffiliate?: boolean
}

function ResourceCard({ title, description, link, icon, isAffiliate }: ResourceCardProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col p-5 bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700/60 hover:border-primary-300 dark:hover:border-primary-500/50 transition-colors"
    >
      <div className="flex items-center space-x-3 mb-2">
        <div className="text-primary-500">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
          {isAffiliate && (
            <span className="ml-2 text-xs text-primary-500 border border-primary-200 dark:border-primary-500/30 rounded px-1.5 py-0.5">
              Partner
            </span>
          )}
        </h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </a>
  )
}

export const metadata = {
  title: 'Resources - Kat Pool',
  description: 'Where Kaspa Miners Thrive',
}

export default function Resources() {
  return (
    <div className="flex flex-col md:flex-row px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      {/* Vertical Navigation */}
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
            <Link href="/resources/mining-hardware" className="block px-4 py-2 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">Mining Hardware</Link>
          </li>
        </ul>
      </nav>
      {/* Main Content Placeholder */}
      <div className="flex-1">
        <div className="text-center text-gray-500 dark:text-gray-400 mt-16">
          <h2 className="text-2xl font-semibold mb-2">Select a resource from the navigation</h2>
          <p>Choose a topic to view detailed resources and guides.</p>
        </div>
      </div>
    </div>
  )
}
