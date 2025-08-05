import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OptimizedAnalytics from '../utils/optimizedAnalytics';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    OptimizedAnalytics.trackEvent('hero_view');
  }, []);

  const slides = [
    {
      title: "Révolutionnez vos projets de construction",
      subtitle: "La plateforme qui connecte clients, prestataires et architectes",
      description: "Gérez vos projets de A à Z avec notre solution complète et intuitive",
      image: "",
      gradient: "from-primary-600 to-secondary-600"
    },
    {
      title: "Collaboration simplifiée",
      subtitle: "Travaillez ensemble en temps réel",
      description: "Messagerie intégrée, suivi des étapes et validation des devis",
      image: "",
      gradient: "from-secondary-600 to-primary-600"
    },
    {
      title: "Gestion intelligente",
      subtitle: "Analytics et tableaux de bord avancés",
      description: "Suivez vos performances et optimisez vos processus",
      image: "",
      gradient: "from-primary-600 to-success-600"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleCTAClick = (action) => {
    OptimizedAnalytics.trackEvent('hero_cta_click', { action });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-secondary-200 rounded-full opacity-20 animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-success-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-warning-200 rounded-full opacity-20 animate-float-delayed"></div>
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Content Side */}
          <div className={`space-y-8 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-full text-primary-700 text-sm font-medium">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
              Nouvelle plateforme disponible
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
                <span className={`bg-gradient-to-r ${slides[currentSlide].gradient} bg-clip-text text-transparent`}>
                  {slides[currentSlide].title}
                </span>
              </h1>
              
              <h2 className="text-xl lg:text-2xl font-medium text-muted">
                {slides[currentSlide].subtitle}
              </h2>
              
              <p className="text-lg text-muted max-w-xl">
                {slides[currentSlide].description}
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">500+</div>
                <div className="text-sm text-muted">Projets réalisés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-600">1200+</div>
                <div className="text-sm text-muted">Utilisateurs actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success-600">98%</div>
                <div className="text-sm text-muted">Satisfaction client</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/inscription" 
                className="btn btn-primary btn-xl group"
                onClick={() => handleCTAClick('signup')}
              >
                <span>Commencer gratuitement</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <button 
                className="btn btn-outline btn-xl group"
                onClick={() => handleCTAClick('demo')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 000-5H9v5zm0 0H7.5a2.5 2.5 0 000 5H9v-5z" />
                </svg>
                <span>Voir la démo</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-secondary-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-success-500 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-sm text-muted">+1000 professionnels nous font confiance</span>
              </div>
            </div>
          </div>

          {/* Visual Side */}
          <div className={`relative ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
            
            {/* Main Card */}
            <div className="relative">
              <div className="card shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="card-header">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-error-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-muted">finitio.app</div>
                  </div>
                </div>
                
                <div className="card-body space-y-6">
                  {/* Dashboard Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Dashboard Projet</h3>
                      <span className="text-xs bg-success-100 text-success-700 px-2 py-1 rounded-full">En cours</span>
                    </div>
                    
                    {/* Progress Bars */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Conception</span>
                          <span>85%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary-600 h-2 rounded-full" style={{width: '85%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Construction</span>
                          <span>60%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-secondary-600 h-2 rounded-full" style={{width: '60%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Finitions</span>
                          <span>25%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-warning-600 h-2 rounded-full" style={{width: '25%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Équipe projet</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          AC
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Aicha Benali</div>
                          <div className="text-xs text-muted">Cliente</div>
                        </div>
                        <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          YA
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Youssef Alami</div>
                          <div className="text-xs text-muted">Prestataire</div>
                        </div>
                        <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-success-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          FT
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Fatima Tazi</div>
                          <div className="text-xs text-muted">Architecte</div>
                        </div>
                        <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 card shadow-lg bg-success-50 border-success-200 p-4 animate-float">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">{slides[currentSlide].image}</div>
                  <div>
                    <div className="text-sm font-medium text-success-700">Nouveau message</div>
                    <div className="text-xs text-success-600">Devis validé </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 card shadow-lg bg-primary-50 border-primary-200 p-4 animate-float-delayed">
                <div className="flex items-center gap-2">
                  <div className="text-2xl"></div>
                  <div>
                    <div className="text-sm font-medium text-primary-700">Progression</div>
                    <div className="text-xs text-primary-600">+15% cette semaine</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-12 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-primary-600 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-600 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 1.5s;
        }
      `}</style>
    </section>
  );
}
