/* eslint-disable @next/next/no-img-element */
"use client";

import { TANMAY_TYPE } from "@/app/page";
import SemanticSearchModal from "@/components/common/semantic-search-modal";
import SementicSearchButton from "@/components/common/sementic-search-button";
import { useSemanticSearch } from "@/providers/semantic-search-provider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiDownload } from "react-icons/fi";
import { Document, Page, pdfjs } from "react-pdf";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
gsap.registerPlugin(ScrollTrigger);

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ResumeBento = ({ data }: { data: TANMAY_TYPE }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const pdfTileRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isMac, setIsMac] = useState<boolean>(false);
  const [openInputModal, setOpenInputModal] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const resumeEmbeddingsRef = useRef<any[]>([]);

  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const { extractor, loading: ModelLoading, error: ModelError } = useSemanticSearch();

  // Cosine similarity function
  function cosineSimilarity(a: number[], b: number[]) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  // Detect OS
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  // Compute embeddings for all resume content only when modal opens
  useEffect(() => {
    async function computeEmbeddings() {
      if (!extractor || !openInputModal) return;
      if (resumeEmbeddingsRef.current.length > 0) return; // Already computed

      try {
        const items = [
          // Personal info
          { text: data.personal.name, type: 'personal', category: 'name' },
          { text: data.personal.profession, type: 'personal', category: 'profession' },
          { text: data.personal.email, type: 'personal', category: 'email' },
          { text: `${data.personal.location.city}, ${data.personal.location.country}`, type: 'personal', category: 'location' },

          // Experience
          ...data.experience.flatMap((exp) => [
            { text: `${exp.role} at ${exp.company}`, type: 'experience', category: exp.company },
            ...exp.description.map(desc => ({ text: desc, type: 'experience', category: exp.company })),
            ...exp.achievements.map(ach => ({ text: ach, type: 'experience', category: exp.company })),
            ...exp.technologies.map(tech => ({ text: tech, type: 'experience', category: exp.company })),
          ]),

          // Projects
          ...data.projects.flatMap((proj) => [
            { text: proj.title, type: 'project', category: proj.title },
            { text: proj.description, type: 'project', category: proj.title },
            ...proj.stacks.map(stack => ({ text: stack, type: 'project', category: proj.title })),
          ]),

          // Skills
          ...data.skills.flatMap((skill) => [
            { text: skill.name, type: 'skill', category: skill.name },
            { text: skill.description, type: 'skill', category: skill.name },
          ]),

          // Meta
          { text: data.meta.availability.status, type: 'meta', category: 'availability' },
          { text: data.meta.totalExperience, type: 'meta', category: 'experience' },
          { text: data.meta.totalProjects, type: 'meta', category: 'projects' },
        ];

        const embeddings = [];
        for (const item of items) {
          const output = await extractor(item.text, { pooling: "mean", normalize: true });
          embeddings.push({ item, embedding: Array.from(output.data) as number[] });
        }
        resumeEmbeddingsRef.current = embeddings;
      } catch (err) {
        console.error("Failed to compute resume embeddings:", err);
      }
    }

    if (!ModelLoading && extractor && openInputModal) {
      computeEmbeddings();
    }
  }, [extractor, ModelLoading, data, openInputModal]);

  // Clear embeddings when modal closes
  useEffect(() => {
    if (!openInputModal) {
      resumeEmbeddingsRef.current = [];
      setSearchResults([]);
      setQuery("");
    }
  }, [openInputModal]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || !extractor) return;

    try {
      const output = await extractor(searchQuery, { pooling: "mean", normalize: true });
      const queryEmbedding = Array.from(output.data) as number[];

      const matches = resumeEmbeddingsRef.current.map((entry) => ({
        item: entry.item,
        score: cosineSimilarity(queryEmbedding, entry.embedding),
      }));

      // Group matches by type
      const typeGroups = matches.reduce((acc: any, match) => {
        const type = match.item.type;
        if (!acc[type]) {
          acc[type] = {
            type: type,
            maxScore: 0,
            matches: []
          };
        }
        if (match.score > 0.40) {
          acc[type].matches.push(match);
          acc[type].maxScore = Math.max(acc[type].maxScore, match.score);
        }
        return acc;
      }, {});

      // Convert to array, sort by maxScore, and take top 4 types
      const topTypes = Object.values(typeGroups)
        .filter((group: any) => group.matches.length > 0)
        .sort((a: any, b: any) => b.maxScore - a.maxScore)
        .slice(0, 4);

      // Group matches by category within each type
      const finalResults = topTypes.map((group: any) => {
        const categoryGroups = group.matches.reduce((acc: any, match: any) => {
          const category = match.item.category;
          if (!acc[category]) acc[category] = [];
          acc[category].push(match);
          return acc;
        }, {});
        return { ...group, categories: categoryGroups };
      });

      setSearchResults(finalResults);
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

  // GSAP ScrollTrigger animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headerRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "linear",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      // PDF tile from left
      gsap.from(pdfTileRef.current, {
        x: -20,
        opacity: 0,
        duration: 0.6,
        delay: 0.1,
        ease: "linear",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      // Right side tiles staggered
      const tiles = [
        downloadRef,
        experienceRef,
        projectsRef,
        skillsRef,
        statusRef,
      ];
      tiles.forEach((ref, index) => {
        gsap.from(ref.current, {
          x: 20,
          opacity: 0,
          duration: 0.6,
          delay: 0.2 + index * 0.05,
          ease: "linear",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = data.resume.pdfUrl;
    link.download = "Resume.pdf";
    link.click();
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

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
    }, 800);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
      }
    };
  }, []);

  // Store zoom functions in ref to use in wheel handler
  const zoomFunctionsRef = useRef<{
    zoomIn: ((step?: number) => void) | null;
    zoomOut: ((step?: number) => void) | null;
  }>({ zoomIn: null, zoomOut: null });

  // Custom wheel handler to only zoom with modifier key
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const isModifierPressed = isMac ? e.metaKey : e.ctrlKey;

      if (
        isModifierPressed &&
        pdfContainerRef.current?.contains(e.target as Node)
      ) {
        e.preventDefault();
        e.stopPropagation();

        const delta = -e.deltaY;
        if (delta > 0 && zoomFunctionsRef.current.zoomIn) {
          zoomFunctionsRef.current.zoomIn(0.1);
        } else if (delta < 0 && zoomFunctionsRef.current.zoomOut) {
          zoomFunctionsRef.current.zoomOut(0.1);
        }
      }
    };

    const container = pdfContainerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [isMac]);

  return (
    <div
      ref={sectionRef}
      id="resume"
      className="min-h-screen w-full bg-black p-2 md:p-3"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          ref={headerRef}
          className="w-full py-4 px-3 md:px-6 flex items-center md:justify-center gap-3 max-md:gap-1.5"
        >
          <h1 className="text-white text-[clamp(30px,4vw,100px)] md:text-[clamp(40px,5vw,150px)] font-Poppins font-medium mb-1">
            Resume
          </h1>
          <SementicSearchButton loading={ModelLoading} onClick={() => setOpenInputModal(true)} />
          <SemanticSearchModal isOpen={openInputModal} onClose={() => setOpenInputModal(false)} query={query} setQuery={setQuery} onSubmit={handleSearch}>
            {searchResults.length > 0 && (
              <div className="flex flex-col gap-4 mb-4 overflow-y-auto">
                {searchResults.map((group: any, idx) => (
                  <div key={idx} className="bg-white overflow-y-scroll max-h-[20vh] w-[clamp(200px,640px,94vw)] relative" data-lenis-prevent>
                    <div className="px-3 pt-2 pb-1 border-b flex items-center gap-2 sticky top-0 bg-white">
                      <h4 className="text-sm font-medium text-black capitalize">{group.type}</h4>
                    </div>
                    <div className="p-3 flex flex-col gap-3 max-h-[10vh]">
                      {Object.entries(group.categories).map(([category, matches]: [string, any], catIdx) => (
                        <div key={catIdx}>
                          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                            {category}
                          </h5>
                          <div className="flex flex-col gap-1">
                            {Array.from<string>(new Set(matches.map((match: any) => match.item.text))).map((uniqueText: string, matchIdx: number) => (
                              <div key={matchIdx} className="text-xs text-gray-700 font-light pl-1.5 bg-white border border-gray-100 rounded hover:border-gray-300 transition-colors">
                                {uniqueText}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SemanticSearchModal>
        </div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1">
          {/* Main PDF Viewer - Large Tile */}
          <div
            ref={pdfTileRef}
            className="lg:col-span-8 bg-zinc-950 border border-white/5 overflow-hidden group hover:border-white/10 transition-all duration-300"
          >
            <div className="p-2 md:p-4">
              <div
                ref={pdfContainerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative bg-white overflow-hidden h-[60vh] md:h-auto cursor-grab active:cursor-grabbing"
              >
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="w-8 h-8 border border-gray-300 border-t-black animate-spin" />
                  </div>
                )}

                {/* Tooltip */}
                {showTooltip && (
                  <div
                    className="fixed z-50 pointer-events-none max-md:hidden"
                    style={{
                      left: tooltipPosition.x + 15,
                      top: tooltipPosition.y + 15,
                    }}
                  >
                    <div className="bg-black/90 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap backdrop-blur-sm border border-white/10">
                      {isMac ? "⌘ + Scroll" : "Ctrl + Scroll"} to zoom
                    </div>
                  </div>
                )}

                <TransformWrapper
                  initialScale={1}
                  minScale={1}
                  maxScale={3}
                  centerOnInit={true}
                  wheel={{
                    step: 0.1,
                    disabled: true, // Disable default wheel behavior
                  }}
                  doubleClick={{ disabled: false }}
                  panning={{ disabled: false }}
                >
                  {({
                    zoomIn,
                    zoomOut,
                    resetTransform,
                    setTransform,
                    ...rest
                  }) => {
                    // Store zoom functions in ref for wheel handler
                    zoomFunctionsRef.current.zoomIn = zoomIn;
                    zoomFunctionsRef.current.zoomOut = zoomOut;

                    return (
                      <TransformComponent
                        wrapperClass="cursor-grab active:cursor-grabbing"
                        wrapperStyle={{
                          width: "100%",
                          height: "100%",
                        }}
                        contentStyle={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "flex-start",
                        }}
                      >
                        <Document
                          file={data.resume.pdfUrl}
                          onLoadSuccess={onDocumentLoadSuccess}
                          className="flex items-center justify-center"
                          loading={
                            <div className="text-gray-500">Loading PDF...</div>
                          }
                        >
                          <Page
                            devicePixelRatio={10}
                            pageNumber={pageNumber}
                            className="max-w-full"
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            width={
                              typeof window !== "undefined"
                                ? window.innerWidth < 1024
                                  ? Math.min(window.innerWidth - 32, 700)
                                  : 700
                                : 700
                            }
                          />
                        </Document>
                      </TransformComponent>
                    );
                  }}
                </TransformWrapper>
              </div>

              {/* PDF Navigation */}
              {numPages > 1 && (
                <div className="flex items-center justify-between mt-2 md:mt-4 text-white/70">
                  <button
                    onClick={goToPrevPage}
                    disabled={pageNumber <= 1}
                    className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 border border-white/10 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs md:text-sm"
                  >
                    <FiChevronLeft className="text-sm md:text-lg" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <span className="text-xs font-mono">
                    {pageNumber}/{numPages}
                  </span>

                  <button
                    onClick={goToNextPage}
                    disabled={pageNumber >= numPages}
                    className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 border border-white/10 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs md:text-sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <FiChevronRight className="text-sm md:text-lg" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side Tiles */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-1 lg:content-start lg:sticky lg:top-4 lg:self-start">
            {/* Download Button Tile */}
            <div
              ref={downloadRef}
              onClick={handleDownload}
              className="col-span-2 lg:col-span-1 bg-zinc-950 border border-white/5 p-6 cursor-pointer group hover:border-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-sm font-medium mb-1">
                    Download
                  </h3>
                  <p className="text-white/40 text-xs">PDF format</p>
                </div>
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
                  <FiDownload className="text-white/70 text-lg" />
                </div>
              </div>
            </div>

            {/* Experience Tile */}
            <div
              ref={experienceRef}
              className="bg-zinc-950 border border-white/5 p-6 group hover:border-white/10 transition-all duration-300"
            >
              <div className="text-3xl font-mono text-white mb-1">
                {data.meta.totalExperience}
              </div>
              <p className="text-white/40 text-xs">Years</p>
            </div>

            {/* Projects Tile */}
            <div
              ref={projectsRef}
              className="bg-zinc-950 border border-white/5 p-6 group hover:border-white/10 transition-all duration-300"
            >
              <div className="text-3xl font-mono text-white mb-1">
                {data.meta.totalProjects}
              </div>
              <p className="text-white/40 text-xs">Projects</p>
            </div>

            {/* Skills Tile */}
            <div
              ref={skillsRef}
              className="col-span-2 lg:col-span-1 bg-zinc-950 border border-white/5 p-6 group hover:border-white/10 transition-all duration-300"
            >
              <h3 className="text-white text-sm font-medium mb-3">Skills</h3>
              <div className="flex flex-wrap gap-1">
                {data.skills
                  .sort((a, b) => (a.percentage > b.percentage ? -1 : 1))
                  .slice(0, 6)
                  .map((skill) => (
                    <span
                      key={skill.name}
                      className="px-2 py-0.5 border border-white/10 text-white/60 text-xs font-mono"
                    >
                      {skill.name}
                    </span>
                  ))}
              </div>
            </div>

            {/* Quick Fact Tile */}
            <div
              ref={statusRef}
              className="col-span-2 lg:col-span-1 bg-zinc-950 border border-white/5 p-6 group hover:border-white/10 transition-all duration-300"
            >
              <h3 className="text-white text-sm font-medium mb-1">Status</h3>
              <p className="text-white/40 text-xs">
                {data.meta.availability.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBento;
