import { useState, useEffect, useCallback, useMemo } from "react";

// Breakpoint definitions (Tailwind CSS inspired)
const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type BreakpointKey = keyof typeof BREAKPOINTS;
type DeviceType = "mobile" | "tablet" | "desktop";
type Orientation = "portrait" | "landscape";

interface MediaQueryState {
  // Viewport dimensions
  width: number;
  height: number;

  // Current breakpoint
  breakpoint: BreakpointKey;

  // Breakpoint booleans
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2Xl: boolean;

  // Range checks
  isSmAndUp: boolean;
  isMdAndUp: boolean;
  isLgAndUp: boolean;
  isXlAndUp: boolean;

  isSmAndDown: boolean;
  isMdAndDown: boolean;
  isLgAndDown: boolean;
  isXlAndDown: boolean;

  // Device detection
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  // Orientation
  orientation: Orientation;
  isPortrait: boolean;
  isLandscape: boolean;

  // Pixel density
  pixelRatio: number;
  isRetina: boolean;

  // Utility functions
  isBreakpoint: (bp: BreakpointKey) => boolean;
  isAbove: (bp: BreakpointKey) => boolean;
  isBelow: (bp: BreakpointKey) => boolean;
  isBetween: (min: BreakpointKey, max: BreakpointKey) => boolean;
}

const getBreakpoint = (width: number): BreakpointKey => {
  if (width >= BREAKPOINTS["2xl"]) return "2xl";
  if (width >= BREAKPOINTS.xl) return "xl";
  if (width >= BREAKPOINTS.lg) return "lg";
  if (width >= BREAKPOINTS.md) return "md";
  if (width >= BREAKPOINTS.sm) return "sm";
  return "xs";
};

const getDeviceType = (width: number): DeviceType => {
  if (width < BREAKPOINTS.md) return "mobile";
  if (width < BREAKPOINTS.lg) return "tablet";
  return "desktop";
};

export const useMediaQuery = (): MediaQueryState => {
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  }));

  const [pixelRatio, setPixelRatio] = useState(() =>
    typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
  );

  // Optimized resize handler with debouncing
  const handleResize = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setPixelRatio(window.devicePixelRatio || 1);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Use ResizeObserver for better performance if available
    let resizeObserver: ResizeObserver | null = null;
    let timeoutId: NodeJS.Timeout;

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver((entries) => {
        // Debounce for performance
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const entry = entries[0];
          if (entry) {
            setDimensions({
              width: entry.contentRect.width,
              height: entry.contentRect.height,
            });
          }
        }, 16); // ~60fps
      });
      resizeObserver.observe(document.documentElement);
    } else {
      // Fallback to window resize event
      (window as Window).addEventListener("resize", handleResize, {
        passive: true,
      });
    }

    // Listen for pixel ratio changes (for zoom/display changes)
    const mediaQuery = (window as Window).matchMedia(
      `(resolution: ${pixelRatio}dppx)`
    );
    const handlePixelRatioChange = () =>
      setPixelRatio(window.devicePixelRatio || 1);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handlePixelRatioChange);
    } else {
      // Legacy support
      mediaQuery.addListener(handlePixelRatioChange);
    }

    return () => {
      clearTimeout(timeoutId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", handleResize);
      }

      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handlePixelRatioChange);
      } else {
        mediaQuery.removeListener(handlePixelRatioChange);
      }
    };
  }, [handleResize, pixelRatio]);

  // Memoized computed values for performance
  const mediaState = useMemo((): MediaQueryState => {
    const { width, height } = dimensions;
    const breakpoint = getBreakpoint(width);
    const deviceType = getDeviceType(width);
    const orientation: Orientation = height > width ? "portrait" : "landscape";

    return {
      // Viewport dimensions
      width,
      height,

      // Current breakpoint
      breakpoint,

      // Breakpoint booleans
      isXs: breakpoint === "xs",
      isSm: breakpoint === "sm",
      isMd: breakpoint === "md",
      isLg: breakpoint === "lg",
      isXl: breakpoint === "xl",
      is2Xl: breakpoint === "2xl",

      // Range checks
      isSmAndUp: width >= BREAKPOINTS.sm,
      isMdAndUp: width >= BREAKPOINTS.md,
      isLgAndUp: width >= BREAKPOINTS.lg,
      isXlAndUp: width >= BREAKPOINTS.xl,

      isSmAndDown: width < BREAKPOINTS.md,
      isMdAndDown: width < BREAKPOINTS.lg,
      isLgAndDown: width < BREAKPOINTS.xl,
      isXlAndDown: width < BREAKPOINTS["2xl"],

      // Device detection
      deviceType,
      isMobile: deviceType === "mobile",
      isTablet: deviceType === "tablet",
      isDesktop: deviceType === "desktop",

      // Orientation
      orientation,
      isPortrait: orientation === "portrait",
      isLandscape: orientation === "landscape",

      // Pixel density
      pixelRatio,
      isRetina: pixelRatio > 1,

      // Utility functions
      isBreakpoint: (bp: BreakpointKey) => breakpoint === bp,
      isAbove: (bp: BreakpointKey) => width > BREAKPOINTS[bp],
      isBelow: (bp: BreakpointKey) => width < BREAKPOINTS[bp],
      isBetween: (min: BreakpointKey, max: BreakpointKey) =>
        width >= BREAKPOINTS[min] && width < BREAKPOINTS[max],
    };
  }, [dimensions, pixelRatio]);

  return mediaState;
};

// Additional hook for specific media queries
export const useMediaQueryString = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
};

// Export breakpoints for external use
export { BREAKPOINTS };
export type { BreakpointKey, DeviceType, Orientation, MediaQueryState };
