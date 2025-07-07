'use client'

import React from 'react'

interface FallbackMessageProps {
  title?: string
  message?: string
  icon?: React.ReactNode
  showIcon?: boolean
  children?: React.ReactNode
  className?: string
}

export default function FallbackMessage({
  title = "No data available",
  message = "Check back soon for updates",
  icon,
  showIcon = true,
  children,
  className = ""
}: FallbackMessageProps) {
  const defaultIcon = (
    <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center p-4">
        {showIcon && (
          <div className="w-10 h-10 mx-auto mb-3 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center">
            {icon || defaultIcon}
          </div>
        )}
        <h3 className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-1">
          {title}
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {message}
        </p>
      </div>
    </div>
  )
} 