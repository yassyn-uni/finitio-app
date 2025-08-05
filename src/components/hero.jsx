import React from 'react';
import { Link } from 'react-router-dom';
import { FinitioLogo, FinitioIllustration } from '../assets/FinitioAssets';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fond premium avec gradient animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 animate-gradient-shift"></div>
      
      {/* Particules animées en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Motif géométrique subtil */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="heroPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <polygon points="10,0 20,10 10,20 0,10" fill="white" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroPattern)" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenu textuel */}
          <div className="text-center lg:text-left animate-fade-in-up">
            {/* Logo et titre */}
            <div className="mb-8">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <FinitioLogo 
                  variant="main" 
                  size="xl" 
                  className="filter brightness-0 invert animate-pulse-soft" 
                />
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                <span className="block">Construisez</span>
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  l'avenir
                </span>
                <span className="block">ensemble</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              La plateforme BTP nouvelle génération qui connecte 
              <span className="text-yellow-400 font-semibold"> clients</span>, 
              <span className="text-orange-400 font-semibold"> prestataires</span> et 
              <span className="text-green-400 font-semibold"> architectes</span> 
              pour des projets de construction réussis.
            </p>

            {/* Statistiques impressionnantes */}
            <div className="grid grid-cols-3 gap-6 mb-10 animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-blue-200 text-sm">Projets réalisés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">98%</div>
                <div className="text-blue-200 text-sm">Satisfaction client</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">24h</div>
                <div className="text-blue-200 text-sm">Temps de réponse</div>
              </div>
            </div>

            {/* Boutons d'action premium */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Link 
                to="/inscription" 
                className="btn-premium group"
              >
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Commencer gratuitement
                </span>
              </Link>
              
              <Link 
                to="/connexion" 
                className="px-8 py-4 rounded-2xl font-semibold text-white border-2 border-white/30 hover:border-white/60 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm hover:bg-white/10"
              >
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Se connecter
                </span>
              </Link>
            </div>

            {/* Badges de confiance */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-10 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white text-sm font-medium">Sécurisé</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white text-sm font-medium">Certifié</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-white text-sm font-medium">5 étoiles</span>
              </div>
            </div>
          </div>

          {/* Illustration premium */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              {/* Illustration principale */}
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                <FinitioIllustration 
                  type="construction" 
                  size="xl" 
                  className="w-full max-w-lg mx-auto filter drop-shadow-2xl" 
                />
              </div>
              
              {/* Éléments décoratifs flottants */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-400 rounded-full opacity-80 animate-float" style={{ animationDelay: '1s' }}></div>
              <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-green-400 rounded-full opacity-80 animate-float" style={{ animationDelay: '2s' }}></div>
              <div className="absolute top-1/2 -right-5 w-12 h-12 bg-orange-400 rounded-full opacity-80 animate-float" style={{ animationDelay: '3s' }}></div>
              
              {/* Cercles décoratifs */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 border-2 border-white/20 rounded-full animate-rotate-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border-2 border-white/10 rounded-full animate-rotate-slow" style={{ animationDirection: 'reverse' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Flèche de défilement */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
