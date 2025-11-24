"use client";

import { NavigationHandler } from "@/components/common/navigation-handler";
import { ViewTransitions } from "next-view-transitions";
import React from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import LenisProvider from "./lenis-provider";
import { SemanticSearchProvider } from "./semantic-search-provider";
import { StateProvider } from "./state-provider";

const RootProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ViewTransitions>
      <NavigationHandler />
      <ParallaxProvider>
        <StateProvider>
          <SemanticSearchProvider>
            <LenisProvider enabled={true}>
              {children}
            </LenisProvider>
          </SemanticSearchProvider>
        </StateProvider>
      </ParallaxProvider>
    </ViewTransitions>
  );
};


export default RootProvider;
