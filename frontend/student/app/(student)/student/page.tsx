'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen, Video, ClipboardList, Loader2,
  ChevronRight, Megaphone
} from 'lucide-react';
import StudentDashboardLayout from '@/components/layouts/StudentDashboardLayout';
import { dashboardService, DashboardData } from '@/services/dashboardService';
import { userService, UserProfile } from '@/services/userService';
import { useSocket } from '@/hooks/useSocket';
import { useCallback } from 'react';

export default function StudentHomePage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { onLiveClassScheduled, offLiveClassScheduled } = useSocket(user?.id);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [dashData, profile] = await Promise.all([
        dashboardService.getDashboardData(),
        userService.getProfile().catch(() => null)
      ]);
      setDashboardData(dashData);
      setUser(profile);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    onLiveClassScheduled(() => {
      console.log('New live class scheduled, refreshing dashboard...');
      fetchAll();
    });

    return () => {
      offLiveClassScheduled();
    };
  }, [onLiveClassScheduled, offLiveClassScheduled, fetchAll]);

  if (loading) {
    return (
      <StudentDashboardLayout>
        <div className="flex-1 flex items-center justify-center h-[calc(100vh-73px)]">
          <div className="text-center">
            <Loader2 className="size-8 animate-spin text-[#1B8A44] mx-auto mb-4" />
            <p className="text-[#64748B]">Loading dashboard...</p>
          </div>
        </div>
      </StudentDashboardLayout>
    );
  }

  if (error) {
    return (
      <StudentDashboardLayout>
        <div className="flex-1 flex items-center justify-center h-[calc(100vh-73px)]">
          <div className="text-center">
            <p className="text-[#DC2626] mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#1B8A44] text-white rounded-lg hover:bg-[#166534] transition-colors">
              Retry
            </button>
          </div>
        </div>
      </StudentDashboardLayout>
    );
  }

  const stats = dashboardData?.stats || { enrolledCourses: 0, liveClasses: 0, assignments: 0 };
  const courses = dashboardData?.courses?.length ? dashboardData.courses : [];
  const announcements = dashboardData?.announcements || [];

  const displayName = user?.name || 'Student';

  const courseVisuals: Record<string, React.ReactNode> = {
    Mathematics: (
      <svg viewBox="0 0 140 100" className="w-32 h-24">
        <circle cx="30" cy="30" r="15" fill="none" stroke="#1B8A44" strokeWidth="1.5" strokeDasharray="3,2"/>
        <line x1="15" y1="30" x2="45" y2="30" stroke="#1B8A44" strokeWidth="1"/>
        <line x1="30" y1="15" x2="30" y2="45" stroke="#1B8A44" strokeWidth="1"/>
        <text x="25" y="34" fontSize="8" fill="#1B8A44" fontWeight="bold">M</text>
        <polygon points="70,20 90,50 50,50" fill="none" stroke="#22C55E" strokeWidth="1.5"/>
        <text x="64" y="45" fontSize="10" fill="#1B8A44" fontWeight="bold">MATH</text>
        <rect x="100" y="25" width="20" height="20" fill="none" stroke="#4ADE80" strokeWidth="1.5" transform="rotate(15 110 35)"/>
        <text x="105" y="38" fontSize="6" fill="#1B8A44">3+2</text>
        <line x1="20" y1="70" x2="120" y2="70" stroke="#CBD5E1" strokeWidth="0.5" strokeDasharray="4,2"/>
        <path d="M30 70 Q50 50 70 70 T110 70" fill="none" stroke="#1B8A44" strokeWidth="1.5"/>
      </svg>
    ),
    Science: (
      <svg viewBox="0 0 120 100" className="w-28 h-24">
        <ellipse cx="45" cy="55" rx="12" ry="18" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5"/>
        <ellipse cx="45" cy="40" rx="8" ry="6" fill="#FECACA"/>
        <ellipse cx="75" cy="50" rx="12" ry="18" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
        <ellipse cx="75" cy="35" rx="8" ry="6" fill="#BFDBFE"/>
        <ellipse cx="60" cy="65" rx="12" ry="18" fill="#DCFCE7" stroke="#22C55E" strokeWidth="1.5"/>
        <ellipse cx="60" cy="50" rx="8" ry="6" fill="#BBF7D0"/>
      </svg>
    ),
    Abacus: (
      <svg viewBox="0 0 120 100" className="w-28 h-24">
        <rect x="20" y="20" width="80" height="60" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="2"/>
        <line x1="20" y1="40" x2="100" y2="40" stroke="#D97706" strokeWidth="2"/>
        <line x1="20" y1="60" x2="100" y2="60" stroke="#D97706" strokeWidth="2"/>
        {[35, 50, 65, 80].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="20" x2={x} y2="80" stroke="#D97706" strokeWidth="1"/>
            <circle cx={x} cy="32" r="5" fill={i % 2 === 0 ? '#F59E0B' : '#EF4444'}/>
            <circle cx={x} cy="50" r="5" fill={i % 2 === 1 ? '#3B82F6' : '#22C55E'}/>
            <circle cx={x} cy="68" r="5" fill={i % 2 === 0 ? '#EF4444' : '#F59E0B'}/>
          </g>
        ))}
      </svg>
    ),
    Chess: (
      <svg viewBox="0 0 140 100" className="w-36 h-24">
        <rect x="20" y="65" width="100" height="20" rx="2" fill="#1E293B"/>
        <rect x="30" y="60" width="80" height="8" rx="1" fill="#334155"/>
        <path d="M40 60 L40 45 L45 35 L50 45 L50 60 Z" fill="#475569"/>
        <circle cx="45" cy="30" r="6" fill="#475569"/>
        <path d="M60 60 L60 40 L65 28 L70 40 L70 60 Z" fill="#64748B"/>
        <circle cx="65" cy="23" r="7" fill="#64748B"/>
        <path d="M80 60 L80 42 L85 32 L90 42 L90 60 Z" fill="#475569"/>
        <circle cx="85" cy="27" r="6" fill="#475569"/>
        <path d="M100 60 L100 38 L105 26 L110 38 L110 60 Z" fill="#64748B"/>
        <circle cx="105" cy="21" r="7" fill="#64748B"/>
      </svg>
    )
  };

  const achievementBadges = [
    { id: 1, title: 'Quick Learner', icon: 'book', color: '#16A34A', borderColor: '#16A34A' },
    { id: 2, title: 'Quiz Master', icon: 'star', color: '#9333EA', borderColor: '#9333EA' },
    { id: 3, title: 'Dedicated', icon: 'flame', color: '#F59E0B', borderColor: '#F59E0B' },
    { id: 4, title: 'Top Performer', icon: 'trophy', color: '#2563EB', borderColor: '#2563EB' },
  ];

  return (
    <StudentDashboardLayout>
      <div className="flex flex-col xl:flex-row">
        {/* Center Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 min-w-0">
          {/* Welcome Message */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-lg sm:text-xl text-[#1E293B]">Welcome back,</h1>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B8A44]">{displayName}! 👋</h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">Keep going! Your next milestone is closer than you think.</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-8">
            {[
              { label: 'Enrolled Courses', value: String(stats.enrolledCourses), icon: BookOpen, iconBg: 'bg-[#DCFCE7]', iconColor: 'text-[#1B8A44]', link: 'View all' },
              { label: 'Live Classes', value: String(stats.liveClasses), icon: Video, iconBg: 'bg-[#FEF3C7]', iconColor: 'text-[#D97706]', link: 'View schedule' },
              { label: 'Assignments', value: String(stats.assignments), icon: ClipboardList, iconBg: 'bg-[#DBEAFE]', iconColor: 'text-[#2563EB]', link: 'View all' },
            ].map((card, index) => (
              <div key={index} className="bg-white rounded-xl border border-[#E2E8F0] p-3 sm:p-4 lg:p-5">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${card.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <card.icon size={16} className={`sm:size-5 lg:size-6 ${card.iconColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#64748B] mb-0.5 truncate">{card.label}</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1E293B]">{card.value}</p>
                  </div>
                </div>
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-[#F1F5F9]">
                  <button className="text-xs text-[#64748B] font-medium flex items-center gap-1 hover:text-[#1B8A44] transition-colors">
                    {card.link} <ChevronRight size={10} className="sm:size-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* My Courses Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h2 className="text-base sm:text-lg font-semibold text-[#1E293B]">My Courses</h2>
              <button className="text-sm text-[#1B8A44] font-medium hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {courses.length > 0 ? courses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
                  <div className="relative h-36 bg-gradient-to-br from-[#F0FDF4] to-[#EDF8F1] flex items-center justify-center overflow-hidden">
                    <span className={`absolute top-3 left-3 ${course.progress > 0 ? 'bg-[#1B8A44]' : 'bg-[#9333EA]'} text-white text-[10px] px-2.5 py-1 rounded-full font-semibold tracking-wide z-10`}>
                      {course.progress > 0 ? 'In Progress' : 'Not Started'}
                    </span>
                    {courseVisuals[course.title] || (
                      <div className="text-3xl font-bold text-[#1B8A44]">{course.title[0]}</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#1E293B] mb-1">{course.title}</h3>
                    <p className="text-xs text-[#64748B] mb-3">{course.progress}% Complete</p>
                    <div className="w-full bg-[#F1F5F9] rounded-full h-1.5 mb-4">
                      <div className="bg-[#1B8A44] h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <button className="w-full py-2 rounded-lg text-sm font-medium border border-[#1B8A44] text-[#1B8A44] hover:bg-[#F0FDF4] transition-colors">
                      {course.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                    </button>
                  </div>
                </div>
              )) : (
                <div className="col-span-full bg-white rounded-xl border border-[#E2E8F0] p-8 text-center">
                  <BookOpen className="size-10 text-[#CBD5E1] mx-auto mb-3" />
                  <p className="text-sm text-[#64748B]">No courses enrolled yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Continue Learning Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#1E293B] mb-5">Continue Learning</h2>
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              <div className="w-full sm:w-52 h-28 bg-[#1E293B] rounded-xl flex items-center justify-center relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 opacity-30">
                  <svg viewBox="0 0 200 100" className="w-full h-full">
                    <text x="10" y="20" fontSize="12" fill="#FCD34D" opacity="0.6">MATH</text>
                    <text x="60" y="35" fontSize="10" fill="#FCD34D" opacity="0.4">MATHEMATICS</text>
                    <text x="120" y="18" fontSize="8" fill="#FCD34D" opacity="0.5">MATH</text>
                    <text x="30" y="55" fontSize="11" fill="#FCD34D" opacity="0.3">MATHEMATICS</text>
                    <text x="100" y="50" fontSize="9" fill="#FCD34D" opacity="0.6">MATH</text>
                    <text x="150" y="40" fontSize="10" fill="#FCD34D" opacity="0.4">MATHEMATICS</text>
                    <text x="20" y="80" fontSize="8" fill="#FCD34D" opacity="0.5">MATH</text>
                    <text x="80" y="75" fontSize="12" fill="#FCD34D" opacity="0.3">MATHEMATICS</text>
                    <text x="140" y="70" fontSize="9" fill="#FCD34D" opacity="0.6">MATH</text>
                    <circle cx="170" cy="80" r="15" fill="none" stroke="#FCD34D" strokeWidth="0.5" opacity="0.3"/>
                    <line x1="0" y1="85" x2="200" y2="85" stroke="#FCD34D" strokeWidth="0.3" opacity="0.2"/>
                  </svg>
                </div>
                <div className="w-12 h-12 bg-[#1B8A44] rounded-full flex items-center justify-center z-10 shadow-lg shadow-[#1B8A44]/30">
                  <Video size={24} className="text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#64748B] mb-1">Mathematics</p>
                <h3 className="font-semibold text-[#1E293B] mb-2">Algebra – Linear Equations</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#64748B]">Lesson 5 of 12</span>
                  <div className="flex-1 bg-[#F1F5F9] rounded-full h-1.5 max-w-[200px]">
                    <div className="bg-[#1B8A44] h-1.5 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
              </div>
              <button className="w-full sm:w-auto px-5 py-2.5 bg-[#1B8A44] text-white rounded-lg text-sm font-medium hover:bg-[#166534] transition-colors flex items-center justify-center gap-2">
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Announcements Section */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[#1E293B]">Announcements</h2>
              <button className="text-sm text-[#1B8A44] font-medium hover:underline">View All</button>
            </div>
            {announcements.length > 0 ? (
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="bg-white rounded-xl border border-[#E2E8F0] p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        announcement.type === 'warning' ? 'bg-[#FEF3C7] text-[#D97706]' :
                        announcement.type === 'error' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                        announcement.type === 'success' ? 'bg-[#DCFCE7] text-[#16A34A]' :
                        'bg-[#DBEAFE] text-[#2563EB]'
                      }`}>
                        <Megaphone size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start sm:items-center justify-between mb-1 gap-2">
                          <h3 className="font-semibold text-[#1E293B] text-sm sm:text-base truncate">{announcement.title}</h3>
                          <span className="text-xs text-[#64748B] whitespace-nowrap shrink-0">
                            {new Date(announcement.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-sm text-[#64748B] line-clamp-2">{announcement.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#DCFCE7] rounded-full flex items-center justify-center flex-shrink-0">
                    <Megaphone size={20} className="text-[#1B8A44]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start sm:items-center justify-between mb-1 gap-2">
                      <h3 className="font-semibold text-[#1E293B] text-sm sm:text-base truncate">Holiday Notice</h3>
                      <span className="text-xs text-[#64748B] whitespace-nowrap shrink-0">2 days ago</span>
                    </div>
                    <p className="text-sm text-[#64748B] line-clamp-2">
                      There will be no live classes on 26th May 2024 on account of Republic Day.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>


      </div>
    </StudentDashboardLayout>
  );
}
