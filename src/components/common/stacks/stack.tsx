import { random } from "lodash";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { TreemapNode } from "./types";
import { expandableVariants } from "./utils";

export const Stack = ({
  leaf,
  i,
  color,
}: {
  leaf: TreemapNode;
  i: number;
  color: { color: string; textColor: string };
}) => {
  const [open, setOpen] = useState(false);
  const [z, setZ] = useState(1);

  const toggle = () => {
    if (!open) setZ(100);
    setOpen((p) => !p);
  };

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    },
    [open]
  );

  useEffect(() => {
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1, transition: { delay: random(1, true) } }}
      key={i}
      className="absolute flex items-center justify-center font-medium text-sm text-center text-[clamp(20px,2vw,150%)] cursor-pointer"
      style={{
        left: leaf.x0,
        top: leaf.y0,
        width: leaf.x1 - leaf.x0,
        height: leaf.y1 - leaf.y0,
        zIndex: z,
      }}
      viewport={{ once: true }}
    >
      <div className="wrapper w-full h-full relative flex items-center justify-center">
        <motion.div
          onClick={toggle}
          layout
          variants={expandableVariants(leaf)}
          animate={open ? "open" : "close"}
          onAnimationComplete={() => {
            if (!open) setZ(i == 0 ? 2 : 1);
          }}
          className={
            "expandable absolute w-[98%] h-[98%] text-[clamp(15px,1vw,150%)] font-light select-none flex flex-col items-center justify-center"
          }
          style={{
            backgroundColor: color.color,
            color: color.textColor,
          }}
        >
          <motion.div className={"heading"} layout>
            {leaf.data.name}
          </motion.div>

          {open && (
            <motion.p
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1.2 }}
              className="text-[clamp(12px,1vw,16px)] font-light max-w-3xl text-center leading-relaxed mt-6"
            >
              {leaf.data.description || "No description available."}
            </motion.p>
          )}

          {open && (
            <div className="text-xs absolute bottom-10">
              [click anywhere or Esc to close]
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
