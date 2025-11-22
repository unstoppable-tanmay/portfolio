"use client";

import Landing from "@/components/pages/home/landing";
import dynamic from "next/dynamic";

const Experience = dynamic(() => import("@/components/pages/home/experience"), {
  ssr: false,
});
const Projects = dynamic(() => import("@/components/pages/home/projects"), {
  ssr: false,
});
const Stacks = dynamic(() => import("@/components/pages/home/stacks"), {
  ssr: false,
});
const Blog = dynamic(() => import("@/components/pages/home/blog"), {
  ssr: false,
});
const Contact = dynamic(() => import("@/components/pages/home/contact"), {
  ssr: false,
});
const ResumeBento = dynamic(
  () => import("@/components/pages/home/resume-bento"),
  {
    ssr: false,
  }
);

export default function Page() {
  return (
    <>
      <Landing />
      <Experience />
      <Stacks />
      <Projects />
      <ResumeBento />
      <Blog />
      <Contact />
    </>
  );
}
