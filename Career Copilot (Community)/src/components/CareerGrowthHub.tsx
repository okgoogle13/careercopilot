import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Sparkles, Target, TrendingUp, MessageSquare, ArrowRight } from "lucide-react";

interface CareerGrowthHubProps {
  onNavigate: (feature: "job-matching" | "career-intelligence" | "interview-prep") => void;
  onBack: () => void;
}

export function CareerGrowthHub({ onNavigate, onBack }: CareerGrowthHubProps) {
  const features = [
    {
      id: "job-matching" as const,
      title: "AI Job Matching",
      description:
        "Find roles that perfectly match your skills and experience using advanced AI analysis.",
      icon: Target,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      benefits: ["Personalized job recommendations", "Skill gap analysis", "Salary insights"],
    },
    {
      id: "career-intelligence" as const,
      title: "Career Intelligence",
      description:
        "Get data-driven insights about your career trajectory and growth opportunities.",
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      benefits: ["Career path analysis", "Market trend insights", "Skill demand forecasting"],
    },
    {
      id: "interview-prep" as const,
      title: "Interview Preparation",
      description: "Practice with AI-powered mock interviews tailored to your target roles.",
      icon: MessageSquare,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      benefits: [
        "Behavioral question practice",
        "Industry-specific scenarios",
        "Personalized feedback",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-semibold">Career Growth Hub</h1>
          </div>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
            Leverage AI to supercharge your career growth with personalized insights, job matching,
            and interview preparation.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                className={`p-8 border-2 ${feature.borderColor} hover:border-primary cursor-pointer transition-all duration-300 hover:shadow-xl group relative overflow-hidden`}
                onClick={() => onNavigate(feature.id)}
              >
                {/* Gemini AI Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary/10 text-primary border-primary/30">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Powered
                  </Badge>
                </div>

                <div className="space-y-6">
                  <div
                    className={`p-4 ${feature.bgColor} rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      Key Features
                    </h4>
                    <ul className="space-y-1">
                      {feature.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90 group-hover:bg-primary/90"
                    size="lg"
                  >
                    Explore {feature.title}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <Card className="p-8 bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Powered by Advanced AI</h3>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our career growth tools are powered by cutting-edge AI technology that analyzes market
              trends, job requirements, and your unique profile to provide personalized career
              guidance.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <Badge variant="secondary">Machine Learning</Badge>
              <Badge variant="secondary">Natural Language Processing</Badge>
              <Badge variant="secondary">Real-time Data Analysis</Badge>
              <Badge variant="secondary">Personalized Recommendations</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
