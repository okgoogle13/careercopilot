import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ArrowLeft, Link, FileText, Loader2, ExternalLink } from "lucide-react";

interface JobInputProps {
  onAnalyze: (jobData: { url?: string; description?: string }) => void;
  onBack: () => void;
}

export function JobInput({ onAnalyze, onBack }: JobInputProps) {
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("url");

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      onAnalyze({
        url: activeTab === "url" ? jobUrl : undefined,
        description: activeTab === "text" ? jobDescription : undefined
      });
    }, 2000);
  };

  const isValidInput = () => {
    if (activeTab === "url") {
      return jobUrl.trim().length > 0 && (jobUrl.includes("http") || jobUrl.includes("www"));
    } else {
      return jobDescription.trim().length > 50; // Minimum description length
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-4">Analyze the Job</h1>
          <p className="text-muted-foreground text-lg">
            Provide the job details so we can optimize your document for maximum impact.
          </p>
        </div>

        {/* Input Tabs */}
        <Card className="p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                Job URL
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Job Description
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Job Posting URL
                </label>
                <div className="relative">
                  <Input
                    type="url"
                    placeholder="https://example.com/job-posting"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    className="pr-10"
                  />
                  <ExternalLink className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 transform -translate-y-1/2" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  We'll automatically extract the job requirements and qualifications
                </p>
              </div>

              {jobUrl && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-primary">
                    ✓ Valid job URL detected
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Job Description
                </label>
                <Textarea
                  placeholder="Paste the complete job description here, including requirements, responsibilities, and qualifications..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {jobDescription.length}/50 characters minimum
                </p>
              </div>

              {jobDescription.length >= 50 && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-primary">
                    ✓ Job description looks good
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Analyze Button */}
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleAnalyze}
              disabled={!isValidInput() || isAnalyzing}
              className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing Job...
                </>
              ) : (
                "Analyze with AI"
              )}
            </Button>
          </div>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-medium mb-1">Keyword Extraction</h3>
            <p className="text-sm text-muted-foreground">
              Identify critical keywords and phrases
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="font-medium mb-1">ATS Optimization</h3>
            <p className="text-sm text-muted-foreground">
              Ensure your document passes ATS systems
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-medium mb-1">Match Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Calculate your compatibility score
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}