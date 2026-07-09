import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border-subtle py-12 mt-12">
      <div className="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="font-bold text-lg mb-2 text-text-primary">Prepiqo</div>
          <p className="text-xs text-text-muted">&copy; {new Date().getFullYear()} Prepiqo. Empowering learners worldwide.</p>
        </div>
        <div className="flex flex-wrap gap-6 md:gap-8 text-xs font-medium text-text-secondary">
          <Link href="/docs" className="hover:text-text-primary transition-colors">Documentation</Link>
          <Link href="/privacy-policy" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-text-primary transition-colors">Terms of Service</Link>
          <Link href="/refund-policy" className="hover:text-text-primary transition-colors">Refund Policy</Link>
          <a href="#" className="hover:text-text-primary transition-colors">Contact Us</a>
        </div>

      </div>
    </footer>
  );
}
