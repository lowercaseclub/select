"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Stage = "main" | "build";

interface StageContextType {
  activeStage: Stage;
  setActiveStage: (stage: Stage) => void;
}

const StageContext = createContext<StageContextType | undefined>(undefined);

interface StageProviderProps {
  children: ReactNode;
  initialStage?: Stage;
}

export function StageProvider({ children, initialStage = "main" }: StageProviderProps) {
  const [activeStage, setActiveStage] = useState<Stage>(initialStage);

  return (
    <StageContext.Provider value={{ activeStage, setActiveStage }}>
      {children}
    </StageContext.Provider>
  );
}

export function useStage() {
  const context = useContext(StageContext);
  if (context === undefined) {
    throw new Error("useStage must be used within a StageProvider");
  }
  return context;
}
