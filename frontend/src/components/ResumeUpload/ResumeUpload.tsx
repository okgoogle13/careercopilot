import React, { useState, useRef } from 'react';
import { atsComplianceValidator } from '../../services/atsComplianceValidator';

interface ResumeUploadProps {
  onUploadComplete: (resumeData: ResumeAnalysisResult) => void;
  onError: (error: string) => void;
}

interface ResumeAnalysisResult {
  fileName: string;
  content: string;
  atsScore: number;
  recommendations: string[];
  fileSize: number;
  uploadedAt: Date;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUploadComplete, onError }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    processFile(files[0]);
  };

  const processFile = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      onError('Please upload a PDF, Word document, or text file.');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      onError('File size must be less than 5MB.');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Step 1: Read file content
      setProcessingStep('Reading file content...');
      const content = await readFileContent(file);

      // Step 2: Extract text (simplified for now)
      setProcessingStep('Extracting text content...');
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 3: Run ATS analysis
      setProcessingStep('Running ATS compliance analysis...');
      const atsScore = await simulateATSAnalysis(content);

      // Step 4: Generate recommendations
      setProcessingStep('Generating recommendations...');
      const recommendations = generateRecommendations(atsScore, content);

      const result: ResumeAnalysisResult = {
        fileName: file.name,
        content: content.substring(0, 1000) + '...', // Truncated for demo
        atsScore,
        recommendations,
        fileSize: file.size,
        uploadedAt: new Date()
      };

      setProcessingStep('Analysis complete!');
      await new Promise(resolve => setTimeout(resolve, 500));

      onUploadComplete(result);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (file.type === 'text/plain') {
          resolve(content);
        } else {
          // For PDF and Word files, we'd normally use a library to extract text
          // For demo purposes, return sample content
          resolve(`Sample resume content from ${file.name}...`);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const simulateATSAnalysis = async (content: string): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple scoring based on content keywords
    let score = 60; // Base score
    
    const keywords = ['react', 'javascript', 'typescript', 'node', 'experience', 'skills', 'education', 'work'];
    const contentLower = content.toLowerCase();
    
    keywords.forEach(keyword => {
      if (contentLower.includes(keyword)) score += 5;
    });
    
    return Math.min(Math.max(score, 45), 95);
  };

  const generateRecommendations = (score: number, content: string): string[] => {
    const recommendations: string[] = [];
    
    if (score < 70) {
      recommendations.push('Consider adding more relevant keywords from the job description');
      recommendations.push('Ensure all section headers are clear and standard');
    }
    
    if (score < 80) {
      recommendations.push('Add more quantifiable achievements and metrics');
      recommendations.push('Use a professional template for better ATS compatibility');
    }
    
    if (!content.toLowerCase().includes('contact') && !content.toLowerCase().includes('email')) {
      recommendations.push('Make sure your contact information is clearly visible');
    }
    
    return recommendations;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Upload Your Resume</h3>
      
      {!isProcessing ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="mb-4">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor" 
              fill="none" 
              viewBox="0 0 48 48"
            >
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          
          <div className="mb-2">
            <p className="text-lg font-medium text-gray-900">
              Drop your resume here, or click to browse
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Supports PDF, Word, and text files up to 5MB
            </p>
          </div>
          
          <div className="flex justify-center mt-4">
            <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              Select File
            </span>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-8 text-center">
          <div className="mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Processing Your Resume</h4>
          <p className="text-sm text-gray-600">{processingStep}</p>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: processingStep.includes('Reading') ? '25%' :
                       processingStep.includes('Extracting') ? '50%' :
                       processingStep.includes('Running') ? '75%' :
                       processingStep.includes('Generating') ? '90%' :
                       processingStep.includes('complete') ? '100%' : '10%'
              }}
            ></div>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
        onChange={(e) => handleFileSelect(e.target.files)}
      />
    </div>
  );
};

export default ResumeUpload;