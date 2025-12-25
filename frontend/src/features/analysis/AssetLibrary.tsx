import { FileText, Upload, Download, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function AssetLibrary() {
  const assets = [
    { id: 1, name: 'Professional Headshot.jpg', uploadedAt: '1 day ago', type: 'image' },
    { id: 2, name: 'Portfolio PDF.pdf', uploadedAt: '2 days ago', type: 'document' },
    { id: 3, name: 'Certifications.pdf', uploadedAt: '3 days ago', type: 'document' },
    { id: 4, name: 'References.docx', uploadedAt: '4 days ago', type: 'document' },
    { id: 5, name: 'Cover Letter Template.docx', uploadedAt: '5 days ago', type: 'document' },
    { id: 6, name: 'Resume v3.pdf', uploadedAt: '1 week ago', type: 'document' },
    { id: 7, name: 'LinkedIn Banner.png', uploadedAt: '1 week ago', type: 'image' },
    { id: 8, name: 'Work Samples.zip', uploadedAt: '2 weeks ago', type: 'archive' },
  ];

  return (
    <div className="p-12 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display-large font-display font-black tracking-tight text-on-surface leading-tight">
            Asset{' '}
            <span className="font-serif italic font-light text-primary">
              Library
            </span>
          </h1>
          <p className="text-on-surface-variant mt-2 text-body-large">Store and manage your career documents and media</p>
        </div>
        <Button className="bg-primary-container text-on-primary-container hover:bg-primary-container/80 rounded-pebble px-8 h-12 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Asset
        </Button>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-4 gap-6">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="bg-surface-container rounded-tech p-6 hover:bg-surface-container-high transition-all cursor-pointer group shadow-elevation-1 hover:shadow-elevation-2"
            style={{
              backgroundImage: 'radial-gradient(circle, var(--sys-color-primary) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              backgroundBlendMode: 'overlay',
              backgroundPosition: '0 0',
            }}
          >
            {/* Icon */}
            <div className="flex items-center justify-center mb-4">
              <FileText className="w-12 h-12 text-primary" />
            </div>

            {/* Asset Name */}
            <h4 className="text-on-surface mb-2 truncate">{asset.name}</h4>

            {/* Upload Time */}
            <p className="text-on-surface-variant text-xs mb-4 font-body uppercase tracking-wider opacity-70">
              {asset.uploadedAt}
            </p>

            {/* Actions */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="flex-1 bg-surface-dim hover:bg-surface text-primary rounded-pebble py-2 flex items-center justify-center transition-colors">
                <Download className="w-4 h-4" />
              </button>
              <button className="flex-1 bg-surface-dim hover:bg-surface text-error rounded-pebble py-2 flex items-center justify-center transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
