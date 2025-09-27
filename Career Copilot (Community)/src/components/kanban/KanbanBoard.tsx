import React, { useState, useRef } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar } from "../ui/avatar";
import {
  Plus,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  MoreVertical,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface ApplicationCard {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  salary?: string;
  appliedDate: string;
  status: "applied" | "interviewing" | "offer" | "rejected";
  priority: "low" | "medium" | "high";
  logo?: string;
  notes?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  status: ApplicationCard["status"];
  cards: ApplicationCard[];
  color: string;
  icon: React.ComponentType<any>;
}

const mockApplications: ApplicationCard[] = [
  {
    id: "1",
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary: "$120k - $150k",
    appliedDate: "2024-01-15",
    status: "applied",
    priority: "high",
  },
  {
    id: "2",
    jobTitle: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Remote",
    salary: "$100k - $130k",
    appliedDate: "2024-01-12",
    status: "interviewing",
    priority: "high",
  },
  {
    id: "3",
    jobTitle: "UI/UX Developer",
    company: "DesignCo",
    location: "New York, NY",
    salary: "$90k - $110k",
    appliedDate: "2024-01-10",
    status: "offer",
    priority: "medium",
  },
  {
    id: "4",
    jobTitle: "React Developer",
    company: "WebAgency",
    location: "Austin, TX",
    salary: "$85k - $105k",
    appliedDate: "2024-01-08",
    status: "rejected",
    priority: "low",
  },
];

const ApplicationCardComponent: React.FC<{
  card: ApplicationCard;
  onDragStart: (e: React.DragEvent, cardId: string) => void;
  isDragging?: boolean;
}> = ({ card, onDragStart, isDragging = false }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-brand-tertiary text-brand-on-tertiary";
      case "medium":
        return "bg-brand-primary text-brand-on-primary";
      case "low":
        return "bg-brand-secondary text-brand-on-secondary";
      default:
        return "bg-surface-container text-on-surface";
    }
  };

  const getCompanyAvatar = (company: string) => {
    return company.charAt(0).toUpperCase();
  };

  return (
    <Card
      className={`
        p-4 cursor-grab active:cursor-grabbing transition-all duration-300
        card-aurora hover:card-aurora
        ${isDragging ? "opacity-50 rotate-2 scale-105" : ""}
      `}
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="w-10 h-10 bg-surface-container-high">
              <div className="w-full h-full flex items-center justify-center text-sm font-medium text-on-surface">
                {getCompanyAvatar(card.company)}
              </div>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-on-surface truncate mb-1">{card.jobTitle}</h3>
              <p className="text-sm text-on-surface-variant flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {card.company}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm text-on-surface-variant">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{card.location}</span>
          </div>
          {card.salary && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-3 h-3" />
              <span>{card.salary}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>Applied {new Date(card.appliedDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <Badge variant="secondary" className={`text-xs ${getPriorityColor(card.priority)}`}>
            {card.priority.toUpperCase()} PRIORITY
          </Badge>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-brand-primary opacity-60"></div>
            <div className="w-2 h-2 rounded-full bg-brand-tertiary opacity-40"></div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const KanbanColumn: React.FC<{
  column: KanbanColumn;
  onAddCard: (columnId: string) => void;
  onCardDrop: (e: React.DragEvent, columnId: string) => void;
  draggedCard: string | null;
}> = ({ column, onAddCard, onCardDrop, draggedCard }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onCardDrop(e, column.id);
  };

  const IconComponent = column.icon;

  return (
    <div className="flex flex-col h-full min-w-80">
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 bg-surface-container border border-outline-variant rounded-lg mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${column.color}`}>
            <IconComponent className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-on-surface">{column.title}</h3>
            <p className="text-sm text-on-surface-variant">
              {column.cards.length} application{column.cards.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddCard(column.id)}
          className="h-8 w-8 p-0 hover:bg-surface-container-high"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Drop Zone */}
      <div
        className={`
          flex-1 p-2 rounded-lg border-2 border-dashed transition-all duration-200
          ${
            isDragOver
              ? "border-brand-primary bg-brand-primary/10"
              : "border-outline-variant bg-surface-container-lowest/50"
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-3">
          {column.cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IconComponent className="w-12 h-12 text-on-surface-variant/40 mb-3" />
              <p className="text-sm text-on-surface-variant mb-2">No applications</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddCard(column.id)}
                className="btn-gradient text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Application
              </Button>
            </div>
          ) : (
            column.cards.map((card) => (
              <ApplicationCardComponent
                key={card.id}
                card={card}
                onDragStart={(e, cardId) => {
                  e.dataTransfer.setData("text/plain", cardId);
                }}
                isDragging={draggedCard === card.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

interface KanbanBoardProps {
  onBack?: () => void;
  className?: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onBack, className = "" }) => {
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: "applied",
      title: "Applied",
      status: "applied",
      cards: mockApplications.filter((app) => app.status === "applied"),
      color: "bg-brand-secondary",
      icon: Briefcase,
    },
    {
      id: "interviewing",
      title: "Interviewing",
      status: "interviewing",
      cards: mockApplications.filter((app) => app.status === "interviewing"),
      color: "bg-brand-primary",
      icon: Clock,
    },
    {
      id: "offer",
      title: "Offer",
      status: "offer",
      cards: mockApplications.filter((app) => app.status === "offer"),
      color: "bg-aurora-tertiary",
      icon: CheckCircle,
    },
    {
      id: "rejected",
      title: "Rejected",
      status: "rejected",
      cards: mockApplications.filter((app) => app.status === "rejected"),
      color: "bg-brand-error",
      icon: XCircle,
    },
  ]);

  const handleCardDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("text/plain");

    if (!cardId) return;

    setColumns((prev) => {
      const newColumns = [...prev];

      // Find and remove card from source column
      let cardToMove: ApplicationCard | null = null;
      newColumns.forEach((column) => {
        const cardIndex = column.cards.findIndex((card) => card.id === cardId);
        if (cardIndex !== -1) {
          cardToMove = column.cards.splice(cardIndex, 1)[0];
        }
      });

      // Add card to target column with updated status
      if (cardToMove) {
        const targetColumn = newColumns.find((col) => col.id === columnId);
        if (targetColumn) {
          cardToMove.status = targetColumn.status;
          targetColumn.cards.push(cardToMove);
        }
      }

      return newColumns;
    });

    setDraggedCard(null);
  };

  const handleAddCard = (columnId: string) => {
    console.log(`Add card to column: ${columnId}`);
    // This would typically open a modal or navigate to an add form
  };

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCard(cardId);
  };

  const totalApplications = columns.reduce((sum, col) => sum + col.cards.length, 0);

  return (
    <div className={`min-h-screen bg-surface ${className}`}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface/80 backdrop-blur-lg border-b border-outline-variant">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-medium text-on-surface mb-2">Application Tracker</h1>
              <p className="text-on-surface-variant">
                Manage your job applications across different stages
              </p>
            </div>
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                Back to Dashboard
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-brand-primary"></div>
              <span className="text-on-surface-variant">
                {totalApplications} Total Applications
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="w-3 h-3 text-brand-tertiary" />
              <span className="text-on-surface-variant">
                {columns.find((col) => col.id === "interviewing")?.cards.length || 0} Active
                Interviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="p-6">
        <div className="flex gap-6 overflow-x-auto pb-6">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddCard={handleAddCard}
              onCardDrop={handleCardDrop}
              draggedCard={draggedCard}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
