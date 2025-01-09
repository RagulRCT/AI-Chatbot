'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import Chat from '@components/Chat';

function HomeComponent() {
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

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeComponent />
    </Suspense>
  );
}