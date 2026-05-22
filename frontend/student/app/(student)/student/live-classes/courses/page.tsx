'use client';

import { useEffect, useState, Suspense } from 'react';
import { Calendar, Clock, Loader2, ExternalLink, AlertCircle, BookOpen, Video, User } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StudentDashboardLayout from '@/components/layouts/StudentDashboardLayout';
import { liveClassService } from '@/services/liveClassService';
import Link from 'next/link';

interface LiveClass {
  id: number;
  title: string;
  description: string;
  meet_link: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  instructor_name: string;
  created_at: string;
}

interface CourseWithLiveClasses {
  course_id: number;
  course_title: string;
  course_description: string;
  thumbnail_url: string;
  progress: number;
  enrollment_status: string;
  live_classes: LiveClass[];
}

function StudentCourseLiveClassesContent() {
  const [courses, setCourses] = useState<CourseWithLiveClasses[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCoursesWithLiveClasses = async () => {
      try {
        setLoading(true);
        const data = await liveClassService.getCoursesWithLiveClasses();
        setCourses(data.courses || []);
        setError('');
      } catch (err) {
        console.error('Failed to fetch courses with live classes:', err);
        setError('Failed to load courses');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesWithLiveClasses();
  }, []);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTimeUntilClass = (scheduledAt: string) => {
    const now = new Date();
    const classTime = new Date(scheduledAt);
    const diff = classTime.getTime() - now.getTime();

    if (diff < 0) return 'Class ended';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `In ${days} day${days > 1 ? 's' : ''}`;
    }

    if (hours > 0) {
      return `In ${hours}h ${minutes}m`;
    }

    if (minutes > 0) {
      return `In ${minutes} minutes`;
    }

    return 'Starting now!';
  };

  const totalUpcomingClasses = courses.reduce((sum, course) => sum + course.live_classes.length, 0);

  return (
    <StudentDashboardLayout>
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1E293B]">My Course Live Classes</h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              View upcoming live classes organized by course
            </p>
          </div>

          <Link href="/student/live-classes">
            <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
              <Calendar className="size-4" />
              View All Classes
            </Button>
          </Link>
        </div>

        {/* Stats Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#1E293B]">{courses.length}</div>
                <div className="text-xs sm:text-sm text-[#64748B]">Enrolled Courses</div>
              </div>
              <div className="h-12 w-px bg-[#E2E8F0]" />
              <div className="text-center">
                <div className="text-2xl font-bold text-[#1B8A44]">{totalUpcomingClasses}</div>
                <div className="text-xs sm:text-sm text-[#64748B]">Upcoming Classes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-[#1B8A44]" />
          </div>
        ) : courses.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <BookOpen className="size-12 text-[#CBD5E1] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#1E293B] mb-2">
                  No enrolled courses
                </h3>
                <p className="text-sm text-[#64748B] mb-6">
                  Enroll in courses to see their upcoming live classes here.
                </p>
                <Link href="/student/courses">
                  <Button className="flex items-center gap-2 mx-auto">
                    <BookOpen className="size-4" />
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {courses.map((course) => {
              return (
                <Card key={course.course_id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="border-b border-[#E2E8F0]">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#1B8A44]/10 rounded-lg flex-shrink-0">
                        <BookOpen className="size-5 text-[#1B8A44]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg truncate">
                          {course.course_title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#64748B]">
                          <div className="flex items-center gap-1">
                            <Video className="size-3" />
                            {course.live_classes.length} upcoming {course.live_classes.length === 1 ? 'class' : 'classes'}
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="size-3 rounded-full bg-[#1B8A44]" style={{ width: `${course.progress}%` }} />
                            {course.progress}% complete
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    {course.live_classes.length === 0 ? (
                      <div className="text-center py-8">
                        <Video className="size-10 text-[#CBD5E1] mx-auto mb-3" />
                        <p className="text-sm text-[#64748B]">
                          No upcoming live classes scheduled
                        </p>
                        <p className="text-xs text-[#94A3B8] mt-1">
                          Your instructor will schedule classes soon
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {course.live_classes.map((liveClass) => {
                          const timeUntil = getTimeUntilClass(liveClass.scheduled_at);
                          const isStartingSoon = new Date(liveClass.scheduled_at).getTime() - new Date().getTime() < 15 * 60 * 1000;

                          return (
                            <div
                              key={liveClass.id}
                              className={`p-3 rounded-lg border transition-all ${
                                isStartingSoon
                                  ? 'border-[#1B8A44] bg-[#1B8A44]/5'
                                  : 'border-[#E2E8F0] bg-[#F8FAFC]'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-[#1E293B] truncate">
                                    {liveClass.title}
                                  </h4>
                                  
                                  {liveClass.instructor_name && (
                                    <div className="flex items-center gap-1 mt-1 text-xs text-[#64748B]">
                                      <User className="size-3" />
                                      {liveClass.instructor_name}
                                    </div>
                                  )}

                                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#64748B]">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="size-3" />
                                      {formatDateTime(liveClass.scheduled_at)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="size-3" />
                                      {liveClass.duration_minutes} min
                                    </div>
                                  </div>

                                  <div className={`inline-flex items-center gap-1 mt-2 text-xs font-medium ${
                                    isStartingSoon ? 'text-[#1B8A44]' : 'text-[#7C3AED]'
                                  }`}>
                                    <span className={`inline-block size-2 rounded-full ${
                                      isStartingSoon ? 'bg-[#1B8A44]' : 'bg-[#7C3AED]'
                                    }`} />
                                    {timeUntil}
                                  </div>

                                  {liveClass.description && (
                                    <p className="text-xs text-[#64748B] mt-2 line-clamp-2">
                                      {liveClass.description}
                                    </p>
                                  )}
                                </div>

                                <a
                                  href={liveClass.meet_link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                                    isStartingSoon
                                      ? 'bg-[#1B8A44] text-white hover:bg-[#157a35]'
                                      : 'bg-[#7C3AED] text-white hover:bg-[#6d28d9]'
                                  }`}
                                  title="Join Google Meet"
                                >
                                  <ExternalLink className="size-4" />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </StudentDashboardLayout>
  );
}

export default function StudentCourseLiveClassesPage() {
  return (
    <Suspense fallback={
      <StudentDashboardLayout>
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-[#1B8A44]" />
          </div>
        </div>
      </StudentDashboardLayout>
    }>
      <StudentCourseLiveClassesContent />
    </Suspense>
  );
}
