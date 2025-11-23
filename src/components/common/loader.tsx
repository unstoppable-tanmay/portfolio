"use client";

import { motion } from "framer-motion";

const Loader = () => {
  return (
    <motion.div
      initial={{}}
      className="text text-[clamp(50px,6vw,100px)] font-bold select-none overflow-hidden leading-none"
    >
      {"Hello.".split("").map((letter, index) => {
        return (
          <motion.span
            initial={{ translateY: "0%", rotateZ: "40deg", opacity: 0 }}
            animate={{
              translateY: "0px",
              rotateZ: ["40deg", "20deg", "0deg"],
              opacity: 1,
            }}
            transition={{
              duration: 0.6,
              delay: index / 8,
              bounce: 0.3,
              damping: 0.4,
            }}
            key={letter}
            className="inline-block origin-bottom"
          >
            {letter}
          </motion.span>
        );
      })}
    </motion.div>
  );
};

export default Loader;
