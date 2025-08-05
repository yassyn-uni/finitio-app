import React from 'react';
import { Link } from 'react-router-dom';

const modules = [
  { 
    title: 'Créer un projet', 
    icon: '🏗️', 
    link: '/nouveau-projet',
    description: 'Initiez de nouveaux projets architecturaux',
    color: 'from-emerald-500 to-teal-600',
    delay: '0ms'
  },
  { 
    title: 'Mes projets', 
    icon: '📁', 
    link: '/projets',
    description: 'Supervisez tous vos projets en cours',
    color: 'from-blue-500 to-cyan-600',
    delay: '100ms'
  },
  { 
    title: 'Gestion des étapes', 
    icon: '📋', 
    link: '/projets',
    description: 'Planifiez et suivez les phases de construction',
    color: 'from-indigo-500 to-purple-600',
    delay: '200ms'
  },
  { 
    title: 'Validation des devis', 
    icon: '✅', 
    link: '/validation-devis',
    description: 'Validez la conformité technique des propositions',
    color: 'from-green-500 to-emerald-600',
    delay: '300ms'
  },
  { 
    title: 'Annuaire prestataires', 
    icon: '📋', 
    link: '/annuaire-prestataires',
    description: 'Trouvez des partenaires qualifiés',
    color: 'from-orange-500 to-amber-600',
    delay: '400ms'
  },
];

export default function DashboardArchitecte() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 p-6">
      {/* Header avec animation */}
      <div className="animate-fade-in-up mb-8">
        <div className="text-center mb-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Espace Architecte
          </h1>
          <p className="text-gray-600 text-lg">
            Concevez et supervisez vos projets architecturaux
          </p>
        </div>
        
        {/* Indicateur de statut */}
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-soft"></div>
            <span className="text-sm font-medium text-gray-700">Certification professionnelle active</span>
          </div>
        </div>
      </div>

      {/* Grille des modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {modules.map((module, index) => (
          <Link 
            key={index} 
            to={module.link}
            className="group"
            style={{ animationDelay: module.delay }}
          >
            <div className="card-interactive animate-fade-in-up bg-white/80 backdrop-blur-sm border border-white/20 h-full">
              {/* Gradient de fond au survol */}
              <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
              
              {/* Contenu de la carte */}
              <div className="relative p-6 flex flex-col items-center text-center h-full">
                {/* Icône avec effet de flottement */}
                <div className="text-5xl mb-4 group-hover:animate-float transition-all duration-300 transform group-hover:scale-110">
                  {module.icon}
                </div>
                
                {/* Titre avec gradient au survol */}
                <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {module.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                  {module.description}
                </p>
                
                {/* Indicateur de navigation */}
                <div className="mt-4 flex items-center text-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span className="text-sm font-medium">Accéder</span>
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              {/* Effet de brillance au survol */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Section statistiques rapides */}
      <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Votre expertise
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
              <div className="text-2xl font-bold text-emerald-600 animate-pulse-soft">15</div>
              <div className="text-sm text-emerald-800">Projets supervisés</div>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 animate-pulse-soft">42</div>
              <div className="text-sm text-blue-800">Devis validés</div>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="text-2xl font-bold text-purple-600 animate-pulse-soft">8</div>
              <div className="text-sm text-purple-800">En validation</div>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200">
              <div className="text-2xl font-bold text-teal-600 animate-pulse-soft">98%</div>
              <div className="text-sm text-teal-800">Conformité</div>
            </div>
          </div>
        </div>
      </div>

      {/* Effet de particules en arrière-plan */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-float opacity-30"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-teal-400 rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-float opacity-20" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-green-400 rounded-full animate-float opacity-35" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
}
