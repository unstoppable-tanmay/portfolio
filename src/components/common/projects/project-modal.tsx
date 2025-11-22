/* eslint-disable @next/next/no-img-element */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { FiExternalLink, FiFileText, FiGithub } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    image?: string;
    title?: string;
    description?: string;
    stacks?: string[];
    links?: {
      live?: string;
      github?: string;
      case_study?: string;
    };
  };
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - blocks all scrolling */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-hidden"
            style={{
              width: "100vw",
              height: "100vh",
              touchAction: "none",
              overscrollBehavior: "none",
            }}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-hidden"
            style={{ touchAction: "none" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col pointer-events-auto border border-black/10 relative"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white transition-colors border border-black/10"
                aria-label="Close modal"
              >
                <IoClose className="w-5 h-5 text-black" />
              </button>

              {/* Scrollable Content */}
              <div className="overflow-y-auto">
                {/* Image Section */}
                {project.image && (
                  <div className="w-full bg-black p-8">
                    <div className="w-full max-h-[400px] flex items-center justify-center">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-auto h-auto max-w-full max-h-[400px] object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Content Section */}
                <div className="p-8 space-y-6">
                  {/* Title */}
                  <h2 className="text-3xl font-light text-black">
                    {project.title}
                  </h2>

                  {/* Description */}
                  <p className="text-black/70 font-light leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  {project.stacks && project.stacks.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm text-black/50 font-light">
                        Technologies Used
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.stacks.map((stack, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-black/5 border border-black/10 text-black/70 text-sm font-light hover:bg-black/10 transition-colors"
                          >
                            {stack}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  {project.links &&
                    (project.links.live ||
                      project.links.github ||
                      project.links.case_study) && (
                      <div className="space-y-3 pt-4 border-t border-black/10">
                        <h3 className="text-sm text-black/50 font-light">
                          Project Links
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {project.links.live && (
                            <a
                              href={project.links.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-black/80 transition-colors font-light text-sm"
                            >
                              <FiExternalLink className="w-4 h-4" />
                              Live Demo
                            </a>
                          )}
                          {project.links.github && (
                            <a
                              href={project.links.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 border border-black/20 text-black hover:bg-black/5 transition-colors font-light text-sm"
                            >
                              <FiGithub className="w-4 h-4" />
                              View on GitHub
                            </a>
                          )}
                          {project.links.case_study && (
                            <a
                              href={project.links.case_study}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 border border-black/20 text-black hover:bg-black/5 transition-colors font-light text-sm"
                            >
                              <FiFileText className="w-4 h-4" />
                              Read Case Study
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Hint */}
              <div className="px-8 py-4 border-t border-black/5">
                <p className="text-xs text-black/30 font-light text-center">
                  Press ESC to close
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
