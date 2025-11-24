"use client";

import { TANMAY } from "@/data/portfolio";
import { useSemanticSearch } from "@/providers/semantic-search-provider";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";

// Cosine similarity function
function cosineSimilarity(a: number[], b: number[]) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

type MatchResult = {
    item: any;
    score: number;
    type: "project" | "experience" | "skill";
};

export default function RecruiterView() {
    const [jd, setJd] = useState("");
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState<MatchResult[]>([]);
    const [error, setError] = useState<string | null>(null);

    const { extractor, loading: modelLoading, error: modelError, loadModel, isModelLoaded } = useSemanticSearch();
    const portfolioEmbeddingsRef = useRef<any[]>([]);
    const [embeddingsComputed, setEmbeddingsComputed] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isModelLoaded) {
            loadModel();
        }
    }, [isModelLoaded]);

    const computeEmbeddings = async () => {
        if (!extractor || portfolioEmbeddingsRef.current.length > 0) return;

        try {
            // Pre-compute portfolio embeddings
            const items = [
                ...TANMAY.projects.map((p) => ({ ...p, type: "project" as const, text: `${p.title} ${p.description} ${p.stacks.join(" ")}` })),
                ...TANMAY.experience.map((e) => ({ ...e, type: "experience" as const, text: `${e.company} ${e.role} ${e.description}` })),
                ...TANMAY.skills.map((s) => ({ ...s, type: "skill" as const, text: s.name })),
            ];

            const embeddings = [];
            for (const item of items) {
                const output = await extractor(item.text, { pooling: "mean", normalize: true });
                embeddings.push({ item, embedding: Array.from(output.data) as number[] });
            }
            portfolioEmbeddingsRef.current = embeddings;
            setEmbeddingsComputed(true);
        } catch (err) {
            console.error("Failed to compute portfolio embeddings:", err);
            throw err;
        }
    };

    const handleAnalyze = async () => {
        if (!jd.trim()) return;
        if (!isModelLoaded) {
            await loadModel();
        }
        setAnalyzing(true);
        setResults([]);
        setError(null);

        try {
            // Compute embeddings if not already done
            if (!embeddingsComputed) {
                await computeEmbeddings();
            }

            const output = await extractor(jd, { pooling: "mean", normalize: true });
            const jdEmbedding = Array.from(output.data) as number[];

            const matches = portfolioEmbeddingsRef.current.map((entry) => ({
                item: entry.item,
                score: cosineSimilarity(jdEmbedding, entry.embedding),
                type: entry.item.type,
            }));

            // Sort by score and take top results
            const topMatches = matches
                .sort((a, b) => b.score - a.score)
                .filter((m) => m.score > 0.25) // Filter low relevance
                .slice(0, 6);

            setResults(topMatches);
        } catch (err) {
            console.error("Analysis failed:", err);
            setError("Analysis failed. Please try again.");
        } finally {
            setAnalyzing(false);
        }
    };

    // Clear embeddings when component unmounts or results are cleared
    const handleClear = () => {
        setJd("");
        setResults([]);
        portfolioEmbeddingsRef.current = [];
        setEmbeddingsComputed(false);
    };

    if (modelLoading && !jd) {
        return (
            <div className="w-full h-full flex items-center justify-center gap-3">
                <div className="loader w-3 h-3 bg-white animate-pulse"></div>
                <p className="text-sm text-white animate-pulse">Loading AI Model (approx 23MB)...</p>
            </div>
        );
    }

    if (modelError) {
        return (
            <div className="w-full h-full flex items-center justify-center gap-3">
                <p className="text-sm text-red-500"> There is Some Error Loading Model {modelError}</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col py-3 max-md:pt-1 gap-3">
            <div className="result flex-1 w-[clamp(200px,900px,94vw)] self-center">
                {analyzing && (
                    <div className="w-full h-full flex items-center justify-center gap-3">
                        <div className="loader w-3 h-3 bg-white animate-pulse"></div>
                        <p className="text-sm text-white animate-pulse">Analyzing match...</p>
                    </div>
                )}

                {!analyzing && results.length > 0 && (
                    <div className="w-full bg-white border p-6 my-4 overflow-y-scroll h-[67vh]" data-lenis-prevent>
                        {/* Header */}
                        <div className="border-b border-black/10 mb-6">
                            <h1 className="text-2xl font-bold text-black mb-1">{TANMAY.personal.name}</h1>
                            <p className="text-sm text-black/60">{TANMAY.personal.profession}</p>
                            <div className="flex gap-4 mt-2 text-xs text-black/50">
                                <span>{TANMAY.personal.email}</span>
                                <span>{TANMAY.personal.location.city}, {TANMAY.personal.location.country}</span>
                            </div>
                        </div>

                        {/* Match Summary */}
                        <div className="mb-6">
                            <h2 className="text-sm font-semibold text-black uppercase tracking-wide mb-3 border-b border-black/10 pb-2">
                                Match Summary
                            </h2>
                            <div className="flex gap-2 flex-wrap">
                                {results.slice(0, 3).map((match, idx) => (
                                    <div key={idx} className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 flex items-center">
                                        <span className="text-xs font-medium text-green-700">
                                            {match.item.title || match.item.company || match.item.name}
                                        </span>
                                        <span className="text-xs font-mono text-green-600">
                                            {Math.round(match.score * 100)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Skills Section */}
                        {results.filter(r => r.type === "skill").length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-sm font-semibold text-black uppercase tracking-wide mb-3 border-b border-black/10 pb-2">
                                    Relevant Skills
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {results
                                        .filter(r => r.type === "skill")
                                        .map((match, idx) => (
                                            <div key={idx} className="px-3 py-1 bg-black/5 border border-black/10 flex items-center">
                                                <span className="text-xs font-medium text-black">{match.item.name}</span>
                                                <span className="text-xs text-green-600 ml-2">{Math.round(match.score * 100)}%</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Experience Section */}
                        {results.filter(r => r.type === "experience").length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-sm font-semibold text-black uppercase tracking-wide mb-3 border-b border-black/10 pb-2">
                                    Relevant Experience
                                </h2>
                                <div className="space-y-4">
                                    {results
                                        .filter(r => r.type === "experience")
                                        .map((match, idx) => (
                                            <div key={idx} className="border-l-2 border-green-500 pl-4">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="text-sm font-semibold text-black">{match.item.role}</h3>
                                                    <span className="text-xs font-mono text-green-600">{Math.round(match.score * 100)}%</span>
                                                </div>
                                                <p className="text-xs text-black/60 mb-1">{match.item.company}</p>
                                                <p className="text-xs text-black/50">{match.item.description}</p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Projects Section */}
                        {results.filter(r => r.type === "project").length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-sm font-semibold text-black uppercase tracking-wide mb-3 border-b border-black/10 pb-2">
                                    Relevant Projects
                                </h2>
                                <div className="space-y-4">
                                    {results
                                        .filter(r => r.type === "project")
                                        .map((match, idx) => (
                                            <div key={idx} className="border border-black/10 p-3">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="text-sm font-semibold text-black">{match.item.title}</h3>
                                                    <span className="text-xs font-mono text-green-600">{Math.round(match.score * 100)}%</span>
                                                </div>
                                                <p className="text-xs text-black/60 mb-2">{match.item.description}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {match.item.stacks?.slice(0, 5).map((stack: string, i: number) => (
                                                        <span key={i} className="text-xs px-2 py-0.5 bg-black/5 text-black/70">
                                                            {stack}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200">
                                <p className="text-xs text-red-600">{error}</p>
                            </div>
                        )}
                    </div>
                )}

                {!analyzing && results.length === 0 && !error && (
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="text-sm text-white/40">Enter a job description to see matching results</p>
                    </div>
                )}
            </div>
            <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-[clamp(200px,640px,94vw)] pointer-events-auto self-center"
            >
                <div
                    className="bg-white border p-2 relative cursor-text"
                    onClick={(e) => inputRef.current?.focus()}
                >
                    {/* Input Area */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={jd}
                            onChange={(e) => setJd(e.target.value)}
                            placeholder={modelLoading ? "Initializing AI Model..." : "Enter Job Description"}
                            className="flex-1 border-none outline-none transition-colors font-Poppins max-md:text-xs text-sm leading-3 font-normal resize-none"
                            autoFocus
                            ref={inputRef}
                            disabled={modelLoading}
                            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                        />
                        <button
                            className="bg-black text-white py-1 px-2 border-none outline-none transition-colors font-Poppins cursor-pointer disabled:opacity-50"
                            onClick={handleAnalyze}
                            disabled={analyzing || !jd.trim()}
                        >
                            {analyzing ? "Checking..." : "Check ✦"}
                        </button>
                        <button
                            className="bg-black text-white border-none px-1 outline-none transition-colors font-Poppins flex items-center justify-center cursor-pointer"
                            onClick={handleClear}
                        >
                            <IoIosClose className="text-xl" />
                        </button>
                    </div>
                </div>
                <p className="text-xs text-white/60 text-center mt-2">It is not LLM Inference, it is based on semantic search</p>
            </motion.div>
        </div>
    );
}
