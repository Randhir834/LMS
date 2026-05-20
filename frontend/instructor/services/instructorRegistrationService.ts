import api from './api';

export interface InstructorRegistrationData {
  fullName: string;
  qualification: string;
  subjectExpertise: string;
  phoneNumber: string;
  role?: 'instructor' | 'student';
}

export const instructorRegistrationService = {
  registerInstructor: async (data: InstructorRegistrationData) => {
    const response = await api.post('/instructor-registrations', {
      ...data,
      role: data.role || 'instructor',
    });
    return response.data;
  },
};
