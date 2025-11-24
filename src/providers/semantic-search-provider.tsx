"use client";

import { env, pipeline } from "@xenova/transformers";
import React, { createContext, useContext, useRef, useState } from "react";

// Configure to use local models from public/models folder
// Models are stored in the repo and deployed with the app
// This avoids HuggingFace dependency and works on all networks
env.allowLocalModels = true;
env.localModelPath = "models/";
env.allowRemoteModels = false;

interface SemanticSearchContextType {
    extractor: any;
    loading: boolean;
    error: string | null;
    loadModel: () => Promise<void>;
    isModelLoaded: boolean;
}

const SemanticSearchContext = createContext<SemanticSearchContextType>({
    extractor: null,
    loading: false,
    error: null,
    loadModel: async () => { },
    isModelLoaded: false,
});

export const useSemanticSearch = () => useContext(SemanticSearchContext);

export const SemanticSearchProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(false); // Start false, only true when loading
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const extractorRef = useRef<any>(null);

    const loadModel = async () => {
        if (extractorRef.current || loading) return; // Already loaded or loading

        setLoading(true);
        try {
            extractorRef.current = await pipeline(
                "feature-extraction",
                "Xenova/all-MiniLM-L6-v2"
            );
            setIsModelLoaded(true);
        } catch (err) {
            console.error("Failed to load global AI model:", err);
            setError("Failed to load AI model.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SemanticSearchContext.Provider
            value={{
                extractor: extractorRef.current,
                loading,
                error,
                loadModel,
                isModelLoaded,
            }}
        >
            {children}
        </SemanticSearchContext.Provider>
    );
};
