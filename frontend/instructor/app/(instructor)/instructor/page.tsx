'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Video, ClipboardList, Users, Loader2, ChevronRight } from 'lucide-react';
import { courseService } from '@/services/courseService';
import type { Course } from '@/types';

export default function InstructorHomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getMyCourses();
        setCourses(data.courses || []);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const statusColor: Record<string, string> = {
    draft: 'bg-[#E2E8F0] text-[#475569]',
    published: 'bg-[#DCFCE7] text-[#1B8A44]',
    archived: 'bg-[#F1F5F9] text-[#64748B]',
  };

  const levelLabel: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-[#1E293B]">Instructor Dashboard</h1>
        <Link href="/instructor/courses" className="text-sm text-[#1B8A44] font-medium hover:underline flex items-center gap-1">
          View All Courses <ChevronRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-[#1B8A44]" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 md:p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#DCFCE7] rounded-full flex items-center justify-center">
                  <BookOpen size={20} className="text-[#1B8A44]" />
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Assigned Courses</p>
                  <p className="text-2xl font-bold text-[#1E293B]">{courses.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 md:p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#FEF3C7] rounded-full flex items-center justify-center">
                  <Video size={20} className="text-[#D97706]" />
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Published</p>
                  <p className="text-2xl font-bold text-[#1E293B]">{courses.filter(c => c.status === 'published').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 md:p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#DBEAFE] rounded-full flex items-center justify-center">
                  <ClipboardList size={20} className="text-[#2563EB]" />
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Drafts</p>
                  <p className="text-2xl font-bold text-[#1E293B]">{courses.filter(c => c.status === 'draft').length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#1E293B] mb-4">My Assigned Courses</h2>
            {courses.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 text-center">
                <BookOpen className="size-10 text-[#CBD5E1] mx-auto mb-3" />
                <p className="text-sm text-[#64748B]">No courses assigned yet. Courses assigned by admin will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
                    <div className="relative h-32 bg-gradient-to-br from-[#F0FDF4] to-[#EDF8F1] flex items-center justify-center overflow-hidden">
                      <span className={`absolute top-3 left-3 text-[10px] px-2.5 py-1 rounded-full font-semibold tracking-wide ${statusColor[course.status] || 'bg-[#F1F5F9] text-[#64748B]'}`}>
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                      </span>
                      {course.thumbnail_url ? (
                        <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-3xl font-bold text-[#1B8A44]">{course.title[0]}</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#1E293B] mb-1 line-clamp-1">{course.title}</h3>
                      {course.description && (
                        <p className="text-xs text-[#64748B] mb-3 line-clamp-2">{course.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#1B8A44] font-medium">
                          {levelLabel[course.level] || course.level}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] font-medium">
                          {course.duration_value} {course.duration_unit}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] font-medium">
                          ₹{course.price}
                        </span>
                      </div>
                      {course.instructors && course.instructors.length > 0 && (
                        <div className="flex items-center gap-1 mb-3">
                          <Users size={14} className="text-[#64748B]" />
                          <span className="text-xs text-[#64748B]">
                            {course.instructors.map(i => i.name).join(', ')}
                          </span>
                        </div>
                      )}
                      <Link href={`/instructor/courses/${course.id}`}>
                        <button className="w-full py-2 rounded-lg text-sm font-medium border border-[#1B8A44] text-[#1B8A44] hover:bg-[#F0FDF4] transition-colors">
                          Manage Course
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
