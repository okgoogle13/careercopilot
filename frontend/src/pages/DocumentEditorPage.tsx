import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, Modal, LoadingSpinner } from '../components/ui';
import { HelpButton } from '../components/HelpSystem';
import {
  Save,
  Undo,
  Redo,
  Download,
  Share2,
  ArrowLeft,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  RefreshCw,
  Zap,
  FileText,
  Settings,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  ChevronDown,
  Type,
  Palette,
  Move3D,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface DocumentData {
  id?: string;
  type: 'resume' | 'cover_letter' | 'ksc';
  title: string;
  content: DocumentSection[];
  profileId: string;
  jobTitle?: string;
  companyName?: string;
  template: string;
  formatting: FormattingOptions;
  metadata: {
    created: Date;
    updated: Date;
    version: number;
  };
}

interface DocumentSection {
  id: string;
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'custom';
  title: string;
  content: string;
  order: number;
  visible: boolean;
  formatting?: SectionFormatting;
}

interface FormattingOptions {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  colors: {
    primary: string;
    secondary: string;
    text: string;
    accent: string;
  };
}

interface SectionFormatting {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  alignment?: 'left' | 'center' | 'right';
  fontSize?: number;
  color?: string;
}

const DocumentEditorPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [document, setDocument] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [editorHistory, setEditorHistory] = useState<DocumentData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showFormatting, setShowFormatting] = useState(true);
  const [splitRatio, setSplitRatio] = useState(0.5); // 50-50 split
  const [isDragging, setIsDragging] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Load document data
  useEffect(() => {
    if (!user?.uid) return;

    const loadDocument = async () => {
      try {
        if (documentId === 'new') {
          // Create new document
          const newDoc: DocumentData = {
            type: 'resume',
            title: 'Untitled Document',
            content: [
              {
                id: 'header',
                type: 'header',
                title: 'Personal Information',
                content: '',
                order: 0,
                visible: true,
              },
              {
                id: 'summary',
                type: 'summary',
                title: 'Professional Summary',
                content: '',
                order: 1,
                visible: true,
              },
            ],
            profileId: '',
            template: 'modern-minimalist',
            formatting: {
              fontFamily: 'Inter',
              fontSize: 11,
              lineHeight: 1.5,
              margins: { top: 0.75, bottom: 0.75, left: 0.75, right: 0.75 },
              colors: {
                primary: '#2563eb',
                secondary: '#64748b',
                text: '#1f2937',
                accent: '#3b82f6',
              },
            },
            metadata: {
              created: new Date(),
              updated: new Date(),
              version: 1,
            },
          };
          setDocument(newDoc);
          addToHistory(newDoc);
        } else {
          // Load existing document
          const response = await fetch(`/api/v1/documents/${documentId}`, {
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
          });

          if (response.ok) {
            const docData = await response.json();
            setDocument(docData);
            addToHistory(docData);
          } else {
            toast.error('Document not found');
            navigate('/documents');
          }
        }
      } catch (error) {
        console.error('Error loading document:', error);
        toast.error('Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [documentId, user, navigate]);

  // History management
  const addToHistory = (doc: DocumentData) => {
    setEditorHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(doc);
      if (newHistory.length > 50) {
        // Limit history to 50 items
        newHistory.shift();
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  };

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setDocument(editorHistory[historyIndex - 1]);
      setUnsavedChanges(true);
    }
  }, [historyIndex, editorHistory]);

  const redo = useCallback(() => {
    if (historyIndex < editorHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setDocument(editorHistory[historyIndex + 1]);
      setUnsavedChanges(true);
    }
  }, [historyIndex, editorHistory]);

  // Auto-save functionality
  useEffect(() => {
    if (document && unsavedChanges && document.id) {
      const saveTimeout = setTimeout(async () => {
        try {
          setSaving(true);
          const response = await fetch(`/api/v1/documents/${document.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${await user?.getIdToken()}`,
            },
            body: JSON.stringify({
              ...document,
              'metadata.updated': new Date(),
              'metadata.version': document.metadata.version + 1,
            }),
          });

          if (response.ok) {
            setUnsavedChanges(false);
            toast.success('Document saved', { duration: 2000 });
          }
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setSaving(false);
        }
      }, 3000);

      return () => clearTimeout(saveTimeout);
    }
  }, [document, unsavedChanges, user]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'z':
            if (e.shiftKey) {
              e.preventDefault();
              redo();
            } else {
              e.preventDefault();
              undo();
            }
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
        }
      }
      if (e.key === 'F11') {
        e.preventDefault();
        setIsFullscreen(!isFullscreen);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, isFullscreen]);

  // Split pane resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const container = resizeRef.current?.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newRatio = Math.min(
        Math.max((e.clientX - containerRect.left) / containerRect.width, 0.2),
        0.8
      );
      setSplitRatio(newRatio);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleSave = async () => {
    if (!document || !user) return;

    setSaving(true);
    try {
      const url = document.id ? `/api/v1/documents/${document.id}` : '/api/v1/documents';
      const method = document.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          ...document,
          'metadata.updated': new Date(),
          'metadata.version': (document.metadata?.version || 0) + 1,
        }),
      });

      if (response.ok) {
        const savedDoc = await response.json();
        setDocument(savedDoc);
        setUnsavedChanges(false);
        toast.success('Document saved successfully!');
      } else {
        toast.error('Failed to save document');
      }
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (sectionId: string, updates: Partial<DocumentSection>) => {
    if (!document) return;

    const newDocument = {
      ...document,
      content: document.content.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    };

    setDocument(newDocument);
    setUnsavedChanges(true);
    addToHistory(newDocument);
  };

  const addSection = (type: DocumentSection['type'], afterSectionId?: string) => {
    if (!document) return;

    const newSection: DocumentSection = {
      id: `section-${Date.now()}`,
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      content: '',
      order: document.content.length,
      visible: true,
    };

    let newContent;
    if (afterSectionId) {
      const afterIndex = document.content.findIndex(s => s.id === afterSectionId);
      newContent = [...document.content];
      newContent.splice(afterIndex + 1, 0, newSection);
    } else {
      newContent = [...document.content, newSection];
    }

    // Reorder sections
    newContent.forEach((section, index) => {
      section.order = index;
    });

    const newDocument = { ...document, content: newContent };
    setDocument(newDocument);
    setUnsavedChanges(true);
    addToHistory(newDocument);
  };

  const deleteSection = (sectionId: string) => {
    if (!document) return;

    const newDocument = {
      ...document,
      content: document.content.filter(section => section.id !== sectionId),
    };

    setDocument(newDocument);
    setUnsavedChanges(true);
    addToHistory(newDocument);
  };

  const applySectionFormatting = (sectionId: string, formatting: SectionFormatting) => {
    updateSection(sectionId, { formatting: { ...formatting } });
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  if (!document) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>Document not found</h2>
          <Button onClick={() => navigate('/documents')}>Return to Documents</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'min-h-screen bg-gray-50'}`}>
      {/* Header */}
      <div className='bg-white shadow-sm border-b sticky top-0 z-40'>
        <div className='max-w-full px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              {!isFullscreen && (
                <Button
                  variant='ghost'
                  onClick={() => navigate('/documents')}
                  className='flex items-center gap-2'
                >
                  <ArrowLeft className='w-4 h-4' />
                  Back
                </Button>
              )}

              <div>
                <input
                  type='text'
                  value={document.title}
                  onChange={e => {
                    setDocument(prev => (prev ? { ...prev, title: e.target.value } : null));
                    setUnsavedChanges(true);
                  }}
                  className='text-xl font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1 rounded'
                  placeholder='Document Title'
                />
                <div className='flex items-center gap-4 text-sm text-gray-500'>
                  <span>{document.type.replace('_', ' ').toUpperCase()}</span>
                  {unsavedChanges && (
                    <span className='flex items-center gap-1 text-amber-600'>
                      <div className='w-2 h-2 bg-amber-500 rounded-full animate-pulse' />
                      Unsaved changes
                    </span>
                  )}
                  {saving && <span className='text-blue-600'>Saving...</span>}
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={undo}
                disabled={historyIndex <= 0}
                title='Undo (Ctrl+Z)'
              >
                <Undo className='w-4 h-4' />
              </Button>

              <Button
                variant='ghost'
                size='sm'
                onClick={redo}
                disabled={historyIndex >= editorHistory.length - 1}
                title='Redo (Ctrl+Y)'
              >
                <Redo className='w-4 h-4' />
              </Button>

              <div className='w-px h-6 bg-gray-300' />

              <Button
                variant='ghost'
                size='sm'
                onClick={() => setPreviewMode(!previewMode)}
                className='flex items-center gap-2'
              >
                {previewMode ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                {previewMode ? 'Edit' : 'Preview'}
              </Button>

              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsFullscreen(!isFullscreen)}
                title='Toggle Fullscreen (F11)'
              >
                {isFullscreen ? (
                  <Minimize2 className='w-4 h-4' />
                ) : (
                  <Maximize2 className='w-4 h-4' />
                )}
              </Button>

              <div className='w-px h-6 bg-gray-300' />

              <Button variant='ghost' size='sm' onClick={() => setShowFormatting(!showFormatting)}>
                <Settings className='w-4 h-4' />
              </Button>

              <HelpButton helpId='profile-editor-sections' size='sm' />

              <Button
                onClick={handleSave}
                disabled={saving || !unsavedChanges}
                className='flex items-center gap-2'
              >
                <Save className='w-4 h-4' />
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex h-full'>
        {/* Formatting Sidebar */}
        {showFormatting && (
          <FormattingSidebar
            document={document}
            selectedSectionId={selectedSectionId}
            onFormatDocument={formatting => {
              setDocument(prev => (prev ? { ...prev, formatting } : null));
              setUnsavedChanges(true);
            }}
            onFormatSection={applySectionFormatting}
          />
        )}

        {/* Split Editor/Preview */}
        <div className='flex-1 flex'>
          {/* Editor Pane */}
          <div className='bg-white border-r' style={{ width: `${splitRatio * 100}%` }}>
            <DocumentEditor
              ref={editorRef}
              document={document}
              selectedSectionId={selectedSectionId}
              onSelectSection={setSelectedSectionId}
              onUpdateSection={updateSection}
              onAddSection={addSection}
              onDeleteSection={deleteSection}
              previewMode={previewMode}
            />
          </div>

          {/* Resize Handle */}
          <div
            ref={resizeRef}
            className='w-1 bg-gray-300 cursor-col-resize hover:bg-gray-400 transition-colors relative group'
            onMouseDown={() => setIsDragging(true)}
          >
            <div className='absolute inset-y-0 -inset-x-1 group-hover:bg-blue-500 group-hover:bg-opacity-20 transition-colors' />
            <Move3D className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity' />
          </div>

          {/* Preview Pane */}
          <div className='bg-gray-50 overflow-auto' style={{ width: `${(1 - splitRatio) * 100}%` }}>
            <DocumentPreview ref={previewRef} document={document} className='p-8' />
          </div>
        </div>
      </div>
    </div>
  );
};

// Document Editor Component
const DocumentEditor = React.forwardRef<
  HTMLDivElement,
  {
    document: DocumentData;
    selectedSectionId: string | null;
    onSelectSection: (id: string | null) => void;
    onUpdateSection: (id: string, updates: Partial<DocumentSection>) => void;
    onAddSection: (type: DocumentSection['type'], afterId?: string) => void;
    onDeleteSection: (id: string) => void;
    previewMode: boolean;
  }
>(
  (
    {
      document,
      selectedSectionId,
      onSelectSection,
      onUpdateSection,
      onAddSection,
      onDeleteSection,
      previewMode,
    },
    ref
  ) => {
    if (previewMode) {
      return <DocumentPreview document={document} />;
    }

    return (
      <div ref={ref} className='h-full overflow-auto p-6'>
        <div className='max-w-4xl mx-auto space-y-6'>
          {document.content
            .sort((a, b) => a.order - b.order)
            .map(section => (
              <SectionEditor
                key={section.id}
                section={section}
                isSelected={selectedSectionId === section.id}
                onSelect={() => onSelectSection(section.id)}
                onUpdate={updates => onUpdateSection(section.id, updates)}
                onAddAfter={type => onAddSection(type, section.id)}
                onDelete={() => onDeleteSection(section.id)}
              />
            ))}

          {/* Add Section Button */}
          <div className='text-center py-8'>
            <AddSectionDropdown onAddSection={type => onAddSection(type)} />
          </div>
        </div>
      </div>
    );
  }
);

// Section Editor Component
const SectionEditor: React.FC<{
  section: DocumentSection;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<DocumentSection>) => void;
  onAddAfter: (type: DocumentSection['type']) => void;
  onDelete: () => void;
}> = ({ section, isSelected, onSelect, onUpdate, onAddAfter, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <Card
      className={`transition-all ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={onSelect}
    >
      <div className='p-6'>
        {/* Section Header */}
        <div className='flex items-center justify-between mb-4'>
          <input
            type='text'
            value={section.title}
            onChange={e => onUpdate({ title: e.target.value })}
            className='text-lg font-semibold text-gray-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1 rounded'
            placeholder='Section Title'
          />

          {(showActions || isSelected) && (
            <div className='flex items-center gap-2'>
              <Button
                size='sm'
                variant='ghost'
                onClick={() => onUpdate({ visible: !section.visible })}
                className={section.visible ? 'text-green-600' : 'text-gray-400'}
              >
                <Eye className='w-4 h-4' />
              </Button>

              <AddSectionDropdown onAddSection={onAddAfter} size='sm' />

              <Button
                size='sm'
                variant='ghost'
                onClick={onDelete}
                className='text-red-500 hover:text-red-700'
              >
                <FileText className='w-4 h-4' />
              </Button>
            </div>
          )}
        </div>

        {/* Section Content */}
        <textarea
          value={section.content}
          onChange={e => onUpdate({ content: e.target.value })}
          className='w-full min-h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical'
          placeholder={`Enter ${section.type} content...`}
          style={{
            fontFamily: section.formatting?.bold ? 'bold' : 'normal',
            fontStyle: section.formatting?.italic ? 'italic' : 'normal',
            textDecoration: section.formatting?.underline ? 'underline' : 'none',
            textAlign: section.formatting?.alignment || 'left',
            fontSize: section.formatting?.fontSize ? `${section.formatting.fontSize}px` : 'inherit',
            color: section.formatting?.color || 'inherit',
          }}
        />
      </div>
    </Card>
  );
};

// Add Section Dropdown
const AddSectionDropdown: React.FC<{
  onAddSection: (type: DocumentSection['type']) => void;
  size?: 'sm' | 'md';
}> = ({ onAddSection, size = 'md' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sectionTypes: Array<{
    type: DocumentSection['type'];
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { type: 'header', label: 'Personal Information', icon: FileText },
    { type: 'summary', label: 'Professional Summary', icon: FileText },
    { type: 'experience', label: 'Work Experience', icon: FileText },
    { type: 'education', label: 'Education', icon: FileText },
    { type: 'skills', label: 'Skills', icon: FileText },
    { type: 'custom', label: 'Custom Section', icon: FileText },
  ];

  return (
    <div className='relative'>
      <Button
        size={size}
        variant='outline'
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2'
      >
        <FileText className='w-4 h-4' />
        Add Section
        <ChevronDown className='w-3 h-3' />
      </Button>

      {isOpen && (
        <>
          <div className='fixed inset-0 z-10' onClick={() => setIsOpen(false)} />
          <div className='absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20'>
            <div className='py-1'>
              {sectionTypes.map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => {
                    onAddSection(type);
                    setIsOpen(false);
                  }}
                  className='flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                >
                  <Icon className='w-4 h-4' />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Formatting Sidebar Component
const FormattingSidebar: React.FC<{
  document: DocumentData;
  selectedSectionId: string | null;
  onFormatDocument: (formatting: FormattingOptions) => void;
  onFormatSection: (sectionId: string, formatting: SectionFormatting) => void;
}> = ({ document, selectedSectionId, onFormatDocument, onFormatSection }) => {
  const selectedSection = selectedSectionId
    ? document.content.find(s => s.id === selectedSectionId)
    : null;

  return (
    <div className='w-80 bg-white border-r border-gray-200 overflow-auto'>
      <div className='p-4 space-y-6'>
        <div className='flex items-center gap-2'>
          <Palette className='w-5 h-5 text-blue-500' />
          <h3 className='font-semibold text-gray-900'>Formatting</h3>
        </div>

        {/* Document-level formatting */}
        <Card className='p-4'>
          <h4 className='font-medium text-gray-900 mb-3'>Document Style</h4>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Font Family</label>
              <select
                value={document.formatting.fontFamily}
                onChange={e =>
                  onFormatDocument({
                    ...document.formatting,
                    fontFamily: e.target.value,
                  })
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              >
                <option value='Inter'>Inter</option>
                <option value='Arial'>Arial</option>
                <option value='Times New Roman'>Times New Roman</option>
                <option value='Georgia'>Georgia</option>
                <option value='Helvetica'>Helvetica</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Font Size: {document.formatting.fontSize}pt
              </label>
              <input
                type='range'
                min='8'
                max='16'
                value={document.formatting.fontSize}
                onChange={e =>
                  onFormatDocument({
                    ...document.formatting,
                    fontSize: parseInt(e.target.value),
                  })
                }
                className='w-full'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Line Height: {document.formatting.lineHeight}
              </label>
              <input
                type='range'
                min='1'
                max='2'
                step='0.1'
                value={document.formatting.lineHeight}
                onChange={e =>
                  onFormatDocument({
                    ...document.formatting,
                    lineHeight: parseFloat(e.target.value),
                  })
                }
                className='w-full'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Colors</label>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <label className='block text-xs text-gray-600 mb-1'>Primary</label>
                  <input
                    type='color'
                    value={document.formatting.colors.primary}
                    onChange={e =>
                      onFormatDocument({
                        ...document.formatting,
                        colors: {
                          ...document.formatting.colors,
                          primary: e.target.value,
                        },
                      })
                    }
                    className='w-full h-8 border border-gray-300 rounded'
                  />
                </div>
                <div>
                  <label className='block text-xs text-gray-600 mb-1'>Text</label>
                  <input
                    type='color'
                    value={document.formatting.colors.text}
                    onChange={e =>
                      onFormatDocument({
                        ...document.formatting,
                        colors: {
                          ...document.formatting.colors,
                          text: e.target.value,
                        },
                      })
                    }
                    className='w-full h-8 border border-gray-300 rounded'
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Section-level formatting */}
        {selectedSection && (
          <Card className='p-4'>
            <h4 className='font-medium text-gray-900 mb-3'>Section: {selectedSection.title}</h4>

            <div className='space-y-4'>
              {/* Text Formatting */}
              <div className='flex items-center gap-2'>
                <Button
                  size='sm'
                  variant={selectedSection.formatting?.bold ? 'default' : 'outline'}
                  onClick={() =>
                    onFormatSection(selectedSection.id, {
                      ...selectedSection.formatting,
                      bold: !selectedSection.formatting?.bold,
                    })
                  }
                >
                  <Bold className='w-3 h-3' />
                </Button>
                <Button
                  size='sm'
                  variant={selectedSection.formatting?.italic ? 'default' : 'outline'}
                  onClick={() =>
                    onFormatSection(selectedSection.id, {
                      ...selectedSection.formatting,
                      italic: !selectedSection.formatting?.italic,
                    })
                  }
                >
                  <Italic className='w-3 h-3' />
                </Button>
                <Button
                  size='sm'
                  variant={selectedSection.formatting?.underline ? 'default' : 'outline'}
                  onClick={() =>
                    onFormatSection(selectedSection.id, {
                      ...selectedSection.formatting,
                      underline: !selectedSection.formatting?.underline,
                    })
                  }
                >
                  <Underline className='w-3 h-3' />
                </Button>
              </div>

              {/* Alignment */}
              <div className='flex items-center gap-2'>
                <Button
                  size='sm'
                  variant={selectedSection.formatting?.alignment === 'left' ? 'default' : 'outline'}
                  onClick={() =>
                    onFormatSection(selectedSection.id, {
                      ...selectedSection.formatting,
                      alignment: 'left',
                    })
                  }
                >
                  <AlignLeft className='w-3 h-3' />
                </Button>
                <Button
                  size='sm'
                  variant={
                    selectedSection.formatting?.alignment === 'center' ? 'default' : 'outline'
                  }
                  onClick={() =>
                    onFormatSection(selectedSection.id, {
                      ...selectedSection.formatting,
                      alignment: 'center',
                    })
                  }
                >
                  <AlignCenter className='w-3 h-3' />
                </Button>
                <Button
                  size='sm'
                  variant={
                    selectedSection.formatting?.alignment === 'right' ? 'default' : 'outline'
                  }
                  onClick={() =>
                    onFormatSection(selectedSection.id, {
                      ...selectedSection.formatting,
                      alignment: 'right',
                    })
                  }
                >
                  <AlignRight className='w-3 h-3' />
                </Button>
              </div>

              {/* Font Size */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Font Size: {selectedSection.formatting?.fontSize || 'Default'}
                </label>
                <input
                  type='range'
                  min='8'
                  max='24'
                  value={selectedSection.formatting?.fontSize || document.formatting.fontSize}
                  onChange={e =>
                    onFormatSection(selectedSection.id, {
                      ...selectedSection.formatting,
                      fontSize: parseInt(e.target.value),
                    })
                  }
                  className='w-full'
                />
              </div>

              {/* Color */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Text Color</label>
                <input
                  type='color'
                  value={selectedSection.formatting?.color || document.formatting.colors.text}
                  onChange={e =>
                    onFormatSection(selectedSection.id, {
                      ...selectedSection.formatting,
                      color: e.target.value,
                    })
                  }
                  className='w-full h-8 border border-gray-300 rounded'
                />
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

// Document Preview Component
const DocumentPreview = React.forwardRef<
  HTMLDivElement,
  {
    document: DocumentData;
    className?: string;
  }
>(({ document, className = '' }, ref) => {
  const previewStyles = {
    fontFamily: document.formatting.fontFamily,
    fontSize: `${document.formatting.fontSize}pt`,
    lineHeight: document.formatting.lineHeight,
    color: document.formatting.colors.text,
    padding: `${document.formatting.margins.top}in ${document.formatting.margins.right}in ${document.formatting.margins.bottom}in ${document.formatting.margins.left}in`,
  };

  return (
    <div ref={ref} className={`bg-white shadow-lg max-w-[8.5in] mx-auto ${className}`}>
      <div style={previewStyles} className='min-h-[11in]'>
        {document.content
          .filter(section => section.visible)
          .sort((a, b) => a.order - b.order)
          .map(section => (
            <div key={section.id} className='mb-4'>
              <h3
                className='font-semibold mb-2'
                style={{
                  color: document.formatting.colors.primary,
                  fontSize: `${document.formatting.fontSize + 2}pt`,
                  fontWeight: section.formatting?.bold ? 'bold' : 'semibold',
                  fontStyle: section.formatting?.italic ? 'italic' : 'normal',
                  textDecoration: section.formatting?.underline ? 'underline' : 'none',
                  textAlign: section.formatting?.alignment || 'left',
                }}
              >
                {section.title}
              </h3>
              <div
                className='whitespace-pre-wrap'
                style={{
                  fontWeight: section.formatting?.bold ? 'bold' : 'normal',
                  fontStyle: section.formatting?.italic ? 'italic' : 'normal',
                  textDecoration: section.formatting?.underline ? 'underline' : 'none',
                  textAlign: section.formatting?.alignment || 'left',
                  fontSize: section.formatting?.fontSize
                    ? `${section.formatting.fontSize}pt`
                    : 'inherit',
                  color: section.formatting?.color || 'inherit',
                }}
              >
                {section.content}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
});

export default DocumentEditorPage;
