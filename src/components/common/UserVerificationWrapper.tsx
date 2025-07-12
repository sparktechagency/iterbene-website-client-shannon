"use client";

import dynamic from "next/dynamic";

const UserVerification = dynamic(
  () => import("@/components/common/UserVerification"),
  {
    ssr: false,
  }
);

export default function UserVerificationWrapper() {
  return <UserVerification />;
}
