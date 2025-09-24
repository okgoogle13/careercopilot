import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { FileText, Mail, Award, ArrowLeft } from "lucide-react";

interface DocumentTypeSelectorProps {
  onSelectType: (type: "resume" | "cover-letter" | "selection-criteria") => void;
  onBack: () => void;
}

export function DocumentTypeSelector({ onSelectType, onBack }: DocumentTypeSelectorProps) {
  const documentTypes = [
    {
      id: "resume" as const,
      title: "Resume",
      description: "Create a professional resume tailored to your target role",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "cover-letter" as const,
      title: "Cover Letter",
      description: "Write a compelling cover letter that highlights your fit",
      icon: Mail,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      id: "selection-criteria" as const,
      title: "Selection Criteria Response",
      description: "Address key selection criteria with detailed examples",
      icon: Award,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold mb-4">What would you like to create?</h1>
          <p className="text-muted-foreground text-lg">
            Choose a document type to begin your AI-powered creation process.
          </p>
        </div>

        {/* Document Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {documentTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card
                key={type.id}
                className="p-8 border-2 border-border hover:border-primary cursor-pointer transition-all duration-200 hover:shadow-lg group"
                onClick={() => onSelectType(type.id)}
              >
                <div className="text-center space-y-4">
                  <div
                    className={`p-4 ${type.bgColor} rounded-2xl w-fit mx-auto group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className={`w-8 h-8 ${type.color}`} />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {type.description}
                    </p>
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90 group-hover:bg-primary/90"
                    size="lg"
                  >
                    Create {type.title}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            All documents will be optimized for ATS systems and tailored to your target role
          </p>
        </div>
      </div>
    </div>
  );
}
