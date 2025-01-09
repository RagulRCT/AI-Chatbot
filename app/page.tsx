'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Chat from '@components/Chat';

export default function Home() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bypass = searchParams.get('bypass') === 'true';

  useEffect(() => {
    if (!isLoading && !user && !bypass) {
      router.push('/auth');
    }
  }, [user, isLoading, router, bypass]);

  if (error) return <div>{error.message}</div>;
  if (!user && !bypass) return null;

  return <Chat />;
}
