import api from './api';

export interface AttendanceStudent {
  id: number;
  name: string;
  email: string;
  enrolled_at: string;
  progress: number;
}

export interface AttendanceRecord {
  student_id: number;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export interface AttendanceSubmission {
  course_id: number;
  date: string;
  students: AttendanceRecord[];
}

export const attendanceService = {
  getInstructorCourses: async () => {
    const response = await api.get('/attendance/courses');
    return response.data;
  },

  getCourseStudents: async (courseId: number) => {
    const response = await api.get(`/attendance/courses/${courseId}/students`);
    return response.data;
  },

  getAttendanceByDate: async (courseId: number, date: string) => {
    const response = await api.get(`/attendance/courses/${courseId}?date=${date}`);
    return response.data;
  },

  markAttendance: async (attendanceData: AttendanceSubmission) => {
    const response = await api.post('/attendance/mark', attendanceData);
    return response.data;
  },

  getAttendanceReports: async (filters?: {
    course_id?: number;
    student_id?: number;
    start_date?: string;
    end_date?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/attendance/reports${query}`);
    return response.data;
  },

  getCourseStats: async (courseId: number, studentId?: number) => {
    const params = studentId ? `?studentId=${studentId}` : '';
    const response = await api.get(`/attendance/courses/${courseId}/stats${params}`);
    return response.data;
  },
};