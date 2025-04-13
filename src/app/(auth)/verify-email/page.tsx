import VerifyEmail from '@/components/pages/auth/verify-email';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Verify Email - Iter Bene",
  description: "Please verify your email address to complete the registration process and start exploring Iter Bene.",
};
const page = () => {
  return <VerifyEmail />
}

export default page