"use client";
const BROWSER_EXTENSION_ATTRIBUTES = [
  "cz-shortcut-listen", // ClickZ browser extension
  "data-adblock-key", // AdBlock extensions
  "data-gr-c-s-loaded", // Grammarly extension
  "data-new-gr-c-s-check-loaded", // Grammarly extension
  "spellcheck", // Various spell check extensions
  "data-gramm", // Grammarly related
  "data-lt-installed", // LanguageTool extension
  "data-new-gr-c-s-loaded", // Grammarly
];

/**
 * Cleans browser extension attributes from body element
 * Call this in useEffect on client side to prevent hydration mismatches
 */
export function cleanBrowserExtensionAttributes(): void {
  if (typeof window === "undefined") return;

  const body = document.body;
  if (!body) return;

  BROWSER_EXTENSION_ATTRIBUTES.forEach((attr) => {
    if (body.hasAttribute(attr)) {
      body.removeAttribute(attr);
    }
  });
}

/**
 * Prevents hydration mismatches by temporarily suppressing console errors
 * during the hydration process
 */
export function suppressHydrationWarnings(): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const originalError = console.error;
  const originalWarn = console.warn;

  const shouldSuppress = (message: string) => {
    return (
      message.includes("Hydration failed") ||
      message.includes("hydrated") ||
      message.includes("server rendered HTML") ||
      message.includes("client properties")
    );
  };

  console.error = (...args) => {
    const message = args[0]?.toString() || "";
    if (!shouldSuppress(message)) {
      originalError(...args);
    }
  };

  console.warn = (...args) => {
    const message = args[0]?.toString() || "";
    if (!shouldSuppress(message)) {
      originalWarn(...args);
    }
  };

  // Return cleanup function
  return () => {
    console.error = originalError;
    console.warn = originalWarn;
  };
}

/**
 * Hook to safely handle hydration in components that might be affected
 * by browser extensions
 */
export function useHydrationSafe() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      cleanBrowserExtensionAttributes();

      // Also clean up periodically in case extensions add them back
      const interval = setInterval(cleanBrowserExtensionAttributes, 5000);

      return () => clearInterval(interval);
    }
  }, []);

  return typeof window !== "undefined";
}

/**
 * React component that wraps children and handles browser extension interference
 */
import React, { useEffect } from "react";

interface BrowserExtensionSafeProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function BrowserExtensionSafe({
  children,
  fallback = null,
}: BrowserExtensionSafeProps) {
  const [isSafe, setIsSafe] = React.useState(false);

  React.useEffect(() => {
    // Clean browser extension attributes
    cleanBrowserExtensionAttributes();

    // Set safe to render after cleanup
    setIsSafe(true);

    // Periodic cleanup
    const interval = setInterval(cleanBrowserExtensionAttributes, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!isSafe) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
