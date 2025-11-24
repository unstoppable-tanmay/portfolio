"use client";
/* eslint-disable @next/next/no-img-element */
import { TANMAY_TYPE } from "@/app/page";
import { useStateContext } from "@/providers/state-provider";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link } from "next-view-transitions";
import { useEffect, useRef, useState } from "react";
import { CiMapPin } from "react-icons/ci";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiGeminiFill } from "react-icons/ri";
import Me from "../../common/landing/me";

gsap.registerPlugin(useGSAP);

const Landing = ({ data }: { data: TANMAY_TYPE }) => {
  const { } = useStateContext();
  const container = useRef<HTMLElement>(null);
  const imageRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useGSAP(
    () => {
      gsap.from(".profession", {
        duration: 1,
        opacity: 0,
        delay: 0.6,
      });
      gsap.from(".name_initial", {
        duration: 1,
        opacity: 0,
        delay: 0.6,
      });
      gsap.from(".name_final", {
        duration: 1,
        opacity: 0,
        delay: 0.6,
      });
      gsap.from(".me_as_img", {
        duration: 1,
        opacity: 0,
        delay: 0.2,
      });

      // Animate peripheral info with custom stagger from different corners
      gsap.from(".peripheral-top-left", {
        duration: 1.2,
        opacity: 0,
        x: -30,
        y: -20,
        delay: 1,
        stagger: 0.15,
      });

      gsap.from(".peripheral-top-right", {
        duration: 1.2,
        opacity: 0,
        x: 30,
        y: -20,
        delay: 1.2,
        stagger: 0.12,
      });

      gsap.from(".peripheral-bottom-left", {
        duration: 1.2,
        opacity: 0,
        x: -30,
        y: 20,
        delay: 1.4,
        stagger: 0.15,
      });

      gsap.from(".peripheral-bottom-right", {
        duration: 1.2,
        opacity: 0,
        x: 30,
        y: 20,
        delay: 1.6,
        stagger: 0.1,
      });

      gsap.from(".peripheral-mobile", {
        duration: 1,
        opacity: 0,
        y: 20,
        delay: 1.2,
      });
    },
    { scope: container }
  );

  const [direction, setDirection] = useState<"left" | "right">("left");
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Track mouse movement and device orientation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      setMousePosition({ x, y });
      setDirection(x < 0 ? "left" : "right");
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      // beta: front-to-back tilt (-180 to 180, 0 is flat)
      // gamma: left-to-right tilt (-90 to 90, 0 is flat)
      const beta = e.beta || 0;
      const gamma = e.gamma || 0;

      // Normalize to -1 to 1 range
      const x = Math.max(-1, Math.min(1, gamma / 30)); // gamma ranges from -90 to 90, divide by 30 for sensitivity
      const y = Math.max(-1, Math.min(1, (beta - 75) / 30)); // Adjusted beta centering for better up/down response

      setMousePosition({ x, y });
      setDirection(x < 0 ? "left" : "right");
    };

    // Check if device supports orientation
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // Animate portrait based on mouse/tilt position
  useEffect(() => {
    if (imageRef.current) {
      const maxMove = isTouchDevice ? 25 : 8; // 35px for touch devices, 8px for desktop
      const x = mousePosition.x * maxMove;
      const y = mousePosition.y * maxMove;

      gsap.to(imageRef.current, {
        x: x,
        y: y,
        duration: 1.2,
        ease: "power2.out",
      });
    }

    // Animate wrapper 3D rotation
    if (wrapperRef.current) {
      const rotateX = mousePosition.y * -2; // Very subtle: -2 to 2 degrees
      const rotateY = mousePosition.x * 2; // Very subtle: -2 to 2 degrees

      gsap.to(wrapperRef.current, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 1.2,
        ease: "power2.out",
        transformPerspective: 1000,
      });
    }
  }, [mousePosition, isTouchDevice]);

  return (
    <main
      ref={container}
      className="section section_landing w-full flex items-center justify-center overflow-hidden h-[100svh] mx-auto font-Poppins relative"
    >
      <div
        ref={wrapperRef}
        className="name_wrapper w-[calc(100%-5vh)] md:px-4 h-[calc(100%-5vh)] md:w-[calc(100%-7vh)] md:h-[calc(100%-7vh)] bg-white flex items-center justify-center gap-[clamp(10px,2vw,30px)] md:gap-[clamp(25px,3vw,100px)] max-md:flex-col relative top-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Content */}
        <h2 className="profession flex-1 flex justify-end max-md:items-end text-[clamp(14px,1vw,18px)] font-light translate-y-[0%] text-black/80">
          {data.personal.profession}
        </h2>
        <div className="relative h-[70svh] lg:h-[95svh] aspect-[0.828125]">
          <Me
            ref={imageRef}
            dev={direction === "left" ? true : false}
            className="me_as_img h-full w-full object-fill"
          />
        </div>
        <div className="name_final flex flex-1 items-center justify-start gap-2">
          <h2 className="text-[clamp(14px,1vw,18px)] font-light translate-y-[0%] text-black/80">
            {data.personal.name}
          </h2>
          <Link
            className="appearance-none outline-none border-none bg-black text-white px-1 font-Poppins text-[clamp(10px,0.8vw,18px)] cursor-pointer flex gap-1 items-center justify-center relative"
            href="/ai"
            onClick={() => {
              document.documentElement.dataset.transition = "forward";
            }}
          >
            <div className="bg absolute w-full aspect-square animate-ping bg-black blur-md opacity-20 -z-10"></div>
            AI<RiGeminiFill />
          </Link>

        </div>
        {/* Peripheral Info - Desktop Only */}
        {/* Top Left - Quick Actions */}
        <div className="peripheral-top-left absolute top-8 left-8 hidden md:flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <a
              href={data.social.resume}
              className="text-[10px] font-light text-black/70 hover:text-black/90 transition-colors pointer-events-auto group flex items-center gap-1.5"
            >
              <span className="group-hover:underline">Resume</span>
              <span className="text-[8px]">↓</span>
            </a>
            <a
              href={data.social.linkedin}
              target="_blank"
              className="text-[10px] font-light text-black/70 hover:text-black/90 transition-colors pointer-events-auto group"
            >
              <span className="group-hover:underline">LinkedIn</span>
            </a>
            <a
              href={data.social.github}
              target="_blank"
              className="text-[10px] font-light text-black/70 hover:text-black/90 transition-colors pointer-events-auto group"
            >
              <span className="group-hover:underline">GitHub</span>
            </a>
            <a
              href={data.social.medium}
              target="_blank"
              className="text-[10px] font-light text-black/70 hover:text-black/90 transition-colors pointer-events-auto group"
            >
              <span className="group-hover:underline">Medium</span>
            </a>
          </div>
        </div>

        {/* Top Right - Skills with 3D depth */}
        <div
          className="peripheral-top-right absolute top-8 right-8 hidden md:flex flex-col gap-2"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="text-[9px] font-light text-right text-black/50 mb-1">
            {data.meta.availability.status}
          </div>
          {data.skills
            .sort((a, b) => (a.percentage > b.percentage ? -1 : 1))
            .slice(0, 4)
            .map((skill, index) => (
              <div
                key={index}
                className="text-[10px] hover:translate-z-[10px] cursor-pointer p-3 -m-3 duration-100 font-light text-black/70 text-right"
              >
                {skill.name}
              </div>
            ))}
          <div className="text-[9px] font-light text-black/50 text-right mt-1">
            {data.meta.totalTechnologies}
          </div>
        </div>

        {/* Bottom Left - Location & Projects */}
        <div className="peripheral-bottom-left absolute bottom-8 left-8 hidden md:flex flex-col gap-3">
          <div className="text-[10px] text-black/60 font-Poppins">
            My Top Ideas
          </div>
          {data.projects.slice(0, 2).map((project, index) => (
            <a
              key={project.id}
              href={`#project-card-${project.id}`}
              className={`text-[10px] font-light ${index === 0 ? "text-black/70" : "text-black/60"
                } hover:text-black/80 transition-colors pointer-events-auto group no-underline p-3 -m-3`}
            >
              <span className="group-hover:underline">{project.title}</span>
              <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
              <div className="text-[8px] text-black/50 mt-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                {project.stacks?.slice(0, 3).join(", ")}
              </div>
            </a>
          ))}
          <div className="flex gap-1 flex-col">
            <a
              href={`mailto:${data.personal.email}`}
              className="text-[9px] font-light text-black/70 cursor-pointer flex items-center gap-1 no-underline"
            >
              <span>
                <MdOutlineAlternateEmail />
              </span>
              <span>{data.personal.email}</span>
            </a>
            <a
              href={data.personal.location.mapLink}
              className="text-[9px] font-light text-black/70 cursor-pointer flex items-center gap-1 no-underline"
            >
              <span>
                <CiMapPin />
              </span>
              <span>
                {data.personal.location.city}, {data.personal.location.country}
              </span>
            </a>
          </div>
        </div>

        {/* Bottom Right - Experience Timeline with Arc */}
        <div className="peripheral-bottom-right absolute bottom-8 right-8 hidden md:flex flex-col items-end gap-2">
          <div className="flex items-center gap-4">
            {data.experience
              .slice(0, 2)
              .reverse()
              .map((item, index) => (
                <>
                  {index > 0 && (
                    <div
                      key={`arrow-${index}`}
                      className="flex items-center gap-2"
                    >
                      <div className="w-4 h-[1px] bg-black/50"></div>
                      <FaArrowRightLong className="text-black/50 text-[10px]" />
                      <div className="w-4 h-[1px] bg-black/50"></div>
                    </div>
                  )}
                  <div key={item.company} className="text-right group">
                    <div className="text-[9px] font-light text-black/50 pointer-events-none">
                      {item.period}
                    </div>
                    <a
                      href={item.link}
                      target="_blank"
                      className="flex gap-0.5 items-center justify-end no-underline"
                    >
                      <img
                        src={item.logo}
                        alt=""
                        className={`${index === 0 ? "w-[12px]" : "w-[15px]"
                          } aspect-square object-fill`}
                      />
                      <span className="text-[10px] font-normal text-black/60">
                        {item.company}
                      </span>
                    </a>
                    <div className="text-[8px] font-light text-black/50 pointer-events-none">
                      {item.role}
                    </div>
                  </div>
                </>
              ))}
          </div>
          <div className="text-[10px] font-light text-black/70 pointer-events-none">
            {data.meta.totalExperience} Of Building Tech
          </div>
        </div>

        {/* Mobile - Scroll Indicator */}
        <div className="peripheral-mobile absolute bottom-8 left-1/2 -translate-x-1/2 md:hidden pointer-events-none">
          <div className="text-[10px] font-light text-black/60 flex items-center gap-2">
            Scroll to explore
            <span className="animate-bounce">↓</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Landing;
