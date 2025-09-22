import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { M3Card, M3CardContent } from '../ui/m3-card';
import { M3Button } from '../ui/m3-button';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';

const testimonials = [
  {
    id: 1,
    content: "FML Career Copilot transformed my job search completely. The AI-powered resume optimization helped me get past ATS filters, and I landed 3 interviews in the first week!",
    author: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
    avatar: "SC",
    rating: 5,
    industry: "Tech",
    color: "bg-blue-500"
  },
  {
    id: 2,
    content: "The interview preparation feature was a game-changer. The AI-generated questions were spot-on for my industry, and I felt completely prepared for every interview.",
    author: "Marcus Rodriguez",
    role: "Product Manager",
    company: "Microsoft",
    avatar: "MR",
    rating: 5,
    industry: "Product",
    color: "bg-green-500"
  },
  {
    id: 3,
    content: "I was struggling to get responses to my applications. After using the ATS optimization tools, my response rate increased by 400%. Absolutely incredible!",
    author: "Priya Patel",
    role: "Data Scientist",
    company: "Netflix",
    avatar: "PP",
    rating: 5,
    industry: "Data",
    color: "bg-purple-500"
  },
  {
    id: 4,
    content: "The career intelligence insights helped me understand exactly what skills I needed to develop. I got promoted within 6 months of using the platform.",
    author: "Alex Thompson",
    role: "UX Designer",
    company: "Airbnb",
    avatar: "AT",
    rating: 5,
    industry: "Design",
    color: "bg-pink-500"
  },
  {
    id: 5,
    content: "As a career changer, I was lost. The personalized job matching and career coaching features gave me the confidence and direction I needed to land my dream role.",
    author: "Jennifer Kim",
    role: "Marketing Manager",
    company: "Spotify",
    avatar: "JK",
    rating: 5,
    industry: "Marketing",
    color: "bg-yellow-500"
  }
];

interface TestimonialCarouselProps {
  className?: string;
  autoPlay?: boolean;
  interval?: number;
}

export function TestimonialCarousel({ 
  className, 
  autoPlay = true, 
  interval = 5000 
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (autoPlay && !isHovered) {
      const timer = setInterval(nextTestimonial, interval);
      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, isHovered]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div 
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-foreground mb-4">
          Loved by Professionals Worldwide
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of professionals who've accelerated their careers with our AI-powered platform.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Main Testimonial Card */}
        <M3Card variant="default" className="mb-8">
          <M3CardContent className="p-8 md:p-12">
            <div className="flex flex-col items-center text-center">
              {/* Quote Icon */}
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Quote className="w-8 h-8 text-primary" />
              </div>

              {/* Testimonial Content */}
              <blockquote className="text-lg md:text-xl text-foreground mb-6 leading-relaxed max-w-3xl">
                "{currentTestimonial.content}"
              </blockquote>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Author Info */}
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className={`
                    flex items-center justify-center w-12 h-12 rounded-full text-white font-semibold
                    ${currentTestimonial.color}
                  `}>
                    {currentTestimonial.avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground">
                      {currentTestimonial.author}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {currentTestimonial.role} at {currentTestimonial.company}
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  {currentTestimonial.industry}
                </Badge>
              </div>
            </div>
          </M3CardContent>
        </M3Card>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <M3Button
            variant="outlined"
            size="medium"
            onClick={prevTestimonial}
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </M3Button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${index === currentIndex 
                    ? 'bg-primary scale-125' 
                    : 'bg-outline-variant hover:bg-outline'
                  }
                `}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <M3Button
            variant="outlined"
            size="medium"
            onClick={nextTestimonial}
            trailingIcon={<ChevronRight className="w-4 h-4" />}
          >
            Next
          </M3Button>
        </div>

        {/* Thumbnail Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              onClick={() => goToTestimonial(index)}
              className={`
                p-4 rounded-lg border transition-all duration-300 text-left
                ${index === currentIndex
                  ? 'border-primary bg-primary/10'
                  : 'border-outline-variant hover:border-outline hover:bg-surface-container-high'
                }
              `}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-semibold
                  ${testimonial.color}
                `}>
                  {testimonial.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground truncate">
                    {testimonial.author}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {testimonial.company}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                "{testimonial.content.substring(0, 80)}..."
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground mb-4">Trusted by professionals at</p>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          {['Google', 'Microsoft', 'Netflix', 'Airbnb', 'Spotify', 'Amazon'].map((company) => (
            <div key={company} className="text-sm font-medium text-muted-foreground">
              {company}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}