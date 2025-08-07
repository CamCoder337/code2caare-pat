'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoginRequest, RegisterPatientRequest, RegisterProfessionalRequest } from '@/types/auth';
import { Loader2, Stethoscope, Heart } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, registerPatient, registerProfessional, isLoading, error, clearError } = useAuthStore();
  
  const [loginData, setLoginData] = useState<LoginRequest>({
    username: '',
    password: '',
  });

  const [patientData, setPatientData] = useState<RegisterPatientRequest>({
    user: {
      username: '',
      password: '',
      phone_number: '',
    },
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'M',
    preferred_language: 'fr',
    preferred_contact_method: 'sms',
  });

  const [professionalData, setProfessionalData] = useState<RegisterProfessionalRequest>({
    user: {
      username: '',
      password: '',
      phone_number: '',
    },
    first_name: '',
    last_name: '',
    gender: 'M',
    date_of_birth: '',
    specialization: '',
    license_number: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      console.log('Attempting login with:', loginData); // Debug log
      await login(loginData);
      console.log('Login successful, redirecting...'); // Debug log
      router.push('/dashboard');
    } catch (err) {
      console.error('Login failed:', err); // Debug log
      // Error is handled by the store
    }
  };

  const handlePatientRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await registerPatient(patientData);
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by the store
    }
  };

  const handleProfessionalRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await registerProfessional(professionalData);
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">DGH Platform</h1>
          <p className="text-gray-600 mt-2">Plateforme de Santé Digitale Globale</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Se connecter</CardTitle>
                <CardDescription>
                  Entrez vos identifiants pour accéder à votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Nom d'utilisateur</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Votre nom d'utilisateur"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connexion...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Tabs defaultValue="patient" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="patient" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Patient
                </TabsTrigger>
                <TabsTrigger value="professional" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Professionnel
                </TabsTrigger>
              </TabsList>

              <TabsContent value="patient">
                <Card>
                  <CardHeader>
                    <CardTitle>Inscription Patient</CardTitle>
                    <CardDescription>
                      Créez votre compte patient pour accéder aux services de santé
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePatientRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="patient-first-name">Prénom</Label>
                          <Input
                            id="patient-first-name"
                            value={patientData.first_name}
                            onChange={(e) => setPatientData({ ...patientData, first_name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patient-last-name">Nom</Label>
                          <Input
                            id="patient-last-name"
                            value={patientData.last_name}
                            onChange={(e) => setPatientData({ ...patientData, last_name: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="patient-username">Nom d'utilisateur</Label>
                        <Input
                          id="patient-username"
                          type="text"
                          placeholder="Votre nom d'utilisateur"
                          value={patientData.user.username}
                          onChange={(e) => setPatientData({ 
                            ...patientData, 
                            user: { ...patientData.user, username: e.target.value }
                          })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="patient-phone">Numéro de téléphone</Label>
                        <Input
                          id="patient-phone"
                          type="tel"
                          placeholder="+237 6XX XXX XXX"
                          value={patientData.user.phone_number}
                          onChange={(e) => setPatientData({ 
                            ...patientData, 
                            user: { ...patientData.user, phone_number: e.target.value }
                          })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="patient-password">Mot de passe</Label>
                        <Input
                          id="patient-password"
                          type="password"
                          value={patientData.user.password}
                          onChange={(e) => setPatientData({ 
                            ...patientData, 
                            user: { ...patientData.user, password: e.target.value }
                          })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="patient-birth">Date de naissance</Label>
                          <Input
                            id="patient-birth"
                            type="date"
                            value={patientData.date_of_birth}
                            onChange={(e) => setPatientData({ ...patientData, date_of_birth: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patient-gender">Genre</Label>
                          <Select
                            value={patientData.gender}
                            onValueChange={(value: 'M' | 'F' | 'O') => setPatientData({ ...patientData, gender: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="M">Masculin</SelectItem>
                              <SelectItem value="F">Féminin</SelectItem>
                              <SelectItem value="O">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="patient-language">Langue préférée</Label>
                          <Select
                            value={patientData.preferred_language}
                            onValueChange={(value: any) => setPatientData({ ...patientData, preferred_language: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fr">Français</SelectItem>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="dua">Duala</SelectItem>
                              <SelectItem value="bas">Bassa</SelectItem>
                              <SelectItem value="ewo">Ewondo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patient-contact">Méthode de contact</Label>
                          <Select
                            value={patientData.preferred_contact_method}
                            onValueChange={(value: any) => setPatientData({ ...patientData, preferred_contact_method: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sms">SMS</SelectItem>
                              <SelectItem value="voice">Appel vocal</SelectItem>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                          {error}
                        </div>
                      )}

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Inscription...
                          </>
                        ) : (
                          'S\'inscrire comme Patient'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="professional">
                <Card>
                  <CardHeader>
                    <CardTitle>Inscription Professionnel</CardTitle>
                    <CardDescription>
                      Créez votre compte professionnel de santé
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfessionalRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="prof-first-name">Prénom</Label>
                          <Input
                            id="prof-first-name"
                            value={professionalData.first_name}
                            onChange={(e) => setProfessionalData({ ...professionalData, first_name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="prof-last-name">Nom</Label>
                          <Input
                            id="prof-last-name"
                            value={professionalData.last_name}
                            onChange={(e) => setProfessionalData({ ...professionalData, last_name: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="prof-username">Nom d'utilisateur</Label>
                        <Input
                          id="prof-username"
                          type="text"
                          placeholder="Votre nom d'utilisateur"
                          value={professionalData.user.username}
                          onChange={(e) => setProfessionalData({ 
                            ...professionalData, 
                            user: { ...professionalData.user, username: e.target.value }
                          })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="prof-phone">Numéro de téléphone</Label>
                        <Input
                          id="prof-phone"
                          type="tel"
                          placeholder="+237 6XX XXX XXX"
                          value={professionalData.user.phone_number}
                          onChange={(e) => setProfessionalData({ 
                            ...professionalData, 
                            user: { ...professionalData.user, phone_number: e.target.value }
                          })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="prof-password">Mot de passe</Label>
                        <Input
                          id="prof-password"
                          type="password"
                          value={professionalData.user.password}
                          onChange={(e) => setProfessionalData({ 
                            ...professionalData, 
                            user: { ...professionalData.user, password: e.target.value }
                          })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="prof-birth">Date de naissance</Label>
                          <Input
                            id="prof-birth"
                            type="date"
                            value={professionalData.date_of_birth}
                            onChange={(e) => setProfessionalData({ ...professionalData, date_of_birth: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="prof-gender">Genre</Label>
                          <Select
                            value={professionalData.gender}
                            onValueChange={(value: 'M' | 'F' | 'O') => setProfessionalData({ ...professionalData, gender: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="M">Masculin</SelectItem>
                              <SelectItem value="F">Féminin</SelectItem>
                              <SelectItem value="O">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="prof-specialization">Spécialisation</Label>
                        <Input
                          id="prof-specialization"
                          placeholder="ex: Cardiologue, Pédiatre..."
                          value={professionalData.specialization}
                          onChange={(e) => setProfessionalData({ ...professionalData, specialization: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="prof-license">Numéro de licence</Label>
                        <Input
                          id="prof-license"
                          placeholder="Numéro de licence professionnelle"
                          value={professionalData.license_number}
                          onChange={(e) => setProfessionalData({ ...professionalData, license_number: e.target.value })}
                        />
                      </div>

                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                          {error}
                        </div>
                      )}

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Inscription...
                          </>
                        ) : (
                          'S\'inscrire comme Professionnel'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}