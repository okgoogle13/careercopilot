import React from 'react';
import { TechCard } from './TechCard';
import figma from '@figma/code-connect';

type TechCardExampleProps = {
  content: React.ReactNode;
  className?: string;
  title: string;
};

/**
 * Figma Code Connect - TechCard Component
 * Strict mapping following DS/TechCard specification
 */
figma.connect(TechCard, 'https://www.figma.com/file/IryuGDWixbuDc3RVhC6llE?node-id=NODE_ID', {
  props: {
    title: figma.string('title'),
    content: figma.children('content'),
    className: figma.string('className'),
  },
  example: (props: TechCardExampleProps) => (
    <TechCard
      title={props.title}
      className={props.className}
    >
      {props.content}
    </TechCard>
  ),
});
