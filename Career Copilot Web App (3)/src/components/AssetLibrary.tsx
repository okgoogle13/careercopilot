import { FileText, Upload, Download, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

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
          <h1 style={{ fontSize: '4.5rem', lineHeight: '1.1', fontFamily: 'Roboto Flex, sans-serif', fontWeight: '800', fontStretch: '150%', color: '#E6E1E5' }}>
            Asset <span style={{ fontFamily: 'Roboto Serif, serif', fontStyle: 'italic', fontWeight: '300', color: '#D0BCFF' }}>Library</span>
          </h1>
          <p className="text-[#CAC4D0] mt-2">Store and manage your career documents and media</p>
        </div>
        <Button className="bg-[#D0BCFF] text-[#381E72] hover:bg-[#E6DDFF] rounded-full px-8 h-12 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Asset
        </Button>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-4 gap-6">
        {assets.map((asset) => (
          <div 
            key={asset.id}
            className="bg-[#25232A] rounded-[28px] p-6 hover:bg-[#2B2930] transition-all cursor-pointer group"
            style={{
              backgroundImage: 'radial-gradient(circle, #E6DEFF 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              backgroundBlendMode: 'overlay',
              backgroundPosition: '0 0'
            }}
          >
            {/* Icon */}
            <div className="flex items-center justify-center mb-4">
              <FileText className="w-12 h-12 text-[#D0BCFF]" />
            </div>
            
            {/* Asset Name */}
            <h4 className="text-[#E6E1E5] mb-2 truncate">{asset.name}</h4>
            
            {/* Upload Time */}
            <p className="text-[#CAC4D0] text-xs mb-4" style={{ fontFamily: 'Roboto Flex, sans-serif', fontStretch: '50%', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {asset.uploadedAt}
            </p>

            {/* Actions */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="flex-1 bg-[#2B2930] hover:bg-[#36343B] text-[#D0BCFF] rounded-full py-2 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </button>
              <button className="flex-1 bg-[#2B2930] hover:bg-[#36343B] text-[#E07A5F] rounded-full py-2 flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}