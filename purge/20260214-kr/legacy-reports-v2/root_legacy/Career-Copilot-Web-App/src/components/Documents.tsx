import { useState } from "react";
import { Plus, Search, FileText, Calendar } from "lucide-react";
import snakePlant from "figma:asset/41188de77d610c3b921deb50cf0552f855047a4a.png";

export function Documents() {
  const [activeTab, setActiveTab] = useState("all");

  const documents = [
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
    { id: 3, name: "UX Designer Resume", type: "resume", date: "Updated 1 week ago", icon: "📄" },
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
    { id: 6, name: "Generic Cover Letter", type: "cover", date: "Updated 2 weeks ago", icon: "📝" },
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

  const filteredDocs = documents.filter((doc) => {
    if (activeTab === "all") return true;
    if (activeTab === "resumes") return doc.type === "resume";
    if (activeTab === "covers") return doc.type === "cover";
    if (activeTab === "ksc") return doc.type === "ksc";
    return true;
  });

  return (
    <div className="p-12 max-w-7xl relative">
      {/* Snake Plant Decoration - Bottom Right Corner */}
      <div
        className="fixed bottom-0 right-0 pointer-events-none"
        style={{
          width: "380px",
          zIndex: 1,
          opacity: 0.55,
        }}
      >
        <img
          src={snakePlant}
          alt=""
          className="w-full h-auto"
          style={{
            mixBlendMode: "screen",
            WebkitMaskImage:
              "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.35) 8%, rgba(0,0,0,0.65) 18%, rgba(0,0,0,0.85) 28%, black 40%)",
            maskImage:
              "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.35) 8%, rgba(0,0,0,0.65) 18%, rgba(0,0,0,0.85) 28%, black 40%)",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h2
            className="mb-2"
            style={{
              fontSize: "4.5rem",
              lineHeight: "1.1",
              fontFamily: "Roboto Flex, sans-serif",
              fontWeight: "800",
              fontStretch: "150%",
              color: "#E6E1E5",
            }}
          >
            Your{" "}
            <span
              style={{
                fontFamily: "Roboto Serif, serif",
                fontStyle: "italic",
                fontWeight: "300",
                color: "#D0BCFF",
              }}
            >
              Documents
            </span>
          </h2>
          <p className="text-[#CAC4D0]">
            Manage your career documents and generate tailored versions
          </p>
        </div>

        {/* Search Bar - Level 4 (Elevated) */}
        <div className="bg-[#36343B] rounded-[28px] p-4 mb-8 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#FFFFFF]" />
          <input
            type="text"
            placeholder="Search documents..."
            className="bg-transparent flex-1 outline-none text-[#FFFFFF] placeholder:text-[#CAC4D0]"
          />
        </div>

        {/* Tabs - Level 2 */}
        <div className="flex gap-2 mb-8 bg-[#25232A] rounded-full p-2 w-fit">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-8 py-3 rounded-full transition-all ${
              activeTab === "all"
                ? "bg-[#D0BCFF] text-[#381E72]"
                : "text-[#CAC4D0] hover:text-[#E6E1E5]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("resumes")}
            className={`px-8 py-3 rounded-full transition-all ${
              activeTab === "resumes"
                ? "bg-[#D0BCFF] text-[#381E72]"
                : "text-[#CAC4D0] hover:text-[#E6E1E5]"
            }`}
          >
            Resumes
          </button>
          <button
            onClick={() => setActiveTab("covers")}
            className={`px-8 py-3 rounded-full transition-all ${
              activeTab === "covers"
                ? "bg-[#D0BCFF] text-[#381E72]"
                : "text-[#CAC4D0] hover:text-[#E6E1E5]"
            }`}
          >
            Cover Letters
          </button>
          <button
            onClick={() => setActiveTab("ksc")}
            className={`px-8 py-3 rounded-full transition-all ${
              activeTab === "ksc"
                ? "bg-[#D0BCFF] text-[#381E72]"
                : "text-[#CAC4D0] hover:text-[#E6E1E5]"
            }`}
          >
            KSC Responses
          </button>
        </div>

        {/* Documents Grid - Outlined Cards (Let texture show through) */}
        <div className="grid grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-transparent border border-[#49454F] rounded-[28px] p-6 hover:bg-[#211F26]/30 hover:border-[#D0BCFF] transition-all cursor-pointer group"
              style={{
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="w-12 h-12 bg-[#2B2930] rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-[#36343B] transition-all">
                {doc.icon}
              </div>
              <h4
                className="text-[#E6E1E5] mb-2"
                style={{ fontFamily: "Roboto Flex, sans-serif", fontWeight: "700" }}
              >
                {doc.name}
              </h4>
              <div className="flex items-center gap-2 text-[#CAC4D0]">
                <Calendar className="w-4 h-4" />
                <span
                  style={{
                    fontFamily: "Roboto Flex, sans-serif",
                    fontStretch: "50%",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    fontSize: "0.7rem",
                  }}
                >
                  {doc.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State for filtered results */}
        {filteredDocs.length === 0 && (
          <div className="bg-[#211F26] rounded-3xl p-16 flex flex-col items-center justify-center">
            <FileText className="w-16 h-16 text-[#CAC4D0] mb-4" />
            <p className="text-[#CAC4D0] text-center">No documents found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
