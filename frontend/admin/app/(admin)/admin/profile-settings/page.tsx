'use client';

import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AdminProfileSettingsPage() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Profile Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input label="Full Name" id="name" />
              <Input label="Email" id="email" type="email" />
              <Button type="submit" className="w-full sm:w-auto">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input label="Current Password" id="current" type="password" />
              <Input label="New Password" id="new" type="password" />
              <Button type="submit" className="w-full sm:w-auto">Update Password</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Account</CardTitle></CardHeader>
          <CardContent>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
