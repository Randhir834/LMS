import api from './api';

export interface CourseEnrollment {
  id: number;
  user_id: number;
  course_id: number;
  status: 'active' | 'completed' | 'cancelled';
  progress: number;
  enrolled_at: string;
  completed_at?: string;
  student_name: string;
  student_email: string;
  student_phone?: string;
  date_of_birth?: string;
  grade?: string;
  completed_lessons: number;
  total_lessons: number;
}

export interface EnrollmentStats {
  total_students: number;
  active_students: number;
  completed_students: number;
  students_completed_course: number;
  average_progress: number;
  new_enrollments_week: number;
  new_enrollments_month: number;
}

export const enrollmentService = {
  getCourseEnrollments: async (courseId: number, filters?: {
    status?: string;
    search?: string;
    sort_by?: string;
    sort_order?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/enrollments/course/${courseId}${query}`);
    return response.data;
  },
};
