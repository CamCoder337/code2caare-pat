'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function Home() {
  const router = useRouter();
  const { user, hasHydrated } = useAuthStore();

  useEffect(() => {
    // Attendre que Zustand soit hydraté avant de rediriger
    if (!hasHydrated) {
      console.log('Waiting for hydration...'); // Debug log
      return;
    }

    console.log('Home page - user:', user); // Debug log
    if (user) {
      console.log('User found, redirecting to dashboard'); // Debug log
      router.push('/dashboard');
    } else {
      console.log('No user, redirecting to login'); // Debug log
      router.push('/login');
    }
  }, [user, hasHydrated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
}
