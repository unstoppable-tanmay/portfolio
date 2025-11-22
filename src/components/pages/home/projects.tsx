/* eslint-disable @next/next/no-img-element */
"use client";

import ProjectModal from "@/components/common/projects/project-modal";
import {
  motion,
  MotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useMemo, useRef, useState } from "react";
import ProjectCardContent from "../../common/projects/project-card";

// Demo project items (will be replaced with actual content later)
const INITIAL_PROJECTS: {
  title: string;
  component?: React.ReactNode;
  image?: string;
  description?: string;
  stacks?: string[];
  links?: {
    live?: string;
    github?: string;
    case_study?: string;
  };
}[] = [
  {
    title: "Ai-Os",
    image: "images/projects/ai-os.svg",
    description:
      "A multimodal AI OS assistant with voice, screen, and keyboard control for app automation. Features a memory-driven 'second brain' for personalized planning, reminders, habit tracking, and emotional support.",
    stacks: ["React", "Electron", "NATS", "Whisper", "llama.cpp", "Chroma"],
    links: {
      github: "https://github.com/unstoppable-tanmay/ai-os",
    },
    component: (
      <ProjectCardContent
        title="Ai-Os: Building A Rust Based AI OS"
        description="A multimodal AI OS assistant with voice, screen, and keyboard control for app automation. Features a memory-driven 'second brain' for personalized planning, reminders, habit tracking, and emotional support."
        stacks={["React", "Electron", "NATS", "Whisper", "llama.cpp", "Chroma"]}
        links={{
          github: "https://github.com/unstoppable-tanmay/ai-os",
        }}
        image="images/projects/ai-os.svg"
      />
    ),
  },
  {
    title: "Meet",
    image: "images/projects/google-meet.png",
    description:
      "Next-gen video conferencing using Mediasoup's SFU architecture to reduce bandwidth by 50%. Includes screen sharing, chat, recording, scheduling, and Google OAuth2 authentication.",
    stacks: ["Mediasoup", "WebRTC", "Socket.IO", "Next.js", "Express.js"],
    links: {
      github: "https://github.com/unstoppable-tanmay/google-meet-node",
    },
    component: (
      <ProjectCardContent
        title="Meet: SFU Enhanced Next-Gen Google Meet Alternative"
        description="Next-gen video conferencing using Mediasoup's SFU architecture to reduce bandwidth by 50%. Includes screen sharing, chat, recording, scheduling, and Google OAuth2 authentication."
        stacks={["Mediasoup", "WebRTC", "Socket.IO", "Next.js", "Express.js"]}
        links={{
          github: "https://github.com/unstoppable-tanmay/google-meet-node",
        }}
        image="/images/projects/google-meet.png"
      />
    ),
  },
  {
    title: "CodeSnip",
    image: "images/projects/codesnip.png",
    description:
      "A social media platform for developers to share and discover code snippets. Built as a modern alternative to Stack Overflow with an intuitive interface for posting, searching, and discussing code blocks across various programming languages.",
    stacks: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma"],
    links: {
      github: "https://github.com/unstoppable-tanmay/CodeSnip",
    },
    component: (
      <ProjectCardContent
        title="CodeSnip: The Second Stack Overflow"
        description="A social media platform for developers to share and discover code snippets. Built as a modern alternative to Stack Overflow with an intuitive interface for posting, searching, and discussing code blocks across various programming languages."
        stacks={[
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "PostgreSQL",
          "Prisma",
        ]}
        links={{
          github: "https://github.com/unstoppable-tanmay/CodeSnip",
        }}
        image="images/projects/codesnip.png"
      />
    ),
  },
];

// Configuration
const CARD_DISTANCE = 2000; // Distance between cards in pixels
const INITIAL_Z_OFFSET = -CARD_DISTANCE - 1500; // Starting z position for first card

// Process projects to add id, side, and zIndex
const PROJECTS = INITIAL_PROJECTS.map((project, index) => ({
  ...project,
  id: index + 1,
  side: index % 2 === 0 ? "left" : "right",
  zIndex: INITIAL_Z_OFFSET - index * CARD_DISTANCE,
}));

// Calculate total camera distance based on number of cards
// Camera needs to travel past the last card + extra buffer for fade out
const LAST_CARD_Z = Math.abs(PROJECTS[PROJECTS.length - 1].zIndex);
const TOTAL_CAMERA_DISTANCE = LAST_CARD_Z + 2000; // Last card position + 2000 buffer
const END_TITLE_Z = -LAST_CARD_Z - CARD_DISTANCE; // Position end title 1000 units after last card

interface ProjectCardProps {
  project: (typeof PROJECTS)[number];
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  index: number;
  scrollYProgress: MotionValue<number>;
  onClick: () => void;
}

const ProjectCard = ({
  project,
  hoveredIndex,
  setHoveredIndex,
  index,
  scrollYProgress,
  onClick,
}: ProjectCardProps) => {
  const isLeft = project.side === "left";

  // Calculate when this card is near the camera
  // Card starts at project.zIndex and camera moves dynamically
  const cardDistance = Math.abs(project.zIndex);
  const appearStart = (cardDistance - 2000) / TOTAL_CAMERA_DISTANCE; // Start appearing 2000 units before
  const appearPeak = cardDistance / TOTAL_CAMERA_DISTANCE; // Closest point
  const appearEnd = (cardDistance + 1200) / TOTAL_CAMERA_DISTANCE; // Fade after passing

  // Opacity based on distance from camera
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, appearStart), appearPeak, Math.min(1, appearEnd)],
    [0, 1, 0]
  );

  // Rotation - starts at 0, rotates when near camera, returns to 0
  const rotateY = useTransform(
    scrollYProgress,
    [Math.max(0, appearStart), appearPeak, Math.min(1, appearEnd)],
    [0, isLeft ? 15 : -15, 0]
  );

  return (
    <motion.div
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
      onClick={onClick}
    >
      {project.component}
    </motion.div>
  );
};

const Projects = () => {
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

  // Camera moves forward on Z-axis dynamically based on number of cards
  const cameraZ = useTransform(
    scrollYProgress,
    [0, 0.95],
    [0, TOTAL_CAMERA_DISTANCE]
  );

  // Title animations - static, no zoom
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.25],
    [1, 1, 0]
  );

  // End title animations - appears at the end
  const endTitleOpacity = useTransform(
    scrollYProgress,
    [0.75, 0.82, 0.92, 1],
    [0, 1, 1, 1]
  );

  // Letter scatter animation - only starts after title is fully visible
  const scatterProgress = useTransform(
    scrollYProgress,
    [0.95, 1], // Start scatter at 95%, giving more time for title to be fully visible
    [0, 1]
  );

  // Monitor scatter progress
  useMotionValueEvent(scatterProgress, "change", (latest) => {
    setScatterValue(latest);
  });

  // Text for end title
  const text = "Still Solving More Problems. . .";

  // Create random stagger values for each letter (memoized to prevent re-randomization)
  const letterStaggers = useMemo(
    () => text.split("").map(() => Math.random() * 0.3),
    []
  );

  return (
    <section
      style={{
        height: `${PROJECTS.length * 150 + 100}vh`,
        touchAction: "pan-y", // Allow vertical scrolling on touch devices
      }}
      ref={sectionRef}
      className="min-h-[450vh] bg-black font-Poppins relative"
    >
      <div
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "center center",
        }}
      >
        {/* Camera container - this moves forward */}
        <motion.div
          style={{
            translateZ: cameraZ,
            transformStyle: "preserve-3d",
          }}
          className="relative w-full h-full"
        >
          {/* Title - positioned at z: -500 */}
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

          {/* Cards Container - all cards are positioned at their fixed z-depth */}
          <div
            className="absolute inset-0"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {PROJECTS.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                hoveredIndex={hoveredIndex}
                setHoveredIndex={setHoveredIndex}
                scrollYProgress={scrollYProgress}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>

          {/* End Title - positioned dynamically at the end */}
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

          {/* Speed lines effect for motion */}
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

      {/* Project Modal */}
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
