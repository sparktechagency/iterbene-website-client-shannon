"use client";

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

interface NoSSRProps {
  children: ReactNode;
  loading?: ReactNode;
}

/**
 * Component that disables SSR for its children
 * Useful for components that have hydration issues
 */
function NoSSRComponent({ children }: NoSSRProps) {
  return <>{children}</>;
}

/**
 * Higher-order component that disables SSR
 * Use this to wrap components that cause hydration mismatches
 */
export const NoSSR = dynamic(() => Promise.resolve(NoSSRComponent), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  )
});

export default NoSSR;