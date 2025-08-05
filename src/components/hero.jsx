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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fond moderne avec gradient dynamique */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      </div>
      
      {/* Grille moderne en arrière-plan */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Éléments flottants modernes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl opacity-20 animate-pulse blur-sm transform rotate-12"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-30 animate-bounce blur-sm"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-3xl opacity-15 animate-pulse blur-sm transform -rotate-12"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-2xl opacity-25 animate-bounce blur-sm transform rotate-45"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-12">
          
          {/* Logo avec effet glassmorphism */}
          <div className="flex justify-center mb-8">
            <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
              <FinitioLogo 
                variant="main" 
                size="xl" 
                className="filter brightness-0 invert animate-pulse-soft" 
              />
            </div>
          </div>

          {/* Titre principal avec effet moderne */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight">
              <span className="block bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                Construisons
              </span>
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-gradient-x">
                l'avenir
              </span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                ensemble
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-light">
              La plateforme révolutionnaire qui connecte <span className="font-semibold text-yellow-300">clients</span>, 
              <span className="font-semibold text-green-300"> prestataires</span> et 
              <span className="font-semibold text-purple-300"> architectes</span> pour des projets de construction exceptionnels
            </p>
          </div>

          {/* CTA Buttons avec design moderne */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Link 
              to="/inscription" 
              onClick={handleInscriptionClick}
              className="group relative px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-3">
                🚀 Commencer gratuitement
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link 
              to="/connexion" 
              onClick={handleConnexionClick}
              className="group px-12 py-4 bg-white/10 backdrop-blur-xl text-white font-bold text-lg rounded-2xl border-2 border-white/30 shadow-xl transform transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-white/50"
            >
              <span className="flex items-center gap-3">
                🔐 Se connecter
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Statistiques modernes */}
          <div className="pt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { number: "10K+", label: "Projets réalisés", icon: "🏗️" },
                { number: "5K+", label: "Professionnels actifs", icon: "👥" },
                { number: "98%", label: "Satisfaction client", icon: "⭐" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  onClick={() => handleStatClick(stat.label, stat.number)}
                  className="group cursor-pointer p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl transform transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/20"
                >
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-yellow-300 transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-blue-200 font-medium text-lg">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges de confiance modernes */}
          <div className="pt-12">
            <p className="text-blue-200 text-sm font-medium mb-6">Ils nous font confiance</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {["🏆 Prix Innovation 2024", "🔒 Sécurisé SSL", "⚡ Support 24/7", "🌍 +50 villes"].map((badge, index) => (
                <div 
                  key={index}
                  className="px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 text-white text-sm font-medium transform transition-all duration-300 hover:scale-105 hover:bg-white/10"
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Flèche de défilement moderne */}
          <div className="pt-16">
            <div className="flex justify-center">
              <div className="animate-bounce cursor-pointer p-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Illustration moderne en arrière-plan */}
      <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
        <FinitioIllustration variant="construction" size="lg" className="transform scale-150" />
      </div>
    </section>
  );
}
