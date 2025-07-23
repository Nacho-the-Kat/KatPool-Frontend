"use client";

import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';

export default function SidebarNavigation() {
    const pathname = usePathname();
    const links = [
        {
            href: '/resources/kas-mining-tutorial',
            label: 'KAS Mining Tutorial',
        },
        {
            href: '/resources/mining-tools',
            label: 'Mining Tools',
        },
        {
            href: '/resources/documentation',
            label: 'Documentation & Guides',
        },
        {
            href: '/resources/mining-hardware',
            label: 'Mining Hardware',
        },
    ];

    return (
        <nav className="w-full md:w-64 mb-4 md:mb-0 md:mr-8">
            <ul
                className="flex overflow-x-auto md:overflow-visible gap-2 md:gap-4 px-2 md:flex-col md:px-0 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary-200 dark:scrollbar-thumb-primary-800"
            >
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <li key={link.href} className="flex-shrink-0">
                            <Link
                                href={link.href}
                                className={`block px-4 py-3 md:py-2 rounded font-semibold transition-colors whitespace-nowrap text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black ${
                                    isActive
                                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                        : 'hover:bg-primary-100 dark:hover:bg-primary-900/30'
                                }`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
} 