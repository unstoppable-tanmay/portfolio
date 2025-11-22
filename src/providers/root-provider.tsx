"use client";

import React from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import LenisProvider from "./lenis-provider";

const RootProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ParallaxProvider>
      {/* {children} */}
      <LenisProvider enabled={true}>{children}</LenisProvider>
    </ParallaxProvider>
  );
};

export default RootProvider;
