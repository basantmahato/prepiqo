import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="pt-20 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-3xl -z-10 opacity-70"></div>

      <div>
        <div className="inline-flex items-center px-3 py-1 text-xs font-semibold text-brand bg-indigo-50 rounded-full mb-6">
          THE ULTIMATE AI STUDY COMPANION
        </div>
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
          <button className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-medium rounded-md bg-white border border-border-strong text-text-primary hover:bg-gray-50 transition-all shadow-sm gap-2">
            View Demo 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-800">JD</div>
            <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-xs font-bold text-green-800">SM</div>
            <div className="w-10 h-10 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-xs font-bold text-purple-800">AR</div>
          </div>
          <p className="text-xs text-text-secondary font-medium">Joined by 5,000+ students this month</p>
        </div>
      </div>

      <div className="relative h-[500px] w-full flex justify-end">
        <div className="w-[85%] h-full bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-border-subtle relative z-10 p-6 flex flex-col gap-4 overflow-hidden">
            {/* Mock UI in Hero */}
            <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
            <div className="w-full bg-white rounded-xl p-4 border border-indigo-100 shadow-sm relative">
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="h-4 bg-indigo-50 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                    <div className="p-3 rounded-lg border-2 border-green-500 bg-green-50 flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <div className="h-3 bg-green-200 rounded w-1/3"></div>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200 flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="absolute top-12 -right-8 bg-white rounded-xl shadow-lg border border-border-subtle p-4 flex items-center gap-4 z-20 animate-bounce [animation-duration:3s]">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <p className="text-xs text-text-secondary font-medium">Daily Goal</p>
            <p className="text-sm font-bold text-brand">Completed!</p>
          </div>
        </div>
      </div>
    </section>
  );
}
