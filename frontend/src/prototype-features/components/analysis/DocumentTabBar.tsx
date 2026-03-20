import React from 'react';

type TabKey = 'resume' | 'coverLetter' | 'ksc';

interface DocumentTabBarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  hasKSC: boolean;
}

const TAB_LABELS: Record<TabKey, string> = {
  resume: 'Resume',
  coverLetter: 'Cover Letter',
  ksc: 'KSC Responses',
};

export const DocumentTabBar: React.FC<DocumentTabBarProps> = ({
  activeTab,
  onTabChange,
  hasKSC,
}) => {
  const tabs: TabKey[] = hasKSC ? ['resume', 'coverLetter', 'ksc'] : ['resume', 'coverLetter'];

  return (
    <div className="flex w-full md:w-auto overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`relative flex-1 md:flex-none px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === tab
              ? 'text-[var(--sys-color-paperWhite-base)]'
              : 'text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-paperWhite-base)]'
          }`}
        >
          {TAB_LABELS[tab]}
          {activeTab === tab && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--sys-color-solidarityRed-base)]" />
          )}
        </button>
      ))}
    </div>
  );
};
