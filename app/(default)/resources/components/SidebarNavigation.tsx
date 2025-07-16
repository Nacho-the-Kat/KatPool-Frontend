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
        <nav className="md:w-64 mb-8 md:mb-0 md:mr-8">
            <ul className="flex md:flex-col gap-4">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={`block px-4 py-2 rounded font-semibold transition-colors ${
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