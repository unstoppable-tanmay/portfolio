"use client";
import { TANMAY_TYPE } from "@/app/page";
import { TechStackTreemap } from "@/components/common/stacks";
import { useRef, useState } from "react";

interface StacksProps {
  data: TANMAY_TYPE["skills"];
}

const Stacks = ({ data }: StacksProps) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  // Handle mouse movement for tooltip
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Update tooltip position
    setTooltipPosition({ x: e.clientX, y: e.clientY });

    // Hide tooltip when moving
    setShowTooltip(false);

    // Clear existing timer
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
    }

    // Set new timer to show tooltip after 1.5 seconds of no movement
    tooltipTimerRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
    }
  };

  return (
    <main className="section min-h-screen font-Poppins relative flex items-center justify-center overflow-hidden flex-col">
      {/* Section Header */}
      <div className="text-center mb-4 md:mb-6">
        <h2 className="text-white text-[clamp(30px,4vw,100px)] md:text-[clamp(40px,5vw,150px)] font-Poppins font-medium">
          Stacks
        </h2>
      </div>
      <div
        className="wrapper h-screen w-full"
        ref={pdfContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <TechStackTreemap stacks={data} />
        {showTooltip && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: tooltipPosition.x + 15,
              top: tooltipPosition.y + 15,
            }}
          >
            <div className="bg-black/90 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap backdrop-blur-sm border border-white/10">
              Click To See More
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Stacks;
