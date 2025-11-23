"use client";

import { TANMAY_TYPE } from "@/app/page";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const Contact = ({ data }: { data: TANMAY_TYPE }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".contact-item",
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: "linear",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="h-screen w-full bg-black flex items-center justify-center font-Poppins py-20 relative overflow-hidden"
    >
      {/* Circular Gradient Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Blue circle at bottom */}
        <div className="absolute left-1/2 translate-x-[-50%] top-[70vh] w-[300vw] aspect-square rounded-full bg-blue-500 blur-[120px]" />

        {/* White circle overlapping - smaller and less opaque */}
        <div className="absolute left-1/2 translate-x-[-53%] top-[80vh] w-[300vw] aspect-square rounded-full bg-white blur-[120px]" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Left Side - Heading */}
          <div className="contact-item">
            <h2 className="text-white text-[clamp(40px,10vw,100px)] font-bold leading-none uppercase">
              Let&apos;s
              <br />
              Connect
            </h2>
          </div>

          {/* Right Side - Contact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {/* Location */}
            <div className="contact-item">
              <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">
                Based In
              </h3>
              <div className="text-white text-sm font-light space-y-1">
                <p>
                  {data.personal.location.city},{" "}
                  {data.personal.location.country}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="contact-item">
              <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">
                Reach Out
              </h3>
              <div className="text-white text-sm font-light space-y-1">
                <a
                  href={`mailto:${data.personal.email}`}
                  className="block text-white hover:text-white/70 transition-colors underline decoration-1 underline-offset-2"
                >
                  {data.personal.email}
                </a>
              </div>
            </div>

            {/* Work Hours */}
            <div className="contact-item">
              <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">
                Open To
              </h3>
              <div className="text-white text-sm font-light space-y-1">
                {data.meta.availability.freelance && <p>Freelance Projects</p>}
                {data.meta.availability.fullTime && (
                  <p>Full-time Opportunities</p>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="contact-item">
              <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">
                Connect
              </h3>
              <div className="text-white text-sm font-light space-y-1">
                <a
                  href={data.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white hover:text-white/70 transition-colors underline decoration-1 underline-offset-2"
                >
                  GitHub
                </a>
                <a
                  href={data.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white hover:text-white/70 transition-colors underline decoration-1 underline-offset-2"
                >
                  LinkedIn
                </a>
                <a
                  href={data.social.medium}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white hover:text-white/70 transition-colors underline decoration-1 underline-offset-2"
                >
                  Medium
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="contact-item text-white/40 text-xs font-light">
            {data.meta.copyright}
          </p>
          <a
            href={data.social.resume}
            download
            className="contact-item inline-flex items-center gap-2 text-white hover:text-white/70 text-sm font-light transition-colors underline decoration-1 underline-offset-2 border border-white/20 hover:border-white/40 px-4 py-2"
          >
            <span>Resume</span>
            <span className="text-xs">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
