import React from 'react';

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 border-t border-border-subtle">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-text-secondary max-w-[600px] mx-auto text-sm md:text-base">Got questions? We've got answers.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div>
          <h4 className="font-bold mb-2">Can I try it without signing up?</h4>
          <p className="text-sm text-text-secondary leading-relaxed">Yes! You can jump straight into the dashboard and generate up to 5 requests completely free without creating an account. After that, you can sign up to get 15 more free requests.</p>
        </div>
        <div>
          <h4 className="font-bold mb-2">Can I export the questions or notes?</h4>
          <p className="text-sm text-text-secondary leading-relaxed">Absolutely! Every generated MCQ, Note, or Q&A can be instantly downloaded as a beautifully formatted PDF document for offline study.</p>
        </div>
        <div>
          <h4 className="font-bold mb-2">What subjects does the AI support?</h4>
          <p className="text-sm text-text-secondary leading-relaxed">Our AI is trained on a vast corpus of knowledge and supports virtually any academic or professional subject, from History to Advanced Cloud Engineering.</p>
        </div>
        <div>
          <h4 className="font-bold mb-2">How do public share links work?</h4>
          <p className="text-sm text-text-secondary leading-relaxed">When you click "Share" on a history item, the app generates a unique URL. Anyone with that URL can view a read-only version of your generated content, even if they don't have an account.</p>
        </div>
      </div>
    </section>
  );
}
