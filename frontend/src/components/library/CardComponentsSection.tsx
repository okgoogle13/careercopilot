/**
 * ELECTRIC ALCHEMIST: CARD COMPONENTS SECTION
 *
 * Documentation section showcasing card components.
 */

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/electric/button';
import { Card } from '@/components';
import { Badge } from '@/components/electric';
import { ComponentSection, ComponentDemo } from './ComponentDemo';

export function CardComponentsSection() {
  const [selectedCard, setSelectedCard] = useState<string | null>('card-2');
  const [favoriteCards, setFavoriteCards] = useState<Set<string>>(new Set(['card-1']));

  const handleCardClick = (cardId: string) => {
    setSelectedCard(selectedCard === cardId ? null : cardId);
  };

  const handleFavoriteToggle = (cardId: string) => {
    const newFavorites = new Set(favoriteCards);
    if (newFavorites.has(cardId)) {
      newFavorites.delete(cardId);
    } else {
      newFavorites.add(cardId);
    }
    setFavoriteCards(newFavorites);
  };

  return (
    <ComponentSection
      title="Card Components"
      description="Five distinct card variants designed for different interaction patterns and data states"
    >
      <ComponentDemo title="Card Variants Overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <h3 className="text-hero text-lg font-semibold text-on-surface mb-2">
              Default Card
            </h3>
            <p className="text-human text-sm text-on-surface-variant">
              Standard card with surface container background.
            </p>
          </Card>

          <Card variant="interactive">
            <h3 className="text-hero text-lg font-semibold text-primary mb-2">
              Interactive Card
            </h3>
            <p className="text-human text-sm text-on-surface-variant">
              Card with tactile press physics on hover/tap.
            </p>
          </Card>

          <Card
            variant="interactive"
            popOutGraphic={
              <div className="w-16 h-16 bg-gradient-to-br from-tertiary to-primary rounded-xl flex items-center justify-center text-3xl">
                ⚡
              </div>
            }
          >
            <h3 className="text-hero text-lg font-semibold text-on-surface mb-2">
              Pop-Out Card
            </h3>
            <p className="text-human text-sm text-on-surface-variant">
              Card with pop-out graphic that lifts on hover.
            </p>
          </Card>
        </div>
      </ComponentDemo>

      <ComponentDemo title="Card with Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['card-1', 'card-2', 'card-3'].map((cardId) => (
            <Card
              key={cardId}
              variant="interactive"
              className={selectedCard === cardId ? 'border-primary border-2' : ''}
              onClick={() => handleCardClick(cardId)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-hero text-lg font-semibold text-on-surface">
                  Card {cardId}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavoriteToggle(cardId);
                  }}
                  className="p-1 rounded-full hover:bg-surface-container-low transition-colors"
                >
                  <Heart
                    className={cn(
                      'h-5 w-5',
                      favoriteCards.has(cardId)
                        ? 'fill-error text-error'
                        : 'text-on-surface-variant'
                    )}
                  />
                </button>
              </div>
              <p className="text-human text-sm text-on-surface-variant mb-4">
                Click to select, heart to favorite.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Action
                </Button>
                <Button variant="ghost" size="sm">
                  More
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ComponentDemo>
    </ComponentSection>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default CardComponentsSection;

