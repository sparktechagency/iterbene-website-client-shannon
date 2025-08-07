"use client";

import { ReactNode, useEffect, useState } from "react";

interface HydrationBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Prevents hydration mismatches by ensuring client-side rendering
 * for components that might be affected by browser extensions or other external factors
 */
export function HydrationBoundary({ 
  children, 
  fallback = null 
}: HydrationBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // This effect only runs on the client side
    setIsHydrated(true);
  }, []);

  // During SSR and before hydration, show fallback or null
  if (!isHydrated) {
    return <>{fallback}</>;
  }

  // After hydration, show children
  return <>{children}</>;
}

export default HydrationBoundary;