'use client';

import React, { useState } from 'react';

interface MCQ {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export default function InteractiveMCQ({ mcq, index }: { mcq: MCQ, index: number }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const hasAnswered = selectedOption !== null;

  return (
    <div className="bg-white border border-border-subtle rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] pdf-avoid-break">
      <div className="p-5 md:p-6">
        <h3 className="font-semibold text-lg mb-4 flex gap-3 text-text-primary leading-snug">
          <span className="text-text-secondary shrink-0">{index + 1}.</span> 
          {mcq.question}
        </h3>
        
        <div className="space-y-2 ml-7 md:ml-8">
          {mcq.options.map((option, optIdx) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === mcq.answer;
            
            let optionStyles = 'border-border-subtle bg-white text-text-secondary hover:border-brand/50 hover:bg-gray-50 cursor-pointer';
            let circleStyles = 'border-border-strong';
            
            if (hasAnswered) {
              optionStyles = 'border-border-subtle bg-white text-text-secondary opacity-60 cursor-default';
              
              if (isCorrect) {
                optionStyles = 'border-green-500 bg-green-50 text-green-900 font-medium cursor-default';
                circleStyles = 'border-green-500 bg-green-500';
              } else if (isSelected && !isCorrect) {
                optionStyles = 'border-red-500 bg-red-50 text-red-900 font-medium cursor-default';
                circleStyles = 'border-red-500 bg-red-500';
              }
            }

            return (
              <button 
                key={optIdx} 
                onClick={() => !hasAnswered && setSelectedOption(option)}
                disabled={hasAnswered}
                className={`w-full text-left p-3.5 rounded-lg border text-sm flex items-start gap-3 transition-colors ${optionStyles}`}
              >
                <div className={`mt-0.5 w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${circleStyles}`}>
                  {(isCorrect && hasAnswered) && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                  {(isSelected && !isCorrect && hasAnswered) && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
                <span className="leading-relaxed">{option}</span>
              </button>
            );
          })}
        </div>
        
        {hasAnswered && (
          <div className="mt-6 ml-7 md:ml-8 p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-900 animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="font-bold flex items-center gap-2 mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              Explanation
            </span>
            <p className="leading-relaxed">{mcq.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
