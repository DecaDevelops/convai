"use client";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ReactNode } from "react";
export default function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemeProvider> & { children: ReactNode }) {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}
