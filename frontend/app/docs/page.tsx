import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function Documentation() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-24 flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-64 shrink-0 border-r border-border-subtle pr-6">
          <h2 className="font-bold text-lg text-text-primary mb-4">Contents</h2>
          <nav className="flex flex-col gap-3 text-sm text-text-secondary">
            <a href="#getting-started" className="hover:text-brand transition-colors">Getting Started</a>
            <a href="#generating-mcqs" className="hover:text-brand transition-colors">Generating MCQs</a>
            <a href="#study-notes" className="hover:text-brand transition-colors">Creating Study Notes</a>
            <a href="#qna" className="hover:text-brand transition-colors">Using Q&A</a>
            <a href="#ai-tutor" className="hover:text-brand transition-colors">Chat with AI Tutor</a>
          </nav>
        </aside>
        
        <div className="flex-1 prose prose-slate max-w-none text-text-secondary">
          <h1 className="text-4xl font-bold text-text-primary mb-8 tracking-tight">Documentation</h1>
          <p className="text-lg mb-12">Welcome to the Prepiqo documentation! Here you will find everything you need to know about using our AI-powered study tools.</p>

          <section id="getting-started" className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Getting Started</h2>
            <p className="mb-4">To get started, you need to create an account and log into your dashboard. Once logged in, you will see your study overview and access to the various AI generation modes.</p>
          </section>

          <section id="generating-mcqs" className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Generating MCQs</h2>
            <p className="mb-4">Multiple Choice Questions (MCQs) are a great way to test your knowledge.</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Select the "Generate MCQs" option from your dashboard.</li>
              <li>Enter the topic, subject, or paste a block of text you want to be quizzed on.</li>
              <li>Select the difficulty level and the number of questions.</li>
              <li>Click "Generate" and wait a few seconds for your custom quiz to be created.</li>
            </ol>
          </section>

          <section id="study-notes" className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Creating Study Notes</h2>
            <p className="mb-4">Need a quick summary of a complex topic?</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Navigate to the "Study Notes" tool.</li>
              <li>Provide a topic or syllabus point.</li>
              <li>The AI will generate structured, easy-to-read notes with key definitions and concepts highlighted.</li>
            </ul>
          </section>

          <section id="qna" className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Using Q&A (Flashcards)</h2>
            <p className="mb-4">Generate direct question and answer pairs perfect for active recall and flashcard studying. Simply input your topic and the AI will generate the most important questions and concise answers.</p>
          </section>

          <section id="ai-tutor" className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Chat with AI Tutor</h2>
            <p className="mb-4">If you're stuck on a specific concept, you can switch to the normal chat mode. This acts as your personal tutor. Ask it to explain things simply, provide analogies, or break down difficult problems step-by-step.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
