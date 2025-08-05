import React from 'react';
import { Link } from 'react-router-dom';
import { FinitioLogo, FinitioIllustration } from '../assets/FinitioAssets';
import { trackCTAClick, trackEvent } from '../utils/analytics';

export default function Hero() {
  // Tracker les clics sur les CTA
  const handleInscriptionClick = () => {
    trackCTAClick('Commencer gratuitement', 'hero_main');
    trackEvent('hero_cta_click', {
      cta_type: 'primary',
      cta_text: 'Commencer gratuitement',
      location: 'hero_section'
    });
  };

  const handleConnexionClick = () => {
    trackCTAClick('Se connecter', 'hero_secondary');
    trackEvent('hero_cta_click', {
      cta_type: 'secondary',
      cta_text: 'Se connecter',
      location: 'hero_section'
    });
  };

  // Tracker les interactions avec les statistiques
  const handleStatClick = (statName, statValue) => {
    trackEvent('hero_stat_interaction', {
      stat_name: statName,
      stat_value: statValue,
      interaction_type: 'click'
    });
  };

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Fond professionnel avec pattern subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1f2937" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Éléments décoratifs professionnels */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full opacity-20 blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
            
            {/* Contenu principal */}
            <div className="space-y-8">
              {/* Logo professionnel */}
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                  <FinitioLogo 
                    variant="main" 
                    size="md" 
                    className="filter brightness-0 invert" 
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Finitio</h2>
                  <p className="text-sm text-gray-600">Construction Excellence</p>
                </div>
              </div>

              {/* Titre principal professionnel */}
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  <span className="block">Construisons</span>
                  <span className="block text-blue-600">l'avenir</span>
                  <span className="block">ensemble</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  La plateforme BTP de référence qui connecte professionnels et clients 
                  pour des projets de construction d'exception.
                </p>
              </div>

              {/* Statistiques professionnelles */}
              <div className="grid grid-cols-3 gap-6 py-8">
                {[
                  { number: "15K+", label: "Projets réalisés", color: "text-blue-600" },
                  { number: "8K+", label: "Professionnels", color: "text-green-600" },
                  { number: "99%", label: "Satisfaction", color: "text-orange-600" }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    onClick={() => handleStatClick(stat.label, stat.number)}
                    className="text-center cursor-pointer group"
                  >
                    <div className={`text-3xl font-bold ${stat.color} group-hover:scale-110 transition-transform`}>
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Boutons d'action professionnels */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/inscription" 
                  onClick={handleInscriptionClick}
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Commencer gratuitement
                </Link>
                
                <Link 
                  to="/connexion" 
                  onClick={handleConnexionClick}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-600 hover:text-blue-600 transform hover:-translate-y-1 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                  </svg>
                  Se connecter
                </Link>
              </div>

              {/* Badges de confiance professionnels */}
              <div className="flex flex-wrap gap-4 pt-6">
                {[
                  { icon: "🏆", text: "Leader du marché" },
                  { icon: "🔒", text: "Sécurisé & Certifié" },
                  { icon: "⚡", text: "Support premium" }
                ].map((badge, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <span>{badge.icon}</span>
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Illustration professionnelle */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-12 shadow-2xl">
                {/* Illustration principale */}
                <div className="relative z-10">
                  <FinitioIllustration 
                    type="construction" 
                    size="xl" 
                    className="w-full max-w-lg mx-auto" 
                  />
                </div>
                
                {/* Éléments décoratifs */}
                <div className="absolute top-6 right-6 w-16 h-16 bg-yellow-400 rounded-2xl opacity-80 rotate-12"></div>
                <div className="absolute bottom-6 left-6 w-12 h-12 bg-green-400 rounded-xl opacity-80 -rotate-12"></div>
                <div className="absolute top-1/2 left-6 w-8 h-8 bg-orange-400 rounded-full opacity-80"></div>
              </div>

              {/* Cartes flottantes */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">👥</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">+2.5K</div>
                    <div className="text-xs text-gray-500">Nouveaux clients</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">📈</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">+45%</div>
                    <div className="text-xs text-gray-500">Croissance</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Indicateur de défilement professionnel */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center space-y-2 text-gray-400">
          <span className="text-xs font-medium">Découvrir</span>
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
