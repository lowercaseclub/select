"use client";

import { ThemeProvider } from "./theme-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      enableSystem={false}
      enableColorScheme={true}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
