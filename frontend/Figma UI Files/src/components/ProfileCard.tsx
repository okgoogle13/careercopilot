import { Edit3, Trash2, Target, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface ProfileCardProps {
  name: string;
  role: string;
  activeApplications: number;
  atsScore: number;
  lastUpdated: string;
  avatarColor: string;
  onEdit: () => void;
  onDelete: () => void;
  isSelected?: boolean;
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
  isSelected = false,
}: ProfileCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-brand-lime';
    if (score >= 70) return 'text-brand-yellow';
    return 'text-brand-red';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return 'bg-brand-lime/10 text-brand-lime border-brand-lime/20';
    if (score >= 70) return 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20';
    return 'bg-brand-red/10 text-brand-red border-brand-red/20';
  };

  return (
    <Card
      className={`card-aurora glass p-6 space-y-4 transition-all duration-300 ${isSelected ? 'border-brand-primary/40' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 ring-2 ring-primary/30 transition-transform duration-300 hover:scale-110">
            <AvatarFallback
              className="text-black font-medium"
              style={{ backgroundColor: avatarColor }}
            >
              {name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>

        <Badge
          className={`${getScoreBadgeColor(atsScore)} border transition-transform duration-300 hover:scale-105`}
        >
          {atsScore}%
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">ATS Score</span>
            <span className={`font-semibold ${getScoreColor(atsScore)}`}>{atsScore}%</span>
          </div>
          <Progress value={atsScore} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-3 h-3 text-brand-primary icon-interactive" />
              <span className="text-xs text-muted-foreground">Applications</span>
            </div>
            <p className="font-semibold text-brand-primary">{activeApplications}</p>
          </div>

          <div className="text-center p-3 bg-secondary/5 rounded-lg border border-secondary/10">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-brand-secondary icon-interactive" />
              <span className="text-xs text-muted-foreground">Potential</span>
            </div>
            <p className="font-semibold text-brand-secondary">High</p>
          </div>
        </div>

        <div className="text-center">
          <span className="text-xs text-muted-foreground">Updated {lastUpdated}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-muted-foreground hover:text-brand-primary hover:bg-primary/10"
          onClick={onEdit}
        >
          <Edit3 className="w-4 h-4 mr-2 icon-interactive" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-muted-foreground hover:text-error hover:bg-error/10"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 mr-2 icon-interactive" />
          Delete
        </Button>
      </div>
    </Card>
  );
}
