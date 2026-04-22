import React from 'react';

export interface ProfileHeaderProps {
  name: string;
  bio?: string;
  identityTags?: string[];
  landAcknowledgment?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  bio,
  identityTags = [],
  landAcknowledgment,
}) => {
  return (
    <div className="mb-8">
      <h1
        className="text-4xl font-bold uppercase tracking-tight"
        style={{ color: 'var(--sys-color-worker-ash-base)' }}
      >
        {name}
      </h1>

      {bio && (
        <p
          className="mt-2 text-sm font-mono uppercase tracking-[0.2em]"
          style={{ color: 'var(--sys-color-concreteGrey-base)' }}
        >
          {bio}
        </p>
      )}

      {identityTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {identityTags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded"
              style={{
                background: 'rgba(218,246,116,0.08)',
                color: 'var(--sys-color-inkGold-base)',
                border: '1px solid rgba(218,246,116,0.2)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {landAcknowledgment && (
        <p
          className="mt-4 text-[10px] font-mono uppercase tracking-[0.25em] opacity-50"
          style={{ color: 'var(--sys-color-concreteGrey-base)' }}
        >
          {landAcknowledgment}
        </p>
      )}
    </div>
  );
};

export default ProfileHeader;
