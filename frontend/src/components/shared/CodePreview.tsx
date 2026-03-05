import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodePreviewProps {
  code: string;
}

export function CodePreview({ code }: CodePreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group mt-2">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-tech-edge bg-surface-container-highest text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors"
          title="Copy code"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="p-4 rounded-tech-edge bg-surface-container-highest overflow-x-auto border border-outline-variant">
        <code className="text-xs font-mono text-on-surface-variant whitespace-pre-wrap">
          {code.trim()}
        </code>
      </pre>
    </div>
  );
}
