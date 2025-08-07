import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function OnboardingGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('role, prenom, nom')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserRole(profile.role);
          setUserName(profile.prenom || 'Utilisateur');
        }
      }
    } catch (error) {
      console.error('Erreur récupération profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStepsForRole = (role) => {
    const commonSteps = [
      {
        title: `Bienvenue ${userName} ! 🎉`,
        description: "Félicitations ! Votre compte Finitio est maintenant créé. Laissez-nous vous guider pour découvrir les fonctionnalités principales.",
        icon: "🎯",
        action: "Commencer le tour guidé"
      }
    ];

    const roleSpecificSteps = {
      client: [
        {
          title: "Créez votre premier projet 🏗️",
          description: "Commencez par créer votre projet de construction ou rénovation. Décrivez vos besoins, votre budget et votre localisation.",
          icon: "🏠",
          action: "Créer un projet",
          path: "/nouveau-projet"
        },
        {
          title: "Trouvez des professionnels 👷",
          description: "Parcourez notre annuaire de prestataires qualifiés et d'architectes pour votre projet.",
          icon: "🔍",
          action: "Voir l'annuaire",
          path: "/annuaire-prestataires"
        },
        {
          title: "Gérez vos devis 💰",
          description: "Recevez, comparez et validez les devis de vos prestataires en toute simplicité.",
          icon: "📊",
          action: "Voir mes devis",
          path: "/devis"
        },
        {
          title: "Communiquez facilement 💬",
          description: "Échangez avec vos prestataires et architectes directement sur la plateforme.",
          icon: "💬",
          action: "Voir mes messages",
          path: "/messages"
        }
      ],
      architecte: [
        {
          title: "Gérez vos projets 📐",
          description: "Organisez et suivez l'avancement de vos projets avec notre système de gestion d'étapes.",
          icon: "📋",
          action: "Gestion des étapes",
          path: "/gestion-etapes"
        },
        {
          title: "Validez les devis 🔍",
          description: "Examinez et validez les devis des prestataires pour vos projets clients.",
          icon: "✅",
          action: "Validation devis",
          path: "/validation-devis"
        },
        {
          title: "Suivez les achats 🛒",
          description: "Contrôlez les achats de matériaux et équipements pour vos projets.",
          icon: "📦",
          action: "Liste des achats",
          path: "/liste-achats"
        },
        {
          title: "Collaborez efficacement 🤝",
          description: "Coordonnez avec vos clients et prestataires via notre système de messagerie.",
          icon: "👥",
          action: "Centre de messages",
          path: "/messages"
        }
      ],
      prestataire: [
        {
          title: "Découvrez les projets 🎯",
          description: "Explorez les projets disponibles qui correspondent à vos compétences et votre zone d'intervention.",
          icon: "🔍",
          action: "Projets disponibles",
          path: "/projets-disponibles"
        },
        {
          title: "Soumettez vos devis 💼",
          description: "Proposez vos services en créant des devis détaillés pour les projets qui vous intéressent.",
          icon: "📝",
          action: "Créer un devis",
          path: "/selection-projet-devis"
        },
        {
          title: "Suivez vos devis 📈",
          description: "Surveillez le statut de vos devis et gérez vos propositions commerciales.",
          icon: "📊",
          action: "Suivi des devis",
          path: "/suivi-devis"
        },
        {
          title: "Gérez vos paiements 💳",
          description: "Suivez vos factures et paiements pour une gestion financière optimale.",
          icon: "💰",
          action: "Mes paiements",
          path: "/paiements"
        }
      ]
    };

    return [...commonSteps, ...(roleSpecificSteps[role] || [])];
  };

  const steps = getStepsForRole(userRole);
  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAction = () => {
    if (currentStepData?.path) {
      // Marquer l'onboarding comme terminé
      localStorage.setItem('finitio_onboarding_completed', 'true');
      navigate(currentStepData.path);
    } else {
      handleNext();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('finitio_onboarding_completed', 'true');
    const dashboardPath = userRole === 'client' ? '/dashboard-client' 
                        : userRole === 'architecte' ? '/dashboard-architecte'
                        : userRole === 'prestataire' ? '/dashboard-prestataire'
                        : '/dashboard';
    navigate(dashboardPath);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center px-4">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-white/20">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600">
              Étape {currentStep + 1} sur {steps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Passer le guide
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <div className="text-6xl mb-6">{currentStepData?.icon}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {currentStepData?.title}
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {currentStepData?.description}
          </p>

          {/* Role Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 font-medium mb-8">
            <span className="mr-2">
              {userRole === 'client' ? '🏠' : userRole === 'architecte' ? '🏛️' : '🔨'}
            </span>
            {userRole === 'client' ? 'Client' : userRole === 'architecte' ? 'Architecte' : 'Prestataire'}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>

          <div className="flex gap-3">
            {currentStep < steps.length - 1 ? (
              <>
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Suivant
                </button>
                {currentStepData?.action && (
                  <button
                    onClick={handleAction}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all font-medium"
                  >
                    {currentStepData.action}
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={handleAction}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-medium"
              >
                {currentStepData?.action || 'Commencer !'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
