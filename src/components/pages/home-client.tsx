"use client";

import dynamic from "next/dynamic";
import { TANMAY_TYPE } from "../../app/page";

// Lazy load heavy components without loading placeholders
const Landing = dynamic(() => import("@/components/pages/home/landing"), {
  ssr: false,
});
const Experience = dynamic(() => import("@/components/pages/home/experience"), {
  ssr: false,
});
const Stacks = dynamic(() => import("@/components/pages/home/stacks"), {
  ssr: false,
});
const Projects = dynamic(() => import("@/components/pages/home/projects"), {
  ssr: false,
});
const ResumeBento = dynamic(
  () => import("@/components/pages/home/resume-bento"),
  {
    ssr: false,
  }
);
const Blog = dynamic(() => import("@/components/pages/home/blog"), {
  ssr: false,
});
const Contact = dynamic(() => import("@/components/pages/home/contact"), {
  ssr: false,
});

export default function HomeClient({ data }: { data: TANMAY_TYPE }) {
  return (
    <div className="flex flex-col relative">
      <Landing data={data} />
      <Experience data={data.experience} />
      <Stacks data={data.skills} />
      <Projects data={data.projects} />
      <ResumeBento data={data} />
      <Blog data={data} />
      <Contact data={data} />
    </div>
  );
}
