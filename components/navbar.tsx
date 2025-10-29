"use client"

import Link from "next/link"
import { useState } from "react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <span className="text-2xl">🩸</span>
            <span className="font-bold text-lg">BloodNearMe</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-white">
            <Link href="/" className="hover:text-primary transition font-medium">
              Home
            </Link>
            <Link href="/find" className="hover:text-primary transition font-medium">
              Find Donor
            </Link>
            <Link href="/request" className="hover:text-primary transition font-medium">
              Request Blood
            </Link>
            <Link href="/donor" className="hover:text-primary transition font-medium">
              Become a Donor
            </Link>
            <Link href="/about" className="hover:text-primary transition font-medium">
              About
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2" aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" suppressHydrationWarning>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-border pt-4 text-white">
            <Link href="/" className="block py-2 hover:text-primary font-medium" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link href="/find" className="block py-2 hover:text-primary font-medium" onClick={() => setIsOpen(false)}>
              Find Donor
            </Link>
            <Link href="/request" className="block py-2 hover:text-primary font-medium" onClick={() => setIsOpen(false)}>
              Request Blood
            </Link>
            <Link href="/donor" className="block py-2 hover:text-primary font-medium" onClick={() => setIsOpen(false)}>
              Become a Donor
            </Link>
            <Link href="/about" className="block py-2 hover:text-primary font-medium" onClick={() => setIsOpen(false)}>
              About
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
