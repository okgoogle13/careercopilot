import { Edit3, Trash2 } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface ProfileCardProps {
  name: string;
  role: string;
  activeApplications: number;
  atsScore: number;
  lastUpdated: string;
  avatarColor: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProfileCard({
  name,
  role,
  activeApplications,
  atsScore,
  lastUpdated,
  avatarColor,
  onEdit,
  onDelete,
}: ProfileCardProps) {
  return (
    <Card className="bg-card border-border p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12">
          <AvatarFallback 
            className="text-black font-medium"
            style={{ backgroundColor: avatarColor }}
          >
            {name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-card-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Active Applications:</span>
          <span className="font-medium text-card-foreground">{activeApplications}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">ATS Score Average:</span>
          <span className="font-medium text-primary">{atsScore}%</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Last Updated:</span>
          <span className="text-sm text-muted-foreground">{lastUpdated}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-muted-foreground hover:text-card-foreground"
          onClick={onEdit}
        >
          <Edit3 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}