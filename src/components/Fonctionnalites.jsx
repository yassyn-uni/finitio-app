import React, { useState, useEffect } from 'react';
import { FinitioIcon } from '../assets/FinitioAssets';

export default function Fonctionnalites() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      id: 'suivi-temps-reel',
      icon: '',
      title: 'Suivi en temps réel',
      description: 'Suivez l\'avancement de vos projets avec des mises à jour instantanées et des notifications intelligentes',
      color: 'primary',
      gradient: 'from-primary-500 to-primary-600',
      bgGradient: 'from-primary-50 to-primary-100',
      details: [
        'Dashboard en temps réel',
        'Notifications push intelligentes',
        'Historique complet des actions',
        'Rapports automatisés'
      ],
      image: ''
    },
    {
      id: 'messagerie-integree',
      icon: '',
      title: 'Messagerie intégrée',
      description: 'Communiquez directement avec vos équipes et clients via notre système de messagerie sécurisé',
      color: 'secondary',
      gradient: 'from-secondary-500 to-secondary-600',
      bgGradient: 'from-secondary-50 to-secondary-100',
      details: [
        'Chat temps réel par projet',
        'Partage de fichiers sécurisé',
        'Notifications contextuelles',
        'Historique des conversations'
      ],
      image: ''
    },
    {
      id: 'planification-avancee',
      icon: '',
      title: 'Planification avancée',
      description: 'Organisez vos projets avec des outils de planification Kanban et des calendriers interactifs',
      color: 'success',
      gradient: 'from-success-500 to-success-600',
      bgGradient: 'from-success-50 to-success-100',
      details: [
        'Kanban interactif',
        'Calendrier de projet',
        'Gestion des dépendances',
        'Timeline automatique'
      ],
      image: ''
    },
    {
      id: 'gestion-financiere',
      icon: '',
      title: 'Gestion financière',
      description: 'Centralisez vos devis, factures et paiements avec un suivi budgétaire automatisé',
      color: 'warning',
      gradient: 'from-warning-500 to-warning-600',
      bgGradient: 'from-warning-50 to-warning-100',
      details: [
        'Devis automatisés',
        'Suivi budgétaire',
        'Facturation intégrée',
        'Analytics financiers'
      ],
      image: ''
    },
    {
      id: 'acces-multi-plateforme',
      icon: '',
      title: 'Accès multi-plateforme',
      description: 'Travaillez depuis n\'importe où avec nos applications web, mobile et desktop synchronisées',
      color: 'info',
      gradient: 'from-info-500 to-info-600',
      bgGradient: 'from-info-50 to-info-100',
      details: [
        'Application mobile native',
        'Interface web responsive',
        'Synchronisation cloud',
        'Mode hors ligne'
      ],
      image: ''
    },
    {
      id: 'securite-renforcee',
      icon: '',
      title: 'Sécurité renforcée',
      description: 'Vos données sont protégées par un chiffrement de niveau bancaire et des sauvegardes automatiques',
      color: 'muted',
      gradient: 'from-muted-600 to-muted-700',
      bgGradient: 'from-muted-50 to-muted-100',
      details: [
        'Chiffrement AES-256',
        'Authentification 2FA',
        'Sauvegardes automatiques',
        'Conformité RGPD'
      ],
      image: ''
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Inscription',
      description: 'Créez votre compte et configurez votre profil professionnel',
      icon: '',
      color: 'primary'
    },
    {
      step: '02',
      title: 'Configuration',
      description: 'Personnalisez votre espace de travail selon vos besoins',
      icon: '',
      color: 'secondary'
    },
    {
      step: '03',
      title: 'Collaboration',
      description: 'Invitez vos équipes et commencez à gérer vos projets',
      icon: '',
      color: 'success'
    }
  ];

  const handleFeatureClick = (index) => {
    setActiveFeature(index);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white via-muted-50 to-white relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-32 right-20 w-96 h-96 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-64 h-64 bg-gradient-to-br from-success-200 to-info-200 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="container relative z-10">
        
        {/* Header Section */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-success-50 border border-success-200 rounded-full text-success-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
            Fonctionnalités avancées
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-success-600 via-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Tout ce dont vous avez besoin
            </span>
          </h2>
          
          <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            Découvrez les outils puissants qui vont révolutionner votre façon de gérer vos projets de construction
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={feature.id}
              onClick={() => handleFeatureClick(index)}
              className={`card cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
                activeFeature === index 
                  ? 'shadow-2xl scale-105 ring-2 ring-primary-500 ring-opacity-50' 
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="card-body p-6">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl text-white text-2xl mb-4 shadow-lg`}>
                  <FinitioIcon type={feature.icon} size="md" className="filter brightness-0 invert" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted leading-relaxed mb-4">{feature.description}</p>
                
                {/* Details */}
                <div className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center gap-2 text-sm">
                      <div className={`w-1.5 h-1.5 bg-${feature.color}-500 rounded-full`}></div>
                      <span className="text-muted">{detail}</span>
                    </div>
                  ))}
                </div>
                
                {/* Action */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className={`inline-flex items-center gap-2 text-${feature.color}-600 font-medium text-sm`}>
                    <span>En savoir plus</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
              Comment ça marche ?
            </h3>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Commencez à utiliser Finitio en 3 étapes simples
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-secondary-200 z-0"></div>
                )}
                
                <div className="card shadow-lg hover:shadow-xl transition-all duration-300 relative z-10">
                  <div className="card-body p-8 text-center">
                    {/* Step Number */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-${step.color}-500 to-${step.color}-600 rounded-full text-white text-xl font-bold mb-6 shadow-lg`}>
                      {step.step}
                    </div>
                    
                    {/* Icon */}
                    <div className="text-4xl mb-4">
                      <FinitioIcon type={step.icon} size="lg" className="mx-auto opacity-80" />
                    </div>
                    
                    {/* Content */}
                    <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                    <p className="text-muted leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="card shadow-2xl overflow-hidden bg-gradient-to-r from-primary-600 via-secondary-600 to-success-600 text-white">
            <div className="card-body p-12">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-3xl lg:text-4xl font-bold mb-6">
                  Prêt à transformer vos projets ?
                </h3>
                <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                  Rejoignez des milliers de professionnels qui ont déjà révolutionné leur façon de travailler avec Finitio
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    className="btn bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    <span>Commencer gratuitement</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                  
                  <button 
                    className="btn border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-all"
                  >
                    <span>Voir la démo</span>
                  </button>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-6 text-primary-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Essai gratuit 30 jours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Aucune carte requise</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Support 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
