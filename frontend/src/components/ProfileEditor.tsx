import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Sparkles, User, Briefcase, GraduationCap, Award, X, Plus } from "lucide-react";
import { KeywordTag, KeywordTagGroup } from "./library/KeywordTag";

interface ProfileEditorProps {
  onNext: () => void;
  onBack: () => void;
}

export function ProfileEditor({ onNext, onBack }: ProfileEditorProps) {
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [skills, setSkills] = useState<Array<{keyword: string; status: 'matched' | 'missing' | 'suggested'}>>([
    { keyword: "React", status: "matched" },
    { keyword: "TypeScript", status: "matched" },
    { keyword: "Node.js", status: "missing" },
  ]);
  const [newSkill, setNewSkill] = useState("");

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setSummary("Dedicated and compassionate Community Support Worker with over 5 years of experience in providing client-centered care. Skilled in crisis intervention, case management, and developing support plans that empower individuals to achieve their goals.");
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Review Your Profile</h1>
          <p className="text-muted-foreground">
            AI-extracted information from your uploaded documents. Review and enhance below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Main Info */}
          <div className="space-y-6">
            {/* Personal Info */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">Personal Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input defaultValue="Nishant Dougall" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input defaultValue="nishant.dougall@email.com" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone</label>
                  <Input defaultValue="+61 4XX XXX XXX" />
                </div>
              </div>
            </Card>

            {/* Professional Summary */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Professional Summary</h3>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Skills</label>
                  <div className="flex gap-2 mb-4">
                    <Input 
                      placeholder="Add a skill" 
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newSkill.trim()) {
                          e.preventDefault();
                          setSkills([...skills, { keyword: newSkill.trim(), status: 'matched' as const }]);
                          setNewSkill('');
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        if (newSkill.trim()) {
                          setSkills([...skills, { keyword: newSkill.trim(), status: 'matched' as const }]);
                          setNewSkill('');
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <KeywordTagGroup
                      keywords={skills}
                      onTagRemove={(keyword) => 
                        setSkills(skills.filter(skill => skill.keyword !== keyword))
                      }
                      onTagClick={(keyword) => {
                        // Optional: Show details or edit the skill
                        console.log('Skill clicked:', keyword);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={handleGenerateSummary}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="AI will generate a professional summary based on your experience..."
                className="min-h-[120px] resize-none"
              />
            </Card>
          </div>

          {/* Right Column - Experience & Skills */}
          <div className="space-y-6">
            {/* Experience */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">Experience</h3>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-card border border-border rounded-lg">
                  <h4 className="font-medium">Community Support Worker</h4>
                  <p className="text-sm text-muted-foreground">Community Care Organization</p>
                  <p className="text-sm text-muted-foreground">2019 - Present</p>
                </div>
                <div className="p-3 bg-card border border-border rounded-lg">
                  <h4 className="font-medium">Peer Worker</h4>
                  <p className="text-sm text-muted-foreground">Mental Health Support Services</p>
                  <p className="text-sm text-muted-foreground">2017 - 2019</p>
                </div>
              </div>
            </Card>

            {/* Education */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">Education</h3>
              </div>
              
              <div className="p-3 bg-card border border-border rounded-lg">
                <h4 className="font-medium">Certificate IV in Mental Health Peer Work</h4>
                <p className="text-sm text-muted-foreground">TAFE Queensland</p>
                <p className="text-sm text-muted-foreground">2017</p>
              </div>
            </Card>

            {/* Skills */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">Key Skills</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {["Crisis Intervention", "Case Management", "Client Support", "Peer Support", "Mental Health", "Community Outreach"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} className="bg-primary hover:bg-primary/90">
            Save Profile & Continue
          </Button>
        </div>
      </div>
    </div>
  );
}