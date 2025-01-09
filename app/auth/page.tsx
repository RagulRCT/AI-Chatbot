'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

import { Button } from '@/components/ui/Button';

export default function AuthPage() {
  const { user, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth0Id: user.sub,
          email: user.email,
          name: user.name,
        }),
      })
        .then(() => router.push('/'))
        .catch((error) => console.error('Failed to create user:', error));
    }
  }, [user, router]);

  const handleLogin = () => {
    const loginUrl = `/api/auth/login?prompt=login`;
    router.push(loginUrl);
  };

  const handleBypass = () => {
    router.push('/?bypass=true');
  };

  if (error) return <div>{error.message}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Welcome to Ragul&apos;s Chatbot
      </h1>
      <Button className="mb-4 w-full max-w-sm" onClick={handleLogin}>
        Log In / Sign Up
      </Button>
      <Button className="w-full max-w-sm" variant="secondary" onClick={handleBypass}>
        Continue as Guest
      </Button>
    </div>
  );
}
