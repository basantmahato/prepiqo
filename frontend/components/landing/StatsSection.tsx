import React from 'react';

export default function StatsSection() {
  return (
    <section className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-border-subtle flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-brand flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <h3 className="text-4xl font-bold mb-2 text-text-primary">4 Modes</h3>
          <p className="text-sm text-text-secondary leading-relaxed">Versatile learning tools including MCQs, Study Notes, Flashcards, and Chat.</p>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-border-subtle flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h3 className="text-4xl font-bold mb-2 text-text-primary">5k+</h3>
          <p className="text-sm text-text-secondary leading-relaxed">Active Students collaborating and climbing the leaderboard together.</p>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-border-subtle flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
          </div>
          <h3 className="text-4xl font-bold mb-2 text-text-primary">Unlimited</h3>
          <p className="text-sm text-text-secondary leading-relaxed">Export your materials to PDF or generate shareable public links for offline study.</p>
        </div>
      </div>
    </section>
  );
}
