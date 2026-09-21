"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Palette = {
  id: string;
  name: string;
  prim: string;
  sec: string;
};

export const PALETTES: Palette[] = [
  { id: "galo", name: "Galo (Atual)", prim: "#7A1E2E", sec: "#F5C518" },
  { id: "oceano", name: "Oceano", prim: "#0F4C81", sec: "#38BDF8" },
  { id: "floresta", name: "Floresta", prim: "#14532D", sec: "#4ADE80" },
  { id: "carvao", name: "Carvão", prim: "#1F2937", sec: "#F9FAFB" },
  { id: "pordosol", name: "Pôr do Sol", prim: "#9A3412", sec: "#FB923C" },
  { id: "roxo", name: "Roxo Real", prim: "#4C1D95", sec: "#C4B5FD" },
  { id: "rosa", name: "Rosa", prim: "#831843", sec: "#F9A8D4" },
  { id: "amarelo", name: "Amarelo Vivo", prim: "#713F12", sec: "#FDE047" },
];

type ThemeContextType = {
  palette: Palette;
  setPalette: (palette: Palette) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPalette] = useState<Palette>(PALETTES[0]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", palette.prim);
    root.style.setProperty("--secondary", palette.sec);
  }, [palette]);

  return (
    <ThemeContext.Provider value={{ palette, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
