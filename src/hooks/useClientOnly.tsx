import { useEffect, useState } from 'react';

/**
 * Hook to ensure component only renders on client side
 * Prevents hydration mismatches for client-only components
 */
export function useClientOnly(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Component wrapper to ensure children only render on client
 */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const isClient = useClientOnly();
  
  return isClient ? <>{children}</> : null;
}

export default useClientOnly;