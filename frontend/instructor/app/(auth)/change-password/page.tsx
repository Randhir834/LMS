'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import InstructorAuthSplitShell from '@/components/layouts/InstructorAuthSplitShell';

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if user is not authenticated
    if (!user || !token) {
      router.push('/login');
    }
  }, [user, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!newPassword || !confirmPassword) {
        setError('Both password fields are required.');
        setLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }

      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters.');
        setLoading(false);
        return;
      }

      await api.post('/users/change-password', {
        newPassword,
        confirmPassword,
      });

      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/instructor');
      }, 2000);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to change password';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <InstructorAuthSplitShell
      leftTitle={
        <>
          Welcome to
          <br />
          <span className="text-yellow-300">PlayFit</span> <span className="text-2xl">🎓</span>
        </>
      }
      leftSubtitle="Empowering instructors to create, manage, and deliver exceptional learning experiences."
    >
      <h2 className="text-xl sm:text-2xl font-bold text-text-primary text-center mb-2">Change Your Password</h2>
      <p className="text-center text-xs sm:text-sm text-text-muted mb-6 sm:mb-8">Please set a new password for your account to continue.</p>

      {success && (
        <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-lg bg-green-50 text-green-700 text-xs sm:text-sm text-center">
          Password changed successfully! Redirecting to dashboard...
        </div>
      )}

      {error && (
        <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-lg bg-hover text-error text-xs sm:text-sm text-center">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="newPassword" className="block text-xs sm:text-sm font-medium text-text-primary">New Password</label>
          <div className="relative">
            <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
              <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="w-full pl-9 sm:pl-11 pr-9 sm:pr-11 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border text-xs sm:text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
            >
              {showNewPassword ? (
                <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              ) : (
                <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.78 0 1.53-.09 2.24-.26"/><path d="M2 2l20 20"/></svg>
              )}
            </button>
          </div>
          <p className="text-xs text-text-muted mt-1">Must be at least 8 characters</p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-text-primary">Confirm Password</label>
          <div className="relative">
            <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
              <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="w-full pl-9 sm:pl-11 pr-9 sm:pr-11 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-border text-xs sm:text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
            >
              {showConfirmPassword ? (
                <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              ) : (
                <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.78 0 1.53-.09 2.24-.26"/><path d="M2 2l20 20"/></svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 active:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          {loading ? (
            'Saving...'
          ) : (
            <>
              <svg width="16" height="16" className="sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Save Password
            </>
          )}
        </button>
      </form>
    </InstructorAuthSplitShell>
  );
}
