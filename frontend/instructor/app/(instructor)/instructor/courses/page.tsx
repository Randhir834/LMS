'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BookOpen, Users, Loader2, PlusCircle, BarChart3, Calendar, FileText } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CourseCard from '@/components/ui/CourseCard';
import CourseFilters from '@/components/ui/CourseFilters';
import { courseService } from '@/services/courseService';
import { categoryService } from '@/services/categoryService';
import type { Course, Category } from '@/types';

function InstructorCoursesContent() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams?.get('search') || '',
    status: searchParams?.get('status') || '',
    category_id: searchParams?.get('category_id') || '',
    level: searchParams?.get('level') || '',
    sort_by: searchParams?.get('sort_by') || 'created_at',
    sort_order: (searchParams?.get('sort_order') as 'asc' | 'desc') || 'desc'
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      const data = await courseService.getMyCourses(cleanFilters);
      setCourses(data.courses || []);
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

  const handleEdit = (id: number) => {
    window.location.href = `/instructor/courses/${id}/edit`;
  };

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

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    draft: courses.filter(c => c.status === 'draft').length,
    totalEnrollments: courses.reduce((sum, c) => sum + (c.enrollment_count || 0), 0)
  };

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#1E293B]">My Courses</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Manage your courses and track student progress
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/instructor/analytics">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <BarChart3 className="size-4" />
              Analytics
            </Button>
          </Link>
          <Link href="/instructor/live-classes">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Calendar className="size-4" />
              Live Classes
            </Button>
          </Link>
          <Link href="/instructor/assignments">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <FileText className="size-4" />
              Assignments
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
              <div className="text-sm text-[#64748B]">Total Courses</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1B8A44]">{stats.published}</div>
              <div className="text-sm text-[#64748B]">Published</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#D97706]">{stats.draft}</div>
              <div className="text-sm text-[#64748B]">Draft</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#7C3AED]">{stats.totalEnrollments}</div>
              <div className="text-sm text-[#64748B]">Total Students</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <CourseFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            userRole="instructor"
            categories={categories}
            showAdvanced={false}
          />
        </CardContent>
      </Card>

      {/* Course Grid */}
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
                  ? 'Try adjusting your filters or search terms.'
                  : 'You haven\'t been assigned to any courses yet. Contact your administrator to get started.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              userRole="instructor"
              onEdit={handleEdit}
              showActions={true}
            />
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {courses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/instructor/assignments">
                <div className="p-4 border border-[#E2E8F0] rounded-lg hover:border-[#1B8A44] transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1B8A44]/10 rounded-lg">
                      <FileText className="size-5 text-[#1B8A44]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#1E293B]">Manage Assignments</h4>
                      <p className="text-sm text-[#64748B]">Create and grade assignments</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/instructor/live-classes">
                <div className="p-4 border border-[#E2E8F0] rounded-lg hover:border-[#1B8A44] transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1B8A44]/10 rounded-lg">
                      <Calendar className="size-5 text-[#1B8A44]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#1E293B]">Schedule Live Classes</h4>
                      <p className="text-sm text-[#64748B]">Host interactive sessions</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/instructor/analytics">
                <div className="p-4 border border-[#E2E8F0] rounded-lg hover:border-[#1B8A44] transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1B8A44]/10 rounded-lg">
                      <BarChart3 className="size-5 text-[#1B8A44]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#1E293B]">View Analytics</h4>
                      <p className="text-sm text-[#64748B]">Track student progress</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function InstructorCoursesPage() {
  return (
    <Suspense fallback={
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-[#1B8A44]" />
        </div>
      </div>
    }>
      <InstructorCoursesContent />
    </Suspense>
  );
}