import React from 'react';
import { FinitioIcon, FinitioIllustration } from '../assets/FinitioAssets';

export default function Pourquoi() {
  const avantages = [
    {
      icon: 'client',
      title: 'Pour les Clients',
      description: 'Trouvez facilement des professionnels qualifiés et suivez vos projets en temps réel',
      color: 'from-blue-500 to-purple-500',
      bgColor: 'from-blue-50 to-purple-50'
    },
    {
      icon: 'contractor',
      title: 'Pour les Prestataires',
      description: 'Accédez à de nouveaux projets et gérez vos chantiers efficacement',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50'
    },
    {
      icon: 'architect',
      title: 'Pour les Architectes',
      description: 'Coordonnez vos équipes et supervisez chaque étape de construction',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'from-emerald-50 to-teal-50'
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Motif de fond subtil */}
      <div className="absolute inset-0 opacity-5">
        <FinitioIllustration type="blueprint" size="xl" className="absolute top-10 right-10" />
        <FinitioIllustration type="tools" size="lg" className="absolute bottom-10 left-10" />
      </div>

      <div className="container mx-auto relative z-10">
        {/* En-tête de section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Pourquoi choisir 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Finitio</span> ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Une plateforme conçue pour simplifier et optimiser chaque aspect de vos projets de construction, 
            de la conception à la réalisation.
          </p>
        </div>

        {/* Grille des avantages */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {avantages.map((avantage, index) => (
            <div 
              key={index}
              className="group relative animate-fade-in-up hover-lift"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={`p-8 rounded-3xl bg-gradient-to-br ${avantage.bgColor} border border-white/50 shadow-lg backdrop-blur-sm transition-all duration-500 group-hover:shadow-2xl`}>
                {/* Icône */}
                <div className="mb-6 flex justify-center">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${avantage.color} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <FinitioIcon 
                      type={avantage.icon} 
                      size="lg" 
                      className="filter brightness-0 invert" 
                    />
                  </div>
                </div>

                {/* Contenu */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  {avantage.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {avantage.description}
                </p>

                {/* Effet de survol */}
                <div className={`absolute inset-0 bg-gradient-to-br ${avantage.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Section statistiques impressionnantes */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-12 text-white animate-fade-in-up">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Des résultats qui parlent d'eux-mêmes
            </h3>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Rejoignez des milliers de professionnels qui font confiance à Finitio
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Projets réalisés</div>
            </div>
            <div className="text-center animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
              <div className="text-blue-200">Satisfaction client</div>
            </div>
            <div className="text-center animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
              <div className="text-4xl md:text-5xl font-bold mb-2">24h</div>
              <div className="text-blue-200">Temps de réponse</div>
            </div>
            <div className="text-center animate-slide-in-right" style={{ animationDelay: '0.8s' }}>
              <div className="text-4xl md:text-5xl font-bold mb-2">150+</div>
              <div className="text-blue-200">Professionnels</div>
            </div>
          </div>
        </div>

        {/* Section témoignages */}
        <div className="mt-20 text-center animate-fade-in-up">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">
            Ce que disent nos utilisateurs
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                nom: "Marie Dubois",
                role: "Cliente",
                avatar: "client",
                temoignage: "Finitio a transformé mon expérience de rénovation. Tout est transparent et organisé !",
                note: 5
              },
              {
                nom: "Pierre Martin",
                role: "Prestataire",
                avatar: "contractor", 
                temoignage: "Grâce à Finitio, j'ai trouvé de nouveaux clients et optimisé ma gestion de chantier.",
                note: 5
              },
              {
                nom: "Sophie Leroy",
                role: "Architecte",
                avatar: "architect",
                temoignage: "La coordination d'équipe n'a jamais été aussi simple. Un outil indispensable !",
                note: 5
              }
            ].map((temoignage, index) => (
              <div 
                key={index}
                className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-4">
                  <FinitioIcon 
                    type={temoignage.avatar} 
                    size="md" 
                    className="mr-4" 
                  />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{temoignage.nom}</div>
                    <div className="text-sm text-gray-500">{temoignage.role}</div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 italic">
                  "{temoignage.temoignage}"
                </p>
                
                <div className="flex justify-center">
                  {[...Array(temoignage.note)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
