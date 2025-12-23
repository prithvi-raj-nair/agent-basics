'use client'

import { ReactNode } from 'react'

interface CardProps {
  title?: string
  children: ReactNode
  className?: string
  headerClassName?: string
}

export function Card({ title, children, className = '', headerClassName = '' }: CardProps) {
  return (
    <div className={`rounded-lg border border-gray-300 overflow-hidden ${className}`}>
      {title && (
        <div className={`px-3 py-2 border-b border-gray-300 font-medium text-sm ${headerClassName}`}>
          {title}
        </div>
      )}
      <div className="p-3">
        {children}
      </div>
    </div>
  )
}
