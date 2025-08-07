'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { AuthGuard } from '@/components/auth-guard';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      if (user.user_type === 'patient') {
        router.push('/dashboard/patient');
      } else if (user.user_type === 'professional') {
        router.push('/dashboard/professional');
      }
    }
  }, [user, router]);

  return (
    <AuthGuard>
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    </AuthGuard>
  );
}