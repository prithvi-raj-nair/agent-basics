'use client'

import { ReactNode } from 'react'

interface ScrollAreaProps {
  children: ReactNode
  className?: string
  maxHeight?: string
}

export function ScrollArea({ children, className = '', maxHeight = '300px' }: ScrollAreaProps) {
  return (
    <div
      className={`overflow-auto custom-scrollbar ${className}`}
      style={{ maxHeight }}
    >
      {children}
    </div>
  )
}
