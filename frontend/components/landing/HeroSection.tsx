'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const SCREENS = [
  {
    type: 'mcq',
    userMsg: 'Generate an MCQ about mitochondria.',
    assistantUI: (
      <div className="bg-white rounded-xl border border-border-subtle shadow-sm p-4 text-xs animate-in fade-in slide-in-from-bottom-2 duration-500">
        <p className="text-text-primary mb-3 font-medium leading-relaxed">Here is your question:</p>
        
        <div className="border border-border-subtle rounded-lg p-3">
          <p className="font-semibold text-text-primary mb-3 leading-relaxed">What is the primary function of the mitochondria?</p>
          <div className="space-y-2">
            <div className="w-full p-2.5 rounded-lg border border-border-subtle text-left transition-colors hover:bg-gray-50 flex items-start gap-2">
              <span className="font-semibold shrink-0 text-text-secondary">A.</span>
              <span>Protein synthesis</span>
            </div>
            <div className="w-full p-2.5 rounded-lg border-2 border-brand bg-indigo-50 text-brand text-left flex items-start gap-2">
              <span className="font-semibold shrink-0">B.</span>
              <span>Cellular respiration</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-1.5 mb-1.5 text-green-700 font-bold text-[10px]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              Correct!
            </div>
            <p className="text-green-800 text-[10px] leading-relaxed">
              Cellular respiration is the correct answer. Mitochondria are often called the "powerhouses" of the cell.
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    type: 'notes',
    userMsg: 'Generate study notes on Neural Networks.',
    assistantUI: (
      <div className="bg-white rounded-xl border border-border-subtle shadow-sm p-4 text-xs text-text-primary animate-in fade-in slide-in-from-bottom-2 duration-500">
        <p className="font-bold text-sm mb-2 text-brand">Neural Networks</p>
        <ul className="list-disc pl-4 space-y-2 text-[10px] leading-relaxed text-text-secondary">
          <li><strong className="text-text-primary">Definition:</strong> A series of algorithms that endeavors to recognize underlying relationships in a set of data.</li>
          <li><strong className="text-text-primary">Architecture:</strong> Composed of an input layer, hidden layers, and an output layer.</li>
          <li><strong className="text-text-primary">Activation:</strong> Functions like ReLU, Sigmoid, and Tanh determine the output.</li>
        </ul>
      </div>
    )
  },
  {
    type: 'qa',
    userMsg: 'Generate Q&A on World War II.',
    assistantUI: (
      <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="bg-white rounded-xl border border-border-subtle shadow-sm p-3 text-xs">
          <h4 className="font-bold mb-1.5 flex gap-1.5 text-text-primary leading-snug"><span className="text-brand shrink-0">Q.</span> When did World War 2 begin and end?</h4>
          <p className="text-[10px] text-text-secondary border-t border-border-subtle pt-2 mt-1 leading-relaxed"><span className="font-bold text-brand">A.</span> It began on September 1, 1939, and ended on September 2, 1945.</p>
        </div>
        <div className="bg-white rounded-xl border border-border-subtle shadow-sm p-3 text-xs">
          <h4 className="font-bold mb-1.5 flex gap-1.5 text-text-primary leading-snug"><span className="text-brand shrink-0">Q.</span> What were the main alliances?</h4>
          <p className="text-[10px] text-text-secondary border-t border-border-subtle pt-2 mt-1 leading-relaxed"><span className="font-bold text-brand">A.</span> The Allies and the Axis powers.</p>
        </div>
      </div>
    )
  },
  {
    type: 'chat',
    userMsg: 'Can you explain the theory of relativity simply?',
    assistantUI: (
      <div className="bg-white rounded-xl border border-border-subtle shadow-sm p-4 text-xs text-text-primary leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500">
        Sure! Imagine you're on a train moving at a constant speed. To you, everything inside the train acts normally. But to someone outside watching you, things look different. Einstein's theory says that the laws of physics are the same everywhere, but space and time are relative to the observer's speed.
      </div>
    )
  }
];

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SCREENS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentScreen = SCREENS[activeIndex];

  return (
    <section className="pt-36 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-3xl -z-10 opacity-70"></div>

      <div>

        <h1 className="text-[3.5rem] leading-[1.1] font-bold mb-6 tracking-tight text-text-primary">
          Master Any Topic With <span className="text-brand">AI</span> Precision.
        </h1>
        <p className="text-lg text-text-secondary mb-10 max-w-[480px] leading-relaxed">
          Generate Interactive MCQs, comprehensive Study Notes, and Flashcard Q&As in seconds. Chat with your personal AI tutor to clarify doubts instantly.
        </p>
        <div className="flex items-center gap-4 mb-10">
          <Link href="/dashboard" className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-md bg-[#4F46E5] text-white hover:bg-[#4338CA] transition-all shadow-sm group">
            Start Generating <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <button className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-md bg-white border border-border-strong text-text-primary hover:bg-gray-50 transition-all shadow-sm gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 2.532v18.936a1.5 1.5 0 0 0 2.25 1.299l15-8.468a1.5 1.5 0 0 0 0-2.598l-15-8.468A1.5 1.5 0 0 0 4 2.532z" />
            </svg>
            <div className="flex flex-col items-start leading-none text-left">
              <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mb-0.5">Get it on</span>
              <span className="text-sm font-extrabold tracking-tight">Google Play</span>
            </div>
          </button>
        </div>
        

      </div>

      <div className="relative h-[650px] w-full flex justify-center lg:justify-end items-center mt-12 lg:mt-0">
        {/* Phone Frame */}
        <div className="w-[320px] h-[650px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl relative z-10">
          {/* Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-30"></div>
          
          {/* Screen */}
          <div className="w-full h-full bg-slate-50 rounded-[2.5rem] overflow-hidden relative flex flex-col font-sans">
            
            {/* Status Bar */}
            <div className="h-12 w-full flex justify-between items-center px-6 pt-2 text-[10px] font-medium text-gray-800 z-20">
              <span>9:41</span>
              <div className="flex gap-1.5 items-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.5L1.5 8C4.5 4.5 8 3 12 3s7.5 1.5 10.5 5L12 21.5z"/></svg>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="7" width="20" height="10" rx="2"/><rect x="22" y="10" width="2" height="4"/></svg>
              </div>
            </div>

            {/* Scrollable Content (Chat UI) */}
            <div className="flex-1 p-4 pb-20 overflow-y-auto bg-bg-secondary flex flex-col gap-4 relative">
              
              {/* User Message */}
              <div key={`user-${activeIndex}`} className="flex gap-3 justify-end mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-text-primary text-bg-primary px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-sm text-xs max-w-[85%] leading-relaxed">
                  {currentScreen.userMsg}
                </div>
                <div className="w-6 h-6 rounded-full bg-border-strong text-text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px] shadow-sm">
                  U
                </div>
              </div>

              {/* Assistant Message */}
              <div key={`assistant-${activeIndex}`} className="flex gap-3 justify-start">
                <div className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                </div>
                <div className="w-full max-w-[85%]">
                  {currentScreen.assistantUI}
                </div>
              </div>

            </div>
            
            {/* Bottom Input Area */}
            <div className="absolute bottom-0 left-0 w-full h-16 bg-white border-t border-border-subtle flex justify-between items-center px-4 gap-2">
               <div className="flex-1 h-10 bg-gray-100 rounded-full flex items-center px-4">
                 <span className="text-xs text-text-muted">Ask follow-up...</span>
               </div>
               <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white shrink-0 shadow-sm">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
               </div>
            </div>
          </div>
        </div>
        

      </div>
    </section>
  );
}
