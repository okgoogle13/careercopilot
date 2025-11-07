import { Plus, Sparkles, FileText } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface CreateProfileCardProps {
  onCreate: () => void;
}

export function CreateProfileCard({ onCreate }: CreateProfileCardProps) {
  return (
    <Card
      className="card-aurora glass p-6 flex flex-col items-center justify-center text-center space-y-6 h-full transition-all duration-300 group cursor-pointer"
      onClick={onCreate}
    >
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-primary/30 to-tertiary/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 icon-interactive">
          <Plus className="w-8 h-8 text-brand-primary" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-primary to-tertiary rounded-full flex items-center justify-center pulse-ai">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-foreground text-lg">Create New Document</h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
          Build AI-optimized resumes and cover letters that get you noticed by employers and pass
          ATS systems.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <FileText className="w-3 h-3" />
        <span>Resume & Cover Letters</span>
      </div>

      <Button
        className="btn-primary-cta px-6 py-2 group-hover:scale-105 transition-transform duration-300"
        onClick={(e) => {
          e.stopPropagation();
          onCreate();
        }}
      >
        <Plus className="w-4 h-4 mr-2 text-white" />
        Get Started
      </Button>
    </Card>
  );
}
