"use client";

import React, { createContext, useContext } from "react";

interface StateContextType {
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <StateContext.Provider value={{}}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};
