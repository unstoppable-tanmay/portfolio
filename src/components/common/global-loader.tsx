"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import Loader from "./loader";

export default function GlobalLoader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Show loader for 3 seconds, then hide
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
                >
                    <Loader />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
