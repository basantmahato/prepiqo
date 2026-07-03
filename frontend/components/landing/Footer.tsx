import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border-subtle py-12 mt-12">
      <div className="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="font-bold text-lg mb-2 text-text-primary">MCQPrep Pro</div>
          <p className="text-xs text-text-muted">&copy; {new Date().getFullYear()} MCQPrep Pro. Empowering learners worldwide.</p>
        </div>
        <div className="flex gap-8 text-xs font-medium text-text-secondary">
          <a href="#" className="hover:text-text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-text-primary transition-colors">Contact Us</a>
        </div>
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-text-secondary hover:bg-gray-200 cursor-pointer transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-text-secondary hover:bg-gray-200 cursor-pointer transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
