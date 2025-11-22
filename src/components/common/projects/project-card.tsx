/* eslint-disable @next/next/no-img-element */
import React from "react";

interface ProjectCardContentProps {
  image?: string;
  title?: string;
  description?: string;
  stacks?: string[];
  links?: {
    live?: string;
    github?: string;
    case_study?: string;
  };
}

const ProjectCardContent: React.FC<ProjectCardContentProps> = ({
  image = "https://i.sstatic.net/y9DpT.jpg",
  title = "Project Title",
  description = "Project description goes here",
  stacks = [],
  links = {},
}) => {
  return (
    <div className="w-full h-full bg-white p-2 md:p-4 flex flex-col shadow-2xl relative">
      {/* Polaroid Photo Container */}
      <div className="bg-black flex-1 flex flex-col">
        {/* Image Section - Auto height based on image aspect ratio */}
        <div className="w-full bg-black p-2 md:p-3">
          <div className="w-full relative bg-black">
            <img
              src={image}
              alt={title}
              className="w-full h-auto object-contain max-h-[200px] md:max-h-[300px]"
            />
          </div>
        </div>

        {/* Info Section - Bottom space like Polaroid */}
        <div className="bg-white px-2 py-2 md:px-4 md:py-3 flex-1 flex flex-col gap-1.5 md:gap-2">
          {/* Title */}
          <h3 className="text-xs md:text-sm font-medium text-black/90 line-clamp-1">
            {title}
          </h3>

          {/* Description */}
          <p className="text-[9px] md:text-[10px] font-thin text-black/60 line-clamp-2 flex-1">
            {description}
          </p>

          {/* Stacks */}
          {stacks.length > 0 && (
            <div className="flex flex-wrap gap-1 md:gap-1.5">
              {stacks.slice(0, 4).map((stack, index) => (
                <span
                  key={index}
                  className="text-[7px] md:text-[8px] px-1.5 md:px-2 py-0.5 bg-black/5 text-black/70"
                >
                  {stack}
                </span>
              ))}
              {stacks.length > 4 && (
                <span className="text-[7px] md:text-[8px] px-1.5 md:px-2 py-0.5 text-black/40">
                  +{stacks.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Links */}
          {(links.live || links.github || links.case_study) && (
            <div className="flex gap-1.5 md:gap-2 mt-0.5 md:mt-1">
              {links.live && (
                <span className="text-[8px] md:text-[9px] text-black/60">
                  Live
                </span>
              )}
              {links.github && (
                <span className="text-[8px] md:text-[9px] text-black/60">
                  GitHub
                </span>
              )}
              {links.case_study && (
                <span className="text-[8px] md:text-[9px] text-black/60">
                  Case Study
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Click Notice */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-center">
        <div className="bg-black/80 backdrop-blur-sm px-2 py-1 border border-white/20">
          <p className="text-[8px] md:text-[9px] text-white/80 font-light">
            [ click to view details ]
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCardContent;
