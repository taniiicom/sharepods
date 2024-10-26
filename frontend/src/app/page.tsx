// types/layout.ts
"use client";
import WaveAnimation from "@/components/WaveAnimation";

import React from "react";

const MobileLayout: React.FC = ({ }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-50">
        <div className="flex-1">
          <h1 className="text-lg font-semibold">SharePods</h1>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <WaveAnimation />
      </main>
    </div>
  );
};

export default MobileLayout;
