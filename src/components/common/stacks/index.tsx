"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { hierarchy, treemap } from "d3";
import { throttle } from "lodash";
import { generateGrayShadesArray } from "./utils";
import { StackItem, TechStackTreemapProps, TreemapNode } from "./types";
import { Stack } from "./stack";
import { useLenis } from "@/providers/lenis-provider";
import { useMediaQuery } from "@/hooks/use-media";

export const TechStackTreemap: React.FC<TechStackTreemapProps> = ({
  stacks,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { breakpoint } = useMediaQuery();

  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    if (!containerRef.current) return;

    const obs = new ResizeObserver(
      throttle(([entry]) => {
        const { width, height } = entry.contentRect;
        setSize({ w: width, h: height });
      }, 1300)
    );
    obs.observe(containerRef.current);

    // IntersectionObserver to check if container is more than 50% visible
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          // lenis.scrollTo(".section_stacks");
        }
      });
    };

    const intersectionObs = new window.IntersectionObserver(handleIntersect, {
      threshold: [0.5],
    });

    intersectionObs.observe(containerRef.current);

    return () => {
      obs.disconnect();
      intersectionObs.disconnect();
    };
  }, []);

  const treemapData = useMemo(() => {
    const total = stacks.reduce((sum, s) => sum + s.percentage, 0);
    const root = hierarchy<StackItem>({
      name: "root",
      percentage: 0,
      children: stacks.map((s) => ({
        name: s.name,
        percentage: s.percentage,
      })),
    })
      .sum((d) =>
        d.name === "root" ? 0 : (d.percentage / total) * (size.w * size.h)
      )
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    treemap<StackItem>()
      .size([size.w, size.h])
      .paddingInner(breakpoint === "md" ? 4 : 2)
      .round(true)(root);

    return root.leaves() as TreemapNode[];
  }, [stacks, size]);
  const colors = useMemo(
    () => generateGrayShadesArray(stacks.length),
    [stacks.length]
  );

  if (size.w === 0 || size.h === 0)
    return (
      <div ref={containerRef} className={`w-full h-full ${className ?? ""}`} />
    );
  return (
    <div
      ref={containerRef}
      className={`section section_stacks relative w-full h-full flex items-center justify-center ${
        className ?? ""
      }`}
    >
      {(treemapData as TreemapNode[]).map((leaf, i) => {
        // return <Expandable key={i} color={colors[i]} leaf={leaf} i={i} />;
        return <Stack key={i} color={colors[i]} leaf={leaf} i={i} />;
      })}
    </div>
  );
};
