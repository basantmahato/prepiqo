import React from 'react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      quote: "Prepiqo completely changed how I study for my medical exams. Generating MCQs from my dense lecture notes saves me hours every single week.",
      author: "Sarah J.",
      role: "Medical Student",
      avatar: "SJ"
    },
    {
      id: 2,
      quote: "The ability to ask the AI tutor to explain why my answer was wrong is invaluable. It's like having a 24/7 professor sitting next to me.",
      author: "David L.",
      role: "Computer Science Major",
      avatar: "DL"
    },
    {
      id: 3,
      quote: "I use the flashcard generator right before tests. The export to PDF feature means I can study on the bus without draining my battery or using data.",
      author: "Priya M.",
      role: "High School Senior",
      avatar: "PM"
    }
  ];

  return (
    <section id="testimonials" className="py-24 border-t border-border-subtle bg-white">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Students Everywhere</h2>
        <p className="text-text-secondary max-w-[600px] mx-auto text-sm md:text-base">Don't just take our word for it. Join thousands of learners achieving top grades.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-gray-50 rounded-2xl p-8 border border-border-subtle flex flex-col justify-between">
            <div className="mb-6">
              {/* Stars */}
              <div className="flex text-yellow-400 mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-text-primary text-sm leading-relaxed italic">"{testimonial.quote}"</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-bold text-lg">
                {testimonial.avatar}
              </div>
              <div>
                <p className="font-bold text-text-primary text-sm">{testimonial.author}</p>
                <p className="text-text-secondary text-xs">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
