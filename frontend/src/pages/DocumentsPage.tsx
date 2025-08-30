import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { useAuthStatus } from '../hooks';

interface DocumentType {
  id: string;
  originalFilename: string;
  createdAt: {
    _seconds: number;
  };
}

const DocumentsPage: React.FC = () => {
  const {
    isAuthenticated,
    isLoading,
    error: authError,
    requireAuth,
    getAuthToken,
  } = useAuthStatus();
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { preferences } = useUserPreferences();
  const userTheme = preferences?.themeId || 'professional';

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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [requireAuth, getAuthToken]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDocuments();
    } else if (!isLoading) {
      setLoading(false);
      setError(authError);
    }
  }, [isAuthenticated, isLoading, authError, fetchDocuments]);

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

  const formatDate = (timestamp: { _seconds: number } | null | undefined) => {
    if (!timestamp || !timestamp._seconds) return 'Date not available';
    return new Date(timestamp._seconds * 1000).toLocaleDateString();
  };

  const renderContent = () => {
    if (isLoading || loading)
      return <div className="p-4 text-center">Loading documents...</div>;
    if (error)
      return <div className="p-4 text-center text-red-500">{error}</div>;
    if (documents.length === 0) {
      return (
        <div className="text-center p-10 border-2 border-dashed rounded-lg">
          <p className="text-gray-600">
            You haven't uploaded any documents. Click 'Upload' to add your first
            one.
          </p>
        </div>
      );
    }
    return (
      <div className="bg-white shadow-md rounded-lg">
        <ul className="divide-y divide-gray-200">
          {documents.map(doc => (
            <li
              key={doc.id}
              className="px-6 py-4 flex items-center justify-between"
            >
              <div>
                <span className="font-medium text-gray-900">
                  {doc.originalFilename}
                </span>
                <span className="text-sm text-gray-600 block">
                  Uploaded: {formatDate(doc.createdAt)}
                </span>
              </div>
              <button
                onClick={() => handleDownload(doc.id, doc.originalFilename)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Download PDF
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Documents</h1>
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Upload New Document</h2>
        {/* Upload form remains the same */}
      </div>
      {renderContent()}
    </div>
  );
};

export default DocumentsPage;
