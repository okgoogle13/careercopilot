import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";

export function KSCGenerator() {
  const [criteria, setCriteria] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);

    // Mock AI generation
    setTimeout(() => {
      setResponse(
        `Based on the selection criteria you provided, here's a tailored response:\n\n${criteria}\n\nI have demonstrated extensive experience in this area through my work at...\n\n[AI-generated content would appear here]`,
      );
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="p-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1
          style={{
            fontSize: "4.5rem",
            lineHeight: "1.1",
            fontFamily: "Roboto Flex, sans-serif",
            fontWeight: "800",
            fontStretch: "150%",
            color: "#E6E1E5",
          }}
        >
          KSC{" "}
          <span
            style={{
              fontFamily: "Roboto Serif, serif",
              fontStyle: "italic",
              fontWeight: "300",
              color: "#D0BCFF",
            }}
          >
            Generator
          </span>
        </h1>
        <p className="text-[#CAC4D0] mt-2">Generate tailored responses to key selection criteria</p>
      </div>

      {/* Card */}
      <div
        className="bg-[#25232A] rounded-[28px] p-8"
        style={{
          backgroundImage: "radial-gradient(circle, #E6DEFF 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          backgroundBlendMode: "overlay",
          backgroundPosition: "0 0",
        }}
      >
        <div className="space-y-6">
          {/* Input Section */}
          <div>
            <label className="block text-[#E6E1E5] mb-3">Selection Criteria</label>
            <Textarea
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              placeholder="Paste the key selection criteria from the job posting here..."
              rows={10}
              className="bg-[#2B2930] border-[#49454F] text-[#E6E1E5] rounded-[28px] resize-none"
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!criteria.trim() || loading}
            className="bg-[#D0BCFF] text-[#381E72] hover:bg-[#E6DDFF] rounded-full px-8 h-12 flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {loading ? "Generating..." : "Generate Response"}
          </Button>

          {/* Response Section */}
          {response && (
            <div className="mt-8 pt-8 border-t border-[#49454F]">
              <label className="block text-[#E6E1E5] mb-3">Generated Response</label>
              <div className="bg-[#2B2930] rounded-[28px] p-6 text-[#E6E1E5] whitespace-pre-wrap">
                {response}
              </div>
              <div className="flex gap-4 mt-4">
                <Button
                  onClick={() => navigator.clipboard.writeText(response)}
                  className="bg-transparent border border-[#49454F] text-[#E6E1E5] hover:bg-[#2B2930] rounded-full px-6"
                >
                  Copy to Clipboard
                </Button>
                <Button
                  onClick={() => setResponse("")}
                  className="bg-transparent border border-[#49454F] text-[#E6E1E5] hover:bg-[#2B2930] rounded-full px-6"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
