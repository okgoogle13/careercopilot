import { StatusBadge, Strike, Placard } from '@/components/ui';

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
    <div className="min-h-screen bg-[var(--sys-color-charcoalBackground-base)] py-8 px-4">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-[var(--sys-color-charcoalBackground-steps-3)] pb-6">
          <div className="flex flex-col xl:flex-row justify-between items-start gap-4">
            <div>
              <Strike
                variant="ghost"
                iconLeft={<ArrowLeft size={16} />}
                onClick={onBack}
                className="mb-4"
              >
                Back to Templates
              </Strike>
              <h1 className="text-[var(--sys-type-scale-headline)] font-bold text-[var(--sys-color-worker-ash-base)] mb-1">
                Document Preview
              </h1>
              <div className="flex items-center gap-2 text-body-medium text-[var(--sys-color-concreteGrey-base)]">
                <FileText size={16} />
                <span>{mockDocument.title}</span>
                <span>•</span>
                <span>Template: {templateName}</span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Strike
                variant="ghost"
                iconLeft={<Edit3 size={16} />}
                onClick={onEdit}
              >
                Edit
              </Strike>
              <Strike
                variant="ghost"
                iconLeft={<Share2 size={16} />}
              >
                Share
              </Strike>
              <Strike
                variant="ghost"
                iconLeft={<Printer size={16} />}
              >
                Print
              </Strike>
              <Strike
                variant="primary"
                iconLeft={<Download size={16} />}
              >
                Download PDF
              </Strike>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Document Info */}
            <Placard elevation="flat">
              <div className="p-4">
                <h3 className="text-title-small font-bold text-[var(--sys-color-worker-ash-base)] mb-4 border-b border-[var(--sys-color-charcoalBackground-steps-4)] pb-2">
                  Document Info
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-body-small text-[var(--sys-color-concreteGrey-base)]">
                      Type:
                    </span>
                    <StatusBadge
                      label={documentType.replace('-', ' ')}
                      variant="neutral"
                      className="capitalize"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body-small text-[var(--sys-color-concreteGrey-base)]">
                      Template:
                    </span>
                    <span className="text-body-small font-semibold text-[var(--sys-color-worker-ash-base)]">
                      {templateName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body-small text-[var(--sys-color-concreteGrey-base)]">
                      Pages:
                    </span>
                    <span className="text-body-small font-semibold text-[var(--sys-color-worker-ash-base)]">
                      {mockDocument.pages}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body-small text-[var(--sys-color-concreteGrey-base)]">
                      Modified:
                    </span>
                    <div className="flex items-center gap-1 text-body-small font-semibold text-[var(--sys-color-worker-ash-base)]">
                      <Clock size={12} />
                      <span>{mockDocument.lastModified}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Placard>

            {/* Zoom Controls */}
            <Placard elevation="flat">
              <div className="p-4">
                <h3 className="text-title-small font-bold text-[var(--sys-color-worker-ash-base)] mb-4 border-b border-[var(--sys-color-charcoalBackground-steps-4)] pb-2">
                  Zoom Controls
                </h3>
                <div className="flex flex-col gap-3 items-center">
                  <div className="flex items-center gap-2 bg-[var(--sys-color-charcoalBackground-steps-2)] rounded-pebble p-1">
                    <button
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 50}
                      className="p-2 rounded-megaphone hover:bg-[var(--sys-color-charcoalBackground-base)] disabled:opacity-50 transition-colors"
                    >
                      <ZoomOut size={16} />
                    </button>
                    <span className="w-12 text-center text-label-small font-mono text-[var(--sys-color-worker-ash-base)]">
                      {zoomLevel}%
                    </span>
                    <button
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= 200}
                      className="p-2 rounded-megaphone hover:bg-[var(--sys-color-charcoalBackground-base)] disabled:opacity-50 transition-colors"
                    >
                      <ZoomIn size={16} />
                    </button>
                  </div>
                  <Strike
                    variant="ghost"
                    size="sm"
                    iconLeft={<RotateCcw size={14} />}
                    onClick={handleResetZoom}
                  >
                    Reset Zoom
                  </Strike>
                </div>
              </div>
            </Placard>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-9">
            <div
              className="rounded-placard p-8 min-h-[800px] flex justify-center items-start overflow-auto"
              style={{ backgroundColor: 'var(--sys-color-concreteGrey-base)' }}
            >
              {/* Document Page */}
              <div
                className="bg-[var(--sys-color-charcoalBackground-base)] shadow-[var(--sys-shadow-elevation2Placard)] transition-all duration-300 origin-top border border-[var(--sys-color-charcoalBackground-steps-4)]"
                style={{
                  width: `${zoomLevel}%`,
                  maxWidth: '850px',
                  aspectRatio: '8.5 / 11',
                }}
              >
                <div className="p-[8%] h-full flex flex-col text-[var(--sys-color-worker-ash-base)]">
                  {/* Mock Resume Content */}
                  <div className="border-b-2 border-[var(--sys-color-charcoalBackground-steps-6)] pb-6 mb-8">
                    <h1 className="text-4xl font-bold text-[var(--sys-color-worker-ash-base)] mb-2 font-display">
                      Nishant Dougall
                    </h1>
                    <p className="text-xl text-[var(--sys-color-concreteGrey-base)] font-medium">
                      Community Support Worker
                    </p>
                  </div>{' '}
                  <div className="flex-1 space-y-8">
                    <section>
                      <h3 className="text-lg font-bold uppercase tracking-wider text-[var(--sys-color-worker-ash-base)] border-b border-[var(--sys-color-charcoalBackground-steps-4)] pb-2 mb-4">
                        Professional Summary
                      </h3>
                      <p className="text-[var(--sys-color-concreteGrey-base)] leading-relaxed">
                        Dedicated community support worker with 5+ years of experience providing
                        person-centered care and support to individuals with disabilities and mental
                        health challenges.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-bold uppercase tracking-wider text-[var(--sys-color-worker-ash-base)] border-b border-[var(--sys-color-charcoalBackground-steps-4)] pb-2 mb-4">
                        Experience
                      </h3>
                      <div className="mb-4">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-[var(--sys-color-worker-ash-base)]">
                            Senior Support Worker
                          </h4>
                          <span className="text-sm text-[var(--sys-color-concreteGrey-base)]">
                            Jan 2020 - Present
                          </span>
                        </div>
                        <p className="text-[var(--sys-color-concreteGrey-base)] italic mb-2">
                          Community Care Australia
                        </p>
                        <ul className="list-disc list-inside text-[var(--sys-color-worker-ash-base)] space-y-1">
                          <li>
                            Provided personalized support to 15+ clients with varying support needs
                          </li>
                          <li>Developed and implemented individual support plans</li>
                          <li>Collaborated with healthcare professionals and families</li>
                        </ul>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-bold uppercase tracking-wider text-[var(--sys-color-worker-ash-base)] border-b border-[var(--sys-color-charcoalBackground-steps-4)] pb-2 mb-4">
                        Education
                      </h3>
                      <div>
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-bold text-[var(--sys-color-worker-ash-base)]">
                            Certificate IV in Disability
                          </h4>
                          <span className="text-sm text-[var(--sys-color-concreteGrey-base)]">
                            2019
                          </span>
                        </div>
                        <p className="text-[var(--sys-color-concreteGrey-base)]">TAFE Queensland</p>
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
