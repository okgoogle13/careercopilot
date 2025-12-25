import { CheckCircle, Circle, Clock } from "lucide-react";
import hangingPlant from "figma:asset/44569b5b09c469ebca1c4c6a3f4bcc3cfa3df233.png";

export function ApplicationTracker() {
  const applications = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "TechCorp",
      location: "San Francisco, CA",
      appliedDate: "2 days ago",
      currentStep: 3,
      steps: ["Applied", "Screening", "Interview", "Offer", "Accepted"],
    },
    {
      id: 2,
      title: "UX Designer",
      company: "DesignHub",
      location: "Remote",
      appliedDate: "5 days ago",
      currentStep: 2,
      steps: ["Applied", "Screening", "Interview", "Offer", "Accepted"],
    },
    {
      id: 3,
      title: "Product Manager",
      company: "StartupXYZ",
      location: "New York, NY",
      appliedDate: "1 week ago",
      currentStep: 1,
      steps: ["Applied", "Screening", "Interview", "Offer", "Accepted"],
    },
    {
      id: 4,
      title: "Full Stack Developer",
      company: "CodeFactory",
      location: "Austin, TX",
      appliedDate: "3 days ago",
      currentStep: 2,
      steps: ["Applied", "Screening", "Interview", "Offer", "Accepted"],
    },
  ];

  return (
    <div className="p-12 max-w-7xl relative">
      {/* Hanging Plant Decoration - Top Right Corner */}
      <div
        className="absolute top-[-20px] right-0 pointer-events-none"
        style={{
          width: "320px",
          height: "90%",
          maxHeight: "800px",
          zIndex: 5,
          opacity: 0.6,
        }}
      >
        <img
          src={hangingPlant}
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
            Application{" "}
            <span
              style={{
                fontFamily: "Roboto Serif, serif",
                fontStyle: "italic",
                fontWeight: "300",
                color: "#D0BCFF",
              }}
            >
              Tracker
            </span>
          </h2>
          <p className="text-[#CAC4D0]">Track your job applications through every stage</p>
        </div>

        {/* Applications List - Level 2 Cards */}
        <div className="space-y-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-[#25232A] rounded-[28px] p-8">
              <div className="flex items-start justify-between mb-12">
                <div className="flex-1">
                  <h3
                    className="text-[#E6E1E5] mb-1 text-3xl"
                    style={{ fontFamily: "Roboto Flex, sans-serif", fontWeight: "700" }}
                  >
                    {app.title}
                  </h3>
                  <p
                    className="text-[#CAC4D0] text-xl"
                    style={{ fontFamily: "Roboto Serif, serif", fontStyle: "italic" }}
                  >
                    {app.company}
                  </p>
                  <p
                    className="text-[#CAC4D0] mt-2"
                    style={{
                      fontFamily: "Roboto Flex, sans-serif",
                      fontStretch: "50%",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      fontSize: "0.7rem",
                    }}
                  >
                    {app.location} • Applied {app.appliedDate}
                  </p>
                </div>
                <button className="bg-[#36343B] px-6 py-2 rounded-full text-[#FFFFFF] hover:bg-[#413F47] transition-all">
                  Update Status
                </button>
              </div>

              {/* Capsule/Pill Stepper */}
              <div className="flex gap-2">
                {app.steps.map((step, idx) => {
                  const isCompleted = idx < app.currentStep;
                  const isCurrent = idx === app.currentStep;

                  return (
                    <div
                      key={idx}
                      className={`flex-1 px-4 py-3 rounded-full text-center transition-all ${
                        isCurrent
                          ? "bg-[#D0BCFF] text-[#381E72]"
                          : isCompleted
                            ? "bg-[#A8C5A3] text-[#141218]"
                            : "bg-[#2B2930] text-[#CAC4D0]"
                      }`}
                    >
                      <p className="text-sm">{step}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Add New Application - Level 3 */}
        <button className="mt-8 w-full bg-[#2B2930] border-2 border-dashed border-[#CAC4D0]/30 rounded-[28px] py-8 text-[#FFFFFF] hover:border-[#D0BCFF]/50 transition-all">
          + Add New Application
        </button>
      </div>
    </div>
  );
}
