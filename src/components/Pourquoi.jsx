import React, { useState, useEffect } from 'react';

export default function Pourquoi() {
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const roles = [
    {
      id: 'clients',
      title: 'Clients',
      icon: '🏠',
      color: 'primary',
      gradient: 'from-primary-500 to-primary-600',
      bgGradient: 'from-primary-50 to-primary-100',
      description: 'Trouvez et gérez vos projets de construction en toute simplicité',
      features: [
        {
          icon: '🔍',
          title: 'Recherche intelligente',
          description: 'Trouvez les meilleurs professionnels selon vos critères'
        },
        {
          icon: '📊',
          title: 'Suivi en temps réel',
          description: 'Suivez l\'avancement de vos projets étape par étape'
        },
        {
          icon: '💰',
          title: 'Gestion budgétaire',
          description: 'Contrôlez vos coûts avec des devis détaillés'
        },
        {
          icon: '🛡️',
          title: 'Garantie qualité',
          description: 'Professionnels vérifiés et assurés'
        }
      ]
    },
    {
      id: 'prestataires',
      title: 'Prestataires',
      icon: '🔨',
      color: 'secondary',
      gradient: 'from-secondary-500 to-secondary-600',
      bgGradient: 'from-secondary-50 to-secondary-100',
      description: 'Développez votre activité et gérez vos chantiers efficacement',
      features: [
        {
          icon: '🎯',
          title: 'Nouveaux projets',
          description: 'Accédez à un flux constant de nouvelles opportunités'
        },
        {
          icon: '📱',
          title: 'Gestion mobile',
          description: 'Gérez vos chantiers depuis votre smartphone'
        },
        {
          icon: '💼',
          title: 'Portfolio digital',
          description: 'Présentez vos réalisations et compétences'
        },
        {
          icon: '⚡',
          title: 'Paiements rapides',
          description: 'Recevez vos paiements de manière sécurisée'
        }
      ]
    },
    {
      id: 'architectes',
      title: 'Architectes',
      icon: '📐',
      color: 'success',
      gradient: 'from-success-500 to-success-600',
      bgGradient: 'from-success-50 to-success-100',
      description: 'Coordonnez vos équipes et supervisez vos projets',
      features: [
        {
          icon: '👥',
          title: 'Coordination équipe',
          description: 'Gérez toutes vos équipes depuis une interface unique'
        },
        {
          icon: '📋',
          title: 'Validation étapes',
          description: 'Validez chaque étape avant passage à la suivante'
        },
        {
          icon: '📈',
          title: 'Analytics avancés',
          description: 'Analysez les performances de vos projets'
        },
        {
          icon: '🎨',
          title: 'Plans interactifs',
          description: 'Partagez et annotez vos plans en temps réel'
        }
      ]
    }
  ];

  const testimonials = [
    {
      name: "Aicha Benali",
      role: "Propriétaire",
      company: "Villa Moderne Casablanca",
      avatar: "AB",
      rating: 5,
      comment: "Finitio a révolutionné mon expérience de construction. La transparence et le suivi en temps réel m'ont permis de rester sereine tout au long du projet.",
      project: "Rénovation complète 180m²",
      color: "primary"
    },
    {
      name: "Youssef Alami",
      role: "Maître d'œuvre",
      company: "Alami Construction",
      avatar: "YA",
      rating: 5,
      comment: "Grâce à Finitio, j'ai augmenté mon chiffre d'affaires de 40% en 6 mois. La plateforme me permet de me concentrer sur mon métier.",
      project: "+25 projets gérés",
      color: "secondary"
    },
    {
      name: "Fatima Tazi",
      role: "Architecte",
      company: "Tazi Architecture",
      avatar: "FT",
      rating: 5,
      comment: "L'outil de coordination d'équipe est exceptionnel. Je peux superviser plusieurs chantiers simultanément sans stress.",
      project: "12 projets en cours",
      color: "success"
    }
  ];

  const stats = [
    { number: "2,500+", label: "Projets réalisés", icon: "🏗️" },
    { number: "98.5%", label: "Satisfaction client", icon: "⭐" },
    { number: "24h", label: "Temps de réponse", icon: "⚡" },
    { number: "500+", label: "Professionnels actifs", icon: "👥" }
  ];

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-muted-50 via-white to-primary-50 relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-200 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-secondary-200 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-success-200 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="container relative z-10">
        
        {/* Header Section */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-full text-primary-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
            Pourquoi choisir Finitio
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-success-600 bg-clip-text text-transparent">
              Une solution pour chaque professionnel
            </span>
          </h2>
          
          <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            Découvrez comment Finitio transforme l'expérience de construction pour chaque acteur du secteur
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-2xl p-2 shadow-lg border border-border">
            {roles.map((role, index) => (
              <button
                key={role.id}
                onClick={() => handleTabClick(index)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === index
                    ? `bg-gradient-to-r ${role.gradient} text-white shadow-lg scale-105`
                    : 'text-muted hover:text-foreground hover:bg-muted-50'
                }`}
              >
                <span className="text-xl">{role.icon}</span>
                <span>{role.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Role Content */}
        <div className="mb-20">
          {roles.map((role, index) => (
            <div
              key={role.id}
              className={`transition-all duration-500 ${
                activeTab === index 
                  ? 'opacity-100 transform translate-y-0' 
                  : 'opacity-0 transform translate-y-8 absolute pointer-events-none'
              }`}
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                
                {/* Content Side */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-3xl font-bold mb-4">
                      Pour les <span className={`text-${role.color}-600`}>{role.title}</span>
                    </h3>
                    <p className="text-lg text-muted leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {role.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex}
                        className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow"
                      >
                        <div className="text-2xl">{feature.icon}</div>
                        <div>
                          <h4 className="font-semibold mb-1">{feature.title}</h4>
                          <p className="text-sm text-muted">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Side */}
                <div className="relative">
                  <div className={`card shadow-2xl overflow-hidden bg-gradient-to-br ${role.bgGradient}`}>
                    <div className="card-body p-8">
                      <div className="text-center mb-6">
                        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${role.gradient} rounded-2xl text-white text-2xl mb-4 shadow-lg`}>
                          {role.icon}
                        </div>
                        <h4 className="text-xl font-bold">Dashboard {role.title}</h4>
                      </div>
                      
                      {/* Mock Dashboard Preview */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                          <span className="text-sm font-medium">Projets actifs</span>
                          <span className={`text-${role.color}-600 font-bold`}>
                            {role.id === 'clients' ? '3' : role.id === 'prestataires' ? '12' : '8'}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progression globale</span>
                            <span>
                              {role.id === 'clients' ? '75%' : role.id === 'prestataires' ? '88%' : '92%'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r ${role.gradient} h-2 rounded-full transition-all duration-1000`}
                              style={{
                                width: role.id === 'clients' ? '75%' : role.id === 'prestataires' ? '88%' : '92%'
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-white rounded text-center">
                            <div className={`text-lg font-bold text-${role.color}-600`}>
                              {role.id === 'clients' ? '€45K' : role.id === 'prestataires' ? '€180K' : '€320K'}
                            </div>
                            <div className="text-xs text-muted">Ce mois</div>
                          </div>
                          <div className="p-2 bg-white rounded text-center">
                            <div className={`text-lg font-bold text-${role.color}-600`}>
                              {role.id === 'clients' ? '4.9' : role.id === 'prestataires' ? '4.8' : '4.9'}
                            </div>
                            <div className="text-xs text-muted">Note moyenne</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="mb-20">
          <div className="card shadow-2xl overflow-hidden bg-gradient-to-r from-primary-600 via-secondary-600 to-success-600 text-white">
            <div className="card-body p-12">
              <div className="text-center mb-12">
                <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                  Des résultats qui parlent d'eux-mêmes
                </h3>
                <p className="text-primary-100 text-lg max-w-2xl mx-auto">
                  Rejoignez des milliers de professionnels qui transforment leurs projets avec Finitio
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="text-center group"
                  >
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                      {stat.icon}
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold mb-2">
                      {stat.number}
                    </div>
                    <div className="text-primary-100 text-sm lg:text-base">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
              Ce que disent nos utilisateurs
            </h3>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Découvrez les témoignages de ceux qui ont transformé leurs projets avec Finitio
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="card shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="card-body p-6">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r from-${testimonial.color}-500 to-${testimonial.color}-600 rounded-full flex items-center justify-center text-white font-bold`}>
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-muted">{testimonial.role}</p>
                      <p className="text-xs text-muted">{testimonial.company}</p>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <blockquote className="text-muted italic mb-4 leading-relaxed">
                    "{testimonial.comment}"
                  </blockquote>

                  {/* Project Info */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1 bg-${testimonial.color}-50 text-${testimonial.color}-700 rounded-full text-sm`}>
                    <span>📊</span>
                    <span>{testimonial.project}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
