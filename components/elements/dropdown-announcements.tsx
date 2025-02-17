'use client'

import Link from 'next/link'
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@headlessui/react'

export default function DropdownAnnouncements({ align }: {
  align?: 'left' | 'right'
}) {
  return (
    <Menu as="div" className="relative inline-flex">
      {({ open }) => (
        <>
          <MenuButton
            className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800 rounded-full ${
              open && 'bg-gray-200 dark:bg-gray-800'
            }`}
          >
            <span className="sr-only">Announcements</span>
            <svg
              className="fill-current text-gray-500/80 dark:text-gray-400/80"
              width={16}
              height={16}
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-.214c-2.162-1.241-4.49-1.843-6.912-2.083l.405 2.712A1 1 0 0 1 5.51 15.1h-.548a1 1 0 0 1-.916-.599l-1.85-3.49-.202-.003A2.014 2.014 0 0 1 0 9V7a2.02 2.02 0 0 1 1.992-2.013 75 75 0 0 0 2.483-.075c3.043-.154 6.148-.849 8.525-2.199zm1 0v11a.5.5 0 0 0 1 0v-11a.5.5 0 0 0-1 0m-1 1.35c-2.344 1.205-5.209 1.842-8 2.033v4.233q.27.015.537.036c2.568.189 5.093.744 7.463 1.993zm-9 6.215v-4.13a95 95 0 0 1-1.992.052A1.02 1.02 0 0 0 1 7v2c0 .55.448 1.002 1.006 1.009A61 61 0 0 1 4 10.065m-.657.975 1.609 3.037.01.024h.548l-.002-.014-.443-2.966a68 68 0 0 0-1.722-.082z"/>
            </svg>
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-gray-100 dark:border-gray-900 rounded-full"></div>
          </MenuButton>
          <Transition
            as="div"
            className={`origin-top-right z-10 absolute top-full -mr-2 sm:mr-0 min-w-[20rem] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
            enter="transition ease-out duration-200 transform"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase pt-1.5 pb-2 px-4">Announcements</div>
            <MenuItems as="ul" className="focus:outline-none">
              <MenuItem as="li" className="border-b border-gray-200 dark:border-gray-700/60 last:border-0">
                {({ active }) => (
                  <div className={`block py-2 px-4 ${active && 'bg-gray-50 dark:bg-gray-700/20'}`}>
                    <span className="block text-sm mb-2">
                      🚀 <span className="font-medium text-gray-800 dark:text-gray-100">NACHO Rebates Now Live!</span> Starting 
                      February 17th, our standard 0.75% pool fee is now active, along with our NACHO token rebate system. Qualify for 
                      100% fee rebates by holding either 100M+ NACHO tokens or at least 1 NACHO NFT. All other miners receive 33% 
                      rebates. Rebates are paid in $NACHO tokens within an hour of each payout. Payout mininum is 5 KAS or equivalent.
                    </span>
                    <span className="block text-xs font-medium text-gray-400 dark:text-gray-500">Feb 17, 2024</span>
                  </div>
                )}
              </MenuItem>
              <MenuItem as="li" className="border-b border-gray-200 dark:border-gray-700/60 last:border-0">
                {({ active }) => (
                  <div className={`block py-2 px-4 ${active && 'bg-gray-50 dark:bg-gray-700/20'}`}>
                    <span className="block text-sm mb-2">
                      🎉 <span className="font-medium text-gray-800 dark:text-gray-100">Kat Pool Open Beta is Live!</span> We're excited to announce 
                      that Kat Pool is now in Open Beta. During this testing phase, all pool fees are set to zero. Thank you for helping us test and improve our platform.
                    </span>
                    <span className="block text-xs font-medium text-gray-400 dark:text-gray-500">Jan 13, 2025</span>
                  </div>
                )}
              </MenuItem>
              <MenuItem as="li" className="border-b border-gray-200 dark:border-gray-700/60 last:border-0">
                {({ active }) => (
                  <div className={`block py-2 px-4 ${active && 'bg-gray-50 dark:bg-gray-700/20'}`}>
                    <span className="block text-sm mb-2">
                      💎 <span className="font-medium text-gray-800 dark:text-gray-100">KRC20 Payouts Coming Soon</span> Our team is actively developing 
                      KRC20 token payout functionality. Stay tuned for this exciting feature that will be available in the near future.
                    </span>
                    <span className="block text-xs font-medium text-gray-400 dark:text-gray-500">Jan 1, 2025</span>
                  </div>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </>
      )}
    </Menu>
  )
}
