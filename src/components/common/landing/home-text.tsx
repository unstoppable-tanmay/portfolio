// "use client";

// import { ReactElement } from "react";
// import { motion } from "framer-motion";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// import { gsap } from "gsap";
// import { Parallax } from "react-scroll-parallax";

// gsap.registerPlugin(ScrollTrigger);

// const getChars = (element: String) => {
//   let chars: ReactElement[] = [];
//   const word = element;
//   word.split("").forEach((char: string, i: number) => {
//     chars.push(
//       <motion.span
//         custom={i}
//         key={i}
//         transition={{
//           duration: 1.3,
//         }}
//       >
//         <Parallax
//           scale={[1, 1.1]}
//           rotate={[-15 * Math.pow(-1, i), 13 * Math.pow(-1, i)]}
//         >
//           {char}
//         </Parallax>
//       </motion.span>
//     );
//   });
//   return chars;
// };

// export default function HomeText({ children }: { children: string }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.5, gap: "20%" }}
//       animate={{ opacity: 1, scale: 1, gap: "0%" }}
//       transition={{
//         duration: 1.2,
//         delay: 0.3,
//         ease: [0, 0.71, 0.2, 1.01],
//       }}
//       className="box flex justify-between font-bold"
//       data-cursor-size="20px"
//     >
//       {getChars(children)}
//     </motion.div>
//   );
// }

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const getChars = (element: string) => {
  let chars: JSX.Element[] = [];
  const word = element;
  word.split("").forEach((char: string, i: number) => {
    chars.push(
      <span key={i} className={`char`} data-char-index={i}>
        {char}
      </span>
    );
  });
  return chars;
};

export default function HomeText({ children }: { children: string }) {
  useEffect(() => {
    CustomEase.create("ease-custom", "0,.71,.2,1.01");

    gsap.fromTo(
      ".text-box",
      {
        opacity: 0,
        scale: 0.7,
        gap: "10%",
      },
      {
        opacity: 1,
        scale: 1,
        gap: "0%",
        duration: 1.2,
        delay: 0,
        ease: "ease-custom",
      }
    );

    gsap.fromTo(
      ".char",
      {
        scale: 1,
        rotation: 0,
        gap: "0%",
      },
      {
        scrollTrigger: {
          once: false,
          trigger: ".section_landing",
          start: "top top",
          end: "+=200vh",
          scrub: 1,
        },
        scale: 1.05,
        rotation: (i) => 10 * Math.pow(-1, i),
        transformOrigin: "center center",
        ease: "none",
        gap: "10%",
      }
    );
  }, [children]);

  return (
    <div
      className="text-box flex justify-between font-bold"
      data-cursor-size="20px"
    >
      {getChars(children)}
    </div>
  );
}
