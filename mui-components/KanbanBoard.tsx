import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Avatar,
  alpha,
} from '@mui/material';
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
} from 'lucide-react';

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
  icon: React.ComponentType<any>;
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
}> = ({ card, onDragStart, isDragging = false }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return { bg: alpha('#F472B6', 0.2), text: '#F472B6' };
      case 'medium':
        return { bg: alpha('#A78BFA', 0.2), text: '#A78BFA' };
      case 'low':
        return { bg: alpha('#C9C3DC', 0.2), text: '#C9C3DC' };
      default:
        return { bg: alpha('#928F99', 0.1), text: '#928F99' };
    }
  };

  const priorityColor = getPriorityColor(card.priority);

  return (
    <Card
      variant="glass"
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
      sx={{
        p: 2,
        cursor: 'grab',
        userSelect: 'none',
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'rotate(2deg) scale(1.05)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:active': {
          cursor: 'grabbing',
        },
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => theme.customShadows.glowPrimary,
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flex: 1, minWidth: 0 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'surface.containerHigh',
                color: 'text.primary',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {card.company.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {card.jobTitle}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                <Building2 size={12} />
                <Typography variant="caption">{card.company}</Typography>
              </Box>
            </Box>
          </Box>
          <IconButton
            size="small"
            sx={{
              color: 'text.secondary',
              flexShrink: 0,
            }}
          >
            <MoreVertical size={16} />
          </IconButton>
        </Box>

        {/* Details */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MapPin size={12} color="#928F99" />
            <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {card.location}
            </Typography>
          </Box>
          {card.salary && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DollarSign size={12} color="#928F99" />
              <Typography variant="caption" color="text.secondary">
                {card.salary}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calendar size={12} color="#928F99" />
            <Typography variant="caption" color="text.secondary">
              Applied {new Date(card.appliedDate).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1, borderTop: 1, borderColor: 'outline.variant' }}>
          <Chip
            label={`${card.priority.toUpperCase()} PRIORITY`}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 700,
              bgcolor: priorityColor.bg,
              color: priorityColor.text,
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

const KanbanColumnComponent: React.FC<{
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

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onCardDrop(e, column.id);
  };

  const IconComponent = column.icon;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 320,
        maxWidth: 400,
        height: '100%',
      }}
    >
      {/* Column Header */}
      <Card
        sx={{
          p: 2,
          mb: 2,
          bgcolor: 'surface.containerHigh',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette[column.color as 'primary' | 'secondary' | 'tertiary' | 'error']?.main || theme.palette.primary.main, 0.1),
                color: `${column.color}.main`,
              }}
            >
              <IconComponent size={18} />
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {column.title}
            </Typography>
          </Box>
          <Chip
            label={column.cards.length}
            size="small"
            sx={{
              height: 24,
              fontWeight: 700,
              bgcolor: (theme) => alpha(theme.palette[column.color as 'primary' | 'secondary' | 'tertiary' | 'error']?.main || theme.palette.primary.main, 0.1),
              color: `${column.color}.main`,
            }}
          />
        </Box>
        <Button
          variant="outlined"
          size="small"
          fullWidth
          startIcon={<Plus size={14} />}
          onClick={() => onAddCard(column.id)}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderStyle: 'dashed',
            '&:hover': {
              borderStyle: 'dashed',
            },
          }}
        >
          Add Application
        </Button>
      </Card>

      {/* Column Content */}
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          flex: 1,
          p: 1,
          borderRadius: 2,
          border: 2,
          borderStyle: 'dashed',
          borderColor: isDragOver ? 'primary.main' : 'transparent',
          bgcolor: isDragOver ? (theme) => alpha(theme.palette.primary.main, 0.05) : 'transparent',
          transition: 'all 0.3s',
          overflowY: 'auto',
          minHeight: 400,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {column.cards.map((card) => (
            <ApplicationCardComponent
              key={card.id}
              card={card}
              onDragStart={(e, cardId) => {
                e.dataTransfer.setData('cardId', cardId);
                e.dataTransfer.setData('sourceColumn', column.id);
              }}
              isDragging={draggedCard === card.id}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export const KanbanBoard: React.FC = () => {
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: 'applied',
      title: 'Applied',
      status: 'applied',
      cards: mockApplications.filter((app) => app.status === 'applied'),
      color: 'primary',
      icon: Briefcase,
    },
    {
      id: 'interviewing',
      title: 'Interviewing',
      status: 'interviewing',
      cards: mockApplications.filter((app) => app.status === 'interviewing'),
      color: 'tertiary',
      icon: Clock,
    },
    {
      id: 'offer',
      title: 'Offer',
      status: 'offer',
      cards: mockApplications.filter((app) => app.status === 'offer'),
      color: 'success',
      icon: CheckCircle,
    },
    {
      id: 'rejected',
      title: 'Rejected',
      status: 'rejected',
      cards: mockApplications.filter((app) => app.status === 'rejected'),
      color: 'error',
      icon: XCircle,
    },
  ]);

  const handleCardDrop = (e: React.DragEvent, targetColumnId: string) => {
    const cardId = e.dataTransfer.getData('cardId');
    const sourceColumnId = e.dataTransfer.getData('sourceColumn');

    if (sourceColumnId === targetColumnId) return;

    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      const sourceColumn = newColumns.find((col) => col.id === sourceColumnId);
      const targetColumn = newColumns.find((col) => col.id === targetColumnId);

      if (!sourceColumn || !targetColumn) return prevColumns;

      const cardIndex = sourceColumn.cards.findIndex((card) => card.id === cardId);
      if (cardIndex === -1) return prevColumns;

      const [movedCard] = sourceColumn.cards.splice(cardIndex, 1);
      movedCard.status = targetColumn.status;
      targetColumn.cards.push(movedCard);

      return newColumns;
    });

    setDraggedCard(null);
  };

  const handleAddCard = (columnId: string) => {
    console.log('Add card to column:', columnId);
    // Implement add card logic
  };

  return (
    <Box
      sx={{
        flex: 1,
        overflowX: 'auto',
        overflowY: 'hidden',
        bgcolor: 'background.default',
        p: { xs: 2, md: 4 },
        minHeight: '100vh',
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Application Tracker
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your job applications with drag-and-drop simplicity
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 3,
          pb: 2,
          minWidth: 'min-content',
        }}
      >
        {columns.map((column) => (
          <KanbanColumnComponent
            key={column.id}
            column={column}
            onAddCard={handleAddCard}
            onCardDrop={handleCardDrop}
            draggedCard={draggedCard}
          />
        ))}
      </Box>
    </Box>
  );
};

export default KanbanBoard;
