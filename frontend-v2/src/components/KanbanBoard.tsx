import { useState, useRef, useCallback, type KeyboardEvent } from 'react';
import { logUserAction } from '@/utils/logger';

interface ApplicationCard {
  id: string;
  title: string;
  company: string;
  status: string;
  appliedDate: string;
  priority: 'low' | 'medium' | 'high';
}

interface KanbanColumn {
  id: string;
  title: string;
  cards: ApplicationCard[];
}

const INITIAL_DATA: KanbanColumn[] = [
  {
    id: 'applied',
    title: 'Applied',
    cards: [
      {
        id: '1',
        title: 'Software Engineer',
        company: 'TechCorp',
        status: 'applied',
        appliedDate: '2024-01-15',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Frontend Developer',
        company: 'WebStart',
        status: 'applied',
        appliedDate: '2024-01-10',
        priority: 'medium'
      }
    ]
  },
  {
    id: 'interview',
    title: 'Interview',
    cards: [
      {
        id: '3',
        title: 'Full Stack Developer',
        company: 'InnovateLab',
        status: 'interview',
        appliedDate: '2024-01-05',
        priority: 'high'
      }
    ]
  },
  {
    id: 'offer',
    title: 'Offer',
    cards: []
  },
  {
    id: 'rejected',
    title: 'Rejected',
    cards: [
      {
        id: '4',
        title: 'Backend Engineer',
        company: 'DataCorp',
        status: 'rejected',
        appliedDate: '2023-12-20',
        priority: 'low'
      }
    ]
  }
];

interface ApplicationCardComponentProps {
  card: ApplicationCard;
  columnId: string;
  isSelected: boolean;
  isDropTarget: boolean;
  onSelect: (cardId: string) => void;
  onMove: (cardId: string, direction: 'up' | 'down' | 'left' | 'right') => void;
  onDrop: (cardId: string) => void;
  onPickup: (cardId: string) => void;
}

function ApplicationCardComponent({
  card,
  columnId,
  isSelected,
  isDropTarget,
  onSelect,
  onMove,
  onDrop,
  onPickup
}: ApplicationCardComponentProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isSelected) {
          onDrop(card.id);
        } else {
          onPickup(card.id);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        onMove(card.id, 'up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        onMove(card.id, 'down');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        onMove(card.id, 'left');
        break;
      case 'ArrowRight':
        event.preventDefault();
        onMove(card.id, 'right');
        break;
      case 'Escape':
        if (isSelected) {
          event.preventDefault();
          onDrop(card.id);
        }
        break;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div
      ref={cardRef}
      className={`
        p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-l-4 shadow-sm transition-all
        ${getPriorityColor(card.priority)}
        ${isSelected ? 'ring-2 ring-primary ring-offset-2 shadow-lg' : 'border-gray-200 dark:border-gray-700'}
        ${isDropTarget ? 'ring-2 ring-green-500 ring-offset-2' : ''}
        cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
      `}
      tabIndex={0}
      role="button"
      aria-roledescription="draggable application card"
      aria-label={`${card.title} at ${card.company}, status: ${columnId}, priority: ${card.priority}. ${isSelected ? 'Selected for move. ' : ''}Press Enter or Space to ${isSelected ? 'drop' : 'pick up'}, arrow keys to move.`}
      aria-describedby={`card-${card.id}-instructions`}
      aria-pressed={isSelected}
      onClick={() => onSelect(card.id)}
      onKeyDown={handleKeyDown}
    >
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-foreground">
          {card.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {card.company}
        </p>
        <div className="flex justify-between items-center text-xs">
          <span className={`
            px-2 py-1 rounded text-xs font-medium
            ${card.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
            ${card.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
            ${card.priority === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
          `}>
            {card.priority}
          </span>
          <span className="text-muted-foreground">
            {new Date(card.appliedDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Screen reader instructions */}
      <div id={`card-${card.id}-instructions`} className="sr-only">
        Keyboard controls: Enter or Space to pick up or drop, Arrow keys to move between positions, Escape to cancel move.
      </div>
    </div>
  );
}

interface KanbanColumnProps {
  column: KanbanColumn;
  selectedCard: string | null;
  dropTarget: string | null;
  onCardSelect: (cardId: string) => void;
  onCardMove: (cardId: string, direction: 'up' | 'down' | 'left' | 'right') => void;
  onCardDrop: (cardId: string) => void;
  onCardPickup: (cardId: string) => void;
}

function KanbanColumn({
  column,
  selectedCard,
  dropTarget,
  onCardSelect,
  onCardMove,
  onCardDrop,
  onCardPickup
}: KanbanColumnProps) {
  return (
    <div
      className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-4"
      role="region"
      aria-label={`${column.title} column with ${column.cards.length} applications`}
    >
      <h2 className="font-semibold text-lg mb-4 text-foreground">
        {column.title}
        <span className="ml-2 text-sm text-muted-foreground">
          ({column.cards.length})
        </span>
      </h2>

      <div className="space-y-3 min-h-[200px]" role="list">
        {column.cards.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No applications in this stage
          </div>
        ) : (
          column.cards.map((card) => (
            <div key={card.id} role="listitem">
              <ApplicationCardComponent
                card={card}
                columnId={column.id}
                isSelected={selectedCard === card.id}
                isDropTarget={dropTarget === card.id}
                onSelect={onCardSelect}
                onMove={onCardMove}
                onDrop={onCardDrop}
                onPickup={onCardPickup}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const [data] = useState<KanbanColumn[]>(INITIAL_DATA);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const findCard = useCallback((cardId: string) => {
    for (const column of data) {
      const cardIndex = column.cards.findIndex(card => card.id === cardId);
      if (cardIndex !== -1) {
        return { column, cardIndex };
      }
    }
    return null;
  }, [data]);

  const handleCardSelect = useCallback((cardId: string) => {
    if (selectedCard === cardId) {
      // Deselect if already selected
      setSelectedCard(null);
      setDropTarget(null);
    } else {
      setSelectedCard(cardId);
      setDropTarget(cardId);
    }
  }, [selectedCard]);

  const handleCardPickup = useCallback((cardId: string) => {
    setSelectedCard(cardId);
    setDropTarget(cardId);
    logUserAction('kanban_card_pickup', { cardId });

    // Announce to screen readers
    const event = new CustomEvent('kanban-announce', {
      detail: { message: 'Card picked up. Use arrow keys to move, Enter to drop, Escape to cancel.' }
    });
    window.dispatchEvent(event);
  }, []);

  const handleCardDrop = useCallback((cardId: string) => {
    if (selectedCard && dropTarget && selectedCard === cardId) {
      // Move the card to the drop target position
      const sourceInfo = findCard(selectedCard);
      const targetInfo = findCard(dropTarget);

      if (sourceInfo && targetInfo) {
        logUserAction('kanban_card_drop', {
          cardId: selectedCard,
          fromColumn: sourceInfo.column.id,
          toColumn: targetInfo.column.id,
          fromIndex: sourceInfo.cardIndex,
          toIndex: targetInfo.cardIndex
        });

        // Announce to screen readers
        const event = new CustomEvent('kanban-announce', {
          detail: { message: `Card moved to ${targetInfo.column.title}` }
        });
        window.dispatchEvent(event);
      }
    }

    setSelectedCard(null);
    setDropTarget(null);
  }, [selectedCard, dropTarget, findCard]);

  const handleCardMove = useCallback((cardId: string, direction: 'up' | 'down' | 'left' | 'right') => {
    if (!selectedCard) return;

    const currentInfo = findCard(dropTarget || cardId);
    if (!currentInfo) return;

    const { column: currentColumn, cardIndex: currentIndex } = currentInfo;
    const currentColumnIndex = data.findIndex(col => col.id === currentColumn.id);

    let newColumnIndex = currentColumnIndex;
    let newCardIndex = currentIndex;

    switch (direction) {
      case 'left':
        newColumnIndex = Math.max(0, currentColumnIndex - 1);
        newCardIndex = 0;
        break;
      case 'right':
        newColumnIndex = Math.min(data.length - 1, currentColumnIndex + 1);
        newCardIndex = 0;
        break;
      case 'up':
        newCardIndex = Math.max(0, currentIndex - 1);
        break;
      case 'down':
        newCardIndex = Math.min(currentColumn.cards.length - 1, currentIndex + 1);
        break;
    }

    const newColumn = data[newColumnIndex];
    const targetCardId = newColumn.cards[newCardIndex]?.id || null;

    setDropTarget(targetCardId || selectedCard);

    // Announce movement to screen readers
    const event = new CustomEvent('kanban-announce', {
      detail: {
        message: `Moved to ${newColumn.title}${newColumn.cards[newCardIndex] ? `, position ${newCardIndex + 1}` : ', end of column'}`
      }
    });
    window.dispatchEvent(event);

    logUserAction('kanban_card_move', {
      cardId,
      direction,
      newColumn: newColumn.id,
      newIndex: newCardIndex
    });
  }, [selectedCard, dropTarget, findCard, data]);

  return (
    <div className="w-full">
      {/* Screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        ref={(el) => {
          if (el) {
            const handleAnnouncement = (event: CustomEvent) => {
              el.textContent = event.detail.message;
            };
            window.addEventListener('kanban-announce', handleAnnouncement as EventListener);
            return () => window.removeEventListener('kanban-announce', handleAnnouncement as EventListener);
          }
        }}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Application Tracker
        </h1>
        <p className="text-muted-foreground">
          Track your job applications through different stages. Use keyboard navigation to move applications between columns.
        </p>

        {/* Keyboard instructions */}
        <details className="mt-4 bg-muted/50 p-4 rounded-lg">
          <summary className="cursor-pointer font-medium text-sm mb-2">
            Keyboard Navigation Instructions
          </summary>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• <kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd> - Navigate between cards</p>
            <p>• <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> or <kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd> - Pick up or drop a card</p>
            <p>• <kbd className="px-2 py-1 bg-muted rounded text-xs">Arrow Keys</kbd> - Move selected card between positions</p>
            <p>• <kbd className="px-2 py-1 bg-muted rounded text-xs">Escape</kbd> - Cancel card movement</p>
          </div>
        </details>
      </div>

      <div
        className="flex gap-6 overflow-x-auto pb-4"
        role="application"
        aria-label="Job application kanban board"
      >
        {data.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            selectedCard={selectedCard}
            dropTarget={dropTarget}
            onCardSelect={handleCardSelect}
            onCardMove={handleCardMove}
            onCardDrop={handleCardDrop}
            onCardPickup={handleCardPickup}
          />
        ))}
      </div>

      {selectedCard && (
        <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm text-primary font-medium">
            Card selected for movement. Use arrow keys to change position, Enter to drop, or Escape to cancel.
          </p>
        </div>
      )}
    </div>
  );
}