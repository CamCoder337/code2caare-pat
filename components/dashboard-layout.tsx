'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Heart, 
  Stethoscope, 
  User, 
  LogOut, 
  Menu, 
  X,
  Home,
  MessageSquare,
  Calendar,
  Settings 
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: 'patient' | 'professional';
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const profileData = user?.profile as any;

  const patientNavItems = [
    { icon: Home, label: 'Accueil', href: '/dashboard/patient' },
    { icon: MessageSquare, label: 'Mes Feedbacks', href: '/dashboard/patient/feedback' },
    { icon: Calendar, label: 'Rendez-vous', href: '/dashboard/patient/appointments' },
    { icon: Settings, label: 'Paramètres', href: '/dashboard/patient/settings' },
  ];

  const professionalNavItems = [
    { icon: Home, label: 'Accueil', href: '/dashboard/professional' },
    { icon: MessageSquare, label: 'Feedbacks Patients', href: '/dashboard/professional/feedback' },
    { icon: Calendar, label: 'Rendez-vous', href: '/dashboard/professional/appointments' },
    { icon: User, label: 'Patients', href: '/dashboard/professional/patients' },
    { icon: Settings, label: 'Paramètres', href: '/dashboard/professional/settings' },
  ];

  const navItems = userType === 'patient' ? patientNavItems : professionalNavItems;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-col lg:sticky lg:top-0 lg:h-screen
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="bg-primary rounded-full p-2">
                {userType === 'patient' ? (
                  <Heart className="h-5 w-5 text-white" />
                ) : (
                  <Stethoscope className="h-5 w-5 text-white" />
                )}
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">DGH Platform</h1>
                <p className="text-xs text-gray-500 capitalize">{userType}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-500 text-white font-semibold">
                  {profileData?.first_name?.charAt(0)?.toUpperCase()}{profileData?.last_name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profileData?.first_name && profileData?.last_name 
                    ? `${profileData.first_name} ${profileData.last_name}`
                    : user?.username
                  }
                </p>
                {userType === 'professional' && (
                  <>
                    <p className="text-xs text-blue-600 truncate">
                      {profileData?.specialization}
                    </p>
                    {profileData?.license_number && (
                      <p className="text-xs text-gray-500 truncate">
                        Licence: {profileData.license_number}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  router.push(item.href);
                  setSidebarOpen(false);
                }}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden lg:block">
              <h2 className="text-xl font-semibold text-gray-900">
                Tableau de bord {userType === 'patient' ? 'Patient' : 'Professionnel'}
              </h2>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}