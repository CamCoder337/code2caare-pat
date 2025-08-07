'use client';

import { AuthGuard } from '@/components/auth-guard';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { 
  MessageSquare, 
  Calendar, 
  Heart, 
  Activity,
  Plus,
  Clock,
  CheckCircle 
} from 'lucide-react';

export default function PatientDashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const profileData = user?.profile as any;

  const quickActions = [
    {
      title: 'Nouveau Feedback',
      description: 'Partager vos symptômes ou préoccupations',
      icon: MessageSquare,
      action: () => router.push('/dashboard/patient/feedback'),
      color: 'bg-blue-500',
    },
    {
      title: 'Prendre RDV',
      description: 'Planifier un rendez-vous médical',
      icon: Calendar,
      action: () => console.log('Navigate to appointments'),
      color: 'bg-green-500',
    },
    {
      title: 'Suivi Santé',
      description: 'Consulter vos métriques de santé',
      icon: Activity,
      action: () => console.log('Navigate to health tracking'),
      color: 'bg-purple-500',
    },
  ];

  const recentFeedbacks = [
    {
      id: 1,
      subject: 'Douleur abdominale',
      status: 'En cours de traitement',
      date: '2024-01-15',
      urgency: 'Moyenne',
    },
    {
      id: 2,
      subject: 'Consultation de routine',
      status: 'Terminé',
      date: '2024-01-10',
      urgency: 'Faible',
    },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Mbarga',
      specialty: 'Cardiologie',
      date: '2024-01-20',
      time: '14:30',
    },
  ];

  return (
    <AuthGuard allowedRoles={['patient']}>
      <DashboardLayout userType="patient">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <Heart className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Bonjour, {profileData?.first_name} {profileData?.last_name} !
                </h1>
                <p className="text-blue-100">
                  Comment vous sentez-vous aujourd'hui ?
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow p-4 gap-2" onClick={action.action}>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`${action.color} rounded-full p-2`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">{action.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Feedbacks */}
            <Card className="p-4 gap-4">
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Mes feedbacks récents</h3>
              </div>
              <div>
                <div className="space-y-3">
                  {recentFeedbacks.map((feedback) => (
                    <div key={feedback.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{feedback.subject}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            feedback.status === 'Terminé' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {feedback.status === 'Terminé' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                            {feedback.status}
                          </span>
                          <span className="text-xs text-gray-500">{feedback.date}</span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        feedback.urgency === 'Moyenne' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {feedback.urgency}
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => router.push('/dashboard/patient/feedback')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau feedback
                </Button>
              </div>
            </Card>

            {/* Upcoming Appointments */}
            <Card className="p-4 gap-4">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold">Rendez-vous à venir</h3>
              </div>
              <div>
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{appointment.doctor}</h4>
                          <p className="text-sm text-gray-600">{appointment.specialty}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{appointment.date}</p>
                          <p className="text-xs text-gray-500">{appointment.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Prendre rendez-vous
                </Button>
              </div>
            </Card>
          </div>

          {/* Health Status */}
          <Card className="p-4 gap-4">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-semibold">Aperçu de votre santé</h3>
            </div>
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-gray-600">Feedbacks actifs</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">1</div>
                  <div className="text-sm text-gray-600">RDV programmé</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">7</div>
                  <div className="text-sm text-gray-600">Jours depuis dernier RDV</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">85%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}