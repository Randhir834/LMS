'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function RoleGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: Array<'admin' | 'instructor' | 'student'>;
}) {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (loading) return; // Wait for auth hook to finish loading

    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }

    if (!user.role || !allowedRoles.includes(user.role as 'admin' | 'instructor' | 'student')) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.replace('/login');
      return;
    }

    setIsChecking(false);
  }, [user, loading, isAuthenticated, allowedRoles, router]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
