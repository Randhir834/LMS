'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BookOpen, Loader2, Play, CheckCircle2, Clock, Award, BarChart3 } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CourseCard from '@/components/ui/CourseCard';
import StudentDashboardLayout from '@/components/layouts/StudentDashboardLayout';
import { enrollmentService } from '@/services/enrollmentService';
import type { Course } from '@/types';

function MyCoursesContent() {
  const searchParams = useSearchParams();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>(searchParams?.get('filter') || 'all');
  const search = searchParams?.get('search') || '';

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const data = await enrollmentService.getEnrollments();
        setEnrollments(data.enrollments || []);
      } catch (error) {
        console.error('Failed to fetch enrollments:', error);
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  // Filter enrollments based on status and search
  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesFilter = filter === 'all' || 
      (filter === 'in-progress' && enrollment.progress > 0 && enrollment.progress < 100) ||
      (filter === 'completed' && enrollment.progress === 100) ||
      (filter === 'not-started' && enrollment.progress === 0);
    
    const matchesSearch = !search || 
      enrollment.course_title?.toLowerCase().includes(search.toLowerCase()) ||
      enrollment.course_description?.toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Convert enrollments to course format for CourseCard
  const courses: Course[] = filteredEnrollments.map(enrollment => ({
    id: enrollment.course_id,
    title: enrollment.course_title || 'Untitled Course',
    description: enrollment.course_description,
    price: 0, // Already enrolled, so price is not relevant
    status: 'published' as const,
    duration_value: 0,
    duration_unit: 'days' as const,
    level: 'beginner' as const,
    language: 'English',
    is_enrolled: true,
    progress: enrollment.progress,
    created_at: enrollment.created_at,
    updated_at: enrollment.updated_at
  }));

  const stats = {
    total: enrollments.length,
    inProgress: enrollments.filter(e => e.progress > 0 && e.progress < 100).length,
    completed: enrollments.filter(e => e.progress === 100).length,
    notStarted: enrollments.filter(e => e.progress === 0).length
  };

  const averageProgress = enrollments.length > 0 
    ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length 
    : 0;

  return (
    <StudentDashboardLayout>
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1E293B]">My Courses</h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              {search 
                ? `Search results for "${search}"`
                : 'Track your learning progress and continue your courses'
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/student/courses">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <BookOpen className="size-3 sm:size-4" />
                <span className="hidden xs:inline">Browse Courses</span>
                <span className="xs:hidden">Browse</span>
              </Button>
            </Link>
            <Link href="/student/certificates">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <Award className="size-4" />
                Certificates
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#1E293B]">{stats.total}</div>
                <div className="text-sm text-[#64748B]">Enrolled Courses</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#1B8A44]">{stats.completed}</div>
                <div className="text-sm text-[#64748B]">Completed</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#D97706]">{stats.inProgress}</div>
                <div className="text-sm text-[#64748B]">In Progress</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#7C3AED]">{Math.round(averageProgress)}%</div>
                <div className="text-sm text-[#64748B]">Avg Progress</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E2E8F0]">
          {[
            { key: 'all', label: 'All Courses', count: stats.total },
            { key: 'in-progress', label: 'In Progress', count: stats.inProgress },
            { key: 'completed', label: 'Completed', count: stats.completed },
            { key: 'not-started', label: 'Not Started', count: stats.notStarted },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                filter === tab.key
                  ? 'border-[#1B8A44] text-[#1B8A44]'
                  : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-[#1B8A44]" />
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <BookOpen className="size-12 text-[#CBD5E1] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#1E293B] mb-2">
                  {enrollments.length === 0 ? 'No enrolled courses' : 'No courses found'}
                </h3>
                <p className="text-sm text-[#64748B] mb-6">
                  {enrollments.length === 0 
                    ? 'Start your learning journey by enrolling in your first course.'
                    : search || filter !== 'all'
                      ? 'Try adjusting your search or filter.'
                      : 'No courses match the selected filter.'
                  }
                </p>
                {enrollments.length === 0 && (
                  <Link href="/student/courses">
                    <Button className="flex items-center gap-2">
                      <BookOpen className="size-4" />
                      Browse Courses
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                userRole="student"
                showActions={true}
              />
            ))}
          </div>
        )}

        {/* Learning Progress Summary */}
        {enrollments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#1E293B]">Overall Progress</span>
                  <span className="text-sm text-[#64748B]">{Math.round(averageProgress)}%</span>
                </div>
                <div className="w-full bg-[#E2E8F0] rounded-full h-3">
                  <div 
                    className="bg-[#1B8A44] h-3 rounded-full transition-all duration-300"
                    style={{ width: `${averageProgress}%` }}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg">
                    <div className="p-2 bg-[#1B8A44]/10 rounded-lg">
                      <CheckCircle2 className="size-5 text-[#1B8A44]" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-[#1E293B]">{stats.completed}</div>
                      <div className="text-sm text-[#64748B]">Courses Completed</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg">
                    <div className="p-2 bg-[#D97706]/10 rounded-lg">
                      <Play className="size-5 text-[#D97706]" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-[#1E293B]">{stats.inProgress}</div>
                      <div className="text-sm text-[#64748B]">In Progress</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg">
                    <div className="p-2 bg-[#64748B]/10 rounded-lg">
                      <Clock className="size-5 text-[#64748B]" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-[#1E293B]">{stats.notStarted}</div>
                      <div className="text-sm text-[#64748B]">Not Started</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </StudentDashboardLayout>
  );
}

export default function MyCoursesPage() {
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
      <MyCoursesContent />
    </Suspense>
  );
}