'use client'

import Link from 'next/link'
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@headlessui/react'
import Image from 'next/image'

export default function DropdownHelp({ align }: {
  align?: 'left' | 'right'
}) {
  return (
    <Menu as="div" className="relative inline-flex">
      {({ open }) => (
        <>
          <MenuButton
            className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800 rounded-full ${open && 'bg-gray-200 dark:bg-gray-800'
              }`}
          >
            <span className="sr-only">Need help?</span>
            <svg
              className="fill-current text-gray-500/80 dark:text-gray-400/80"
              width={16}
              height={16}
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
            </svg>
          </MenuButton>
          <Transition
            as="div"
            className={`origin-top-right z-10 absolute top-full min-w-[11rem] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'
              }`}
            enter="transition ease-out duration-200 transform"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase pt-1.5 pb-2 px-3">Need help?</div>
            <MenuItems as="ul" className="focus:outline-none">
              <MenuItem as="li">
                {({ active }) => (
                  <Link 
                    className={`font-medium text-sm flex items-center py-1 px-3 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-primary-500'}`} 
                    href="https://kas.fyi/address/kaspa:qz4j8mu269z8llgcczmfukm9fan2fq822kzxu4cfukd5fqrhxpsv2zhs9jxnp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-3 h-3 fill-current text-primary-500 shrink-0 mr-2" viewBox="0 0 12 12">
                      <rect y="3" width="12" height="9" rx="1" />
                      <path d="M2 0h8v2H2z" />
                    </svg>
                    <span>Pool Treasury</span>
                  </Link>
                )}
              </MenuItem>
              <MenuItem as="li">
                {({ active }) => (
                  <Link 
                    className={`font-medium text-sm flex items-center py-1 px-3 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-primary-500'}`} 
                    href="https://NachoWyborski.xyz"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/images/nacho.svg"
                      alt="Nacho Icon"
                      className="w-3 h-3 text-primary-500 shrink-0 mr-2"
                      width={12}
                      height={12}
                    />
                    <span>Nacho the Kat</span>
                  </Link>
                )}
              </MenuItem>
              {/*<MenuItem as="li">
                {({ active }) => (
                  <Link className={`font-medium text-sm flex items-center py-1 px-3 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-primary-500'}`} href="https://ticket.katpool.xyz">
                    <svg className="w-3 h-3 fill-current text-primary-500 shrink-0 mr-2" viewBox="0 0 16 16">
                      <path d="M1.5 3A1.5 1.5 0 0 0 0 4.5V6a.5.5 0 0 0 .5.5 1.5 1.5 0 1 1 0 3 .5.5 0 0 0-.5.5v1.5A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5V10a.5.5 0 0 0-.5-.5 1.5 1.5 0 0 1 0-3A.5.5 0 0 0 16 6V4.5A1.5 1.5 0 0 0 14.5 3z"/>
                    </svg>
                    <span>Submit Ticket</span>
                  </Link>
                )}
              </MenuItem>*/}
              <MenuItem as="li">
                {({ active }) => (
                  <Link 
                    className={`font-medium text-sm flex items-center py-1 px-3 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-primary-500'}`} 
                    href="https://discord.gg/nachothekat"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-3 h-3 fill-current text-primary-500 shrink-0 mr-2" viewBox="0 0 16 16">
                      <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/>
                    </svg>
                    <span>Contact Us</span>
                  </Link>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </>
      )}
    </Menu>
  )
}