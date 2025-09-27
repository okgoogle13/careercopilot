import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton, Rating } from '@mui/material';
import { ChevronLeft, ChevronRight, FormatQuote } from '@mui/icons-material';

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
    <Box className="max-w-4xl mx-auto py-12">
      <Typography variant="h3" className="text-3xl font-bold text-center mb-12">
        What Our Users Say
      </Typography>

      <Box className="relative">
        <Card className="p-8 bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="text-center">
            {/* Quote Icon */}
            <Box className="flex justify-center mb-6">
              <FormatQuote sx={{ fontSize: 48 }} className="text-primary/30" />
            </Box>

            {/* Testimonial Quote */}
            <Typography
              variant="h6"
              className="text-lg md:text-xl font-medium mb-6 text-gray-800 italic leading-relaxed"
            >
              "{currentTestimonial.quote}"
            </Typography>

            {/* Rating */}
            <Box className="flex justify-center mb-4">
              <Rating value={currentTestimonial.rating} readOnly size="small" />
            </Box>

            {/* Author Info */}
            <Box>
              <Typography variant="h6" className="font-semibold text-gray-900">
                {currentTestimonial.author}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentTestimonial.role} at {currentTestimonial.company}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        <Box className="flex justify-center items-center mt-8 gap-4">
          <IconButton
            onClick={prevTestimonial}
            className="border border-gray-300 hover:bg-primary/10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft sx={{ fontSize: 20 }} />
          </IconButton>

          {/* Dots Indicator */}
          <Box className="flex gap-2">
            {testimonials.map((_, index) => (
              <Box
                key={index}
                className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </Box>

          <IconButton
            onClick={nextTestimonial}
            className="border border-gray-300 hover:bg-primary/10"
            aria-label="Next testimonial"
          >
            <ChevronRight sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
