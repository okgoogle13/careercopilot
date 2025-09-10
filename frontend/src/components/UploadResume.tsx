import { Button } from './ui/button';
import { useCallback, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Upload, FileText, Mail, Award } from 'lucide-react';

interface UploadResumeProps {
  onNext: () => void;
  onBack: () => void;
}

export function UploadResume({ onNext, onBack }: UploadResumeProps) {
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const criteriaInputRef = useRef<HTMLInputElement>(null);

  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [coverFiles, setCoverFiles] = useState<File[]>([]);
  const [criteriaFiles, setCriteriaFiles] = useState<File[]>([]);

  const addFiles = useCallback(
    (incoming: FileList | null | File[], setter: (f: File[]) => void, existing: File[]) => {
      if (!incoming) return;
      const list = Array.from(incoming as any as File[]);
      const merged = [...existing];
      for (const f of list) {
        if (
          !merged.find(
            (m) => m.name === f.name && m.size === f.size && m.lastModified === f.lastModified
          )
        ) {
          merged.push(f);
        }
      }
      setter(merged);
    },
    []
  );

  const onDrop = useCallback(
    (e: React.DragEvent, setter: (f: File[]) => void, existing: File[]) => {
      e.preventDefault();
      e.stopPropagation();
      addFiles(e.dataTransfer.files, setter, existing);
    },
    [addFiles]
  );

  const onBrowse = (ref: React.RefObject<HTMLInputElement>) => ref.current?.click();

  const FileList = ({ files }: { files: File[] }) => (
    <ul className="mt-4 text-left space-y-2">
      {files.map((f, i) => (
        <li key={f.name + i} className="text-sm text-muted-foreground truncate">
          {f.name} • {(f.size / 1024).toFixed(1)} KB
        </li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Create Your Master Profile</h1>
          <p className="text-muted-foreground">
            Upload your existing documents. We'll build your profile from them.
          </p>
        </div>

        <div className="space-y-6">
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

            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => onBrowse(resumeInputRef)}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => onDrop(e, setResumeFiles, resumeFiles)}
              role="button"
              tabIndex={0}
            >
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                Drag and drop files here or click to browse
              </p>
              <Button size="sm" variant="outline" onClick={() => onBrowse(resumeInputRef)}>
                Upload Files
              </Button>
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files, setResumeFiles, resumeFiles)}
              />
              {resumeFiles.length > 0 && <FileList files={resumeFiles} />}
            </div>
          </Card>

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

            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => onBrowse(coverInputRef)}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => onDrop(e, setCoverFiles, coverFiles)}
              role="button"
              tabIndex={0}
            >
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                Drag and drop files here or click to browse
              </p>
              <Button size="sm" variant="outline" onClick={() => onBrowse(coverInputRef)}>
                Upload Files
              </Button>
              <input
                ref={coverInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files, setCoverFiles, coverFiles)}
              />
              {coverFiles.length > 0 && <FileList files={coverFiles} />}
            </div>
          </Card>

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

            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => onBrowse(criteriaInputRef)}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => onDrop(e, setCriteriaFiles, criteriaFiles)}
              role="button"
              tabIndex={0}
            >
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                Drag and drop files here or click to browse
              </p>
              <Button size="sm" variant="outline" onClick={() => onBrowse(criteriaInputRef)}>
                Upload Files
              </Button>
              <input
                ref={criteriaInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files, setCriteriaFiles, criteriaFiles)}
              />
              {criteriaFiles.length > 0 && <FileList files={criteriaFiles} />}
            </div>
          </Card>
        </div>

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
