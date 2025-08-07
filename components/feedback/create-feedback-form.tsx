'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFeedbackStore } from '@/store/feedback-store';
import { CreateFeedbackRequest, LANGUAGE_OPTIONS, RATING_OPTIONS, INPUT_TYPE_OPTIONS } from '@/types/feedback';
import { 
  X, 
  Star, 
  MessageSquare, 
  Send,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface CreateFeedbackFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateFeedbackForm({ onClose, onSuccess }: CreateFeedbackFormProps) {
  const { 
    departments, 
    isLoading, 
    error, 
    createFeedback, 
    fetchDepartments,
    clearError 
  } = useFeedbackStore();

  const [isDepartmentsLoading, setIsDepartmentsLoading] = useState(true);

  const [formData, setFormData] = useState<CreateFeedbackRequest>({
    description: '',
    rating: 3,
    department_id: '',
    language: 'fr',
    input_type: 'text'
  });

  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Toujours charger les départements au montage du composant
    const loadDepartments = async () => {
      try {
        setIsDepartmentsLoading(true);
        await fetchDepartments();
      } catch (error) {
        console.error('Erreur lors du chargement des départements:', error);
      } finally {
        setIsDepartmentsLoading(false);
      }
    };
    
    loadDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.description.trim()) {
      errors.description = 'La description est requise';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'La description doit contenir au moins 10 caractères';
    }

    if (!formData.department_id) {
      errors.department_id = 'Veuillez sélectionner un département';
    }

    if (formData.rating < 1 || formData.rating > 5) {
      errors.rating = 'La note doit être entre 1 et 5';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      const result = await createFeedback(formData);
      
      // Afficher un message de succès
      console.log('Feedback créé avec succès:', result);
      
      // Réinitialiser le formulaire
      setFormData({
        description: '',
        rating: 3,
        department_id: '',
        language: 'fr',
        input_type: 'text'
      });
      
      // Callback de succès
      if (onSuccess) {
        onSuccess();
      }
      
      // Fermer le formulaire après un délai
      setTimeout(() => {
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error('Erreur lors de la création du feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    setValidationErrors(prev => ({ ...prev, rating: '' }));
  };

  const getRatingStars = () => {
    const displayRating = hoveredRating || formData.rating;
    
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        className="focus:outline-none"
        onMouseEnter={() => setHoveredRating(i + 1)}
        onMouseLeave={() => setHoveredRating(null)}
        onClick={() => handleRatingClick(i + 1)}
      >
        <Star
          className={`h-6 w-6 transition-colors ${
            i < displayRating 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300 hover:text-yellow-300'
          }`}
        />
      </button>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Nouveau Feedback</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description de votre expérience *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, description: e.target.value }));
                  setValidationErrors(prev => ({ ...prev, description: '' }));
                }}
                placeholder="Décrivez votre expérience, vos symptômes ou vos préoccupations..."
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  validationErrors.description ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note de satisfaction *
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {getRatingStars()}
                </div>
                <span className="text-sm text-gray-600 ml-3">
                  {formData.rating}/5 - {RATING_OPTIONS.find(opt => opt.value === formData.rating)?.label}
                </span>
              </div>
              {validationErrors.rating && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.rating}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Département concerné *
              </label>
              {isDepartmentsLoading ? (
                <div className="flex items-center justify-center py-3 border rounded-md">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2" />
                  <span className="text-sm text-gray-600">Chargement des départements...</span>
                </div>
              ) : departments.length === 0 ? (
                <div className="flex items-center justify-center py-3 border border-red-200 rounded-md bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm text-red-600">Aucun département disponible</span>
                </div>
              ) : (
                <Select
                  value={formData.department_id}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, department_id: value }));
                    setValidationErrors(prev => ({ ...prev, department_id: '' }));
                  }}
                >
                  <SelectTrigger className={validationErrors.department_id ? 'border-red-300' : ''}>
                    <SelectValue placeholder="Sélectionnez un département" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.department_id} value={dept.department_id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {validationErrors.department_id && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.department_id}</p>
              )}
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langue
              </label>
              <Select
                value={formData.language}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Input Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'entrée
              </label>
              <Select
                value={formData.input_type}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, input_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INPUT_TYPE_OPTIONS.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || isLoading || isDepartmentsLoading}
                className="flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Envoi...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Envoyer le feedback</span>
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Information</p>
                <p>
                  Votre feedback sera analysé automatiquement pour déterminer le sentiment et extraire les thèmes principaux. 
                  Vous pourrez suivre le statut de traitement dans la liste de vos feedbacks.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}