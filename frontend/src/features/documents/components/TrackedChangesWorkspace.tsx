import { useEffect } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import { Placard } from '../../../components/ui/Placard';
import { Strike } from '../../../components/ui/Strike';

export interface TrackedChangesWorkspaceProps {
  blob: Blob;
  filename: string;
  onReset: () => void;
}

export function TrackedChangesWorkspace({ blob, filename, onReset }: TrackedChangesWorkspaceProps) {
  const url = URL.createObjectURL(blob);

  useEffect(() => {
    return () => URL.revokeObjectURL(url);
  }, [url]);

  const handleDownload = () => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Placard
      elevation="raised"
      header={
        <h2
          className="text-xl font-black"
          style={{
            fontFamily: 'var(--sys-type-font-fraunces)',
            color: 'var(--sys-color-paperWhite)',
          }}
        >
          Redlines Applied
        </h2>
      }
    >
      <p
        className="mb-6 text-sm"
        style={{
          fontFamily: 'var(--sys-type-font-work-sans)',
          color: 'var(--sys-color-worker-ash-base)',
        }}
      >
        Your redlined document is ready. Download it to review the tracked changes.
      </p>

      <p
        className="mb-6 text-xs font-mono truncate"
        style={{ color: 'var(--sys-color-concreteGrey-base)' }}
      >
        {filename}
      </p>

      <div className="flex items-center gap-3">
        <Strike
          variant="primary"
          size="md"
          iconLeft={<Download className="w-4 h-4" />}
          onClick={handleDownload}
          style={{ color: 'var(--sys-color-inkGold-base)' }}
        >
          Download Redlined Document
        </Strike>

        <Strike
          variant="ghost"
          size="md"
          iconLeft={<RotateCcw className="w-4 h-4" />}
          onClick={onReset}
        >
          Start Over
        </Strike>
      </div>
    </Placard>
  );
}
