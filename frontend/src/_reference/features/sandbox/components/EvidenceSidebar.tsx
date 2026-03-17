import { Search, Database, ChevronRight, Star } from 'lucide-react';

export function EvidenceSidebar() {
  return (
    <div className="h-full flex flex-col bg-surface-container-low border-r border-outline-variant/30 rounded-l-lg">
      <div className="p-4 border-b border-outline-variant/30">
        <h3 className="text-title-small font-bold text-on-surface flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-primary" />
          Evidence Vault
        </h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search STARs..."
            className="w-full bg-surface-container-high rounded-march pl-9 pr-4 py-2 text-label-small text-on-surface outline-none focus:ring-1 ring-primary/50 placeholder:text-on-surface-variant/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Mock Data for Sprint 2 - Now with Structured STAR Content */}
        {[
          {
            id: 1,
            title: 'Project Phoenix Migration',
            tags: ['Leadership', 'Technical'],
            star: {
              situation: 'Legacy system causing 40% downtime.',
              task: 'Lead migration of 50k users to new platform.',
              action: 'Orchestrated cross-functional team of 10 devs; implemented phased rollout.',
              result: 'Zero data loss, 99.9% uptime achieved.',
            },
          },
          {
            id: 2,
            title: 'Stakeholder Conflict Resolution',
            tags: ['Communication', 'Soft Skills'],
            star: {
              situation: 'Two departments disagreed on API specs.',
              task: 'Mediate consensus to unblock dev team.',
              action: 'Facilitated workshops; created shared interface contract.',
              result: 'Agreement reached in 2 days; project delivered on time.',
            },
          },
          {
            id: 3,
            title: 'Budget Optimization',
            tags: ['Strategic', 'Finance'],
            star: {
              situation: 'Department overspending by 15%.',
              task: 'Reduce costs without cutting headcount.',
              action: 'Audited SaaS licenses; renegotiated vendor contracts.',
              result: 'Saved $200k/year (20% reduction).',
            },
          },
        ].map((item) => (
          <div
            key={item.id}
            draggable="true"
            onDragStart={(e) => {
              e.dataTransfer.setData('application/json', JSON.stringify(item.star));
              e.dataTransfer.effectAllowed = 'copy';
            }}
            className="group bg-surface-container border border-outline-variant rounded-leaf p-3 hover:border-primary hover:shadow-sm cursor-grab active:cursor-grabbing transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-tertiary bg-tertiary-container px-2 py-0.5 rounded-march">
                {item.tags[0]}
              </span>
              <Star className="w-3 h-3 text-on-surface-variant group-hover:text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-label-medium font-bold text-on-surface mb-1 line-clamp-1">
              {item.title}
            </h4>
            <p className="text-body-small text-on-surface-variant line-clamp-2">
              {item.star.result}
            </p>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-outline-variant/30 text-center">
        <button className="text-label-small text-secondary hover:text-on-surface transition-colors flex items-center justify-center gap-1 w-full py-2">
          View All Evidence <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
