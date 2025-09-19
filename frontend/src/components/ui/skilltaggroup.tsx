import { Badge } from './badge';
import { cn } from './utils';
import React, { useState } from 'react';
import { SkillTag } from './skilltag';

interface Skill {
  text: string;
  status?: 'suggested' | 'accepted' | 'rejected';
}

interface SkillTagGroupProps {
  skills: Skill[];
  title?: string;
  onSkillAccept?: (skill: string) => void;
  onSkillReject?: (skill: string) => void;
  maxVisible?: number;
}

export const SkillTagGroup: React.FC<SkillTagGroupProps> = ({
  skills,
  title,
  onSkillAccept,
  onSkillReject,
  maxVisible = 10,
}) => {
  const [skillList, setSkillList] = useState<Skill[]>(skills);

  const handleAccept = (skill: string) => {
    const updatedSkills = skillList.map((s) =>
      s.text === skill ? { ...s, status: 'accepted' as const } : s
    );
    setSkillList(updatedSkills);
    onSkillAccept?.(skill);
  };

  const handleReject = (skill: string) => {
    const updatedSkills = skillList.map((s) =>
      s.text === skill ? { ...s, status: 'rejected' as const } : s
    );
    setSkillList(updatedSkills);
    onSkillReject?.(skill);
  };

  const visibleSkills = skillList.slice(0, maxVisible);
  const hiddenCount = Math.max(0, skillList.length - maxVisible);

  const statusCounts = skillList.reduce(
    (acc, { status }) => {
      acc[status || 'suggested'] = (acc[status || 'suggested'] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-3">
      {title && (
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-semantic-color-text-primary text-semantic-typography-heading-md">
            {title}
          </h4>
          <div className="flex items-center gap-2 text-xs">
            {statusCounts.accepted && (
              <Badge
                variant="outline"
                className="border-accent-green/50 text-accent-green font-medium"
              >
                {statusCounts.accepted} accepted
              </Badge>
            )}
            {statusCounts.rejected && (
              <Badge variant="outline" className="border-accent-red/50 text-accent-red font-medium">
                {statusCounts.rejected} rejected
              </Badge>
            )}
            {statusCounts.suggested && (
              <Badge
                variant="outline"
                className="border-brand-primary/50 text-brand-light font-medium"
              >
                {statusCounts.suggested} suggested
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {visibleSkills.map((skill, index) => (
          <SkillTag
            key={`${skill.text}-${index}`}
            text={skill.text}
            status={skill.status}
            onAccept={() => handleAccept(skill.text)}
            onReject={() => handleReject(skill.text)}
          />
        ))}

        {hiddenCount > 0 && (
          <Badge
            variant="outline"
            className={cn(
              'border-semantic-color-border-subtle',
              'text-semantic-color-text-secondary',
              'hover:border-semantic-color-action-primary-default',
              'hover:text-semantic-color-action-primary-default',
              'cursor-pointer transition-colors font-medium'
            )}
          >
            +{hiddenCount} more
          </Badge>
        )}
      </div>
    </div>
  );
};
