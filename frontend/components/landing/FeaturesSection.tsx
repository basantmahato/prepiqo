import React from 'react';

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 border-t border-border-subtle">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">An All-in-One Study Hub</h2>
        <p className="text-text-secondary max-w-[600px] mx-auto text-sm md:text-base">One platform, four powerful ways to learn. Adapt the AI to your specific study style.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-50 text-brand rounded-xl flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          </div>
          <h3 className="text-xl font-bold mb-3">Interactive MCQs</h3>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">Generate dynamic multiple-choice questions with selectable difficulty. Validate your knowledge instantly with detailed explanations for every correct and incorrect answer.</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-50 text-brand rounded-xl flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <h3 className="text-xl font-bold mb-3">Comprehensive Study Notes</h3>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">Provide a topic, and our AI will generate beautifully formatted, structured Markdown study notes. Perfect for cramming or building foundational knowledge.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-50 text-brand rounded-xl flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <h3 className="text-xl font-bold mb-3">Flashcard Q&As</h3>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">Need rapid-fire review? Generate specific questions and concise answers tailored to your topic and difficulty level. Excellent for active recall.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-50 text-brand rounded-xl flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <h3 className="text-xl font-bold mb-3">Personal AI Tutor Chat</h3>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">Stuck on a concept? Engage in a free-flowing conversation with your AI tutor to clarify doubts, ask follow-up questions, and dive deeper into complex subjects.</p>
        </div>
      </div>
    </section>
  );
}
