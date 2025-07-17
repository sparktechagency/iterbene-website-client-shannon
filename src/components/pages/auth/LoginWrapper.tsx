'use client';

import { useSearchParams } from 'next/navigation';
import Login from './login';

const LoginWrapper = () => {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirectUrl');
  return <Login redirectUrl={redirectUrl as string} />;
};

export default LoginWrapper;
