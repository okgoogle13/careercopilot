import React from "react";
import { Zap, Target, Brain, Shield, Sparkles, TrendingUp } from "lucide-react";
import { M3Card, M3CardHeader, M3CardTitle, M3CardDescription, M3CardContent } from "../ui/m3-card";
import { Badge } from "../ui/badge";

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "AI-Powered Resume Builder",
    description:
      "Create ATS-optimized resumes with intelligent content suggestions and real-time scoring.",
    badge: "✨ AI",
    gradient: "from-primary to-primary-container",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Smart Job Matching",
    description:
      "Get personalized job recommendations based on your skills, experience, and career goals.",
    badge: "🎯 Smart",
    gradient: "from-secondary to-secondary-container",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Interview Preparation",
    description:
      "Practice with AI-generated questions tailored to your industry and specific job roles.",
    badge: "🧠 Adaptive",
    gradient: "from-tertiary to-tertiary-container",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "ATS Optimization",
    description:
      "Ensure your resume passes through Applicant Tracking Systems with our advanced analysis.",
    badge: "🛡️ Secure",
    gradient: "from-primary to-secondary",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Professional Templates",
    description:
      "Choose from expertly designed templates that highlight your unique strengths and experience.",
    badge: "✨ Design",
    gradient: "from-secondary to-tertiary",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Career Intelligence",
    description:
      "Track your application progress and receive insights to improve your job search strategy.",
    badge: "📈 Growth",
    gradient: "from-tertiary to-primary",
  },
];

interface FeatureHighlightsProps {
  className?: string;
}

export function FeatureHighlights({ className }: FeatureHighlightsProps) {
  return (
    <div className={className}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-foreground mb-4">
          Supercharge Your Career Journey
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your job search with AI-powered tools designed to help you land your dream role
          faster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <M3Card
            key={index}
            variant="interactive"
            className="group transition-all duration-300 hover:scale-105"
          >
            <M3CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`
                  flex items-center justify-center w-12 h-12 rounded-xl
                  bg-gradient-to-br ${feature.gradient}
                  text-white shadow-lg group-hover:shadow-xl
                  transition-all duration-300
                `}
                >
                  {feature.icon}
                </div>
                <Badge
                  variant="secondary"
                  className="bg-surface-container-high text-on-surface text-xs px-2 py-1"
                >
                  {feature.badge}
                </Badge>
              </div>
              <M3CardTitle className="text-lg mb-2">{feature.title}</M3CardTitle>
              <M3CardDescription className="text-sm leading-relaxed">
                {feature.description}
              </M3CardDescription>
            </M3CardHeader>
          </M3Card>
        ))}
      </div>

      {/* Statistics Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="text-3xl font-semibold text-primary mb-2">94%</div>
          <p className="text-sm text-muted-foreground">Resume improvement rate</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-semibold text-secondary mb-2">3.2x</div>
          <p className="text-sm text-muted-foreground">Faster job matching</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-semibold text-tertiary mb-2">85%</div>
          <p className="text-sm text-muted-foreground">Interview success rate</p>
        </div>
      </div>
    </div>
  );
}
