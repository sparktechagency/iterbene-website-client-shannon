"use client";
import { useSearchParams } from "next/navigation";
import { Children, cloneElement, Suspense, isValidElement } from "react";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");

  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, { redirectUrl } as {
        redirectUrl: string | null;
      });
    }
    return child;
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>{childrenWithProps}</Suspense>
  );
};

export default AuthWrapper;
