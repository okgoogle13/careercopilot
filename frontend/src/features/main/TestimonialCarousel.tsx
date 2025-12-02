/**
 * ELECTRIC ALCHEMIST: TESTIMONIAL CAROUSEL COMPONENT
 *
 * Testimonial carousel using Electric Alchemist Design System v4.4.
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Card, Button } from '@/components';
import { cn } from '@/lib/utils';

// Simple Star component
function Star({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      'CareerCopilot transformed my job search. The AI-generated cover letters were so personalized and compelling that I landed interviews at all my target companies.',
    author: 'Sarah Chen',
    role: 'Software Engineer',
    company: 'Google',
    rating: 5,
  },
  {
    id: 2,
    quote:
      'The resume optimization feature is incredible. It helped me highlight my skills in ways I never thought of, and I got my dream job within two weeks.',
    author: 'Marcus Johnson',
    role: 'Product Manager',
    company: 'Microsoft',
    rating: 5,
  },
  {
    id: 3,
    quote:
      'I was struggling with interview prep until I found CareerCopilot. The AI feedback on my practice responses boosted my confidence tremendously.',
    author: 'Emily Rodriguez',
    role: 'UX Designer',
    company: 'Apple',
    rating: 5,
  },
  {
    id: 4,
    quote:
      'The application tracking feature kept me organized throughout my job search. I could see exactly where I stood with each opportunity.',
    author: 'David Kim',
    role: 'Data Scientist',
    company: 'Netflix',
    rating: 4,
  },
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="py-12">
      <h2 className="text-hero text-3xl font-bold text-center mb-12">
        What Our Users Say
      </h2>

      <div className="max-w-4xl mx-auto">
        <Card variant="default" className="p-8">
          <div className="text-center">
            {/* Quote Icon */}
            <div className="flex justify-center mb-6">
              <Quote className="h-12 w-12 text-primary" />
            </div>

            {/* Testimonial Quote */}
            <p className="text-hero text-lg md:text-xl font-medium mb-6 italic">
              "{currentTestimonial.quote}"
            </p>

            {/* Rating */}
            <div className="flex justify-center mb-4 gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-4 w-4',
                    i < currentTestimonial.rating
                      ? 'text-primary fill-primary'
                      : 'text-outline-variant'
                  )}
                />
              ))}
            </div>

            {/* Author Info */}
            <div>
              <h3 className="text-hero text-lg font-semibold">{currentTestimonial.author}</h3>
              <p className="text-human text-sm text-on-surface-variant">
                {currentTestimonial.role} at {currentTestimonial.company}
              </p>
            </div>
          </div>
        </Card>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center mt-8 gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={prevTestimonial}
            className="p-2"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-outline-variant hover:bg-outline'
                )}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextTestimonial}
            className="p-2"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCarousel;

