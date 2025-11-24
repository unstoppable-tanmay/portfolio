"use client";

import { TANMAY, TANMAY_TYPE } from "@/data/portfolio";
import HomeClient from "../components/pages/home-client";

export type { TANMAY_TYPE };

export default function Page() {
  return <HomeClient data={TANMAY} />;
}
