import { ChevronLeft, ChevronRight, FormatQuote } from '@mui/icons-material';
import { Box } from '@mui/material';
import { Card, CardContent, Typography, Box, IconButton, Rating } from '@mui/material';
import React, { useState } from 'react';

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
    <Box sx={{
      py: 12
    }}>
      <Typography variant="h3" sx={{
      typography: "h3",
      fontWeight: 700,
      textAlign: "center",
      mb: 12
    }}>
        What Our Users Say
      </Typography>

      <Box sx={{}}>
        <Card sx={{
      p: 8,}}>
          <CardContent sx={{
      textAlign: "center"
    }}>
            {/* Quote Icon */}
            <Box sx={{
      display: "flex",
      justifyContent: "center",
      mb: 6
    }}>
              <FormatQuote sx={{ fontSize: 48 }} sx={{}} />
            </Box>

            {/* Testimonial Quote */}
            <Typography
              variant="h6"
              sx={{
      typography: "h6",
      [theme.breakpoints.up('sm')]: { typography: "h5" },
      fontWeight: 500,
      mb: 6,
      fontStyle: "italic",}}
            >
              "{currentTestimonial.quote}"
            </Typography>

            {/* Rating */}
            <Box sx={{
      display: "flex",
      justifyContent: "center",
      mb: 4
    }}>
              <Rating value={currentTestimonial.rating} readOnly size="small" />
            </Box>

            {/* Author Info */}
            <Box>
              <Typography variant="h6" sx={{
      fontWeight: 600,}}>
                {currentTestimonial.author}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentTestimonial.role} at {currentTestimonial.company}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        <Box sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      mt: 8,
      gap: 4
    }}>
          <IconButton
            onClick={prevTestimonial}
            sx={{
      border: 1,
      borderColor: "gray.300",
      '&:hover': {}
    }}
            aria-label="Previous testimonial"
          >
            <ChevronLeft sx={{ fontSize: 20 }} />
          </IconButton>

          {/* Dots Indicator */}
          <Box sx={{
      display: "flex",
      gap: 2
    }}>
            {testimonials.map((_, index) => (
              <Box
                key={index}
                sx={{
      borderRadius: "var(--sys-shape-radius-full)",
      cursor: "pointer",}}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </Box>

          <IconButton
            onClick={nextTestimonial}
            sx={{
      border: 1,
      borderColor: "gray.300",
      '&:hover': {}
    }}
            aria-label="Next testimonial"
          >
            <ChevronRight sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
