import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border-subtle transition-all">
      <div className="flex justify-between items-center h-20 px-8 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-12">
          <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2 text-brand">
            <span className="text-xl font-extrabold tracking-tighter">MCQPrep Pro</span>
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#how-it-works" className="text-text-secondary hover:text-text-primary transition-colors">How it Works</a>
            <a href="#features" className="text-text-secondary hover:text-text-primary transition-colors">Capabilities</a>
            <a href="#pricing" className="text-text-secondary hover:text-text-primary transition-colors">Pricing</a>
            <a href="#faq" className="text-text-secondary hover:text-text-primary transition-colors">FAQ</a>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/login" className="text-sm font-medium text-text-primary hover:text-text-secondary transition-colors px-2 py-2">
            Login
          </Link>
          <Link href="/register" className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-md bg-[#4F46E5] text-white hover:bg-[#4338CA] transition-all shadow-sm">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
