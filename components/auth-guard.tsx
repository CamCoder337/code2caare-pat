'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('patient' | 'professional' | 'admin')[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const { user, accessToken, hasHydrated } = useAuthStore();

  useEffect(() => {
    // Attendre l'hydratation avant de vérifier l'authentification
    if (!hasHydrated) {
      return;
    }

    if (!accessToken || !user) {
      router.push('/login');
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.user_type)) {
      // Redirect to appropriate dashboard based on user type
      if (user.user_type === 'patient') {
        router.push('/dashboard/patient');
      } else if (user.user_type === 'professional') {
        router.push('/dashboard/professional');
      } else {
        router.push('/dashboard');
      }
      return;
    }
  }, [user, accessToken, allowedRoles, hasHydrated, router]);

  if (!hasHydrated || !accessToken || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.user_type)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès non autorisé</h1>
          <p className="text-gray-600">Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}