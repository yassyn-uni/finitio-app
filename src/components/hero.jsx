import React from 'react';
import { Link } from 'react-router-dom';
import { FinitioLogo } from '../assets/FinitioAssets';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background avec gradient premium harmonisé */}
      <div className="absolute inset-0 construction-gradient"></div>
      
      {/* Overlay optimisé pour contraste */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      {/* Contenu principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          {/* Logo premium avec meilleur contraste */}
          <div className="mb-8 flex justify-center">
            <div className="p-6 glass-effect-dark rounded-2xl border border-white border-opacity-30">
              <FinitioLogo variant="main" size="xl" className="filter brightness-0 invert" />
            </div>
          </div>
          
          {/* Titre principal avec gradient harmonisé */}
          <h1 className="text-white font-display font-bold text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            L'Excellence en
            <span className="block text-transparent bg-clip-text construction-accent-gradient">
              Construction
            </span>
          </h1>
          
          {/* Sous-titre avec meilleur contraste */}
          <p className="text-white text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed font-light">
            Transformez vos projets de construction avec notre plateforme premium. 
            Gestion intelligente, collaboration fluide, résultats exceptionnels.
          </p>
          
          {/* Statistiques avec nouvelle classe harmonisée */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="stats-card">
              <div className="stats-number">500+</div>
              <div className="stats-label">Projets Réalisés</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">98%</div>
              <div className="stats-label">Satisfaction Client</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">24/7</div>
              <div className="stats-label">Support Premium</div>
            </div>
          </div>
          
          {/* Boutons d'action harmonisés */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/inscription" 
              className="btn btn-primary btn-lg px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <span>🚀</span>
              Démarrer Gratuitement
            </Link>
            
            <Link 
              to="/demo" 
              className="btn btn-outline btn-lg px-8 py-4 text-lg font-semibold text-white border-white border-2 hover:bg-white hover:text-gray-900 shadow-xl"
            >
              <span>🎥</span>
              Voir la Démo
            </Link>
          </div>
          
          {/* Indicateur de scroll amélioré */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white border-opacity-60 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Éléments décoratifs harmonisés */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-orange-500 bg-opacity-20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-400 bg-opacity-15 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-20 w-16 h-16 bg-white bg-opacity-10 rounded-full blur-lg animate-pulse delay-500"></div>
    </section>
  );
}
