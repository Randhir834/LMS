'use client';

import { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, BookOpen, Video, 
  ClipboardList, Award, ChevronRight, Camera, Bell, 
  Shield, Settings, HelpCircle, LogOut, Loader2, Star, Target, Trophy, Trash2, Save
} from 'lucide-react';
import StudentDashboardLayout from '@/components/layouts/StudentDashboardLayout';
import { userService, UserProfile } from '@/services/userService';
import { dashboardService, DashboardData } from '@/services/dashboardService';

function formatDateOfBirth(date?: string) {
  if (!date) return 'N/A';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'N/A';
  return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogout = () => {
    userService.logout();
  };

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    dob: 'N/A',
    grade: 'N/A',
    school: 'N/A',
    parentName: 'N/A',
    phone: 'N/A',
    location: 'N/A'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, dashData] = await Promise.all([
          userService.getProfile(),
          dashboardService.getDashboardData()
        ]);
        setUser(profile);
        setDashboardData(dashData);
        setFormData(prev => ({
          ...prev,
          name: profile.name,
          dob: formatDateOfBirth(profile.date_of_birth),
          grade: profile.grade || 'N/A',
          school: profile.school || 'N/A',
          parentName: profile.parent_guardian_name || 'N/A',
          phone: profile.phone || 'N/A',
          location: profile.location || 'N/A'
        }));
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) return;
    setSaving(true);
    try {
      const updatedUser = await userService.updateProfile({
        name: formData.name,
        school: formData.school === 'N/A' ? undefined : formData.school,
        grade: formData.grade === 'N/A' ? undefined : formData.grade,
        parent_guardian_name: formData.parentName === 'N/A' ? undefined : formData.parentName,
        phone: formData.phone === 'N/A' ? undefined : formData.phone,
        location: formData.location === 'N/A' ? undefined : formData.location
      });
      setUser(updatedUser);
      setFormData(prev => ({
        ...prev,
        name: updatedUser.name,
        grade: updatedUser.grade || 'N/A',
        school: updatedUser.school || 'N/A',
        parentName: updatedUser.parent_guardian_name || 'N/A',
        phone: updatedUser.phone || 'N/A',
        location: updatedUser.location || 'N/A'
      }));
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update profile.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <StudentDashboardLayout>
        <div className="flex-1 flex items-center justify-center h-[calc(100vh-73px)]">
          <div className="text-center">
            <Loader2 className="size-8 animate-spin text-[#1B8A44] mx-auto mb-4" />
            <p className="text-[#64748B]">Loading profile...</p>
          </div>
        </div>
      </StudentDashboardLayout>
    );
  }

  const displayName = user?.name || 'Student';
  const role = user?.role || 'student';
  const email = user?.email || '';
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';

  const stats = [
    { label: 'Enrolled Courses', value: dashboardData?.stats.enrolledCourses || 0, icon: BookOpen, color: 'text-[#1B8A44]', bg: 'bg-[#DCFCE7]' },
    { label: 'Live Classes Attended', value: dashboardData?.stats.liveClasses || 0, icon: Video, color: 'text-[#D97706]', bg: 'bg-[#FEF3C7]' },
    { label: 'Assignments Completed', value: dashboardData?.stats.assignments || 0, icon: ClipboardList, color: 'text-[#2563EB]', bg: 'bg-[#DBEAFE]' },
    { label: 'Certificates Earned', value: 0, icon: Award, color: 'text-[#9333EA]', bg: 'bg-[#F3E8FF]' },
  ];

  const courses = dashboardData?.courses || [];

  return (
    <StudentDashboardLayout>
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
        <div className="mb-6">
          <h2 className="text-[#64748B] text-sm mb-4">Manage your personal information and account settings</h2>
          
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.includes('successfully') ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEE2E2] text-[#DC2626]'} animate-in fade-in slide-in-from-top-4`}>
              {message}
            </div>
          )}

        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-8 space-y-4 md:space-y-6">
            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 md:p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 text-center md:text-left">
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#F0FDF4]">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1B8A44&color=fff&size=256`} 
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-1 right-1 w-8 h-8 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center text-[#64748B] hover:text-[#1B8A44] shadow-sm transition-colors">
                    <Camera size={16} />
                  </button>
                </div>

                <div className="flex-1 w-full">
                  <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                      <input 
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="text-xl md:text-2xl font-bold text-[#1E293B] bg-transparent border-none focus:ring-0 p-0 w-full md:w-auto text-center md:text-left"
                      />
                      <span className="px-3 py-0.5 bg-[#DCFCE7] text-[#1B8A44] text-xs font-semibold rounded-md capitalize">
                        {role}
                      </span>
                    </div>
                    {formData.name !== user?.name && (
                      <button 
                        onClick={handleUpdateProfile}
                        disabled={saving}
                        className="w-full md:w-auto px-4 py-2 bg-[#1B8A44] text-white text-sm font-medium rounded-lg hover:bg-[#166534] transition-colors flex items-center justify-center gap-2"
                      >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Save Changes
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 md:gap-x-12">
                    <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-12">
                      <div className="flex items-center gap-2 w-28 sm:w-32">
                        <Calendar size={16} className="text-[#94A3B8] shrink-0" />
                        <span className="text-sm text-[#64748B]">Date of Birth</span>
                      </div>
                      <span className="text-sm font-medium text-[#1E293B] whitespace-nowrap">{formData.dob}</span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-12">
                      <div className="flex items-center gap-2 w-28 sm:w-32">
                        <Award size={16} className="text-[#94A3B8] shrink-0" />
                        <span className="text-sm text-[#64748B]">Grade</span>
                      </div>
                      <span className="text-sm font-medium text-[#1E293B] whitespace-nowrap">{formData.grade}</span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-12">
                      <div className="flex items-center gap-2 w-28 sm:w-32">
                        <BookOpen size={16} className="text-[#94A3B8] shrink-0" />
                        <span className="text-sm text-[#64748B]">School</span>
                      </div>
                      <span className="text-sm font-medium text-[#1E293B] truncate max-w-[120px] sm:max-w-[150px] whitespace-nowrap">{formData.school}</span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-12">
                      <div className="flex items-center gap-2 w-28 sm:w-32">
                        <User size={16} className="text-[#94A3B8] shrink-0" />
                        <span className="text-sm text-[#64748B]">Parent/Guardian</span>
                      </div>
                      <span className="text-sm font-medium text-[#1E293B] whitespace-nowrap">{formData.parentName}</span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-12">
                      <div className="flex items-center gap-2 w-28 sm:w-32">
                        <Calendar size={16} className="text-[#94A3B8] shrink-0" />
                        <span className="text-sm text-[#64748B]">Member Since</span>
                      </div>
                      <span className="text-sm font-medium text-[#1E293B] whitespace-nowrap">{joinDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-4 md:p-5">
                  <div className="flex items-center gap-3 md:gap-4 mb-3">
                    <div className={`w-8 h-8 md:w-10 md:h-10 ${stat.bg} rounded-full flex items-center justify-center`}>
                      <stat.icon size={16} className={stat.color} />
                    </div>
                    <span className="text-lg md:text-xl font-bold text-[#1E293B]">{stat.value}</span>
                  </div>
                  <p className="text-[10px] md:text-xs text-[#64748B] mb-2">{stat.label}</p>
                  <button className="text-[10px] md:text-[11px] text-[#1B8A44] font-semibold flex items-center gap-1">
                    View all <ChevronRight size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Recently Enrolled Courses */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[#1E293B]">Recently Enrolled Courses</h3>
                <button className="text-sm text-[#1B8A44] font-medium hover:underline">View All</button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4">
                {courses.length > 0 ? courses.slice(0, 4).map((course, i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-[16/9] sm:aspect-[4/3] bg-[#F8FAFC] rounded-xl overflow-hidden relative flex items-center justify-center">
                      <div className="text-3xl font-bold text-[#1B8A44]">{course.title[0]}</div>
                    </div>
                    <div className="px-1">
                      <h4 className="text-sm font-semibold text-[#1E293B] mb-2 line-clamp-1">{course.title}</h4>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-[#1B8A44]">{course.progress}% Complete</span>
                      </div>
                      <div className="w-full bg-[#F1F5F9] rounded-full h-1.5 mb-3">
                        <div className="bg-[#1B8A44] h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                      </div>
                      <button className="w-full py-2 bg-[#F0FDF4] text-[#1B8A44] text-[11px] font-bold rounded-lg border border-[#DCFCE7] hover:bg-[#DCFCE7] transition-colors">
                        Continue Learning
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-8 text-center text-[#64748B]">No courses enrolled yet</div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="col-span-12 lg:col-span-4 space-y-4 md:space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 md:p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-[#1E293B]">Contact Information</h3>
                <button className="text-[11px] text-[#1B8A44] font-bold">Edit</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F8FAFC] rounded-lg flex items-center justify-center text-[#94A3B8]">
                    <Mail size={16} />
                  </div>
                  <span className="text-sm text-[#64748B] break-all">{email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F8FAFC] rounded-lg flex items-center justify-center text-[#94A3B8]">
                    <Phone size={16} />
                  </div>
                  <span className="text-sm text-[#64748B]">{formData.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F8FAFC] rounded-lg flex items-center justify-center text-[#94A3B8]">
                    <MapPin size={16} />
                  </div>
                  <span className="text-sm text-[#64748B] line-clamp-1">{formData.location}</span>
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 md:p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-[#1E293B]">Achievements</h3>
                <button className="text-[11px] text-[#1B8A44] font-bold">View All</button>
              </div>
              <div className="space-y-5">
                {dashboardData?.achievements && dashboardData.achievements.length > 0 ? dashboardData.achievements.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 bg-[#DCFCE7] rounded-lg flex items-center justify-center`}>
                        {item.icon === 'star' && <Star size={18} className="text-[#1B8A44]" />}
                        {item.icon === 'target' && <Target size={18} className="text-[#1B8A44]" />}
                        {item.icon === 'award' && <Award size={18} className="text-[#1B8A44]" />}
                        {item.icon === 'trophy' && <Trophy size={18} className="text-[#1B8A44]" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1E293B]">{item.title}</h4>
                        <p className="text-[11px] text-[#64748B]">{item.description}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-[#64748B] text-xs py-4">No achievements yet</div>
                )}
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 md:p-6">
              <h3 className="font-bold text-[#1E293B] mb-5">Account Settings</h3>
              <div className="space-y-2">
                {[
                  { label: 'Change Password', icon: Shield },
                  { label: 'Notification Preferences', icon: Bell },
                  { label: 'Privacy Settings', icon: Settings },
                ].map((item, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-3 hover:bg-[#F8FAFC] rounded-xl transition-colors group">
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className="text-[#94A3B8] group-hover:text-[#1B8A44]" />
                      <span className="text-sm text-[#64748B] font-medium">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-[#CBD5E1]" />
                  </button>
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-3 hover:bg-[#FEF2F2] rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={18} className="text-[#DC2626] opacity-80" />
                    <span className="text-sm text-[#DC2626] font-semibold">Logout</span>
                  </div>
                  <ChevronRight size={16} className="text-[#DC2626] opacity-50" />
                </button>

                <button className="w-full flex items-center justify-between p-3 hover:bg-[#FFF5F5] rounded-xl transition-colors group">
                  <div className="flex items-center gap-3">
                    <Trash2 size={18} className="text-[#DC2626] opacity-50" />
                    <span className="text-sm text-[#DC2626] font-medium">Deactivate Account</span>
                  </div>
                  <ChevronRight size={16} className="text-[#DC2626] opacity-30" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  );
}

