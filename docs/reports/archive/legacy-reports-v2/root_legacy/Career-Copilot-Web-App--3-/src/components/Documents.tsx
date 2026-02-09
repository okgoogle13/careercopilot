import { useState } from "react";
import { Search, FileText, Calendar } from "lucide-react";
import snakePlant from "../assets/images/snake-plant.png";
import { PageHeader } from "./shared/PageHeader";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type DocumentType = "resume" | "cover" | "ksc";

export interface Document {
  id: number;
  name: string;
  type: DocumentType;
  date: string;
  icon: string;
}

export type DocumentTab = "all" | "resumes" | "covers" | "ksc";

// ============================================================================
// MOCK DATA - Replace with API calls
// ============================================================================

const DOCUMENTS: Document[] = [
  {
    id: 1,
    name: "Software Engineer Resume",
    type: "resume",
    date: "Updated 2 days ago",
    icon: "📄",
  },
  {
    id: 2,
    name: "Cover Letter - TechCorp",
    type: "cover",
    date: "Updated 3 days ago",
    icon: "📝",
  },
  {
    id: 3,
    name: "UX Designer Resume",
    type: "resume",
    date: "Updated 1 week ago",
    icon: "📄",
  },
  {
    id: 4,
    name: "Product Manager Resume",
    type: "resume",
    date: "Updated 1 week ago",
    icon: "📄",
  },
  {
    id: 5,
    name: "Cover Letter - DesignHub",
    type: "cover",
    date: "Updated 5 days ago",
    icon: "📝",
  },
  {
    id: 6,
    name: "Generic Cover Letter",
    type: "cover",
    date: "Updated 2 weeks ago",
    icon: "📝",
  },
  {
    id: 7,
    name: "KSC Response - Leadership",
    type: "ksc",
    date: "Updated 4 days ago",
    icon: "📋",
  },
  {
    id: 8,
    name: "KSC Response - Communication",
    type: "ksc",
    date: "Updated 1 week ago",
    icon: "📋",
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function filterDocuments(documents: Document[], tab: DocumentTab): Document[] {
  if (tab === "all") return documents;

  const typeMap: Record<Exclude<DocumentTab, "all">, DocumentType> = {
    resumes: "resume",
    covers: "cover",
    ksc: "ksc",
  };

  return documents.filter((doc) => doc.type === typeMap[tab as keyof typeof typeMap]);
}

// ============================================================================
// COMPONENT
// ============================================================================

export function Documents() {
  const [activeTab, setActiveTab] = useState<DocumentTab>("all");

  const filteredDocs = filterDocuments(DOCUMENTS, activeTab);

  return (
    <div className="p-6 md:p-12 max-w-7xl relative">
      {/* Snake Plant Decoration - Bottom Right Corner */}
      <div className="fixed bottom-0 right-0 pointer-events-none w-[380px] z-[1] opacity-55">
        <img
          src={snakePlant}
          alt=""
          className="w-full h-auto mix-blend-screen"
          style={{
            WebkitMaskImage:
              "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.35) 8%, rgba(0,0,0,0.65) 18%, rgba(0,0,0,0.85) 28%, black 40%)",
            maskImage:
              "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.35) 8%, rgba(0,0,0,0.65) 18%, rgba(0,0,0,0.85) 28%, black 40%)",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <PageHeader
          title="Your Documents"
          highlightedWord="Documents"
          description="Manage your career documents and generate tailored versions"
        />

        {/* Search Bar */}
        <div className="bg-[#36343B] rounded-[28px] p-4 mb-8 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#FFFFFF]" />
          <input
            type="text"
            placeholder="Search documents..."
            className="bg-transparent flex-1 outline-none text-[#FFFFFF] placeholder:text-[#CAC4D0]"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-[#25232A] rounded-full p-2 w-fit">
          <TabButton
            label="All"
            isActive={activeTab === "all"}
            onClick={() => setActiveTab("all")}
          />
          <TabButton
            label="Resumes"
            isActive={activeTab === "resumes"}
            onClick={() => setActiveTab("resumes")}
          />
          <TabButton
            label="Cover Letters"
            isActive={activeTab === "covers"}
            onClick={() => setActiveTab("covers")}
          />
          <TabButton
            label="KSC Responses"
            isActive={activeTab === "ksc"}
            onClick={() => setActiveTab("ksc")}
          />
        </div>

        {/* Documents Grid */}
        {filteredDocs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-8 py-3 rounded-full transition-all font-medium
        ${isActive ? "bg-[#D0BCFF] text-[#381E72]" : "text-[#CAC4D0] hover:text-[#E6E1E5]"}
      `}
    >
      {label}
    </button>
  );
}

interface DocumentCardProps {
  document: Document;
}

function DocumentCard({ document }: DocumentCardProps) {
  return (
    <div className="bg-transparent border border-[#49454F] rounded-[28px] p-6 hover:bg-[#211F26]/30 hover:border-[#D0BCFF] transition-all cursor-pointer group backdrop-blur-[8px]">
      <div className="w-12 h-12 bg-[#2B2930] rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-[#36343B] transition-all">
        {document.icon}
      </div>
      <h4 className="text-[#E6E1E5] mb-2 font-bold">{document.name}</h4>
      <div className="flex items-center gap-2 text-[#CAC4D0]">
        <Calendar className="w-4 h-4" />
        <span className="uppercase tracking-[0.04em] text-[0.7rem] font-mono">{document.date}</span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-[#211F26] rounded-3xl p-16 flex flex-col items-center justify-center">
      <FileText className="w-16 h-16 text-[#CAC4D0] mb-4" />
      <p className="text-[#CAC4D0] text-center">No documents found in this category</p>
    </div>
  );
}
