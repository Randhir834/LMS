'use client';

import Link from 'next/link';
import { BookOpen, Users, Clock, Star, Edit, Trash2, Eye, Play, CheckCircle2 } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from './Card';
import Button from './Button';
import type { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  userRole: 'admin' | 'instructor' | 'student';
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  deleting?: boolean;
  showActions?: boolean;
  linkPrefix?: string;
}

export default function CourseCard({ 
  course, 
  userRole, 
  onDelete, 
  onEdit, 
  deleting = false, 
  showActions = true,
  linkPrefix = ''
}: CourseCardProps) {
  const statusColors = {
    draft: 'bg-[#E2E8F0] text-[#475569]',
    published: 'bg-[#DCFCE7] text-[#1B8A44]',
    archived: 'bg-[#F1F5F9] text-[#64748B]',
  };

  const levelColors = {
    beginner: 'bg-[#EFF6FF] text-[#1E40AF]',
    intermediate: 'bg-[#FEF3C7] text-[#D97706]',
    advanced: 'bg-[#FEE2E2] text-[#DC2626]',
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `₹${price.toLocaleString()}`;
  };

  const formatDuration = (value: number, unit: string) => {
    return `${value} ${unit}${value > 1 ? '' : ''}`;
  };

  const instructorNames = course.instructors?.map(i => i.name).join(', ') || course.instructor_name || 'No instructor';

  const getViewLink = () => {
    if (userRole === 'admin') return `${linkPrefix}/admin/courses/${course.id}`;
    if (userRole === 'instructor') return `${linkPrefix}/instructor/courses/${course.id}`;
    return `${linkPrefix}/student/course/${course.id}`;
  };

  const getEditLink = () => {
    if (userRole === 'admin') return `${linkPrefix}/admin/courses/${course.id}/edit`;
    if (userRole === 'instructor') return `${linkPrefix}/instructor/courses/${course.id}/edit`;
    return null;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-[#E2E8F0] hover:border-[#1B8A44]/20">
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
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[course.status]}`}>
            {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 text-xs font-bold bg-white/90 text-[#1E293B] rounded-full shadow-sm">
            {formatPrice(course.price)}
          </span>
        </div>

        {/* Progress Bar for Students */}
        {userRole === 'student' && course.is_enrolled && course.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="flex-1 bg-[#E2E8F0] rounded-full h-2">
                <div 
                  className="bg-[#1B8A44] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <span className="text-[#64748B] font-medium">{Math.round(course.progress || 0)}%</span>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title and Level */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-[#1E293B] line-clamp-2 group-hover:text-[#1B8A44] transition-colors">
                {course.title}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${levelColors[course.level]}`}>
                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </span>
            </div>
            
            {course.description && (
              <p className="text-sm text-[#64748B] line-clamp-2">
                {course.description}
              </p>
            )}
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <Users className="size-4" />
            <span className="truncate">{instructorNames}</span>
          </div>

          {/* Course Stats */}
          <div className="flex items-center justify-between text-sm text-[#64748B]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="size-4" />
                <span>{formatDuration(course.duration_value, course.duration_unit)}</span>
              </div>
              
              {course.enrollment_count !== undefined && (
                <div className="flex items-center gap-1">
                  <Users className="size-4" />
                  <span>{course.enrollment_count}</span>
                </div>
              )}

              {course.rating && (
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {course.category_name && (
              <span className="text-xs bg-[#F1F5F9] text-[#64748B] px-2 py-1 rounded">
                {course.category_name}
              </span>
            )}
          </div>

          {/* Enrollment Status for Students */}
          {userRole === 'student' && course.is_enrolled && (
            <div className="flex items-center gap-2 text-sm text-[#1B8A44] bg-[#DCFCE7] px-3 py-2 rounded-lg">
              <CheckCircle2 className="size-4" />
              <span className="font-medium">Enrolled</span>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex items-center gap-2 pt-2 border-t border-[#E2E8F0]">
              <Link href={getViewLink()} className="flex-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full flex items-center gap-2"
                >
                  {userRole === 'student' ? (
                    course.is_enrolled ? (
                      <>
                        <Play className="size-4" />
                        Continue
                      </>
                    ) : (
                      <>
                        <Eye className="size-4" />
                        View Details
                      </>
                    )
                  ) : (
                    <>
                      <Eye className="size-4" />
                      View
                    </>
                  )}
                </Button>
              </Link>

              {(userRole === 'admin' || (userRole === 'instructor' && getEditLink())) && onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(course.id)}
                  className="px-3"
                >
                  <Edit className="size-4" />
                </Button>
              )}

              {userRole === 'admin' && onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(course.id)}
                  disabled={deleting}
                  className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}