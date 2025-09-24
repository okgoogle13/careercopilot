import React, { ReactNode, useEffect } from "react";
import { ColorModeProvider, useColorMode } from "../contexts/ColorModeContext";
import { useDesignTokens } from "../hooks/useDesignTokens";
import { cn } from "./ui/utils";

interface ThemeWrapperProps {
  children: ReactNode;
  className?: string;
  defaultMode?: "light" | "dark" | "system";
  enableAnimations?: boolean;
  enableGlassMorphism?: boolean;
}

// Inner component that has access to color mode context
function ThemeWrapperInner({
  children,
  className = "",
  enableAnimations = true,
  enableGlassMorphism = true,
}: Omit<ThemeWrapperProps, "defaultMode">) {
  const { resolvedColorMode } = useColorMode();
  const { tokens } = useDesignTokens();

  // Apply theme-specific configurations
  useEffect(() => {
    const root = document.documentElement;

    // Set CSS custom properties for theme
    root.style.setProperty("--resolved-color-mode", resolvedColorMode);

    // Configure animations based on user preference
    if (!enableAnimations) {
      root.style.setProperty("--animation-duration-fast", "0ms");
      root.style.setProperty("--animation-duration-normal", "0ms");
      root.style.setProperty("--animation-duration-slow", "0ms");
    } else {
      root.style.setProperty("--animation-duration-fast", tokens.animationDurationFast);
      root.style.setProperty("--animation-duration-normal", tokens.animationDurationNormal);
      root.style.setProperty("--animation-duration-slow", tokens.animationDurationSlow);
    }

    // Configure glass morphism
    if (!enableGlassMorphism) {
      root.style.setProperty("--glass-blur", "0px");
      root.style.setProperty("--glass-bg", "var(--background-card)");
    } else {
      root.style.setProperty("--glass-blur", "15px");
      root.style.setProperty("--glass-bg", "rgba(26, 31, 54, 0.25)");
    }

    // Set meta theme color for mobile browsers
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }

    metaThemeColor.setAttribute("content", resolvedColorMode === "dark" ? "#0f172a" : "#ffffff");

    // Set viewport meta tag for mobile responsiveness
    let metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      metaViewport = document.createElement("meta");
      metaViewport.setAttribute("name", "viewport");
      metaViewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      );
      document.head.appendChild(metaViewport);
    }
  }, [resolvedColorMode, tokens, enableAnimations, enableGlassMorphism]);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = () => {
      const root = document.documentElement;
      if (mediaQuery.matches) {
        root.classList.add("reduce-motion");
      } else {
        root.classList.remove("reduce-motion");
      }
    };

    handleChange(); // Set initial state
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Apply high contrast if user prefers it
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-contrast: high)");

    const handleChange = () => {
      const root = document.documentElement;
      if (mediaQuery.matches) {
        root.classList.add("high-contrast");
      } else {
        root.classList.remove("high-contrast");
      }
    };

    handleChange(); // Set initial state
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div
      className={cn(
        // Base theme classes
        "min-h-screen bg-background text-foreground",
        "font-sans antialiased",

        // Theme-specific classes
        resolvedColorMode === "dark" ? "dark" : "light",

        // Feature flags
        enableAnimations && "enable-animations",
        enableGlassMorphism && "enable-glass",

        // Responsive classes
        "overflow-x-hidden",

        className,
      )}
    >
      {children}
    </div>
  );
}

// Main ThemeWrapper component
export function ThemeWrapper({
  children,
  defaultMode = "dark", // FML Career Copilot defaults to dark
  ...props
}: ThemeWrapperProps) {
  return (
    <ColorModeProvider defaultMode={defaultMode}>
      <ThemeWrapperInner {...props}>{children}</ThemeWrapperInner>
    </ColorModeProvider>
  );
}

// Theme provider hook for accessing theme configuration
export function useThemeConfig() {
  const { colorMode, resolvedColorMode, setColorMode, toggleColorMode } = useColorMode();
  const { tokens, styles } = useDesignTokens();

  return {
    // Current theme state
    colorMode,
    resolvedColorMode,
    isDark: resolvedColorMode === "dark",
    isLight: resolvedColorMode === "light",

    // Theme controls
    setColorMode,
    toggleColorMode,

    // Design tokens
    tokens,
    styles,

    // Utility functions
    getThemeClass: (darkClass: string, lightClass: string) =>
      resolvedColorMode === "dark" ? darkClass : lightClass,

    getThemeValue: <T extends any>(darkValue: T, lightValue: T): T =>
      resolvedColorMode === "dark" ? darkValue : lightValue,
  };
}

// HOC for theme-aware components
export function withTheme<P extends object>(
  Component: React.ComponentType<P & { theme: ReturnType<typeof useThemeConfig> }>,
): React.ComponentType<P> {
  const ThemedComponent = (props: P) => {
    const theme = useThemeConfig();
    return React.createElement(Component, { ...props, theme } as P & {
      theme: ReturnType<typeof useThemeConfig>;
    });
  };

  ThemedComponent.displayName = `withTheme(${Component.displayName || Component.name})`;
  return ThemedComponent;
}

// Theme debugging component (development only)
export function ThemeDebugger({ show = false }: { show?: boolean }) {
  const theme = useThemeConfig();

  if (!show || process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 p-4 bg-card border border-border rounded-lg shadow-lg max-w-xs">
      <h4 className="font-semibold mb-2">Theme Debug</h4>
      <div className="space-y-1 text-sm">
        <div>Mode: {theme.colorMode}</div>
        <div>Resolved: {theme.resolvedColorMode}</div>
        <div>Is Dark: {theme.isDark.toString()}</div>
        <div className="pt-2 border-t border-border">
          <div>Primary: {theme.tokens.colorPrimary}</div>
          <div>Background: {theme.tokens.colorBackground}</div>
          <div>Foreground: {theme.tokens.colorForeground}</div>
        </div>
      </div>
    </div>
  );
}

export default ThemeWrapper;
