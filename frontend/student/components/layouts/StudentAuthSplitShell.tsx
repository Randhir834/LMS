import type { ReactNode } from 'react';

interface StudentAuthSplitShellProps {
  leftTitle: ReactNode;
  leftSubtitle: string;
  centered?: boolean;
  children: ReactNode;
}

export default function StudentAuthSplitShell({ leftTitle, leftSubtitle, centered = true, children }: StudentAuthSplitShellProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row md:h-screen md:overflow-hidden">
      {/* Mobile-only branding */}
      <div className="md:hidden bg-[#1B8A44] px-6 py-8 text-center">
        <img
          src="/images/navbarlogo.png"
          alt="PlayFit LMS"
          className="h-12 w-auto mx-auto mb-2"
        />
        <p className="text-sm text-white/80">Learning Platform</p>
      </div>

      <div
        className="relative w-full md:w-[55%] hidden md:flex flex-col justify-between p-6 sm:p-8 md:p-12 lg:p-16 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/images/loginstudentpage.png")' }}
      >
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-md">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 drop-shadow-lg">{leftTitle}</h2>
          <p className="text-xs sm:text-sm text-white/90 mb-6 sm:mb-8 drop-shadow">{leftSubtitle}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 sm:gap-3 mb-6 sm:mb-8 max-w-lg">
            <div className="flex items-center gap-2 sm:gap-2.5 bg-white/90 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 sm:py-2.5 shadow-lg w-full min-h-[44px] sm:min-h-[52px] h-[44px] sm:h-[52px] box-border">
              <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-primary-100 flex items-center justify-center">
                <svg width="12" height="12" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="#1B8A44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </div>
              <span className="min-w-0 text-xs font-medium text-text-primary text-left leading-snug line-clamp-2">Expert Instructors</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 bg-white/90 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 sm:py-2.5 shadow-lg w-full min-h-[44px] sm:min-h-[52px] h-[44px] sm:h-[52px] box-border">
              <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-orange-50 flex items-center justify-center">
                <svg width="12" height="12" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              </div>
              <span className="min-w-0 text-xs font-medium text-text-primary text-left leading-snug line-clamp-2">Live Interactive Classes</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 bg-white/90 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 sm:py-2.5 shadow-lg w-full min-h-[44px] sm:min-h-[52px] h-[44px] sm:h-[52px] box-border">
              <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg width="12" height="12" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <span className="min-w-0 text-xs font-medium text-text-primary text-left leading-snug line-clamp-2">Study Materials & PDFs</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 bg-white/90 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 sm:py-2.5 shadow-lg w-full min-h-[44px] sm:min-h-[52px] h-[44px] sm:h-[52px] box-border">
              <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-violet-50 flex items-center justify-center">
                <svg width="12" height="12" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              </div>
              <span className="min-w-0 text-xs font-medium text-text-primary text-left leading-snug line-clamp-2">Track Your Progress</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 bg-white/90 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 sm:py-2.5 shadow-lg w-full min-h-[44px] sm:min-h-[52px] h-[44px] sm:h-[52px] box-border">
              <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-pink-50 flex items-center justify-center">
                <svg width="12" height="12" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 22 12 19 17 22 15.79 13.88"/></svg>
              </div>
              <span className="min-w-0 text-xs font-medium text-text-primary text-left leading-snug line-clamp-2">Achieve Your Goals</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`w-full md:w-[45%] flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-14 no-scrollbar overflow-y-auto ${centered ? 'min-h-screen md:h-screen justify-center' : 'min-h-screen md:h-screen md:overflow-y-auto justify-start pt-6 sm:pt-8 md:pt-16 pb-8'}`}>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
