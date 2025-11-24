"use client";

import { useEffect } from "react";

export const NavigationHandler = () => {
    useEffect(() => {
        const handlePopState = () => {
            document.documentElement.dataset.transition = "back";
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    return null;
};
