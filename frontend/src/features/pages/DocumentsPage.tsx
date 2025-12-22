import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, FileText, Calendar } from 'lucide-react';
import { Container } from '@/components';
// import snakePlant from 'figma:asset/41188de77d610c3b921deb50cf0552f855047a4a.png';

export function DocumentsPage() {
  const [activeTab, setActiveTab] = useState('all');

  const documents = [
    { id: 1, name: 'Software Engineer Resume', type: 'resume', date: 'Updated 2 days ago', icon: '📄' },
    { id: 2, name: 'Cover Letter - TechCorp', type: 'cover', date: 'Updated 3 days ago', icon: '📝' },
    { id: 3, name: 'UX Designer Resume', type: 'resume', date: 'Updated 1 week ago', icon: '📄' },
    { id: 4, name: 'Product Manager Resume', type: 'resume', date: 'Updated 1 week ago', icon: '📄' },
    { id: 5, name: 'Cover Letter - DesignHub', type: 'cover', date: 'Updated 5 days ago', icon: '📝' },
    { id: 6, name: 'Generic Cover Letter', type: 'cover', date: 'Updated 2 weeks ago', icon: '📝' },
    { id: 7, name: 'KSC Response - Leadership', type: 'ksc', date: 'Updated 4 days ago', icon: '📋' },
    { id: 8, name: 'KSC Response - Communication', type: 'ksc', date: 'Updated 1 week ago', icon: '📋' },
  ];

  const filteredDocs = documents.filter(doc => {
    if (activeTab === 'all') return true;
    if (activeTab === 'resumes') return doc.type === 'resume';
    if (activeTab === 'covers') return doc.type === 'cover';
    if (activeTab === 'ksc') return doc.type === 'ksc';
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-surface relative min-h-screen">
      {/* Snake Plant Decoration - Bottom Right Corner */}
      <div
        className="fixed bottom-0 right-0 pointer-events-none z-0"
        style={{ width: '380px', opacity: 0.55 }}
      >
        {/* Placeholder for snakePlant if not found */}
        <div
          className="w-full h-[400px]"
          style={{
            background: 'radial-gradient(circle at bottom right, #6D7E44 0%, transparent 70%)',
            mixBlendMode: 'screen'
          }}
        />
      </div>

      <Container size="2xl" className="py-12 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h2 className="mb-2 text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight text-[#E6E1E5]">
            Your <span className="font-serif italic font-light text-[#D0BCFF]">Documents</span>
          </h2>
          <p className="text-[#CAC4D0] text-lg">Manage your career documents and generate tailored versions</p>
        </div>

        {/* Search Bar - Level 4 (Elevated) */}
        <div className="bg-[#36343B] rounded-[28px] p-4 mb-8 flex items-center gap-3 shadow-lg">
          <Search className="w-5 h-5 text-[#FFFFFF]" />
          <input
            type="text"
            placeholder="Search documents..."
            className="bg-transparent flex-1 outline-none text-[#FFFFFF] placeholder:text-[#CAC4D0] border-none focus:ring-0 p-0"
          />
        </div>

        {/* Tabs - Level 2 */}
        <div className="flex flex-wrap gap-2 mb-8 bg-[#25232A] rounded-full p-2 w-fit">
          {['all', 'resumes', 'covers', 'ksc'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-full transition-all capitalize ${activeTab === tab
                ? 'bg-[#D0BCFF] text-[#381E72] font-semibold shadow-sm'
                : 'text-[#CAC4D0] hover:text-[#E6E1E5]'
                }`}
            >
              {tab === 'covers' ? 'Cover Letters' : tab === 'ksc' ? 'KSC Responses' : tab}
            </button>
          ))}
        </div>

        {/* Documents Grid - Outlined Cards (Let texture show through) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={doc.id}
              className="bg-surface/50 border border-[#49454F] rounded-[28px] p-6 hover:bg-[#211F26]/30 hover:border-[#D0BCFF] transition-all cursor-pointer group backdrop-blur-md relative overflow-hidden"
            >
              <div className="w-12 h-12 bg-[#2B2930] rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-[#36343B] transition-all">
                {doc.icon}
              </div>
              <h4 className="text-[#E6E1E5] mb-2 font-bold text-lg leading-tight">
                {doc.name}
              </h4>
              <div className="flex items-center gap-2 text-[#CAC4D0] text-xs uppercase tracking-wider font-medium">
                <Calendar className="w-4 h-4" />
                <span>{doc.date}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State for filtered results */}
        {filteredDocs.length === 0 && (
          <div className="bg-[#211F26] rounded-3xl p-16 flex flex-col items-center justify-center border border-dashed border-[#49454F]">
            <FileText className="w-16 h-16 text-[#CAC4D0] mb-4 opacity-50" />
            <p className="text-[#CAC4D0] text-center">No documents found in this category</p>
          </div>
        )}
      </Container>
    </div>
  );
}

export default DocumentsPage;

