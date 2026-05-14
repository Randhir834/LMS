'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { User, Mail, Phone, MapPin, GraduationCap, BookOpen, Users, Calendar } from 'lucide-react';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  grade?: string;
  school?: string;
  parent_guardian_name?: string;
  date_of_birth?: string;
  age?: number;
  role: string;
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Simulate logged-in student (in real app, this would come from auth)
  const currentUserId = 22; // This should match the user ID you're testing with

  useEffect(() => {
    // Mock initial profile data (in real app, this would be fetched from API)
    setProfile({
      id: currentUserId,
      name: 'Student Name',
      email: 'student@example.com',
      phone: '123-456-7890',
      location: 'City, State',
      grade: '10th Grade',
      school: 'Example High School',
      parent_guardian_name: 'Parent Name',
      date_of_birth: '2008-01-15',
      age: 16,
      role: 'student'
    });

    // Connect to Socket.IO server
    const newSocket = io('http://localhost:5001', {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('[Student] Connected to server');
      setIsConnected(true);
      
      // Join user-specific room
      newSocket.emit('join-user-room', currentUserId);
    });

    newSocket.on('disconnect', () => {
      console.log('[Student] Disconnected from server');
      setIsConnected(false);
    });

    // Listen for profile updates
    newSocket.on('profile-updated', (data) => {
      console.log('[Student] Profile update received:', data);
      
      if (data.user) {
        setProfile(data.user);
        
        // Add notification
        const message = data.message || 'Your profile has been updated!';
        setNotifications(prev => [...prev, message]);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
          setNotifications(prev => prev.slice(1));
        }, 5000);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [currentUserId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.map((notification, index) => (
        <div
          key={index}
          className="fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse"
          style={{ top: `${1 + index * 4}rem` }}
        >
          🔄 {notification}
        </div>
      ))}

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-12 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <User size={48} className="text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{profile?.name || 'Loading...'}</h2>
                <p className="text-blue-100 text-lg">{profile?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                  Student
                </span>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="text-blue-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">{profile?.email || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="text-green-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold">{profile?.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="text-red-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{profile?.location || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Student Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <GraduationCap className="text-blue-500" size={20} />
                  <div>
                    <p className="text-sm text-blue-600">Grade</p>
                    <p className="font-semibold text-blue-900">{profile?.grade || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <BookOpen className="text-green-500" size={20} />
                  <div>
                    <p className="text-sm text-green-600">School</p>
                    <p className="font-semibold text-green-900">{profile?.school || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                  <Users className="text-orange-500" size={20} />
                  <div>
                    <p className="text-sm text-orange-600">Parent/Guardian</p>
                    <p className="font-semibold text-orange-900">{profile?.parent_guardian_name || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <Calendar className="text-purple-500" size={20} />
                  <div>
                    <p className="text-sm text-purple-600">Date of Birth</p>
                    <p className="font-semibold text-purple-900">
                      {formatDate(profile?.date_of_birth)} 
                      {profile?.age && ` (${profile.age} years old)`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Update Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-2">Real-time Updates</h4>
          <p className="text-blue-700">
            This profile updates automatically when an administrator makes changes. 
            No page refresh needed! The connection status is shown in the top right.
          </p>
        </div>
      </div>
    </div>
  );
}