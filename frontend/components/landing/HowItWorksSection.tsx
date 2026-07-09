import React from 'react';

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 border-t border-border-subtle bg-gray-50/50">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How Prepiqo Works</h2>
        <p className="text-text-secondary max-w-[600px] mx-auto text-sm md:text-base">Go from a blank page to mastering a topic in three simple steps.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
        {/* Connecting Line (Hidden on Mobile) */}
        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-indigo-100 -z-10"></div>
        
        {/* Step 1 */}
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-indigo-100 flex items-center justify-center text-3xl font-extrabold text-brand mb-6 shadow-sm">
            1
          </div>
          <h3 className="text-xl font-bold mb-3">Provide a Topic</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Enter any subject you want to learn. Paste your syllabus, a Wikipedia link, or just type a concept like "Quantum Physics".
          </p>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-indigo-100 flex items-center justify-center text-3xl font-extrabold text-brand mb-6 shadow-sm">
            2
          </div>
          <h3 className="text-xl font-bold mb-3">AI Generates Content</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Prepiqo's AI instantly builds Interactive MCQs, comprehensive Study Notes, or Flashcards tailored to your exact prompt.
          </p>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-24 h-24 rounded-full bg-brand border-4 border-indigo-200 flex items-center justify-center text-3xl font-extrabold text-white mb-6 shadow-md transform hover:scale-110 transition-transform">
            3
          </div>
          <h3 className="text-xl font-bold mb-3">Learn & Export</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Take the quizzes, chat with the AI tutor for doubts, and export everything to a beautiful PDF for offline revision.
          </p>
        </div>
      </div>
    </section>
  );
}
