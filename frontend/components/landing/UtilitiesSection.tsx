import React from 'react';

export default function UtilitiesSection() {
  return (
    <section id="utilities" className="py-24 border-t border-border-subtle">
      <div className="flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">Study on your own terms.</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Export to PDF</h4>
                <p className="text-text-secondary text-sm leading-relaxed">Take your study materials completely offline. Download perfectly formatted PDFs of your MCQs, Notes, and Q&As with a single click.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Share Publicly</h4>
                <p className="text-text-secondary text-sm leading-relaxed">Collaborating with a study group? Generate a secure public link to share your specific study notes or quizzes with classmates.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">No-Signup Free Trial</h4>
                <p className="text-text-secondary text-sm leading-relaxed">Experience the magic immediately. Generate up to 5 complete quizzes or notes absolutely free, without ever needing to create an account.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full relative">
          <div className="bg-white border border-border-subtle rounded-2xl shadow-xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500 z-10 relative">
            <div className="flex justify-between items-center mb-6 border-b border-border-subtle pb-4">
               <h3 className="font-bold">MCQs on Human Anatomy</h3>
               <div className="flex gap-2">
                  <div className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md">Share</div>
                  <div className="px-3 py-1 bg-indigo-50 text-brand text-xs font-bold rounded-md">PDF</div>
               </div>
            </div>
            <div className="space-y-4 opacity-70">
               <div className="h-4 bg-gray-200 rounded w-full"></div>
               <div className="h-4 bg-gray-200 rounded w-5/6"></div>
               <div className="h-10 border border-indigo-200 bg-indigo-50 rounded-lg w-full mt-4"></div>
               <div className="h-10 border border-gray-200 rounded-lg w-full"></div>
               <div className="h-10 border border-gray-200 rounded-lg w-full"></div>
            </div>
          </div>
          <div className="absolute top-10 -left-10 w-full h-full bg-indigo-50 rounded-2xl -z-10"></div>
        </div>
      </div>
    </section>
  );
}
