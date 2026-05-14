'use client';

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { User, Mail, Phone, MapPin, Award, GraduationCap } from 'lucide-react';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  specialization?: string;
  qualifications?: string;
  role: string;
}

export default function InstructorDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Simulate logged-in instructor (in real app, this would come from auth)
  const currentUserId = 22; // This should match the user ID you're testing with

  useEffect(() => {
    // Mock initial profile data (in real app, this would be fetched from API)
    setProfile({
      id: currentUserId,
      name: 'Instructor Name',
      email: 'instructor@example.com',
      phone: '123-456-7890',
      location: 'City, State',
      specialization: 'Computer Science',
      qualifications: 'PhD in Computer Science, 10+ years experience',
      role: 'instructor'
    });

    // Connect to Socket.IO server
    const newSocket = io('http://localhost:5001', {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('[Instructor] Connected to server');
      setIsConnected(true);
      
      // Join user-specific room
      newSocket.emit('join-user-room', currentUserId);
    });

    newSocket.on('disconnect', () => {
      console.log('[Instructor] Disconnected from server');
      setIsConnected(false);
    });

    // Listen for profile updates
    newSocket.on('profile-updated', (data) => {
      console.log('[Instructor] Profile update received:', data);
      
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
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
          className="fixed top-4 right-4 bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse"
          style={{ top: `${1 + index * 4}rem` }}
        >
          🔄 {notification}
        </div>
      ))}

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-12 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <User size={48} className="text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{profile?.name || 'Loading...'}</h2>
                <p className="text-purple-100 text-lg">{profile?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                  Instructor
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
                  <Mail className="text-purple-500" size={20} />
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

              {/* Instructor Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <Award className="text-purple-500" size={20} />
                  <div>
                    <p className="text-sm text-purple-600">Specialization</p>
                    <p className="font-semibold text-purple-900">{profile?.specialization || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg">
                  <GraduationCap className="text-indigo-500 mt-1" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-indigo-600">Qualifications</p>
                    <p className="font-semibold text-indigo-900 leading-relaxed">
                      {profile?.qualifications || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Update Info */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-purple-900 mb-2">Real-time Updates</h4>
          <p className="text-purple-700">
            This profile updates automatically when an administrator makes changes. 
            No page refresh needed! The connection status is shown in the top right.
          </p>
        </div>
      </div>
    </div>
  );
}