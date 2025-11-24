/* eslint-disable @next/next/no-img-element */
"use client";

import { TANMAY_TYPE } from "@/app/page";
import SemanticSearchModal from "@/components/common/semantic-search-modal";
import SementicSearchButton from "@/components/common/sementic-search-button";
import { useSemanticSearch } from "@/providers/semantic-search-provider";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface ExperienceProps {
  data: TANMAY_TYPE["experience"];
}

const Experience = ({ data: EXPERIENCES }: ExperienceProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { extractor, loading: ModelLoading, error: ModelError } = useSemanticSearch();
  const [openInputModal, setOpenInputModal] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const experienceEmbeddingsRef = useRef<any[]>([]);

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
      if (experienceEmbeddingsRef.current.length > 0) return; // Already computed

      try {
        const items = EXPERIENCES.flatMap((exp) => [
          { ...exp, text: `${exp.role} at ${exp.company}`, type: 'role' },
          ...exp.description.map(desc => ({ ...exp, text: desc, type: 'description' })),
          ...exp.achievements.map(ach => ({ ...exp, text: ach, type: 'achievement' })),
          ...exp.technologies.map(skill => ({ ...exp, text: skill, type: 'skill' })),
          ...exp.ai.map(ai => ({ ...exp, text: ai, type: 'description' }))
        ]);

        const embeddings = [];
        for (const item of items) {
          const output = await extractor(item.text, { pooling: "mean", normalize: true });
          embeddings.push({ item, embedding: Array.from(output.data) as number[] });
        }
        experienceEmbeddingsRef.current = embeddings;
      } catch (err) {
        console.error("Failed to compute experience embeddings:", err);
      }
    }

    if (!ModelLoading && extractor && openInputModal) {
      computeEmbeddings();
    }
  }, [extractor, ModelLoading, EXPERIENCES, openInputModal]);

  // Clear embeddings when modal closes
  useEffect(() => {
    if (!openInputModal) {
      experienceEmbeddingsRef.current = [];
      setSearchResults([]);
      setQuery("");
    }
  }, [openInputModal]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || !extractor) return;

    try {
      const output = await extractor(searchQuery, { pooling: "mean", normalize: true });
      const queryEmbedding = Array.from(output.data) as number[];

      const matches = experienceEmbeddingsRef.current.map((entry) => ({
        item: entry.item,
        score: cosineSimilarity(queryEmbedding, entry.embedding),
      }));

      // Group matches by company
      const companyGroups = matches.reduce((acc: any, match) => {
        const company = match.item.company;
        if (!acc[company]) {
          acc[company] = {
            company: company,
            logo: match.item.logo,
            maxScore: 0,
            matches: []
          };
        }
        if (match.score > 0.30) {
          acc[company].matches.push(match);
          acc[company].maxScore = Math.max(acc[company].maxScore, match.score);
        }
        return acc;
      }, {});

      // Convert to array, sort by maxScore, and take top 3
      const topCompanies = Object.values(companyGroups)
        .filter((group: any) => group.matches.length > 0)
        .sort((a: any, b: any) => b.maxScore - a.maxScore)
        .slice(0, 3);

      // Group matches by type within each company
      const finalResults = topCompanies.map((group: any) => {
        const typeGroups = group.matches.reduce((acc: any, match: any) => {
          const type = match.item.type;
          if (!acc[type]) acc[type] = [];
          acc[type].push(match);
          return acc;
        }, {});
        return { ...group, types: typeGroups };
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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Calculate scroll-triggered horizontal movement
  // Get viewport width (fallback for SSR)
  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : 1200;

  // Use responsive card width based on viewport
  const isMobile = viewportWidth < 768;
  const cardWidth = isMobile ? viewportWidth * 0.85 : 420; // 85vw on mobile, 420px on desktop
  const gap = 24; // gap-6 = 24px
  const paddingLeft = isMobile ? 16 : 32; // pl-4 on mobile, pl-8 on desktop

  // Total width of all cards
  const totalCardsWidth = EXPERIENCES.length * (cardWidth + gap) + paddingLeft;

  // Only scroll if content is wider than viewport
  const scrollDistance = Math.max(0, totalCardsWidth - viewportWidth);

  // Calculate section height based on scroll distance needed
  // More conservative multiplier for smoother scroll
  const scrollHeightVh =
    scrollDistance > 0
      ? Math.min(300, 100 + Math.ceil(scrollDistance / 3))
      : 100;

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-black font-Poppins min-h-screen my-[5vh]"
      style={{
        minHeight: "100vh",
        height: scrollDistance > 0 ? `${scrollHeightVh}vh` : "100vh",
      }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center flex-col overflow-hidden">
        <div className="w-full px-4 md:px-6">
          {/* Header and Footer Stats Container */}
          <div className="w-full max-md:px-0 px-3 mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex gap-3 max-md:gap-1.5 items-center justify-center"
            >
              <h2 className="text-white text-[clamp(30px,4vw,100px)] md:text-[clamp(40px,5vw,150px)] font-normal">
                Experience
              </h2>
              <SementicSearchButton loading={ModelLoading} onClick={() => setOpenInputModal(true)} />
              <SemanticSearchModal isOpen={openInputModal} onClose={() => setOpenInputModal(false)} query={query} setQuery={setQuery} onSubmit={handleSearch}>
                {searchResults.length > 0 && (
                  <div className="flex flex-col gap-4 mb-4 overflow-y-auto">
                    {searchResults.map((group: any, idx) => (
                      <div key={idx} className="bg-white overflow-y-scroll max-h-[25vh] w-[clamp(200px,640px,94vw)]" data-lenis-prevent>
                        <div className="px-3 py-2 border-b flex items-center gap-2">
                          <img src={group.logo} alt={group.company} className="w-5 h-5 object-contain bg-white rounded-sm border border-gray-100" />
                          <h4 className="text-sm font-medium text-black">{group.company}</h4>
                        </div>
                        <div className="p-3 flex flex-col gap-3 " >
                          {Object.entries(group.types).map(([type, matches]: [string, any], typeIdx) => (
                            <div key={typeIdx}>
                              <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                                {type}s
                              </h5>
                              <div className={type === 'skill' ? "flex flex-wrap gap-2" : "flex flex-col gap-1"}>
                                {Array.from<string>(new Set(matches.map((match: any) => match.item.text))).map((uniqueText: string, matchIdx: number) => (
                                  <div key={matchIdx} className="text-xs text-gray-700 font-light bg-white pl-2 border border-gray-100 rounded hover:border-gray-300 transition-colors">
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
            </motion.div>

            {/* Footer Stats - Desktop Only */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:grid grid-cols-4 gap-3 flex-shrink-0"
            >
              <div className="bg-white backdrop-blur-sm border border-white/10 p-4 text-center hover:bg-white/90 transition-colors min-w-[100px]">
                <div className="text-2xl font-light text-black mb-1">2.5+</div>
                <p className="text-black/40 text-xs font-light">Years</p>
              </div>
              <div className="bg-white backdrop-blur-sm border border-white/10 p-4 text-center hover:bg-white/90 transition-colors min-w-[100px]">
                <div className="text-2xl font-light text-black mb-1">3</div>
                <p className="text-black/40 text-xs font-light">Companies</p>
              </div>
              <div className="bg-white backdrop-blur-sm border border-white/10 p-4 text-center hover:bg-white/90 transition-colors min-w-[100px]">
                <div className="text-2xl font-light text-black mb-1">15+</div>
                <p className="text-black/40 text-xs font-light">Projects</p>
              </div>
              <div className="bg-white backdrop-blur-sm border border-white/10 p-4 text-center hover:bg-white/90 transition-colors min-w-[100px]">
                <div className="text-2xl font-light text-black mb-1">10+</div>
                <p className="text-black/40 text-xs font-light">Technologies</p>
              </div>
            </motion.div>
          </div>

          {/* Horizontal Scroll Container */}
          <motion.div
            style={{ x: scrollDistance > 0 ? x : undefined }}
            className={`flex gap-6 pl-4 md:pl-8 ${scrollDistance === 0 ? "justify-center" : ""
              }`}
          >
            {EXPERIENCES.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="flex-shrink-0 w-[85vw] md:w-[420px] relative"
              >
                {/* Card */}
                <div className="group relative bg-white backdrop-blur-sm border border-white/10 hover:bg-white/95 hover:border-white/20 transition-all duration-300 h-full">
                  {/* Company Logo & Header */}
                  <div className="p-6 pb-0 border-b border-white/10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={exp.logo}
                          alt={exp.company}
                          className="w-12 h-12 object-contain bg-white/"
                        />
                        <div>
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black text-lg font-light hover:underline"
                          >
                            {exp.company}
                          </a>
                          <p className="text-black/60 text-sm font-light">
                            {exp.role}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <p className="text-black/40 font-light">{exp.period}</p>
                      <span className="text-black/20">•</span>
                      <p className="text-black/60 font-light">{exp.duration}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="p-6 space-y-4">
                    <ul className="space-y-2">
                      {exp.description.map((item, i) => (
                        <li
                          key={i}
                          className="text-black/70 text-sm font-light flex items-center gap-2"
                        >
                          <span className="w-2 aspect-square bg-black/80" />
                          <span className="text-xs">{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Achievements */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="pt-2 max-md:hidden">
                        <p className="text-black/50 text-xs mb-2 font-light">
                          Key Achievements
                        </p>
                        <ul className="space-y-1">
                          {exp.achievements.map((achievement, i) => (
                            <li
                              key={i}
                              className="text-black/60 text-xs font-light flex items-start gap-2"
                            >
                              <span className="text-black/30">-</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Technologies */}
                    <div className="pt-2">
                      <p className="text-black/50 text-xs mb-2 font-light">
                        Technologies
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-black/5 border border-white/10 text-black/60 text-xs font-light hover:bg-black/10 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer Stats - Mobile Only */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:hidden mt-8 grid grid-cols-2 gap-3"
          >
            <div className="bg-black/5 backdrop-blur-sm border border-white/10 p-6 text-center hover:bg-white/10 transition-colors">
              <div className="text-3xl font-light text-white mb-1">2.5+</div>
              <p className="text-white/40 text-xs font-light">Years</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-center hover:bg-white/10 transition-colors">
              <div className="text-3xl font-light text-white mb-1">3</div>
              <p className="text-white/40 text-xs font-light">Companies</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-center hover:bg-white/10 transition-colors">
              <div className="text-3xl font-light text-white mb-1">15+</div>
              <p className="text-white/40 text-xs font-light">Projects</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-center hover:bg-white/10 transition-colors">
              <div className="text-3xl font-light text-white mb-1">10+</div>
              <p className="text-white/40 text-xs font-light">Technologies</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
