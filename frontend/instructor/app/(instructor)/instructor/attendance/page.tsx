'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Users, Calendar, CheckCircle2, Loader2, ClipboardCheck } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { attendanceService } from '@/services/attendanceService';
import type { Course } from '@/types';

export default function AttendancePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await attendanceService.getInstructorCourses();
        setCourses(data.courses || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-[#1B8A44]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#1E293B]">Attendance Management</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Mark attendance for your courses and track student participation
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/instructor/attendance/reports">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ClipboardCheck className="size-4" />
              View Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1E293B]">{courses.length}</div>
              <div className="text-sm text-[#64748B]">Active Courses</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1B8A44]">
                {courses.reduce((sum, course) => sum + (course.enrolled_students || 0), 0)}
              </div>
              <div className="text-sm text-[#64748B]">Total Students</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#7C3AED]">
                {new Date().toLocaleDateString()}
              </div>
              <div className="text-sm text-[#64748B]">Today's Date</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Cards */}
      {courses.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <BookOpen className="size-12 text-[#CBD5E1] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#1E293B] mb-2">No courses found</h3>
              <p className="text-sm text-[#64748B]">
                You don't have any published courses assigned to you yet.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="group hover:shadow-lg transition-all duration-200">
              <div className="relative">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-[#1B8A44]/10 to-[#1B8A44]/20 rounded-t-lg flex items-center justify-center">
                    <BookOpen className="size-12 text-[#1B8A44]/60" />
                  </div>
                )}
                
                {/* Category Badge */}
                {course.category_name && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 text-xs font-medium bg-white/90 text-[#1E293B] rounded-full shadow-sm">
                      {course.category_name}
                    </span>
                  </div>
                )}

                {/* Student Count Badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 text-xs font-bold bg-[#1B8A44] text-white rounded-full shadow-sm flex items-center gap-1">
                    <Users className="size-3" />
                    {course.enrolled_students || 0}
                  </span>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Title */}
                  <div>
                    <h3 className="font-semibold text-[#1E293B] line-clamp-2 group-hover:text-[#1B8A44] transition-colors">
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="text-sm text-[#64748B] line-clamp-2 mt-1">
                        {course.description}
                      </p>
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="flex items-center justify-between text-sm text-[#64748B]">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      <span>{course.duration_value} {course.duration_unit}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      course.level === 'beginner' ? 'bg-[#EFF6FF] text-[#1E40AF]' :
                      course.level === 'intermediate' ? 'bg-[#FEF3C7] text-[#D97706]' :
                      'bg-[#FEE2E2] text-[#DC2626]'
                    }`}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#E2E8F0]">
                    <Link href={`/instructor/attendance/${course.id}`} className="flex-1">
                      <Button className="w-full flex items-center gap-2">
                        <CheckCircle2 className="size-4" />
                        Mark Attendance
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/instructor/attendance/reports">
                <div className="p-4 border border-[#E2E8F0] rounded-lg hover:border-[#1B8A44] transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1B8A44]/10 rounded-lg">
                      <ClipboardCheck className="size-5 text-[#1B8A44]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#1E293B]">Attendance Reports</h4>
                      <p className="text-sm text-[#64748B]">View detailed attendance analytics</p>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="p-4 border border-[#E2E8F0] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#7C3AED]/10 rounded-lg">
                    <Calendar className="size-5 text-[#7C3AED]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1E293B]">Today's Classes</h4>
                    <p className="text-sm text-[#64748B]">Mark attendance for today's sessions</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}