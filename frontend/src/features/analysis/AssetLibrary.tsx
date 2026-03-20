import { Archive, Download, FileText, Image, Trash2, Upload } from 'lucide-react';
import { KeralaRageButton } from '../../components/ui/KeralaRageButton';

export function AssetLibrary() {
  const assets = [
    { id: 1, name: 'Field Headshot.jpg', uploadedAt: '1 day ago', type: 'image' },
    { id: 2, name: 'Portfolio Dossier.pdf', uploadedAt: '2 days ago', type: 'document' },
    { id: 3, name: 'Training Record.pdf', uploadedAt: '3 days ago', type: 'document' },
    { id: 4, name: 'Reference Pack.docx', uploadedAt: '4 days ago', type: 'document' },
    { id: 5, name: 'Letter Base Template.docx', uploadedAt: '5 days ago', type: 'document' },
    { id: 6, name: 'Resume Release v3.pdf', uploadedAt: '1 week ago', type: 'document' },
    { id: 7, name: 'Solidarity Banner.png', uploadedAt: '1 week ago', type: 'image' },
    { id: 8, name: 'Work Sample Bundle.zip', uploadedAt: '2 weeks ago', type: 'archive' },
  ];

  const getAssetIcon = (type: string) => {
    if (type === 'image') return Image;
    if (type === 'archive') return Archive;
    return FileText;
  };

  return (
    <div className="p-12 max-w-7xl animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-display-large-KrDark font-display font-black tracking-tight text-on-surface-paper-white leading-tight">
            Working{' '}
            <span className="font-proclamation italic font-light text-ink-gold">Archive</span>
          </h1>
          <p className="text-on-surface-variant mt-2 text-body-large-KrDark font-primary">
            Keep your proofs, source files, and working material within reach.
          </p>
        </div>
        <KeralaRageButton
          variant="primary"
          size="lg"
          startIcon={<Upload className="w-5 h-5" />}
        >
          Upload to Archive
        </KeralaRageButton>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="bg-surface-KrDark-concrete-grey rounded-placard p-8 border border-outline-variant/30 hover:bg-surface-KrDark-concrete-grey-high transition-all duration-300 ease-viscous cursor-pointer group shadow-[var(--elevation-shadow-rest)] hover:shadow-[var(--elevation-shadow-glow-gold)] hover:-translate-y-1"
          >
            {/* Icon */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-march bg-ink-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                {(() => {
                  const AssetIcon = getAssetIcon(asset.type);
                  return <AssetIcon className="w-8 h-8 text-ink-gold" />;
                })()}
              </div>
            </div>

            {/* Asset Name */}
            <h4 className="text-on-surface-paper-white font-display font-bold mb-2 truncate text-lg">
              {asset.name}
            </h4>

            {/* Upload Time */}
            <p className="text-on-surface-variant-dim text-xs mb-6 font-primary uppercase tracking-widest opacity-70">
              {asset.uploadedAt}
            </p>

            {/* Actions */}
            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-viscous translate-y-2 group-hover:translate-y-0">
              <button className="flex-1 bg-surface-KrDark-concrete-grey-highest hover:bg-ink-gold hover:text-primary-on-primary text-ink-gold rounded-strike py-2.5 flex items-center justify-center transition-all duration-300 ease-viscous border border-primary-ink-gold/20">
                <Download className="w-4 h-4" />
              </button>
              <button className="flex-1 bg-surface-KrDark-concrete-grey-highest hover:bg-error hover:text-on-error text-error rounded-scaffold py-2.5 flex items-center justify-center transition-all duration-300 ease-viscous border border-error/20">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
