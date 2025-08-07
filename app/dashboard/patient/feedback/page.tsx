'use client';

import { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFeedbackStore } from '@/store/feedback-store';
import { 
  MessageSquare, 
  Plus, 
  Filter,
  Calendar,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Search
} from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateFeedbackForm } from '@/components/feedback/create-feedback-form';

export default function PatientFeedbackPage() {
  const { 
    feedbacks, 
    isLoading, 
    error, 
    filters,
    fetchMyFeedbacks, 
    setFilters,
    clearFilters,
    clearError 
  } = useFeedbackStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);

  // Fonction utilitaire pour formater les dates en sécurité
  const formatSafeDate = (dateString?: string, formatString: string = 'dd MMM yyyy à HH:mm'): string => {
    if (!dateString) return 'Date inconnue';
    
    try {
      // Essayer de parser la date ISO
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, formatString, { locale: fr });
      }
      
      // Essayer de créer une date directement
      const fallbackDate = new Date(dateString);
      if (isValid(fallbackDate)) {
        return format(fallbackDate, formatString, { locale: fr });
      }
      
      return 'Date invalide';
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', dateString, error);
      return 'Date invalide';
    }
  };

  useEffect(() => {
    fetchMyFeedbacks();
  }, [fetchMyFeedbacks]);

  const handleFilterChange = (key: string, value: string) => {
    if (value === 'all' || value === '') {
      const newFilters = { ...filters };
      delete newFilters[key as keyof typeof filters];
      setFilters(newFilters);
    } else {
      setFilters({ [key]: value });
    }
    fetchMyFeedbacks({ ...filters, [key]: value === 'all' ? undefined : value });
  };

  const getSentimentBadge = (sentiment?: string) => {
    if (!sentiment) return <Badge variant="secondary">En traitement</Badge>;
    
    switch (sentiment) {
      case 'positive':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Positif</Badge>;
      case 'negative':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Négatif</Badge>;
      case 'neutral':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Neutre</Badge>;
      default:
        return <Badge variant="secondary">En traitement</Badge>;
    }
  };

  const getProcessingStatus = (isProcessed: boolean, processedAt?: string) => {
    if (isProcessed && processedAt) {
      return (
        <div className="flex items-center text-sm text-green-600">
          <CheckCircle className="h-4 w-4 mr-1" />
          Traité le {formatSafeDate(processedAt, 'dd/MM/yyyy à HH:mm')}
        </div>
      );
    }
    return (
      <div className="flex items-center text-sm text-orange-600">
        <Clock className="h-4 w-4 mr-1" />
        En cours de traitement...
      </div>
    );
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (error) {
    return (
      <AuthGuard allowedRoles={['patient']}>
        <DashboardLayout userType="patient">
          <div className="p-6">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
                <Button 
                  onClick={() => {
                    clearError();
                    fetchMyFeedbacks();
                  }}
                  className="mt-3"
                  variant="outline"
                >
                  Réessayer
                </Button>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={['patient']}>
      <DashboardLayout userType="patient">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mes Feedbacks</h1>
              <p className="text-gray-600">
                Gérez vos retours et suivez leur traitement
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nouveau Feedback</span>
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filtres</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Rechercher
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Description..."
                      className="pl-10"
                      value={filters.search || ''}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Note
                  </label>
                  <Select
                    value={filters.rating?.toString() || 'all'}
                    onValueChange={(value) => handleFilterChange('rating', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les notes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les notes</SelectItem>
                      <SelectItem value="5">5 étoiles</SelectItem>
                      <SelectItem value="4">4 étoiles</SelectItem>
                      <SelectItem value="3">3 étoiles</SelectItem>
                      <SelectItem value="2">2 étoiles</SelectItem>
                      <SelectItem value="1">1 étoile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Statut
                  </label>
                  <Select
                    value={filters.is_processed?.toString() || 'all'}
                    onValueChange={(value) => handleFilterChange('is_processed', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="true">Traités</SelectItem>
                      <SelectItem value="false">En traitement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      clearFilters();
                      fetchMyFeedbacks();
                    }}
                    className="w-full"
                  >
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedbacks List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : feedbacks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun feedback trouvé
                </h3>
                <p className="text-gray-600 mb-4">
                  Vous n'avez pas encore créé de feedback. Commencez par partager votre expérience !
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer mon premier feedback
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <Card key={feedback.feedback_id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center space-x-1">
                            {getRatingStars(feedback.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {feedback.rating}/5
                          </span>
                          {getSentimentBadge(feedback.sentiment)}
                        </div>
                        
                        <p className="text-gray-900 mb-3 leading-relaxed">
                          {feedback.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {formatSafeDate(feedback.created_at)}
                              </span>
                            </div>
                            {feedback.theme_name && (
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-4 w-4" />
                                <span>{feedback.theme_name}</span>
                              </div>
                            )}
                          </div>
                          
                          {getProcessingStatus(feedback.is_processed, feedback.processed_at)}
                        </div>

                        {feedback.sentiment && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span>Analyse de sentiment :</span>
                              <div className="flex space-x-3">
                                {feedback.sentiment_positive_score !== undefined && feedback.sentiment_positive_score !== null && (
                                  <span className="text-green-600">
                                    Positif: {Math.round(Number(feedback.sentiment_positive_score) || 0)}%
                                  </span>
                                )}
                                {feedback.sentiment_negative_score !== undefined && feedback.sentiment_negative_score !== null && (
                                  <span className="text-red-600">
                                    Négatif: {Math.round(Number(feedback.sentiment_negative_score) || 0)}%
                                  </span>
                                )}
                                {feedback.sentiment_neutral_score !== undefined && feedback.sentiment_neutral_score !== null && (
                                  <span className="text-gray-600">
                                    Neutre: {Math.round(Number(feedback.sentiment_neutral_score) || 0)}%
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Create Feedback Form Modal */}
          {showCreateForm && (
            <CreateFeedbackForm
              onClose={() => setShowCreateForm(false)}
              onSuccess={() => {
                fetchMyFeedbacks(); // Rafraîchir la liste
              }}
            />
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}