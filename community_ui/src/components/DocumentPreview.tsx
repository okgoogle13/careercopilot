import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Download,
  Share2,
  Edit3,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Printer,
} from "lucide-react";

interface DocumentPreviewProps {
  onBack: () => void;
  onEdit: () => void;
  documentType: "resume" | "cover-letter";
  templateName: string;
}

interface DocumentData {
  title: string;
  type: "resume" | "cover-letter";
  lastModified: string;
  pages: number;
  templateName: string;
}

const mockDocument: DocumentData = {
  title: "Nishant Dougall - Community Support Worker Resume",
  type: "resume",
  lastModified: "2 hours ago",
  pages: 1,
  templateName: "Modern Minimal",
};

export function DocumentPreview({
  onBack,
  onEdit,
  documentType,
  templateName,
}: DocumentPreviewProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <div className="flex-1 p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Templates
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Document Preview</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mockDocument.title} • Template: {templateName}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Document
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Document Info Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4">
            <h3 className="font-medium mb-3">Document Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <Badge variant="secondary" className="capitalize">
                  {documentType.replace("-", " ")}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Template:</span>
                <span className="font-medium">{templateName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pages:</span>
                <span className="font-medium">{mockDocument.pages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Modified:</span>
                <span className="font-medium">{mockDocument.lastModified}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-3">View Options</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Zoom Level</span>
                <span className="text-sm font-medium">{zoomLevel}%</span>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={handleZoomOut}>
                  <ZoomOut className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleResetZoom}>
                  <RotateCcw className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleZoomIn}>
                  <ZoomIn className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-3">Export Options</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="w-3 h-3 mr-2" />
                PDF (Recommended)
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="w-3 h-3 mr-2" />
                Word Document
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="w-3 h-3 mr-2" />
                Plain Text
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-3">ATS Score</h3>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">87%</div>
              <div className="text-sm text-muted-foreground">Excellent ATS compatibility</div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                View Details
              </Button>
            </div>
          </Card>
        </div>

        {/* Document Preview */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Preview</h3>
              {mockDocument.pages > 1 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {currentPage} of {mockDocument.pages}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(mockDocument.pages, currentPage + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>

            {/* Document Preview Container */}
            <div className="bg-gray-100 p-8 rounded-lg flex justify-center overflow-auto">
              <div
                className="bg-white shadow-lg transition-transform duration-200 max-w-[8.5in]"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: "top center",
                  minHeight: "11in",
                  aspectRatio: "8.5 / 11",
                }}
              >
                {/* Mock Resume Content */}
                <div className="p-12 h-full">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center border-b border-gray-300 pb-4">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">Nishant Dougall</h1>
                      <div className="text-gray-600 space-y-1">
                        <p>nishant.dougall@email.com • (555) 123-4567</p>
                        <p>Vancouver, BC • linkedin.com/in/nishantdougall</p>
                      </div>
                    </div>

                    {/* Professional Summary */}
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
                        Professional Summary
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        Dedicated Community Support Worker with 3+ years of experience providing
                        client-centered care and advocacy. Proven track record in crisis
                        intervention, case management, and supporting individuals with mental health
                        challenges and addiction recovery.
                      </p>
                    </div>

                    {/* Experience */}
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                        Professional Experience
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                Community Support Worker
                              </h3>
                              <p className="text-gray-600">Community Living BC</p>
                            </div>
                            <span className="text-gray-500 text-sm">2021 - Present</span>
                          </div>
                          <ul className="text-gray-700 space-y-1 text-sm">
                            <li>
                              • Provide support to 25+ individuals with developmental disabilities
                              and mental health challenges
                            </li>
                            <li>
                              • Facilitate life skills training and community integration programs
                            </li>
                            <li>
                              • Collaborate with multidisciplinary teams to develop and implement
                              care plans
                            </li>
                            <li>
                              • Maintain detailed documentation and progress reports for client
                              files
                            </li>
                          </ul>
                        </div>

                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                Mental Health Support Assistant
                              </h3>
                              <p className="text-gray-600">Fraser Health Authority</p>
                            </div>
                            <span className="text-gray-500 text-sm">2019 - 2021</span>
                          </div>
                          <ul className="text-gray-700 space-y-1 text-sm">
                            <li>
                              • Assisted mental health professionals in group therapy sessions
                            </li>
                            <li>• Provided crisis intervention and de-escalation support</li>
                            <li>
                              • Connected clients with community resources and support services
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
                        Core Competencies
                      </h2>
                      <div className="text-gray-700 text-sm">
                        <p>
                          <strong>Clinical Skills:</strong> Crisis Intervention, Case Management,
                          Mental Health Support, Addiction Counseling
                        </p>
                        <p>
                          <strong>Interpersonal:</strong> Active Listening, Cultural Competency,
                          Team Collaboration, Client Advocacy
                        </p>
                        <p>
                          <strong>Technical:</strong> Documentation, Care Planning, Risk Assessment,
                          Community Resources
                        </p>
                      </div>
                    </div>

                    {/* Education & Certifications */}
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-1">
                        Education & Certifications
                      </h2>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              Diploma in Community Support Work
                            </h3>
                            <p className="text-gray-600">Douglas College</p>
                          </div>
                          <span className="text-gray-500 text-sm">2019</span>
                        </div>
                        <div className="text-sm text-gray-700">
                          <p>
                            <strong>Certifications:</strong> Mental Health First Aid, Crisis
                            Prevention Institute (CPI), CPR/AED
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
