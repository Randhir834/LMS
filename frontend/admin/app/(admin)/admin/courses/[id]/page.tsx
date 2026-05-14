'use client';

import { useEffect, useMemo, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Users, ArrowLeft, Edit, Layers, BookOpen, FileText } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { courseService } from '@/services/courseService';
import type { Course } from '@/types';

export default function AdminCourseViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const courseId = Number(id);
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await courseService.getCourseById(courseId);
        setCourse(res.course || null);
      } catch {
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const instructorNames = useMemo(() => {
    if (!course?.instructors?.length) return '';
    return course.instructors.map((i) => i.name).join(', ');
  }, [course]);

  const levelLabel: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-primary-500" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <BookOpen className="size-12 text-dark-200 mx-auto mb-3" />
              <p className="text-sm text-text-muted">Course not found.</p>
              <div className="mt-4">
                <Button variant="outline" onClick={() => router.push('/admin/courses')}>Back to Courses</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg border border-border hover:bg-hover transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={18} className="text-text-secondary" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary">{course.title}</h1>
            <p className="text-sm text-text-muted">Status: {course.status}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/admin/courses/${course.id}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit size={16} /> Edit
            </Button>
          </Link>
          <Link href={`/admin/courses/${course.id}/sections`}>
            <Button className="gap-2">
              <Layers size={16} /> Structure
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
            <CardContent>
              {course.description ? (
                <p className="text-sm text-text-secondary whitespace-pre-line">{course.description}</p>
              ) : (
                <p className="text-sm text-text-muted">No description provided.</p>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-500 font-medium">
                  {levelLabel[course.level] || course.level}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] font-medium">
                  {course.duration_value} {course.duration_unit}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-100 text-dark-500 font-medium">
                  ₹{course.price}
                </span>
                {course.language && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-100 text-dark-500 font-medium">
                    {course.language}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Learning & Requirements</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-text-primary mb-2">What you’ll learn</p>
                {course.what_you_learn ? (
                  <p className="text-sm text-text-secondary whitespace-pre-line">{course.what_you_learn}</p>
                ) : (
                  <p className="text-sm text-text-muted">Not set</p>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary mb-2">Requirements</p>
                {course.requirements ? (
                  <p className="text-sm text-text-secondary whitespace-pre-line">{course.requirements}</p>
                ) : (
                  <p className="text-sm text-text-muted">Not set</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Instructors</CardTitle></CardHeader>
            <CardContent>
              {instructorNames ? (
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-text-muted" />
                  <p className="text-sm text-text-secondary">{instructorNames}</p>
                </div>
              ) : (
                <p className="text-sm text-text-muted">No instructors assigned.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Next Steps</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/admin/courses/${course.id}/sections`} className="block">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Layers size={16} /> Manage Sections
                </Button>
              </Link>
              <Link href={`/admin/courses/${course.id}/lessons`} className="block">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BookOpen size={16} /> Manage Lessons
                </Button>
              </Link>
              <Link href={`/admin/courses/${course.id}/materials`} className="block">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText size={16} /> Course Materials
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
