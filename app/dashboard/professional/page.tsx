'use client';

import { AuthGuard } from '@/components/auth-guard';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth-store';
import { 
  Stethoscope, 
  Users, 
  MessageSquare, 
  Calendar,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

export default function ProfessionalDashboardPage() {
  const { user } = useAuthStore();
  const profileData = user?.profile as any;

  const todayStats = [
    {
      title: 'Patients aujourd\'hui',
      value: '12',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Feedbacks en attente',
      value: '8',
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'RDV programmés',
      value: '15',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Taux de satisfaction',
      value: '94%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const urgentFeedbacks = [
    {
      id: 1,
      patientName: 'Marie Nguyen',
      subject: 'Douleur thoracique aiguë',
      time: 'Il y a 15 min',
      urgency: 'Urgent',
      patientId: 'P001234',
    },
    {
      id: 2,
      patientName: 'Paul Mbarga',
      subject: 'Fièvre persistante',
      time: 'Il y a 45 min',
      urgency: 'Modéré',
      patientId: 'P001235',
    },
    {
      id: 3,
      patientName: 'Anne Fotso',
      subject: 'Question sur prescription',
      time: 'Il y a 1h',
      urgency: 'Faible',
      patientId: 'P001236',
    },
  ];

  const todayAppointments = [
    {
      id: 1,
      time: '09:00',
      patient: 'Jean Kamdem',
      type: 'Consultation',
      status: 'Terminé',
    },
    {
      id: 2,
      time: '10:30',
      patient: 'Sarah Njoya',
      type: 'Suivi',
      status: 'En cours',
    },
    {
      id: 3,
      time: '14:00',
      patient: 'Michel Biya',
      type: 'Urgence',
      status: 'À venir',
    },
    {
      id: 4,
      time: '15:30',
      patient: 'Grace Ntamack',
      type: 'Consultation',
      status: 'À venir',
    },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Urgent':
        return 'bg-red-100 text-red-800';
      case 'Modéré':
        return 'bg-orange-100 text-orange-800';
      case 'Faible':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Terminé':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'À venir':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Terminé':
        return CheckCircle;
      case 'En cours':
        return Activity;
      case 'À venir':
        return Clock;
      default:
        return Clock;
    }
  };

  return (
    <AuthGuard allowedRoles={['professional']}>
      <DashboardLayout userType="professional">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <Stethoscope className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    Dr. {profileData?.first_name} {profileData?.last_name}
                  </h1>
                  <p className="text-blue-100">
                    {profileData?.specialization} • {profileData?.department_id}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Licence N°</p>
                <p className="font-mono text-sm">{profileData?.license_number}</p>
              </div>
            </div>
          </div>

          {/* Today's Statistics */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Aperçu du jour</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {todayStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`${stat.bgColor} rounded-full p-2`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Urgent Feedbacks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span>Feedbacks prioritaires</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {urgentFeedbacks.map((feedback) => (
                    <div key={feedback.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">{feedback.patientName}</h4>
                            <span className="text-xs text-gray-500">({feedback.patientId})</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{feedback.subject}</p>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(feedback.urgency)}`}>
                              {feedback.urgency}
                            </span>
                            <span className="text-xs text-gray-500">{feedback.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Voir tous les feedbacks
                </Button>
              </CardContent>
            </Card>

            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <span>Rendez-vous d'aujourd'hui</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayAppointments.map((appointment) => {
                    const StatusIcon = getStatusIcon(appointment.status);
                    return (
                      <div key={appointment.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-center">
                              <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                              <p className="text-xs text-gray-500">{appointment.type}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{appointment.patient}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {appointment.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Voir le planning complet
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Button className="h-12 justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Nouveaux feedbacks
                </Button>
                <Button variant="outline" className="h-12 justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Planifier RDV
                </Button>
                <Button variant="outline" className="h-12 justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Mes patients
                </Button>
                <Button variant="outline" className="h-12 justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Statistiques
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}