"use client";

import { useLenis } from "@/providers/lenis-provider";
import { useSemanticSearch } from "@/providers/semantic-search-provider";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoIosClose } from "react-icons/io";

interface SemanticSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    query: string;
    setQuery: (query: string) => void;
    onSubmit?: (query: string) => void;
    children?: React.ReactNode;
}

const SemanticSearchModal = ({
    isOpen,
    onClose,
    query,
    setQuery,
    onSubmit,
    children,
}: SemanticSearchModalProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && query === "") {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, query, onClose]);

    const lenis = useLenis();
    const { loadModel, loading: modelLoading } = useSemanticSearch();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            lenis?.stop();
            loadModel();
        } else {
            document.body.style.overflow = "unset";
            lenis?.start();
        }
        return () => {
            document.body.style.overflow = "unset";
            lenis?.start();
        };
    }, [isOpen, lenis, loadModel]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-end pointer-events-none  flex-col">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
                        onClick={e => {
                            query === "" && onClose()
                        }}
                    />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }} className="swap-instance z-[9999] pointer-events-auto">
                        {children}</motion.div>

                    {/* Modal Container */}
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-2xl mb-12 px-4 pointer-events-auto"
                    >
                        <div
                            className="bg-white border p-2 relative cursor-text"
                            onClick={(e) => inputRef.current?.focus()}
                        >
                            {/* Input Area */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder={modelLoading ? "Initializing AI Model..." : "Search With Natural Language"}
                                    className="flex-1 border-none outline-none transition-colors font-poppins max-md:text-xs text-sm leading-3 font-Poppins font-normal"
                                    autoFocus
                                    ref={inputRef}
                                    disabled={modelLoading}
                                />
                                <button
                                    className="bg-black text-white py-1 px-2 border-none outline-none transition-colors font-Poppins cursor-pointer"
                                    onClick={() => onSubmit?.(query)}
                                >
                                    Search &#10022;
                                </button>
                                <button
                                    className="bg-black text-white border-none px-1 outline-none transition-colors font-Poppins flex items-center justify-center cursor-pointer"
                                    onClick={() => onClose()}
                                >
                                    <IoIosClose className="text-xl" />
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-white/60 text-center mt-2">It is not LLM Inference, it is based on semantic search</p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default SemanticSearchModal;
