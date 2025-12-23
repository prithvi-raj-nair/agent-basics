'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className="relative bg-purple-100 rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] m-4 flex flex-col"
      >
        {title && (
          <div className="px-6 py-4 border-b border-purple-200">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
        )}
        <div className="flex-1 overflow-auto p-6 custom-scrollbar">
          {children}
        </div>
        <div className="px-6 py-4 border-t border-purple-200 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}
