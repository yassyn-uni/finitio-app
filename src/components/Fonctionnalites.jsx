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
      color: 'accent',
      gradient: 'construction-accent-gradient',
      bgGradient: 'from-accent-50 to-accent-100',
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
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
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
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
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
      color: 'amber',
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
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
      color: 'slate',
      gradient: 'from-slate-500 to-slate-600',
      bgGradient: 'from-slate-50 to-slate-100',
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
      color: 'gray',
      gradient: 'from-gray-600 to-gray-700',
      bgGradient: 'from-gray-50 to-gray-100',
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
      color: 'accent'
    },
    {
      step: '02',
      title: 'Configuration',
      description: 'Personnalisez votre espace de travail selon vos besoins',
      icon: '',
      color: 'orange'
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
    <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
      
      {/* Background Elements harmonisés */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-32 right-20 w-96 h-96 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-64 h-64 bg-gradient-to-br from-green-200 to-orange-200 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="container relative z-10">
        
        {/* Header Section harmonisé */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-50 border border-accent-200 rounded-full text-accent-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></span>
            Fonctionnalités avancées
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
            <span className="construction-accent-gradient bg-clip-text text-transparent">
              Tout ce dont vous avez besoin
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez les outils puissants qui vont révolutionner votre façon de gérer vos projets de construction
          </p>
        </div>

        {/* Features Grid harmonisé */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={feature.id}
              onClick={() => handleFeatureClick(index)}
              className={`card cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
                activeFeature === index 
                  ? 'shadow-2xl scale-105 ring-2 ring-accent-500 ring-opacity-50' 
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="card-body p-6">
                {/* Icon harmonisé */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl text-white text-2xl mb-4 shadow-lg`}>
                  <FinitioIcon type={feature.icon} size="md" className="filter brightness-0 invert" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                
                {/* Details harmonisés */}
                <div className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center gap-2 text-sm">
                      <div className={`w-1.5 h-1.5 bg-${feature.color}-500 rounded-full`}></div>
                      <span className="text-gray-600">{detail}</span>
                    </div>
                  ))}
                </div>
                
                {/* Action harmonisé */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-accent-600 text-sm font-medium hover:text-accent-700 transition-colors cursor-pointer">
                    En savoir plus →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Process Steps harmonisé */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4 text-gray-900">
            Comment ça marche ?
          </h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trois étapes simples pour transformer votre gestion de projets
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {processSteps.map((step, index) => (
            <div key={step.step} className="text-center relative">
              {/* Connector line */}
              {index < processSteps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-accent-300 to-accent-400 transform translate-x-1/2 z-0"></div>
              )}
              
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 construction-accent-gradient rounded-full text-white text-xl font-bold mb-4 shadow-lg`}>
                  {step.step}
                </div>
                <h4 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h4>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section harmonisé */}
        <div className="text-center bg-gradient-to-r from-accent-50 to-orange-50 rounded-3xl p-8 md:p-12 border border-accent-100">
          <h3 className="text-3xl font-bold mb-4 text-gray-900">
            Prêt à révolutionner vos projets ?
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de professionnels qui font déjà confiance à Finitio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary btn-lg px-8 py-4">
              <span className="mr-2">🚀</span>
              Commencer gratuitement
            </button>
            <button className="btn btn-outline btn-lg px-8 py-4">
              <span className="mr-2">📞</span>
              Demander une démo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
