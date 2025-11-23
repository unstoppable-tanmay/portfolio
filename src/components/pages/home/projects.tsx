/* eslint-disable @next/next/no-img-element */
"use client";

import { TANMAY_TYPE } from "@/app/page";
import ProjectModal from "@/components/common/projects/project-modal";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useMemo, useRef, useState } from "react";
import ProjectCardContent from "../../common/projects/project-card";

interface ProjectsProps {
  data: TANMAY_TYPE["projects"];
}

// Configuration
const CARD_DISTANCE = 2000; // Distance between cards in pixels

const Projects = ({ data }: ProjectsProps) => {
  // Process projects to add component
  const PROJECTS = useMemo(
    () =>
      data.map((project) => ({
        ...project,
        component: (
          <ProjectCardContent
            title={project.title}
            description={project.description}
            stacks={project.stacks}
            links={project.links}
            image={project.image}
          />
        ),
      })),
    [data]
  );

  // Calculate total camera distance based on number of cards
  const LAST_CARD_Z = Math.abs(PROJECTS[PROJECTS.length - 1].zIndex);
  const TOTAL_CAMERA_DISTANCE = LAST_CARD_Z + 2000;
  const END_TITLE_Z = -LAST_CARD_Z - CARD_DISTANCE;

  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scatterValue, setScatterValue] = useState(0);
  const [selectedProject, setSelectedProject] = useState<
    (typeof PROJECTS)[number] | null
  >(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const cameraZ = useTransform(
    scrollYProgress,
    [0, 0.95],
    [0, TOTAL_CAMERA_DISTANCE]
  );

  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.25],
    [1, 1, 0]
  );

  const endTitleOpacity = useTransform(
    scrollYProgress,
    [0.75, 0.82, 0.92, 1],
    [0, 1, 1, 1]
  );

  const scatterProgress = useTransform(scrollYProgress, [0.95, 1], [0, 1]);

  useMotionValueEvent(scatterProgress, "change", (latest) => {
    setScatterValue(latest);
  });

  const text = "Still Solving More Problems. . .";
  const letterStaggers = useMemo(
    () => text.split("").map(() => Math.random() * 0.3),
    []
  );

  // ProjectCard component
  const ProjectCard = ({
    project,
    index,
  }: {
    project: (typeof PROJECTS)[number];
    index: number;
  }) => {
    const isLeft = project.side === "left";
    const cardDistance = Math.abs(project.zIndex);
    const appearStart = (cardDistance - 2000) / TOTAL_CAMERA_DISTANCE;
    const appearPeak = cardDistance / TOTAL_CAMERA_DISTANCE;
    const appearEnd = (cardDistance + 1200) / TOTAL_CAMERA_DISTANCE;

    const opacity = useTransform(
      scrollYProgress,
      [Math.max(0, appearStart), appearPeak, Math.min(1, appearEnd)],
      [0, 1, 0]
    );

    const rotateY = useTransform(
      scrollYProgress,
      [Math.max(0, appearStart), appearPeak, Math.min(1, appearEnd)],
      [0, isLeft ? 15 : -15, 0]
    );

    return (
      <motion.div
        id={`project-card-${project.id}`}
        style={{
          position: "absolute",
          top: "50%",
          [isLeft ? "left" : "right"]: "10%",
          translateY: "-50%",
          translateZ: `${project.zIndex}px`,
          transformStyle: "preserve-3d",
          opacity,
          rotateY: rotateY,
        }}
        className="w-[clamp(200px,50vw,500px)] h-[max(260px,min(min-content,600px))] bg-white cursor-pointer"
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={() => setSelectedProject(project)}
      >
        {project.component}
      </motion.div>
    );
  };

  return (
    <section
      style={{
        height: `${PROJECTS.length * 150 + 100}vh`,
        touchAction: "pan-y",
      }}
      ref={sectionRef}
      className="min-h-[450vh] bg-black font-Poppins relative"
    >
      <div
        className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "center center",
        }}
      >
        <motion.div
          style={{
            translateZ: cameraZ,
            transformStyle: "preserve-3d",
          }}
          className="relative w-full h-full"
        >
          <motion.h2
            style={{
              opacity: titleOpacity,
              position: "absolute",
              top: "50%",
              left: "50%",
              translateX: "-50%",
              translateY: "-50%",
              translateZ: "-500px",
              transformStyle: "preserve-3d",
            }}
            className="text-[clamp(30px,4vw,100px)] md:text-[clamp(40px,5vw,150px)] font-normal text-white/90 pointer-events-none whitespace-nowrap font-Poppins"
          >
            My Ideas
          </motion.h2>

          <div
            className="absolute inset-0"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {PROJECTS.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          <motion.h2
            style={{
              opacity: endTitleOpacity,
              position: "absolute",
              top: "50%",
              left: "50%",
              translateX: "-50%",
              translateY: "-50%",
              translateZ: `${END_TITLE_Z}px`,
              transformStyle: "preserve-3d",
            }}
            className="text-[clamp(32px,1.5vw,80px)] font-normal font-Poppins text-white/90 pointer-events-none whitespace-nowrap"
          >
            {scatterValue > 0
              ? text.split("").map((char, i) => {
                  const stagger = letterStaggers[i];
                  const letterProgress = Math.max(
                    0,
                    Math.min(1, (scatterValue - stagger) / 0.3)
                  );
                  const opacity = 1 - letterProgress;

                  return (
                    <span
                      key={i}
                      style={{
                        opacity,
                        display: "inline-block",
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  );
                })
              : text}
          </motion.h2>

          <motion.div
            style={{
              opacity: useTransform(
                scrollYProgress,
                [0, 0.15, 0.85, 1],
                [0, 0.4, 0.4, 0]
              ),
            }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(255,255,255,0.03)_100%)]" />
          </motion.div>
        </motion.div>
      </div>

      <ProjectModal
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        project={{
          image: selectedProject?.image,
          title: selectedProject?.title,
          description: selectedProject?.description,
          stacks: selectedProject?.stacks,
          links: selectedProject?.links,
        }}
      />
    </section>
  );
};

export default Projects;
