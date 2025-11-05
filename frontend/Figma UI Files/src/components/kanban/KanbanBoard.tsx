import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Chip,
  Avatar,
  IconButton,
  alpha,
} from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';
import {
  Add,
  Business,
  CalendarMonth,
  AttachMoney,
  LocationOn,
  MoreVert,
  Work,
  AccessTime,
  CheckCircle,
  Cancel,
  Warning,
} from '@mui/icons-material';

interface ApplicationCard {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  salary?: string;
  appliedDate: string;
  status: 'applied' | 'interviewing' | 'offer' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  logo?: string;
  notes?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  status: ApplicationCard['status'];
  cards: ApplicationCard[];
  color: string;
  icon: SvgIconComponent;
}

const mockApplications: ApplicationCard[] = [
  {
    id: '1',
    jobTitle: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary: '$120k - $150k',
    appliedDate: '2024-01-15',
    status: 'applied',
    priority: 'high',
  },
  {
    id: '2',
    jobTitle: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    salary: '$100k - $130k',
    appliedDate: '2024-01-12',
    status: 'interviewing',
    priority: 'high',
  },
  {
    id: '3',
    jobTitle: 'UI/UX Developer',
    company: 'DesignCo',
    location: 'New York, NY',
    salary: '$90k - $110k',
    appliedDate: '2024-01-10',
    status: 'offer',
    priority: 'medium',
  },
  {
    id: '4',
    jobTitle: 'React Developer',
    company: 'WebAgency',
    location: 'Austin, TX',
    salary: '$85k - $105k',
    appliedDate: '2024-01-08',
    status: 'rejected',
    priority: 'low',
  },
];

const ApplicationCardComponent: React.FC<{
  card: ApplicationCard;
  onDragStart: (e: React.DragEvent, cardId: string) => void;
  isDragging?: boolean;
  onClick?: () => void;
}> = ({ card, onDragStart, isDragging = false, onClick }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return { bgcolor: 'tertiary.main', color: 'white' };
      case 'medium':
        return { bgcolor: 'primary.main', color: 'white' };
      case 'low':
        return { bgcolor: 'secondary.main', color: 'white' };
      default:
        return { bgcolor: 'surface.container', color: 'text.primary' };
    }
  };

  const getCompanyAvatar = (company: string) => {
    return company.charAt(0).toUpperCase();
  };

  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
      onClick={onClick}
      sx={{
        p: 3,
        cursor: 'grab',
        transition: 'all 0.3s ease',
        borderRadius: 3,
        border: 2,
        borderColor: (theme) => alpha(theme.palette.primary.main, 0.1),
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'rotate(2deg) scale(1.05)' : 'none',
        '&:active': {
          cursor: 'grabbing',
        },
        '&:hover': {
          boxShadow: (theme) => theme.customShadows.glowAurora,
          transform: 'translateY(-4px)',
          borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flex: 1 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'surface.containerHigh',
                color: 'text.primary',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              {getCompanyAvatar(card.company)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 500,
                  mb: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {card.jobTitle}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Business sx={{ fontSize: 12, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {card.company}
                </Typography>
              </Box>
            </Box>
          </Box>
          <IconButton size="small" sx={{ flexShrink: 0 }}>
            <MoreVert sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Details */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LocationOn sx={{ fontSize: 12, color: 'text.secondary' }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {card.location}
            </Typography>
          </Box>
          {card.salary && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AttachMoney sx={{ fontSize: 12, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {card.salary}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CalendarMonth sx={{ fontSize: 12, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Applied {new Date(card.appliedDate).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: 1,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Chip
            label={`${card.priority.toUpperCase()} PRIORITY`}
            size="small"
            sx={{
              fontSize: '0.625rem',
              fontWeight: 600,
              height: 24,
              ...getPriorityColor(card.priority),
            }}
          />
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                opacity: 0.6,
              }}
            />
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'tertiary.main',
                opacity: 0.4,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

const KanbanColumn: React.FC<{
  column: KanbanColumn;
  onAddCard: (columnId: string) => void;
  onCardDrop: (e: React.DragEvent, columnId: string) => void;
  draggedCard: string | null;
  onCardClick?: (cardId: string) => void;
}> = ({ column, onAddCard, onCardDrop, draggedCard, onCardClick }) => {
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

  const getColumnColor = (color: string) => {
    const colorMap: Record<string, string> = {
      'bg-brand-secondary': 'secondary.main',
      'bg-brand-primary': 'primary.main',
      'bg-aurora-tertiary': 'tertiary.main',
      'bg-brand-error': 'error.main',
    };
    return colorMap[color] || 'primary.main';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: 320 }}>
      {/* Column Header */}
      <Card
        sx={{
          p: 2,
          mb: 3,
          bgcolor: 'surface.container',
          border: 1,
          borderColor: 'outline.variant',
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: getColumnColor(column.color),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconComponent sx={{ fontSize: 16, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {column.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {column.cards.length} application{column.cards.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={() => onAddCard(column.id)}>
            <Add sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Card>

      {/* Drop Zone */}
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          flex: 1,
          p: 1.5,
          borderRadius: 3,
          border: 2,
          borderStyle: 'dashed',
          borderColor: isDragOver ? 'primary.main' : 'outline.variant',
          bgcolor: isDragOver
            ? (theme) => alpha(theme.palette.primary.main, 0.1)
            : (theme) => alpha(theme.palette.surface.containerLowest, 0.5),
          transition: 'all 0.2s ease',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {column.cards.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                textAlign: 'center',
              }}
            >
              <IconComponent
                sx={{
                  fontSize: 48,
                  color: (theme) => alpha(theme.palette.text.secondary, 0.4),
                  mb: 2,
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                No applications
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Add sx={{ fontSize: 12 }} />}
                onClick={() => onAddCard(column.id)}
                sx={{
                  fontSize: '0.75rem',
                  textTransform: 'none',
                }}
              >
                Add Application
              </Button>
            </Box>
          ) : (
            column.cards.map((card) => (
              <ApplicationCardComponent
                key={card.id}
                card={card}
                onDragStart={(e, cardId) => {
                  e.dataTransfer.setData('text/plain', cardId);
                }}
                isDragging={draggedCard === card.id}
                onClick={() => onCardClick?.(card.id)}
              />
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

interface KanbanBoardProps {
  applications?: ApplicationCard[];
  onCardClick?: (cardId: string) => void;
  onBack?: () => void;
  className?: string;
  isLoading?: boolean;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications = [],
  onCardClick,
  onBack,
  className = '',
  isLoading = false,
}) => {
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: 'applied',
      title: 'Applied',
      status: 'applied',
      cards: applications.filter((app) => app.status === 'applied'),
      color: 'bg-brand-secondary',
      icon: Work,
    },
    {
      id: 'interviewing',
      title: 'Interviewing',
      status: 'interviewing',
      cards: applications.filter((app) => app.status === 'interviewing'),
      color: 'bg-brand-primary',
      icon: AccessTime,
    },
    {
      id: 'offer',
      title: 'Offer',
      status: 'offer',
      cards: applications.filter((app) => app.status === 'offer'),
      color: 'bg-aurora-tertiary',
      icon: CheckCircle,
    },
    {
      id: 'rejected',
      title: 'Rejected',
      status: 'rejected',
      cards: applications.filter((app) => app.status === 'rejected'),
      color: 'bg-brand-error',
      icon: Cancel,
    },
  ]);

  // Update columns when applications prop changes
  React.useEffect(() => {
    setColumns([
      {
        id: 'applied',
        title: 'Applied',
        status: 'applied',
        cards: applications.filter((app) => app.status === 'applied'),
        color: 'bg-brand-secondary',
        icon: Work,
      },
      {
        id: 'interviewing',
        title: 'Interviewing',
        status: 'interviewing',
        cards: applications.filter((app) => app.status === 'interviewing'),
        color: 'bg-brand-primary',
        icon: AccessTime,
      },
      {
        id: 'offer',
        title: 'Offer',
        status: 'offer',
        cards: applications.filter((app) => app.status === 'offer'),
        color: 'bg-aurora-tertiary',
        icon: CheckCircle,
      },
      {
        id: 'rejected',
        title: 'Rejected',
        status: 'rejected',
        cards: applications.filter((app) => app.status === 'rejected'),
        color: 'bg-brand-error',
        icon: Cancel,
      },
    ]);
  }, [applications]);

  const handleCardDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');

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
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
      className={className}
    >
      {/* Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: (theme) => alpha(theme.palette.background.default, 0.8),
          backdropFilter: 'blur(16px)',
          borderBottom: 1,
          borderColor: 'outline.variant',
        }}
      >
        <Box sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 500, mb: 1 }}>
                Application Tracker
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your job applications across different stages
              </Typography>
            </Box>
            {onBack && (
              <Button variant="outlined" onClick={onBack}>
                Back to Dashboard
              </Button>
            )}
          </Box>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {totalApplications} Total Applications
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Warning sx={{ fontSize: 12, color: 'tertiary.main' }} />
              <Typography variant="body2" color="text.secondary">
                {columns.find((col) => col.id === 'interviewing')?.cards.length || 0} Active
                Interviews
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Kanban Board */}
      <Box sx={{ p: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            overflowX: 'auto',
            pb: 4,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'surface.container',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'primary.main',
              borderRadius: 4,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            },
          }}
        >
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddCard={handleAddCard}
              onCardDrop={handleCardDrop}
              draggedCard={draggedCard}
              onCardClick={onCardClick}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default KanbanBoard;
