import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase-config';
import toast from 'react-hot-toast';

const DocumentsPage: React.FC = () => {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userTheme, setUserTheme] = useState<string>('professional');


    const fetchDocuments = async (user: User) => {
        try {
            setLoading(true);
            const token = await user.getIdToken();
            const response = await fetch('/api/v1/documents', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch documents');
            const data = await response.json();
            setDocuments(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await fetchDocuments(user);
                // Fetch user theme preference
                const userDocRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists() && docSnap.data().preferences?.themeId) {
                    setUserTheme(docSnap.data().preferences.themeId);
                }
            } else {
                setLoading(false);
                setError('You must be logged in to view this page.');
            }
        });
        return () => unsubscribe();
    }, []);

    const handleDownload = async (documentId: string, originalFilename: string) => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            toast.error("You must be logged in to download files.");
            return;
        }

        try {
            const token = await user.getIdToken();
            // Append the user's selected theme to the download URL
            const downloadUrl = `/api/v1/documents/${documentId}/download-pdf?theme=${userTheme}`;
            const response = await fetch(downloadUrl, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("PDF download failed.");
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
            toast.success("PDF download started!");

        } catch (err: any) {
            toast.error(err.message || "Failed to download PDF.");
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp || !timestamp._seconds) return 'Date not available';
        return new Date(timestamp._seconds * 1000).toLocaleDateString();
    };
    
    const renderContent = () => {
        if (loading) return <div className="p-4 text-center">Loading documents...</div>;
        if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
        if (documents.length === 0) {
            return (
                <div className="text-center p-10 border-2 border-dashed rounded-lg">
                    <p className="text-gray-500">You haven't uploaded any documents. Click 'Upload' to add your first one.</p>
                </div>
            );
        }
        return (
            <div className="bg-white shadow-md rounded-lg">
                <ul className="divide-y divide-gray-200">
                    {documents.map((doc) => (
                        <li key={doc.id} className="px-6 py-4 flex items-center justify-between">
                            <div>
                                <span className="font-medium text-gray-900">{doc.originalFilename}</span>
                                <span className="text-sm text-gray-500 block">Uploaded: {formatDate(doc.createdAt)}</span>
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
    }

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
