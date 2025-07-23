"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type OccasionContextType = {
  selectedOccasion: string | null;
  setSelectedOccasion: (occasion: string) => void;
};

const OccasionContext = createContext<OccasionContextType | undefined>(undefined);

export const OccasionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);

  return (
    <OccasionContext.Provider value={{ selectedOccasion, setSelectedOccasion }}>
      {children}
    </OccasionContext.Provider>
  );
};

export const useOccasion = () => {
  const context = useContext(OccasionContext);
  if (!context) throw new Error("useOccasion must be used inside OccasionProvider");
  return context;
};
