/* eslint-disable @next/next/no-img-element */
"use client";
import { TANMAY_TYPE } from "@/app/page";
import SemanticSearchModal from "@/components/common/semantic-search-modal";
import SementicSearchButton from "@/components/common/sementic-search-button";
import { TechStackTreemap } from "@/components/common/stacks";
import { useSemanticSearch } from "@/providers/semantic-search-provider";
import { useEffect, useRef, useState } from "react";

interface StacksProps {
  data: TANMAY_TYPE["skills"];
}

const Stacks = ({ data }: StacksProps) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [openInputModal, setOpenInputModal] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const skillEmbeddingsRef = useRef<any[]>([]);

  const { extractor, loading: ModelLoading, error: ModelError } = useSemanticSearch();

  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  // Cosine similarity function
  function cosineSimilarity(a: number[], b: number[]) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  useEffect(() => {
    async function computeEmbeddings() {
      if (!extractor || !openInputModal) return;
      if (skillEmbeddingsRef.current.length > 0) return; // Already computed

      try {
        const items = data.flatMap((skill) => [
          { ...skill, text: skill.name, type: 'name' },
          { ...skill, text: skill.description, type: 'description' }
        ]);

        const embeddings = [];
        for (const item of items) {
          const output = await extractor(item.text, { pooling: "mean", normalize: true });
          embeddings.push({ item, embedding: Array.from(output.data) as number[] });
        }
        skillEmbeddingsRef.current = embeddings;
      } catch (err) {
        console.error("Failed to compute skill embeddings:", err);
      }
    }

    if (!ModelLoading && extractor && openInputModal) {
      computeEmbeddings();
    }
  }, [extractor, ModelLoading, data, openInputModal]);

  // Clear embeddings when modal closes
  useEffect(() => {
    if (!openInputModal) {
      skillEmbeddingsRef.current = [];
      setSearchResults([]);
      setQuery("");
    }
  }, [openInputModal]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || !extractor) return;

    try {
      const output = await extractor(searchQuery, { pooling: "mean", normalize: true });
      const queryEmbedding = Array.from(output.data) as number[];

      const matches = skillEmbeddingsRef.current.map((entry) => ({
        item: entry.item,
        score: cosineSimilarity(queryEmbedding, entry.embedding),
      }));

      // Group matches by skill name
      const skillGroups = matches.reduce((acc: any, match) => {
        const skillName = match.item.name;
        if (!acc[skillName]) {
          acc[skillName] = {
            name: skillName,
            maxScore: 0,
            matches: []
          };
        }
        if (match.score > 0.30) {
          acc[skillName].matches.push(match);
          acc[skillName].maxScore = Math.max(acc[skillName].maxScore, match.score);
        }
        return acc;
      }, {});

      // Convert to array, sort by maxScore, and take top 5
      const topSkills = Object.values(skillGroups)
        .filter((group: any) => group.matches.length > 0)
        .sort((a: any, b: any) => b.maxScore - a.maxScore)
        .slice(0, 20);

      // Group matches by type within each skill
      const finalResults = topSkills.map((group: any) => {
        const typeGroups = group.matches.reduce((acc: any, match: any) => {
          const type = match.item.type;
          if (!acc[type]) acc[type] = [];
          acc[type].push(match);
          return acc;
        }, {});
        return { ...group, types: typeGroups };
      });

      setSearchResults(finalResults);
      console.log(finalResults);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) handleSearch(query);
      else setSearchResults([]);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, extractor]);

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
      <div className="w-full text-center px-3 md:px-6 mb-2 md:mb-3 flex gap-3 max-md:gap-1.5 items-center md:justify-center">
        <h2 className="text-white text-[clamp(30px,4vw,100px)] md:text-[clamp(40px,5vw,150px)] font-Poppins font-medium">
          Stacks
        </h2>
        <SementicSearchButton loading={ModelLoading} onClick={() => setOpenInputModal(true)} />
        <SemanticSearchModal isOpen={openInputModal} onClose={() => setOpenInputModal(false)} query={query} setQuery={setQuery} onSubmit={handleSearch}>
          {searchResults.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-4 overflow-y-auto w-[clamp(200px,640px,93vw)] self-center">
              {searchResults.map((group: any, idx) => (
                <div key={idx} className="bg-white overflow-y-scroll">
                  <div className="px-3 py-2 border-b flex items-center gap-2">
                    <h4 className="text-sm font-medium text-black">{group.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SemanticSearchModal>
      </div>
      <div
        className="wrapper h-[90vh] md:h-[85vh] w-full"
        ref={pdfContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <TechStackTreemap stacks={data} />
        {showTooltip && (
          <div
            className="fixed z-50 pointer-events-none max-md:hidden"
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
