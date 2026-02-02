import { Pebble } from '@/components/ui/Pebble';
import { Seed } from '@/components/ui/Seed';
import { Stone } from '@/components/ui/Stone';
import {
  ArrowLeft,
  Clock,
  Download,
  Edit3,
  FileText,
  Printer,
  RotateCcw,
  Share2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import React, { useState } from 'react';

export interface DocumentPreviewProps {
  onBack: () => void;
  onEdit: () => void;
  documentType?: 'resume' | 'cover-letter';
  templateName?: string;
}

const mockDocument = {
  title: 'Nishant Dougall - Community Support Worker Resume',
  type: 'resume' as const,
  lastModified: '2 hours ago',
  pages: 1,
  templateName: 'Modern Minimal',
};

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  onBack,
  onEdit,
  documentType = 'resume',
  templateName = 'Modern Minimal',
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <div className="min-h-screen bg-[var(--color-background-base)] py-8 px-4">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-[var(--color-surface-container-high)] pb-6">
          <div className="flex flex-col xl:flex-row justify-between items-start gap-4">
            <div>
              <Pebble
                variant="ghost"
                icon={ArrowLeft}
                onClick={onBack}
                className="mb-4"
              >
                Back to Templates
              </Pebble>
              <h1 className="text-display-medium font-bold text-[var(--color-text-primary)] mb-1">
                Document Preview
              </h1>
              <div className="flex items-center gap-2 text-body-medium text-[var(--color-text-secondary)]">
                <FileText size={16} />
                <span>{mockDocument.title}</span>
                <span>•</span>
                <span>Template: {templateName}</span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Pebble
                variant="ghost"
                icon={Edit3}
                onClick={onEdit}
              >
                Edit
              </Pebble>
              <Pebble
                variant="ghost"
                icon={Share2}
              >
                Share
              </Pebble>
              <Pebble
                variant="ghost"
                icon={Printer}
              >
                Print
              </Pebble>
              <Pebble
                variant="primary"
                icon={Download}
              >
                Download PDF
              </Pebble>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Document Info */}
            <Stone variant="flat">
              <div className="p-4">
                <h3 className="text-title-small font-bold text-[var(--color-text-primary)] mb-4 border-b border-[var(--color-surface-container)] pb-2">
                  Document Info
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-body-small text-[var(--color-text-secondary)]">
                      Type:
                    </span>
                    <Seed
                      label={documentType.replace('-', ' ')}
                      variant="neutral"
                      className="capitalize"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body-small text-[var(--color-text-secondary)]">
                      Template:
                    </span>
                    <span className="text-body-small font-semibold text-[var(--color-text-primary)]">
                      {templateName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body-small text-[var(--color-text-secondary)]">
                      Pages:
                    </span>
                    <span className="text-body-small font-semibold text-[var(--color-text-primary)]">
                      {mockDocument.pages}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body-small text-[var(--color-text-secondary)]">
                      Modified:
                    </span>
                    <div className="flex items-center gap-1 text-body-small font-semibold text-[var(--color-text-primary)]">
                      <Clock size={12} />
                      <span>{mockDocument.lastModified}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Stone>

            {/* Zoom Controls */}
            <Stone variant="flat">
              <div className="p-4">
                <h3 className="text-title-small font-bold text-[var(--color-text-primary)] mb-4 border-b border-[var(--color-surface-container)] pb-2">
                  Zoom Controls
                </h3>
                <div className="flex flex-col gap-3 items-center">
                  <div className="flex items-center gap-2 bg-[var(--color-surface-container)] rounded-lg p-1">
                    <button
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 50}
                      className="p-2 rounded-md hover:bg-[var(--color-surface-base)] disabled:opacity-50 transition-colors"
                    >
                      <ZoomOut size={16} />
                    </button>
                    <span className="w-12 text-center text-label-small font-mono">
                      {zoomLevel}%
                    </span>
                    <button
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= 200}
                      className="p-2 rounded-md hover:bg-[var(--color-surface-base)] disabled:opacity-50 transition-colors"
                    >
                      <ZoomIn size={16} />
                    </button>
                  </div>
                  <Pebble
                    variant="ghost"
                    size="small"
                    icon={RotateCcw}
                    onClick={handleResetZoom}
                  >
                    Reset Zoom
                  </Pebble>
                </div>
              </div>
            </Stone>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-9">
            <div className="bg-[#E5E7EB] rounded-2xl p-8 min-h-[800px] flex justify-center items-start overflow-auto">
              {/* Document Page */}
              <div
                className="bg-white shadow-xl transition-all duration-300 origin-top"
                style={{
                  width: `${zoomLevel}%`,
                  maxWidth: '850px',
                  aspectRatio: '8.5 / 11',
                }}
              >
                <div className="p-[8%] h-full flex flex-col">
                  {/* Mock Resume Content */}
                  <div className="border-b-2 border-gray-800 pb-6 mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">
                      Nishant Dougall
                    </h1>
                    <p className="text-xl text-gray-600 font-medium">Community Support Worker</p>
                  </div>

                  <div className="flex-1 space-y-8">
                    <section>
                      <h3 className="text-lg font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2 mb-4">
                        Professional Summary
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Dedicated community support worker with 5+ years of experience providing
                        person-centered care and support to individuals with disabilities and mental
                        health challenges.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2 mb-4">
                        Experience
                      </h3>
                      <div className="mb-4">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-gray-800">Senior Support Worker</h4>
                          <span className="text-sm text-gray-500">Jan 2020 - Present</span>
                        </div>
                        <p className="text-gray-600 italic mb-2">Community Care Australia</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          <li>
                            Provided personalized support to 15+ clients with varying support needs
                          </li>
                          <li>Developed and implemented individual support plans</li>
                          <li>Collaborated with healthcare professionals and families</li>
                        </ul>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2 mb-4">
                        Education
                      </h3>
                      <div>
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-bold text-gray-800">Certificate IV in Disability</h4>
                          <span className="text-sm text-gray-500">2019</span>
                        </div>
                        <p className="text-gray-600">TAFE Queensland</p>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
