'use client';

import { useEffect, useMemo, useState, use } from 'react';
import Link from 'next/link';
import { Loader2, Users, BookOpen, CheckCircle2, CreditCard, Play, Clock, Star, Award, FileText, Video } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { courseService } from '@/services/courseService';
import { enrollmentService } from '@/services/enrollmentService';
import { paymentService } from '@/services/paymentService';
import type { Course } from '@/types';

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const courseId = Number(id);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [courseRes, enrollRes] = await Promise.all([
          courseService.getCourseById(courseId),
          enrollmentService.checkEnrollment(courseId).catch(() => ({ enrolled: false })),
        ]);
        setCourse(courseRes.course || null);
        setEnrolled(!!enrollRes.enrolled);
        setEnrollmentData(enrollRes);
      } catch (error) {
        console.error('Failed to fetch course:', error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [courseId]);

  const instructorNames = useMemo(() => {
    if (!course?.instructors?.length) return course?.instructor_name || 'No instructor';
    return course.instructors.map((i) => i.name).join(', ');
  }, [course]);

  const handleEnroll = async () => {
    if (!course) return;

    try {
      setEnrollLoading(true);
      
      if (course.price > 0) {
        setShowPayment(true);
      } else {
        await enrollmentService.enrollCourse(courseId);
        setEnrolled(true);
        alert('Successfully enrolled in the free course!');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to enroll';
      alert(msg);
    } finally {
      setEnrollLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!course) return;

    try {
      setEnrollLoading(true);
      
      const enrollResult = await enrollmentService.enrollCourse(courseId, paymentMethod);
      
      if (enrollResult.payment) {
        // Handle payment redirect or confirmation
        alert('Payment successful! You are now enrolled in the course.');
        setEnrolled(true);
        setShowPayment(false);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Payment failed';
      alert(msg);
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-[#1B8A44]" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <BookOpen className="size-12 text-[#CBD5E1] mx-auto mb-3" />
              <p className="text-sm text-[#64748B]">Course not found.</p>
              <Link href="/student/courses" className="inline-block mt-4">
                <Button variant="outline">Back to Courses</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-6">
      {/* Course Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Info */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Title and Status */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-2">
                      {course.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-[#64748B]">
                      <div className="flex items-center gap-1">
                        <Users className="size-4" />
                        <span>{instructorNames}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="size-4" />
                        <span>{course.duration_value} {course.duration_unit}</span>
                      </div>
                      {course.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="size-4 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      course.level === 'beginner' ? 'bg-[#EFF6FF] text-[#1E40AF]' :
                      course.level === 'intermediate' ? 'bg-[#FEF3C7] text-[#D97706]' :
                      'bg-[#FEE2E2] text-[#DC2626]'
                    }`}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </span>
                    {enrolled && (
                      <span className="px-3 py-1 text-sm font-medium bg-[#DCFCE7] text-[#1B8A44] rounded-full">
                        Enrolled
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar for Enrolled Students */}
                {enrolled && enrollmentData?.progress !== undefined && (
                  <div className="bg-[#F8FAFC] p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#1E293B]">Course Progress</span>
                      <span className="text-sm text-[#64748B]">{Math.round(enrollmentData.progress)}%</span>
                    </div>
                    <div className="w-full bg-[#E2E8F0] rounded-full h-3">
                      <div 
                        className="bg-[#1B8A44] h-3 rounded-full transition-all duration-300"
                        style={{ width: `${enrollmentData.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Description */}
                {course.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#1E293B] mb-2">About This Course</h3>
                    <p className="text-[#64748B] leading-relaxed">{course.description}</p>
                  </div>
                )}

                {/* What You'll Learn */}
                {course.what_you_learn && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#1E293B] mb-3">What You'll Learn</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {course.what_you_learn.split('\n').filter(item => item.trim()).map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="size-4 text-[#1B8A44] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-[#64748B]">{item.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {course.requirements && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#1E293B] mb-3">Requirements</h3>
                    <div className="space-y-2">
                      {course.requirements.split('\n').filter(item => item.trim()).map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="size-2 bg-[#64748B] rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-[#64748B]">{item.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Course Content Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-[#64748B]">
                  <span>{course.total_sections || 0} sections • {course.total_lessons || 0} lessons</span>
                  <span>Total length: {course.duration_value} {course.duration_unit}</span>
                </div>
                
                {/* Sample Content Structure */}
                <div className="space-y-3">
                  <div className="border border-[#E2E8F0] rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Video className="size-5 text-[#64748B]" />
                        <div>
                          <h4 className="font-medium text-[#1E293B]">Introduction</h4>
                          <p className="text-sm text-[#64748B]">Get started with the basics</p>
                        </div>
                      </div>
                      <span className="text-sm text-[#64748B]">5 min</span>
                    </div>
                  </div>
                  
                  <div className="border border-[#E2E8F0] rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="size-5 text-[#64748B]" />
                        <div>
                          <h4 className="font-medium text-[#1E293B]">Course Materials</h4>
                          <p className="text-sm text-[#64748B]">Downloadable resources</p>
                        </div>
                      </div>
                      <span className="text-sm text-[#64748B]">PDF</span>
                    </div>
                  </div>
                  
                  {!enrolled && (
                    <div className="text-center py-4 text-sm text-[#64748B]">
                      <p>Enroll to see full course content</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Enrollment Card */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Price */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1E293B]">
                    {course.price === 0 ? 'Free' : `₹${course.price.toLocaleString()}`}
                  </div>
                  {course.price > 0 && (
                    <p className="text-sm text-[#64748B] mt-1">One-time payment</p>
                  )}
                </div>

                {/* Enrollment Button */}
                {enrolled ? (
                  <Link href={`/student/course/${courseId}/learn`}>
                    <Button className="w-full flex items-center gap-2">
                      <Play className="size-4" />
                      Continue Learning
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-3">
                    {!showPayment ? (
                      <Button 
                        onClick={handleEnroll}
                        disabled={enrollLoading}
                        className="w-full flex items-center gap-2"
                      >
                        {enrollLoading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : course.price === 0 ? (
                          <>
                            <BookOpen className="size-4" />
                            Enroll for Free
                          </>
                        ) : (
                          <>
                            <CreditCard className="size-4" />
                            Enroll Now
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-[#374151] mb-2">
                            Payment Method
                          </label>
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B8A44]"
                          >
                            <option value="credit_card">Credit Card</option>
                            <option value="debit_card">Debit Card</option>
                            <option value="upi">UPI</option>
                            <option value="net_banking">Net Banking</option>
                          </select>
                        </div>
                        
                        <Button 
                          onClick={handlePayment}
                          disabled={enrollLoading}
                          className="w-full flex items-center gap-2"
                        >
                          {enrollLoading ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <>
                              <CreditCard className="size-4" />
                              Pay ₹{course.price.toLocaleString()}
                            </>
                          )}
                        </Button>
                        
                        <Button 
                          variant="outline"
                          onClick={() => setShowPayment(false)}
                          className="w-full"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Course Features */}
                <div className="space-y-3 pt-4 border-t border-[#E2E8F0]">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="size-4 text-[#64748B]" />
                    <span className="text-[#64748B]">Self-paced learning</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Award className="size-4 text-[#64748B]" />
                    <span className="text-[#64748B]">Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="size-4 text-[#64748B]" />
                    <span className="text-[#64748B]">{course.enrollment_count || 0} students enrolled</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructor Info */}
          {course.instructors && course.instructors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Instructor{course.instructors.length > 1 ? 's' : ''}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.instructors.map((instructor) => (
                    <div key={instructor.id} className="flex items-start gap-3">
                      <div className="size-12 bg-[#1B8A44]/10 rounded-full flex items-center justify-center">
                        <Users className="size-6 text-[#1B8A44]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-[#1E293B]">{instructor.name}</h4>
                        <p className="text-sm text-[#64748B]">{instructor.email}</p>
                        {instructor.is_primary && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-[#1B8A44]/10 text-[#1B8A44] rounded">
                            Primary Instructor
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}