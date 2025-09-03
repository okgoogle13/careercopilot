import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, LoadingSpinner, ProgressBar } from '../ui';
import { HelpButton } from '../HelpSystem';
import { 
  Mic, VolumeX, Volume2, RefreshCw, Save, Wand2, FileText,
  MessageSquare, Lightbulb, TrendingUp, User, BookOpen, 
  RotateCcw, CheckCircle, AlertCircle, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

interface VoiceProfile {
  id: string;
  userId: string;
  name: string;
  tone: 'professional' | 'conversational' | 'formal' | 'friendly' | 'authoritative' | 'creative';
  formality: number; // 1-10 scale
  confidence: number; // 1-10 scale
  enthusiasm: number; // 1-10 scale
  vocabulary: 'simple' | 'technical' | 'business' | 'academic' | 'mixed';
  sentenceStructure: 'short' | 'medium' | 'long' | 'varied';
  commonPhrases: string[];
  writingPatterns: {
    averageWordsPerSentence: number;
    paragraphLength: 'short' | 'medium' | 'long';
    useOfNumbers: boolean;
    useOfBulletPoints: boolean;
    activeVoice: boolean;
  };
  industry: string[];
  sampleTexts: Array<{
    type: 'resume' | 'cover_letter' | 'email' | 'social';
    content: string;
    analyzed: boolean;
  }>;
  confidence_score: number; // AI confidence in the voice profile
  created: Date;
  updated: Date;
}

interface VoiceAnalysis {
  tone: string;
  formality: number;
  confidence: number;
  enthusiasm: number;
  vocabulary: string;
  sentenceStructure: string;
  keyPhrases: string[];
  suggestions: Array<{
    type: 'improvement' | 'insight' | 'warning';
    message: string;
  }>;
}

interface VoiceProfileManagerProps {
  profileId?: string;
  onSave?: (profile: VoiceProfile) => void;
  onClose?: () => void;
}

const VoiceProfileManager: React.FC<VoiceProfileManagerProps> = ({
  profileId,
  onSave,
  onClose,
}) => {
  const [profile, setProfile] = useState<VoiceProfile | null>(null);
  const [loading, setLoading] = useState(!!profileId);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'setup' | 'samples' | 'analysis' | 'preview'>('setup');
  const [sampleText, setSampleText] = useState('');
  const [analysis, setAnalysis] = useState<VoiceAnalysis | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (profileId) {
      loadProfile(profileId);
    } else {
      // Create new profile
      setProfile({
        id: '',
        userId: '',
        name: 'My Voice Profile',
        tone: 'professional',
        formality: 7,
        confidence: 7,
        enthusiasm: 5,
        vocabulary: 'business',
        sentenceStructure: 'medium',
        commonPhrases: [],
        writingPatterns: {
          averageWordsPerSentence: 15,
          paragraphLength: 'medium',
          useOfNumbers: true,
          useOfBulletPoints: true,
          activeVoice: true,
        },
        industry: [],
        sampleTexts: [],
        confidence_score: 0,
        created: new Date(),
        updated: new Date(),
      });
      setLoading(false);
    }
  }, [profileId]);

  const loadProfile = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/voice-profiles/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        toast.error('Failed to load voice profile');
      }
    } catch (error) {
      toast.error('Error loading voice profile');
    } finally {
      setLoading(false);
    }
  };

  const analyzeText = async (text: string, type: 'resume' | 'cover_letter' | 'email' | 'social' = 'email') => {
    if (!text.trim()) {
      toast.error('Please enter some text to analyze');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await fetch('/api/v1/voice-profiles/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type }),
      });

      if (response.ok) {
        const analysisResult = await response.json();
        setAnalysis(analysisResult);
        
        // Update profile with analysis results
        if (profile) {
          setProfile({
            ...profile,
            tone: analysisResult.tone as any,
            formality: analysisResult.formality,
            confidence: analysisResult.confidence,
            enthusiasm: analysisResult.enthusiasm,
            vocabulary: analysisResult.vocabulary as any,
            sentenceStructure: analysisResult.sentenceStructure as any,
            commonPhrases: [...profile.commonPhrases, ...analysisResult.keyPhrases.slice(0, 5)],
            sampleTexts: [
              ...profile.sampleTexts,
              { type, content: text, analyzed: true }
            ],
            confidence_score: Math.min(profile.confidence_score + 20, 100),
            updated: new Date(),
          });
        }
        
        toast.success('Text analysis completed!');
        setActiveTab('analysis');
      } else {
        toast.error('Failed to analyze text');
      }
    } catch (error) {
      toast.error('Error analyzing text');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const url = profile.id ? `/api/v1/voice-profiles/${profile.id}` : '/api/v1/voice-profiles';
      const method = profile.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          updated: new Date(),
        }),
      });

      if (response.ok) {
        const savedProfile = await response.json();
        setProfile(savedProfile);
        toast.success('Voice profile saved successfully!');
        onSave?.(savedProfile);
      } else {
        toast.error('Failed to save voice profile');
      }
    } catch (error) {
      toast.error('Error saving voice profile');
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = (updates: Partial<VoiceProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates, updated: new Date() });
    }
  };

  const generateSampleContent = async (contentType: 'resume' | 'cover_letter' | 'email') => {
    if (!profile) return;

    try {
      const response = await fetch('/api/v1/voice-profiles/generate-sample', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          profile,
          contentType,
          jobTitle: 'Software Engineer',
          company: 'Tech Corp'
        }),
      });

      if (response.ok) {
        const { content } = await response.json();
        setSampleText(content);
        setShowPreview(true);
      } else {
        toast.error('Failed to generate sample content');
      }
    } catch (error) {
      toast.error('Error generating sample content');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Not Found</h3>
        <p className="text-gray-600">Unable to load the voice profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mic className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Voice Profile Manager</h1>
            <p className="text-gray-600">Personalize your writing style for authentic documents</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <HelpButton helpId="voice-profiling" size="sm" />
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Profile Name */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Professional Writing Style"
            />
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">Confidence Score</div>
            <div className="flex items-center gap-2">
              <ProgressBar value={profile.confidence_score} className="w-24 h-2" />
              <span className="text-sm font-medium">{profile.confidence_score}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {[
            { id: 'setup', label: 'Profile Setup', icon: User },
            { id: 'samples', label: 'Text Samples', icon: FileText },
            { id: 'analysis', label: 'Analysis', icon: TrendingUp },
            { id: 'preview', label: 'Preview', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'setup' && (
          <ProfileSetupTab profile={profile} onUpdate={updateProfile} />
        )}
        
        {activeTab === 'samples' && (
          <SamplesTab 
            profile={profile} 
            onUpdate={updateProfile}
            onAnalyze={analyzeText}
            analyzing={analyzing}
          />
        )}
        
        {activeTab === 'analysis' && (
          <AnalysisTab 
            profile={profile}
            analysis={analysis}
            onGenerateSample={generateSampleContent}
          />
        )}
        
        {activeTab === 'preview' && (
          <PreviewTab 
            profile={profile}
            onGenerateSample={generateSampleContent}
          />
        )}
      </div>

      {/* Sample Content Preview Modal */}
      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} size="lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Generated Sample Content</h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-800">{sampleText}</pre>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button onClick={() => {
              navigator.clipboard.writeText(sampleText);
              toast.success('Copied to clipboard');
            }}>
              Copy Text
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Profile Setup Tab
const ProfileSetupTab: React.FC<{
  profile: VoiceProfile;
  onUpdate: (updates: Partial<VoiceProfile>) => void;
}> = ({ profile, onUpdate }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Core Settings */}
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-blue-500" />
            Writing Tone
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Tone
              </label>
              <select
                value={profile.tone}
                onChange={(e) => onUpdate({ tone: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="professional">Professional</option>
                <option value="conversational">Conversational</option>
                <option value="formal">Formal</option>
                <option value="friendly">Friendly</option>
                <option value="authoritative">Authoritative</option>
                <option value="creative">Creative</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formality Level: {profile.formality}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={profile.formality}
                onChange={(e) => onUpdate({ formality: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Casual</span>
                <span>Formal</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confidence Level: {profile.confidence}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={profile.confidence}
                onChange={(e) => onUpdate({ confidence: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Modest</span>
                <span>Assertive</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enthusiasm Level: {profile.enthusiasm}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={profile.enthusiasm}
                onChange={(e) => onUpdate({ enthusiasm: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Reserved</span>
                <span>Enthusiastic</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-500" />
            Language Style
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vocabulary Level
              </label>
              <select
                value={profile.vocabulary}
                onChange={(e) => onUpdate({ vocabulary: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="simple">Simple & Clear</option>
                <option value="business">Business Professional</option>
                <option value="technical">Technical & Specialized</option>
                <option value="academic">Academic & Scholarly</option>
                <option value="mixed">Mixed Vocabulary</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sentence Structure
              </label>
              <select
                value={profile.sentenceStructure}
                onChange={(e) => onUpdate({ sentenceStructure: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="short">Short & Punchy</option>
                <option value="medium">Medium Length</option>
                <option value="long">Long & Detailed</option>
                <option value="varied">Varied Structure</option>
              </select>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Column - Advanced Settings */}
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Writing Patterns
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Average Words per Sentence
              </label>
              <input
                type="number"
                min="5"
                max="50"
                value={profile.writingPatterns.averageWordsPerSentence}
                onChange={(e) => onUpdate({
                  writingPatterns: {
                    ...profile.writingPatterns,
                    averageWordsPerSentence: parseInt(e.target.value) || 15,
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paragraph Length
              </label>
              <select
                value={profile.writingPatterns.paragraphLength}
                onChange={(e) => onUpdate({
                  writingPatterns: {
                    ...profile.writingPatterns,
                    paragraphLength: e.target.value as any,
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="short">Short (2-3 sentences)</option>
                <option value="medium">Medium (4-6 sentences)</option>
                <option value="long">Long (7+ sentences)</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Writing Preferences
              </label>
              
              {[
                { key: 'useOfNumbers', label: 'Use numbers and metrics' },
                { key: 'useOfBulletPoints', label: 'Prefer bullet points' },
                { key: 'activeVoice', label: 'Use active voice' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={profile.writingPatterns[key as keyof typeof profile.writingPatterns] as boolean}
                    onChange={(e) => onUpdate({
                      writingPatterns: {
                        ...profile.writingPatterns,
                        [key]: e.target.checked,
                      }
                    })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Common Phrases
          </h3>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.commonPhrases.map((phrase, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {phrase}
                  <button
                    onClick={() => {
                      const newPhrases = [...profile.commonPhrases];
                      newPhrases.splice(index, 1);
                      onUpdate({ commonPhrases: newPhrases });
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a common phrase..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const value = (e.target as HTMLInputElement).value.trim();
                    if (value && !profile.commonPhrases.includes(value)) {
                      onUpdate({ commonPhrases: [...profile.commonPhrases, value] });
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
              />
            </div>
            
            <p className="text-xs text-gray-500">
              Press Enter to add phrases you commonly use in professional writing
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Text Samples Tab
const SamplesTab: React.FC<{
  profile: VoiceProfile;
  onUpdate: (updates: Partial<VoiceProfile>) => void;
  onAnalyze: (text: string, type: 'resume' | 'cover_letter' | 'email' | 'social') => void;
  analyzing: boolean;
}> = ({ profile, onUpdate, onAnalyze, analyzing }) => {
  const [newSampleText, setNewSampleText] = useState('');
  const [selectedType, setSelectedType] = useState<'resume' | 'cover_letter' | 'email' | 'social'>('email');

  return (
    <div className="space-y-6">
      {/* Add New Sample */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Add Writing Sample
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="resume">Resume/CV Content</option>
              <option value="cover_letter">Cover Letter</option>
              <option value="email">Professional Email</option>
              <option value="social">Social Media/LinkedIn</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sample Text
            </label>
            <textarea
              value={newSampleText}
              onChange={(e) => setNewSampleText(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-vertical"
              placeholder="Paste a sample of your professional writing here..."
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Include at least 50-100 words for better analysis accuracy
            </p>
          </div>

          <Button
            onClick={() => onAnalyze(newSampleText, selectedType)}
            disabled={!newSampleText.trim() || analyzing}
            className="flex items-center gap-2"
          >
            {analyzing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            {analyzing ? 'Analyzing...' : 'Analyze Writing Style'}
          </Button>
        </div>
      </Card>

      {/* Existing Samples */}
      {profile.sampleTexts.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Previous Samples</h3>
          
          <div className="space-y-4">
            {profile.sampleTexts.map((sample, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">
                      {sample.type.replace('_', ' ').toUpperCase()}
                    </span>
                    {sample.analyzed && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <button
                    onClick={() => {
                      const newSamples = [...profile.sampleTexts];
                      newSamples.splice(index, 1);
                      onUpdate({ sampleTexts: newSamples });
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">{sample.content}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {profile.sampleTexts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>No writing samples added yet</p>
          <p className="text-sm">Add samples above to improve voice analysis accuracy</p>
        </div>
      )}
    </div>
  );
};

// Analysis Tab
const AnalysisTab: React.FC<{
  profile: VoiceProfile;
  analysis: VoiceAnalysis | null;
  onGenerateSample: (type: 'resume' | 'cover_letter' | 'email') => void;
}> = ({ profile, analysis, onGenerateSample }) => {
  if (!analysis) {
    return (
      <div className="text-center py-12 text-gray-500">
        <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-lg font-medium mb-2">No Analysis Available</p>
        <p>Add and analyze writing samples to see your voice profile insights</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analysis Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">{profile.formality}/10</div>
          <div className="text-sm text-gray-600">Formality</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">{profile.confidence}/10</div>
          <div className="text-sm text-gray-600">Confidence</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">{profile.enthusiasm}/10</div>
          <div className="text-sm text-gray-600">Enthusiasm</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">{profile.confidence_score}%</div>
          <div className="text-sm text-gray-600">AI Confidence</div>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice Analysis Results</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Writing Characteristics</h4>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-700">Primary Tone:</dt>
                <dd className="text-sm text-gray-600 capitalize">{analysis.tone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-700">Vocabulary Level:</dt>
                <dd className="text-sm text-gray-600 capitalize">{analysis.vocabulary}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-700">Sentence Structure:</dt>
                <dd className="text-sm text-gray-600 capitalize">{analysis.sentenceStructure}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Key Phrases Identified</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.keyPhrases.slice(0, 10).map((phrase, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                >
                  {phrase}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
          
          <div className="space-y-3">
            {analysis.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  suggestion.type === 'improvement'
                    ? 'bg-blue-50 border-l-4 border-blue-400'
                    : suggestion.type === 'insight'
                    ? 'bg-green-50 border-l-4 border-green-400'
                    : 'bg-amber-50 border-l-4 border-amber-400'
                }`}
              >
                <div className="flex items-start gap-2">
                  {suggestion.type === 'improvement' && (
                    <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />
                  )}
                  {suggestion.type === 'insight' && (
                    <Lightbulb className="w-4 h-4 text-green-500 mt-0.5" />
                  )}
                  {suggestion.type === 'warning' && (
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                  )}
                  <p className="text-sm text-gray-700">{suggestion.message}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Sample Generation */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Your Voice Profile</h3>
        <p className="text-gray-600 mb-4">
          Generate sample content using your voice profile to see how it sounds.
        </p>
        
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => onGenerateSample('resume')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Generate Resume Sample
          </Button>
          <Button
            onClick={() => onGenerateSample('cover_letter')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Generate Cover Letter Sample
          </Button>
          <Button
            onClick={() => onGenerateSample('email')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Mic className="w-4 h-4" />
            Generate Email Sample
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Preview Tab
const PreviewTab: React.FC<{
  profile: VoiceProfile;
  onGenerateSample: (type: 'resume' | 'cover_letter' | 'email') => void;
}> = ({ profile, onGenerateSample }) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice Profile Summary</h3>
        
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            Based on your settings and analyzed writing samples, here's your voice profile:
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-800">
              <strong>Your writing style is {profile.tone}</strong> with a formality level of {profile.formality}/10. 
              You tend to write with {profile.confidence >= 7 ? 'high' : profile.confidence >= 5 ? 'moderate' : 'low'} confidence 
              and {profile.enthusiasm >= 7 ? 'high' : profile.enthusiasm >= 5 ? 'moderate' : 'low'} enthusiasm. 
              Your vocabulary is typically {profile.vocabulary}, 
              and you prefer {profile.sentenceStructure} sentences.
            </p>
          </div>

          <h4 className="font-medium text-gray-900 mb-2">Writing Patterns:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Average {profile.writingPatterns.averageWordsPerSentence} words per sentence</li>
            <li>• {profile.writingPatterns.paragraphLength.charAt(0).toUpperCase() + profile.writingPatterns.paragraphLength.slice(1)} paragraphs</li>
            {profile.writingPatterns.useOfNumbers && <li>• Includes numbers and metrics</li>}
            {profile.writingPatterns.useOfBulletPoints && <li>• Uses bullet points for clarity</li>}
            {profile.writingPatterns.activeVoice && <li>• Prefers active voice</li>}
          </ul>

          {profile.commonPhrases.length > 0 && (
            <>
              <h4 className="font-medium text-gray-900 mb-2 mt-4">Common Phrases:</h4>
              <div className="flex flex-wrap gap-2">
                {profile.commonPhrases.slice(0, 10).map((phrase, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    "{phrase}"
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Sample Content</h3>
        <p className="text-gray-600 mb-4">
          Test how your voice profile affects generated content across different document types.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => onGenerateSample('resume')}
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <FileText className="w-6 h-6" />
            <div>
              <div className="font-medium">Resume Section</div>
              <div className="text-xs opacity-90">Professional summary</div>
            </div>
          </Button>
          
          <Button
            onClick={() => onGenerateSample('cover_letter')}
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <MessageSquare className="w-6 h-6" />
            <div>
              <div className="font-medium">Cover Letter</div>
              <div className="text-xs opacity-75">Opening paragraph</div>
            </div>
          </Button>
          
          <Button
            onClick={() => onGenerateSample('email')}
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <Mic className="w-6 h-6" />
            <div>
              <div className="font-medium">Professional Email</div>
              <div className="text-xs opacity-75">Follow-up message</div>
            </div>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VoiceProfileManager;