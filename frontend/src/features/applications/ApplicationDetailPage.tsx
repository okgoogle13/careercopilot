import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ApplicationDetailPanel } from './components/ApplicationDetailPanel';

export function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Panel is always "open" when routed here; closing navigates back.
  const [open, setOpen] = useState(true);

  if (!id) {
    return (
      <div className="min-h-screen bg-[var(--sys-color-charcoalBackground-base)] flex flex-col items-center justify-center gap-4">
        <p className="font-mono text-sm text-[var(--sys-color-solidarityRed-base)]">
          No application ID provided.
        </p>
        <button
          onClick={() => navigate('/applications')}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--sys-color-inkGold-base)] hover:opacity-75 transition-opacity"
        >
          <ArrowLeft size={13} /> Back to Applications
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--sys-color-charcoalBackground-base)]">
      <ApplicationDetailPanel
        applicationId={id}
        isOpen={open}
        onClose={() => {
          setOpen(false);
          navigate('/applications');
        }}
        onStatusChange={() => {
          /* handled inside panel */
        }}
        onArchive={() => navigate('/applications')}
      />
    </div>
  );
}

export default ApplicationDetailPage;
