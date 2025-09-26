import React from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Upload, FileText, Mail, Trophy as Award } from "lucide-react";

interface UploadResumeProps {
  onNext: () => void;
  onBack: () => void;
}

export function UploadResume({ onNext, onBack }: UploadResumeProps) {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Create Your Master Profile</h1>
          <p className="text-muted-foreground">
            Upload your existing documents. We'll build your profile from them.
          </p>
        </div>

        {/* Upload Areas */}
        <div className="space-y-6">
          {/* Resumes */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Resumes</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your current resume(s) in PDF or Word format
                </p>
              </div>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                Drag and drop files here or click to browse
              </p>
              <Button size="sm" variant="outline">
                Upload Files
              </Button>
            </div>
          </Card>

          {/* Cover Letters */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Cover Letters</h3>
                <p className="text-sm text-muted-foreground">
                  Upload any existing cover letters for reference
                </p>
              </div>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                Drag and drop files here or click to browse
              </p>
              <Button size="sm" variant="outline">
                Upload Files
              </Button>
            </div>
          </Card>

          {/* Selection Criteria */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Selection Criteria Responses</h3>
                <p className="text-sm text-muted-foreground">
                  Upload any previous selection criteria responses
                </p>
              </div>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                Drag and drop files here or click to browse
              </p>
              <Button size="sm" variant="outline">
                Upload Files
              </Button>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} className="bg-primary hover:bg-primary/90">
            Continue to Profile Creation
          </Button>
        </div>
      </div>
    </div>
  );
}
