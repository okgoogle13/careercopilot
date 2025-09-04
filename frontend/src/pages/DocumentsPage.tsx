import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { useAuthStatus } from '../hooks';
import { DocumentUpload } from '../components/documents/DocumentUpload';
import { DocumentCard } from '../components/documents/DocumentCard';
// Importing components from the UI barrel file for consistency
import { Button, Input, Tabs, TabsList, TabsTrigger } from '../components/ui';
import { Search, FileText, Upload } from 'lucide-react';

export interface DocumentType {
  id: string;
  originalFilename: string;
  fileType: string;
  size: number;
  createdAt: { _seconds: number } | Date;
  downloadUrl?: string;
  metadata?: Record<string, any>;
}

const DocumentsPage: React.FC = () => {
  // const navigate = useNavigate();
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    error: authError,
    requireAuth,
    getAuthToken,
  } = useAuthStatus();

  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [_error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [_isUploading, setIsUploading] = useState(false);

  const { preferences } = useUserPreferences();
  const userTheme = preferences?.themeId || 'professional';

  // Filter documents based on search query and active tab
  useEffect(() => {
    let result = [...documents];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(doc =>
        doc.originalFilename.toLowerCase().includes(query) ||
        doc.fileType.toLowerCase().includes(query)
      );
    }

    // Apply tab filter
    if (activeTab !== 'all') {
      result = result.filter(doc => doc.fileType === activeTab);
    }

    setFilteredDocuments(result);
  }, [documents, searchQuery, activeTab]);

  const fetchDocuments = useCallback(async () => {
    if (!requireAuth()) return;

    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        setError('Unable to get authentication token');
        return;
      }

      const response = await fetch('/api/v1/documents', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch documents');

      const data = await response.json();
      setDocuments(data);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load documents';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [requireAuth, getAuthToken]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDocuments();
    } else if (!isAuthLoading) {
      setLoading(false);
      setError('Please log in to view documents');
    }
  }, [isAuthenticated, isAuthLoading, fetchDocuments]);

  const handleDelete = async (documentId: string) => {
    if (!requireAuth()) {
      toast.error('You must be logged in to delete files.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Authentication error. Please log in again.');
        return;
      }

      const response = await fetch(`/api/v1/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      toast.success('Document deleted successfully');
      fetchDocuments(); // Refresh the document list
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete document';
      toast.error(message);
    }
  };

  const handleDownload = async (
    documentId: string,
    originalFilename: string
  ) => {
    if (!requireAuth()) {
      toast.error('You must be logged in to download files.');
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Unable to get authentication token');
        return;
      }

      // Append the user's selected theme to the download URL
      const downloadUrl = `/api/v1/documents/${documentId}/download-pdf?theme=${userTheme}`;
      const response = await fetch(downloadUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('PDF download failed.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${originalFilename.split('.')[0]}_${userTheme}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('PDF download started!');
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to download PDF.'
      );
    }
  };

  const getDocumentDate = (doc: DocumentType): Date => {
    if (doc.createdAt instanceof Date) {
      return doc.createdAt;
    }
    return new Date(doc.createdAt._seconds * 1000);
  };

  if (isAuthLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your documents...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-lg">
          <h3 className="font-medium">Authentication Error</h3>
          <p className="text-sm">{authError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col space-y-6">
        {/* Header and Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Documents</h1>
            <p className="text-muted-foreground text-sm">
              Manage your uploaded documents and track their status
            </p>
          </div>
          <DocumentUpload
            onUpload={fetchDocuments}
            className="w-full md:w-auto"
            disabled={isUploading}
          />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-3 md:flex w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="resume">Resumes</TabsTrigger>
              <TabsTrigger value="cover-letter">Cover Letters</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Document List */}
        <div className="grid gap-4">
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={{
                    ...doc,
                    createdAt: getDocumentDate(doc)
                  }}
                  onDownload={() => handleDownload(doc.id, doc.originalFilename)}
                  onDelete={() => handleDelete(doc.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No documents found</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md px-4">
                {searchQuery
                  ? 'No documents match your search. Try a different term.'
                  : activeTab !== 'all'
                    ? `You don't have any ${activeTab.replace('-', ' ')}. Upload one to get started.`
                    : 'Upload your first document to get started.'
                }
              </p>
              {!searchQuery && activeTab === 'all' && (
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => {
                    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                    if (fileInput) {
                      fileInput.click();
                    }
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
