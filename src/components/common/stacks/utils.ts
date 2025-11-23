import { Variants } from "motion/react";
import { TreemapNode } from "./types";

export function generateGrayShadesArray(
  size: number
): { color: string; textColor: string }[] {
  const shades: { color: string; textColor: string }[] = [];

  const getRandomGrayShade = (exclude?: string): string => {
    let color: string;
    do {
      // Generate either dark (0-80) or light (175-255) gray values for high contrast
      const isDark = Math.random() > 0.5;
      const gray = isDark
        ? Math.floor(Math.random() * 80) // 0-80 for dark shades
        : Math.floor(Math.random() * 80) + 175; // 175-255 for light shades
      const hex = gray.toString(16).padStart(2, "0");
      color = `#${hex}${hex}${hex}`;
    } while (color === exclude);
    return color;
  };

  for (let i = 0; i < size; i++) {
    const prev = i > 0 ? shades[i - 1] : undefined;
    const color = getRandomGrayShade(prev?.color);
    shades.push({ color, textColor: textColorFor(color) });
  }

  return shades;
}

function textColorFor(bgHex: string): string {
  const r = parseInt(bgHex.slice(1, 3), 16);
  const g = parseInt(bgHex.slice(3, 5), 16);
  const b = parseInt(bgHex.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#FFFFFF";
}

export const expandableVariants = (leaf: TreemapNode): Variants => ({
  open: {
    width: "100vw",
    height: "100vh",
    left: -leaf.x0,
    top: -leaf.y0,
  },
  close: {
    width: "100%",
    height: "100%",
  },
});

export const expandableHeadingVariants = (leaf: TreemapNode): Variants => ({
  open: {
    width: "100vw",
    height: "100vh",
    left: -leaf.x0,
    top: -leaf.y0,
  },
  close: {
    width: "100%",
    height: "100%",
  },
});
