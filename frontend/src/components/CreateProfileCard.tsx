import { Plus } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";

interface CreateProfileCardProps {
  onCreate: () => void;
}

export function CreateProfileCard({ onCreate }: CreateProfileCardProps) {
  return (
    <Card className="bg-card border-border p-6 flex flex-col items-center justify-center text-center space-y-4 h-full">
      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
        <Plus className="w-6 h-6 text-primary-foreground" />
      </div>
      
      <div>
        <h3 className="font-medium text-card-foreground mb-2">Create New Profile</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Build a tailored profile to optimize your resume for specific job applications and track your progress.
        </p>
      </div>

      <Button 
        onClick={onCreate}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Profile
      </Button>
    </Card>
  );
}