'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Announcements from '../elements/dropdown-announcements'
import DropdownHelp from '../elements/dropdown-help'

export default function Nav() {
  const pathname = usePathname()
  const [minerLink, setMinerLink] = useState('/miner')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const storedWallet = localStorage.getItem('kaspaWalletAddress')
    if (storedWallet) {
      setMinerLink(`/miner?wallet=${storedWallet}`)
    }
  }, [])

  return (
    <>
      {/* Existing Desktop Navigation - Unchanged */}
      <nav className="hidden lg:flex lg:grow items-center">
        <ul className="flex grow justify-start flex-wrap items-center">
          <li className="relative group">
            <Link
              href="https://katpool.xyz"
              className="flex items-center px-3 py-2 text-sm font-medium transition-colors"
            >
              <Image
                src="/images/navlogo.png"
                alt="Navigation Logo"
                width={128}
                height={32}
                className={`mr-6 ${pathname === '/' ? 'opacity-100' : 'opacity-100'}`}
              />
            </Link>
          </li>
          {/* <li className="relative group">
            <Link
              href="/landing"
              className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${pathname === '/landing'
                ? 'text-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
              }`}
            >
              <span>Landing Page</span>
            </Link>
          </li> */}
          <li className="relative group">
            <Link
              href="/connect"
              className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${pathname === '/connect'
                ? 'text-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
              }`}
            >
              <span>Getting Started</span>
            </Link>
          </li>
          <li className="relative group">
            <Link
              href={minerLink}
              className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${pathname === '/miner'
                ? 'text-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
              }`}
            >
              <span>Miner Dashboard</span>
            </Link>
          </li>
          <li className="relative group">
            <Link
              href="/pool"
              className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${pathname === '/pool'
                ? 'text-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
              }`}
            >
              <span>Pool Statistics</span>
            </Link>
          </li>
          <li className="relative group">
            <Link
              href="/topMiners"
              className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${pathname === '/topMiners'
                ? 'text-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
              }`}
            >
              <span>Top Miners</span>
            </Link>
          </li>
          <li className="relative group">
            <Link
              href="/resources"
              className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${pathname === '/resources'
                ? 'text-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
              }`}
            >
              <span>Resources</span>
            </Link>
          </li>
        </ul>

        <div className="flex items-center space-x-4">
          {/* Beta Alert - Desktop */}
          <a 
            href="https://discord.gg/s6tXwKafFH"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 animate-pulse hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors cursor-pointer"
          >
            Open Beta - Please Report Bugs
          </a>

          {/* Desktop Navigation Elements */}
          <div className="hidden lg:block">
            <Announcements align="right" />
          </div>
          <div className="hidden lg:block">
            <DropdownHelp align="right" />
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="flex lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-[9999]">
        <div className="flex items-center justify-between w-full px-4 py-3">
          <Link href="https://katpool.xyz" className="flex-shrink-0">
            <Image
              src="/images/navlogo.png"
              alt="Navigation Logo"
              width={96}
              height={24}
              priority
              className="w-24 h-auto"
            />
          </Link>
          <div className="flex items-center space-x-2">
            {/* Beta Alert - Mobile */}
            <a
              href="https://discord.gg/s6tXwKafFH"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 animate-pulse hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors cursor-pointer"
            >
              BETA
            </a>
            {/* Mobile Navigation Elements */}
            <div className="lg:hidden">
              <Announcements align="right" />
            </div>
            <div className="lg:hidden">
              <DropdownHelp align="right" />
            </div>
            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-[100]">
            <ul className="px-2 py-3 space-y-1">
              {/* <li>
                <Link
                  href="/landing"
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${pathname === '/landing'
                    ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/10'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Landing Page
                </Link>
              </li> */}
              <li>
                <Link
                  href="/connect"
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${pathname === '/connect'
                    ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/10'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Getting Started
                </Link>
              </li>
              <li>
                <Link
                  href={minerLink}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${pathname === '/miner'
                    ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/10'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Miner Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/pool"
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${pathname === '/pool'
                    ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/10'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pool Statistics
                </Link>
              </li>
              <li>
                <Link
                  href="/topMiners"
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${pathname === '/topMiners'
                    ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/10'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Top Miners
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${pathname === '/resources'
                    ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/10'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  )
} 