'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import StudentAuthSplitShell from '@/components/layouts/StudentAuthSplitShell';
import { authService } from '@/services/authService';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || '';
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
      setError('Missing reset token. Open the link from your email or server log.');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({ token, password });
      setDone(true);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Could not reset password.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Gradient Background Blobs */}
      <div className="absolute -top-12 xs:-top-16 sm:-top-20 -left-12 xs:-left-16 sm:-left-20 w-32 xs:w-36 sm:w-40 h-32 xs:h-36 sm:h-40 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-12 xs:-bottom-16 sm:-bottom-20 -right-12 xs:-right-16 sm:-right-20 w-32 xs:w-36 sm:w-40 h-32 xs:h-36 sm:h-40 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="relative">
        <div className="text-center mb-6 xs:mb-7 sm:mb-8">
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
            {done ? 'Password Reset!' : 'Set New Password'}
          </h2>
          <p className="text-xs xs:text-sm text-gray-600">
            {done ? 'Your password has been successfully updated' : 'Choose a strong password for your student account'}
          </p>
        </div>

        {done ? (
          <div className="space-y-4 xs:space-y-5 sm:space-y-6 text-center">
            <div className="mx-auto w-14 h-14 xs:w-15 xs:h-15 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shadow-lg animate-in zoom-in">
              <svg width="28" height="28" className="xs:w-[30px] xs:h-[30px] sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="space-y-2 xs:space-y-2.5 sm:space-y-3 bg-gradient-to-r from-green-50 to-emerald-50 p-4 xs:p-5 sm:p-6 rounded-2xl border border-green-200">
              <p className="text-xs xs:text-sm text-gray-700 font-semibold">Password Reset Successful!</p>
              <p className="text-xs xs:text-sm text-gray-700 leading-relaxed">Your password has been updated. You can now sign in with your new password.</p>
            </div>
            <Link
              href="/login"
              className="inline-flex w-full py-2.5 xs:py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 text-white font-semibold text-xs xs:text-sm hover:from-green-600 hover:via-emerald-600 hover:to-green-600 active:from-green-700 active:via-emerald-700 active:to-green-700 transition-all items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 touch-target active:scale-95"
            >
              <svg width="16" height="16" className="xs:w-[18px] xs:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              Continue to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-4.5 sm:space-y-5">
            {error && (
              <div className="relative">
                <div className="h-1 bg-gradient-to-r from-red-500 to-pink-500 absolute top-0 left-0 right-0 rounded-t-xl"></div>
                <div className="p-3 xs:p-3.5 sm:p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs xs:text-sm text-center pt-4 xs:pt-4.5 sm:pt-5">
                  {error}
                </div>
              </div>
            )}
            
            <div className="space-y-1.5 xs:space-y-2">
              <label htmlFor="password" className="block text-xs xs:text-sm font-semibold text-gray-700">
                New Password
              </label>
              <div className="relative group">
                <div className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
                  <svg width="16" height="16" className="xs:w-[18px] xs:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full pl-10 xs:pl-12 pr-10 xs:pr-12 py-2.5 xs:py-3 sm:py-3.5 rounded-xl border border-gray-200 text-xs xs:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm transition-all touch-target"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 xs:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors touch-target"
                >
                  {showPassword ? (
                    <svg width="16" height="16" className="xs:w-[18px] xs:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  ) : (
                    <svg width="16" height="16" className="xs:w-[18px] xs:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.78 0 1.53-.09 2.24-.26"/><path d="M2 2l20 20"/></svg>
                  )}
                </button>
              </div>
              <p className="text-[10px] xs:text-xs text-gray-500">Use at least 8 characters.</p>
            </div>

            <div className="space-y-1.5 xs:space-y-2">
              <label htmlFor="confirm" className="block text-xs xs:text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                  <svg width="16" height="16" className="xs:w-[18px] xs:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input
                  id="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full pl-10 xs:pl-12 pr-10 xs:pr-12 py-2.5 xs:py-3 sm:py-3.5 rounded-xl border border-gray-200 text-xs xs:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm transition-all touch-target"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 xs:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors touch-target"
                >
                  {showConfirm ? (
                    <svg width="16" height="16" className="xs:w-[18px] xs:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  ) : (
                    <svg width="16" height="16" className="xs:w-[18px] xs:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.78 0 1.53-.09 2.24-.26"/><path d="M2 2l20 20"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 xs:py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 text-white font-semibold text-xs xs:text-sm hover:from-green-600 hover:via-emerald-600 hover:to-green-600 active:from-green-700 active:via-emerald-700 active:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 touch-target active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 xs:w-5 xs:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg width="16" height="16" className="xs:w-[18px] xs:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  Update Password
                </>
              )}
            </button>
          </form>
        )}

        <p className="mt-4 xs:mt-5 sm:mt-6 text-center text-xs xs:text-sm text-gray-600">
          Remember your password?{' '}
          <Link href="/login" className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hover:from-green-700 hover:to-emerald-700 active:scale-95 inline-block">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <StudentAuthSplitShell
      leftTitle={
        <>
          <span className="bg-gradient-to-r from-green-200 via-emerald-200 to-green-200 bg-clip-text text-transparent">
            Secure Your
          </span>
          <br />
          <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
            Account!
          </span>{' '}
          <span className="text-3xl animate-float">🔒</span>
        </>
      }
      leftSubtitle="Pick a new password to keep your learning progress and profile safe."
    >
      <Suspense fallback={
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </StudentAuthSplitShell>
  );
}
