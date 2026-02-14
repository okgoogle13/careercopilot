import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import texturePattern from "../assets/images/texture-pattern.png";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#1A1714] relative">
      {/* Textured Background Layer */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `url(${texturePattern})`,
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      />

      {/* Main Flex Container */}
      <div className="relative z-10 flex flex-row min-h-screen">
        {/* Sidebar - Responsive Flex Child */}
        <Sidebar />

        {/* Main Content Area - Flex-1 fills remaining space */}
        <main className="flex-1 min-h-screen w-full overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
