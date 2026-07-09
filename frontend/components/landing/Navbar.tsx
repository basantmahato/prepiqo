'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[1000px]">
      <nav className="bg-brand text-white rounded-[2rem] px-6 py-3.5 flex flex-col shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between w-full">
          {/* Logo Section */}
          <Link href="/" className="font-bold text-lg tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity ml-2" onClick={() => setIsOpen(false)}>
            <span>@Prepiqo</span>
          </Link>
          
          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/#how-it-works" className="text-white/80 hover:text-white transition-colors">How it Works</Link>
            <Link href="/#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</Link>
            <Link href="/docs" className="text-white/80 hover:text-white transition-colors">Documentation</Link>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/register" className="inline-flex items-center justify-center px-5 py-2 text-sm font-bold rounded-full bg-white text-brand hover:bg-gray-50 transition-colors shadow-sm">
              Sign Up
            </Link>
          </div>

          {/* Mobile Actions & Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-white hover:opacity-80 transition-opacity">
              Login
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-1 focus:outline-none" aria-label="Toggle menu" title="Toggle menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden flex flex-col items-center gap-4 pt-6 pb-4 mt-2 border-t border-white/20 animate-in slide-in-from-top-2">
            <Link href="/#how-it-works" onClick={() => setIsOpen(false)} className="text-sm font-medium text-white/80 hover:text-white">How it Works</Link>
            <Link href="/#pricing" onClick={() => setIsOpen(false)} className="text-sm font-medium text-white/80 hover:text-white">Pricing</Link>
            <Link href="/docs" onClick={() => setIsOpen(false)} className="text-sm font-medium text-white/80 hover:text-white">Documentation</Link>
            <div className="w-full h-px bg-white/20 my-2"></div>
            <Link href="/register" onClick={() => setIsOpen(false)} className="w-full text-center py-2 text-sm font-bold rounded-full bg-white text-brand hover:bg-gray-50">Sign Up</Link>
          </div>
        )}
      </nav>
    </div>
  );
}
