"use client";

import dynamic from "next/dynamic";
import { TANMAY_TYPE } from "../../app/page";
import Loader from "../common/loader";

const ComponentLoader = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-black">
    <Loader />
  </div>
);

// Lazy load heavy components
const Landing = dynamic(() => import("@/components/pages/home/landing"), {
  ssr: false,
  loading: () => <ComponentLoader />,
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
    <div className="flex flex-col">
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
