"use client";
/* eslint-disable @next/next/no-img-element */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { CiMapPin } from "react-icons/ci";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdOutlineAlternateEmail } from "react-icons/md";
import Me from "../../common/landing/me";

gsap.registerPlugin(useGSAP);
const Landing = () => {
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
          Software Engineer
        </h2>
        <div className="relative h-[70svh] lg:h-[95svh] aspect-[0.828125]">
          <Me
            ref={imageRef}
            dev={direction === "left" ? true : false}
            className="me_as_img h-full w-full object-fill"
          />
        </div>
        <h2 className="name_final flex-1 flex justify-start text-[clamp(14px,1vw,18px)] font-light translate-y-[0%] text-black/80">
          Tanmay Kumar
        </h2>

        {/* Peripheral Info - Desktop Only */}
        {/* Top Left - Quick Actions */}
        <div className="peripheral-top-left absolute top-8 left-8 hidden md:flex flex-col gap-2">
          <a
            href="/test-1"
            className="text-[10px] font-light text-black/70 hover:text-black/90 transition-colors pointer-events-auto group flex items-center gap-1.5"
          >
            <span className="group-hover:underline">Resume</span>
            <span className="text-[8px]">↓</span>
          </a>
          <a
            href="https://linkedin.com/in/tanmay-kumar-panda"
            target="_blank"
            className="text-[10px] font-light text-black/70 hover:text-black/90 transition-colors pointer-events-auto group"
          >
            <span className="group-hover:underline">LinkedIn</span>
          </a>
          <a
            href="https://github.com/unstoppable-tanmay"
            target="_blank"
            className="text-[10px] font-light text-black/70 hover:text-black/90 transition-colors pointer-events-auto group"
          >
            <span className="group-hover:underline">GitHub</span>
          </a>
          <a
            href="https://medium.com/@tanmaypanda752"
            target="_blank"
            className="text-[10px] font-light text-black/70 hover:text-black/90 transition-colors pointer-events-auto group"
          >
            <span className="group-hover:underline">Medium</span>
          </a>
        </div>

        {/* Top Right - Skills with 3D depth */}
        <div
          className="peripheral-top-right absolute top-8 right-8 hidden md:flex flex-col gap-2"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="text-[9px] font-light text-black/50 mb-1">
            Available for work
          </div>
          <div className="text-[10px] hover:translate-z-[10px] cursor-pointer p-3 -m-3 duration-100 font-light text-black/70 text-right">
            React
          </div>
          <div className="text-[10px] hover:translate-z-[10px] cursor-pointer p-3 -m-3 duration-100 font-light text-black/70 text-right">
            TypeScript
          </div>
          <div className="text-[10px] hover:translate-z-[10px] cursor-pointer p-3 -m-3 duration-100 font-light text-black/70 text-right">
            Next.js
          </div>
          <div className="text-[10px] hover:translate-z-[10px] cursor-pointer p-3 -m-3 duration-100 font-light text-black/70 text-right">
            Node.js
          </div>
          <div className="text-[9px] font-light text-black/50 text-right mt-1">
            15+ Technologies
          </div>
        </div>

        {/* Bottom Left - Location & Projects */}
        <div className="peripheral-bottom-left absolute bottom-8 left-8 hidden md:flex flex-col gap-3">
          <div className="flex gap-1 flex-col">
            <a
              href="mailto:tanmaypanda752@gmail.com"
              className="text-[9px] font-light text-black/70 cursor-pointer flex items-center gap-1 no-underline"
            >
              <span>
                <MdOutlineAlternateEmail />
              </span>
              <span>tanmaypanda752@gmail.com</span>
            </a>
            <a
              href="https://share.google/REPATkpRwU69G0MQE"
              className="text-[9px] font-light text-black/70 cursor-pointer flex items-center gap-1 no-underline"
            >
              <span>
                <CiMapPin />
              </span>
              <span>Banglure, India</span>
            </a>
          </div>
          <a
            href="#project-1"
            className="text-[10px] font-light text-black/70 hover:text-black/80 transition-colors pointer-events-auto group no-underline p-3 -m-3"
          >
            <span className="group-hover:underline">Project Alpha</span>
            <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </span>
            <div className="text-[8px] text-black/50 mt-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
              React • TypeScript • 2024
            </div>
          </a>
          <a
            href="#project-2"
            className="text-[10px] font-light text-black/60 hover:text-black/80 transition-colors pointer-events-auto group no-underline p-3 -m-3"
          >
            <span className="group-hover:underline">Project Beta</span>
            <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </span>
            <div className="text-[8px] text-black/50 mt-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
              Next.js • Node.js • 2024
            </div>
          </a>
        </div>

        {/* Bottom Right - Experience Timeline with Arc */}
        <div className="peripheral-bottom-right absolute bottom-8 right-8 hidden md:flex flex-col items-end gap-2">
          <div className="flex items-center gap-4">
            <div className="text-right group">
              <div className="text-[9px] font-light text-black/50 pointer-events-none">
                2023-2024
              </div>
              <a
                href="https://www.linkedin.com/company/techalphabi"
                target="_blank"
                className="flex gap-0.5 items-center justify-center no-underline"
              >
                <img
                  src="images/companies/alphabi.jpeg"
                  alt=""
                  className="w-[12px] aspect-square object-fill"
                />
                <span className="text-[10px] font-normal text-black/60">
                  AlphaBI.
                </span>
              </a>
              <div className="text-[8px] font-light text-black/50 pointer-events-none">
                SDE
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-[1px] bg-black/50"></div>
              <FaArrowRightLong className="text-black/50 text-[10px]" />
              <div className="w-4 h-[1px] bg-black/50"></div>
            </div>
            <div className="text-right group">
              <div className="text-[9px] font-light text-black/50 pointer-events-none">
                2024-Present
              </div>
              <a
                href="https://www.linkedin.com/company/papaya-global"
                target="_blank"
                className="flex gap-0.5 items-center justify-center no-underline"
              >
                <img
                  src="images/companies/papaya.png"
                  alt=""
                  className="w-[15px] aspect-square object-fill"
                />
                <span className="text-[10px] font-normal text-black/60">
                  Papaya Global.
                </span>
              </a>
              <div className="text-[8px] font-light text-black/50 pointer-events-none">
                SDE 1
              </div>
            </div>
          </div>
          <div className="text-[10px] font-light text-black/70 pointer-events-none">
            3+ Years Experience
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
