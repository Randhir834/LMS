'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BookOpen, Loader2, Users, Star, Heart, Filter } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CourseCard from '@/components/ui/CourseCard';
import CourseFilters from '@/components/ui/CourseFilters';
import StudentDashboardLayout from '@/components/layouts/StudentDashboardLayout';
import { courseService } from '@/services/courseService';
import { categoryService } from '@/services/categoryService';
import { enrollmentService } from '@/services/enrollmentService';
import type { Course, Category } from '@/types';

function StudentCoursesContent() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams?.get('search') || '',
    category_id: searchParams?.get('category_id') || '',
    level: searchParams?.get('level') || '',
    price_range: searchParams?.get('price_range') || '',
    sort_by: searchParams?.get('sort_by') || 'created_at',
    sort_order: (searchParams?.get('sort_order') as 'asc' | 'desc') || 'desc'
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      
      // Get published courses with enrollment status
      const data = await courseService.getPublishedCourses(cleanFilters);
      
      // Check enrollment status for each course
      const coursesWithEnrollment = await Promise.all(
        (data.courses || []).map(async (course) => {
          try {
            const enrollmentData = await enrollmentService.checkEnrollment(course.id);
            return {
              ...course,
              is_enrolled: enrollmentData.enrolled,
              progress: enrollmentData.progress || 0
            };
          } catch {
            return { ...course, is_enrolled: false, progress: 0 };
          }
        })
      );
      
      setCourses(coursesWithEnrollment);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  };

  const enrolledCourses = courses.filter(c => c.is_enrolled);
  const availableCourses = courses.filter(c => !c.is_enrolled);

  const stats = {
    total: courses.length,
    enrolled: enrolledCourses.length,
    available: availableCourses.length,
    completed: enrolledCourses.filter(c => c.progress === 100).length
  };

  return (
    <StudentDashboardLayout>
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1E293B]">
              {filters.search ? 'Search Results' : 'Browse Courses'}
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              {filters.search 
                ? `Showing results for "${filters.search}"`
                : 'Discover and enroll in courses that match your interests'
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/student/my-courses">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <BookOpen className="size-3 sm:size-4" />
                <span className="hidden xs:inline">My Courses</span>
                <span className="xs:hidden">My</span>
              </Button>
            </Link>
            <Link href="/student/wishlist">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <Heart className="size-3 sm:size-4" />
                <span className="hidden xs:inline">Wishlist</span>
                <span className="xs:hidden">List</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1E293B]">{stats.total}</div>
                <div className="text-xs sm:text-sm text-[#64748B]">Available Courses</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1B8A44]">{stats.enrolled}</div>
                <div className="text-xs sm:text-sm text-[#64748B]">Enrolled</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#7C3AED]">{stats.completed}</div>
                <div className="text-xs sm:text-sm text-[#64748B]">Completed</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#D97706]">{stats.available}</div>
                <div className="text-xs sm:text-sm text-[#64748B]">New Courses</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-3 sm:p-4">
            <CourseFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              userRole="student"
              categories={categories}
              showAdvanced={true}
            />
          </CardContent>
        </Card>

        {/* Course Sections */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-[#1B8A44]" />
          </div>
        ) : courses.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <BookOpen className="size-12 text-[#CBD5E1] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#1E293B] mb-2">No courses found</h3>
                <p className="text-sm text-[#64748B] mb-6">
                  {filters.search || Object.values(filters).some(v => v && v !== 'created_at' && v !== 'desc')
                    ? 'Try adjusting your filters or search terms to find more courses.'
                    : 'No courses are currently available. Check back later for new content.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Enrolled Courses Section */}
            {enrolledCourses.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-[#1E293B]">Continue Learning</h2>
                  <Link href="/student/my-courses">
                    <Button variant="ghost" size="sm" className="text-xs sm:text-sm">View All</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                  {enrolledCourses.slice(0, 6).map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      userRole="student"
                      showActions={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Available Courses Section */}
            {availableCourses.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-[#1E293B]">
                    {enrolledCourses.length > 0 ? 'Explore More Courses' : 'All Courses'}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                  {availableCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      userRole="student"
                      showActions={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </StudentDashboardLayout>
  );
}

export default function StudentCoursesPage() {
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
      <StudentCoursesContent />
    </Suspense>
  );
}
