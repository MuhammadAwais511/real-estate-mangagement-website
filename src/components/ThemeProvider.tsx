"use client";

import type { ReactNode } from "react";
import { ThemeProvider as ThemeContextProvider } from "@/hooks/useTheme";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContextProvider>{children}</ThemeContextProvider>;
}
