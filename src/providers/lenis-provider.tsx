import Lenis from "lenis";
import { createContext, useContext, useEffect, useState } from "react";

const LenisContext = createContext<Lenis | null>(null);

const LenisProvider = ({
  children,
  enabled = true,
}: {
  children: React.ReactNode;
  enabled?: boolean;
}) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  useEffect(() => {
    if (!enabled) {
      setLenis(null);
      return;
    }

    const lenisInstance = new Lenis({
      lerp: 0.1, // or easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    setLenis(lenisInstance);

    let rafId: number;
    const raf = (time: number) => {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenisInstance.destroy();
      setLenis(null);
    };
  }, [enabled]);
  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
};

export const useLenis = () => {
  const context = useContext(LenisContext);
  if (context === null) {
    throw new Error("useLenis must be used within a LenisProvider");
  }
  return context;
};

export default LenisProvider;
