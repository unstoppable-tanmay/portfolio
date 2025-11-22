/* eslint-disable @next/next/no-img-element */
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ExperienceItem {
  id: number;
  company: string;
  logo: string;
  role: string;
  duration: string;
  period: string;
  description: string[];
  technologies: string[];
  achievements?: string[];
  link?: string;
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: 1,
    company: "Papaya Global",
    logo: "/images/companies/papaya.png",
    role: "SDE 1",
    duration: "1 year 4 months",
    period: "Aug 2024 - Present",
    description: [
      "Built MCP Agent with Generative AI for Figma-to-UI conversion",
      "Contributed to backend with Java Spring Boot, Kafka, RabbitMQ",
    ],
    technologies: [
      "React",
      "TypeScript",
      "Java Spring Boot",
      "Kafka",
      "RabbitMQ",
      "MariaDB",
      "Playwright",
      "Generative AI",
    ],
    achievements: [
      "Accelerated design-to-production pipeline with AI",
      "Develped Centralized Knoledge Base of Company",
    ],
    link: "https://www.linkedin.com/company/papaya-global",
  },
  {
    id: 2,
    company: "AlphaBI",
    logo: "/images/companies/alphabi.jpeg",
    role: "SDE Intern",
    duration: "7 months",
    period: "Jan 2024 - Aug 2024",
    description: [
      "Implemented Next.js 14, Prisma, Strapi, Kafka, Docker",
      "Enhanced company website with SEO optimizations",
      "Worked on a real-time health monitoring app with Flutter",
    ],
    technologies: [
      "Next.js 14",
      "Prisma",
      "Strapi",
      "Kafka",
      "Flutter",
      "Docker",
      "TypeScript",
    ],
    achievements: [
      "Increased UX of the websites",
      "Improved the design of real-time health monitoring app",
    ],
    link: "https://www.linkedin.com/company/techalphabi",
  },
  {
    id: 3,
    company: "Intelligent Cloud Applications",
    logo: "/images/companies/cloud-application.jpeg",
    role: "SDE Part Time",
    duration: "10 months",
    period: "Mar 2023 - Dec 2023",
    description: [
      "Built serverless backend and interactive frontend service",
      "Optimized legacy backend for low API overhead",
      "Led technical team as Tech Lead",
    ],
    technologies: ["Serverless", "React", "Node.js", "AWS", "Next.js", "AWS"],
    achievements: [
      "Reduced server load by 50%",
      "Designed scalable architecture for future growth",
    ],
    link: "https://www.linkedin.com/company/icloudapps/",
  },
];

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Calculate scroll-triggered horizontal movement
  // Get viewport width (fallback for SSR)
  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : 1200;

  // Use responsive card width based on viewport
  const isMobile = viewportWidth < 768;
  const cardWidth = isMobile ? viewportWidth * 0.85 : 420; // 85vw on mobile, 420px on desktop
  const gap = 24; // gap-6 = 24px
  const paddingLeft = isMobile ? 16 : 32; // pl-4 on mobile, pl-8 on desktop

  // Total width of all cards
  const totalCardsWidth = EXPERIENCES.length * (cardWidth + gap) + paddingLeft;

  // Only scroll if content is wider than viewport
  const scrollDistance = Math.max(0, totalCardsWidth - viewportWidth);

  // Calculate section height based on scroll distance needed
  // More conservative multiplier for smoother scroll
  const scrollHeightVh =
    scrollDistance > 0
      ? Math.min(300, 100 + Math.ceil(scrollDistance / 3))
      : 100;

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-black font-Poppins min-h-screen my-[5vh]"
      style={{
        minHeight: "100vh",
        height: scrollDistance > 0 ? `${scrollHeightVh}vh` : "100vh",
      }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center flex-col overflow-hidden">
        <div className="w-full px-4 md:px-6">
          {/* Header and Footer Stats Container */}
          <div className="w-full px-6 mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-white text-[clamp(30px,4vw,100px)] md:text-[clamp(40px,5vw,150px)] font-normal">
                Experience
              </h2>
            </motion.div>

            {/* Footer Stats - Desktop Only */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:grid grid-cols-4 gap-3 flex-shrink-0"
            >
              <div className="bg-white backdrop-blur-sm border border-white/10 p-4 text-center hover:bg-white/10 transition-colors min-w-[100px]">
                <div className="text-2xl font-light text-black mb-1">2.5+</div>
                <p className="text-black/40 text-xs font-light">Years</p>
              </div>
              <div className="bg-white backdrop-blur-sm border border-white/10 p-4 text-center hover:bg-white/10 transition-colors min-w-[100px]">
                <div className="text-2xl font-light text-black mb-1">3</div>
                <p className="text-black/40 text-xs font-light">Companies</p>
              </div>
              <div className="bg-white backdrop-blur-sm border border-white/10 p-4 text-center hover:bg-white/10 transition-colors min-w-[100px]">
                <div className="text-2xl font-light text-black mb-1">15+</div>
                <p className="text-black/40 text-xs font-light">Projects</p>
              </div>
              <div className="bg-white backdrop-blur-sm border border-white/10 p-4 text-center hover:bg-white/10 transition-colors min-w-[100px]">
                <div className="text-2xl font-light text-black mb-1">10+</div>
                <p className="text-black/40 text-xs font-light">Technologies</p>
              </div>
            </motion.div>
          </div>

          {/* Horizontal Scroll Container */}
          <motion.div
            style={{ x: scrollDistance > 0 ? x : undefined }}
            className={`flex gap-6 pl-4 md:pl-8 ${
              scrollDistance === 0 ? "justify-center" : ""
            }`}
          >
            {EXPERIENCES.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="flex-shrink-0 w-[85vw] md:w-[420px] relative"
              >
                {/* Card */}
                <div className="group relative bg-white backdrop-blur-sm border border-white/10 hover:bg-white/95 hover:border-white/20 transition-all duration-300 h-full">
                  {/* Company Logo & Header */}
                  <div className="p-6 pb-0 border-b border-white/10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={exp.logo}
                          alt={exp.company}
                          className="w-12 h-12 object-contain bg-white/"
                        />
                        <div>
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black text-lg font-light hover:underline"
                          >
                            {exp.company}
                          </a>
                          <p className="text-black/60 text-sm font-light">
                            {exp.role}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <p className="text-black/40 font-light">{exp.period}</p>
                      <span className="text-black/20">•</span>
                      <p className="text-black/60 font-light">{exp.duration}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="p-6 space-y-4">
                    <ul className="space-y-2">
                      {exp.description.map((item, i) => (
                        <li
                          key={i}
                          className="text-black/70 text-sm font-light flex items-center gap-2"
                        >
                          <span className="w-2 aspect-square bg-black/80" />
                          <span className="text-xs">{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Achievements */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="pt-2 max-md:hidden">
                        <p className="text-black/50 text-xs mb-2 font-light">
                          Key Achievements
                        </p>
                        <ul className="space-y-1">
                          {exp.achievements.map((achievement, i) => (
                            <li
                              key={i}
                              className="text-black/60 text-xs font-light flex items-start gap-2"
                            >
                              <span className="text-black/30">-</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Technologies */}
                    <div className="pt-2">
                      <p className="text-black/50 text-xs mb-2 font-light">
                        Technologies
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-black/5 border border-white/10 text-black/60 text-xs font-light hover:bg-black/10 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer Stats - Mobile Only */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:hidden mt-8 grid grid-cols-2 gap-3"
          >
            <div className="bg-black/5 backdrop-blur-sm border border-white/10 p-6 text-center hover:bg-white/10 transition-colors">
              <div className="text-3xl font-light text-white mb-1">2.5+</div>
              <p className="text-white/40 text-xs font-light">Years</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-center hover:bg-white/10 transition-colors">
              <div className="text-3xl font-light text-white mb-1">3</div>
              <p className="text-white/40 text-xs font-light">Companies</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-center hover:bg-white/10 transition-colors">
              <div className="text-3xl font-light text-white mb-1">15+</div>
              <p className="text-white/40 text-xs font-light">Projects</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-center hover:bg-white/10 transition-colors">
              <div className="text-3xl font-light text-white mb-1">10+</div>
              <p className="text-white/40 text-xs font-light">Technologies</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
