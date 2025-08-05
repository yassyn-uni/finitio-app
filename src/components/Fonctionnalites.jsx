import React from 'react';
import { FinitioIcon, FinitioIllustration } from '../assets/FinitioAssets';

export default function Fonctionnalites() {
  const fonctionnalites = [
    {
      icon: 'project',
      title: 'Suivi en temps réel',
      description: 'Suivez l\'avancement de vos chantiers avec des mises à jour instantanées et des notifications intelligentes',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    {
      icon: 'communication',
      title: 'Messagerie intégrée',
      description: 'Communiquez directement avec vos équipes et clients via notre système de messagerie sécurisé',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      icon: 'planning',
      title: 'Planification avancée',
      description: 'Organisez vos projets avec des outils de planification Kanban et des calendriers interactifs',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'from-purple-50 to-indigo-50'
    },
    {
      icon: 'finance',
      title: 'Gestion financière',
      description: 'Centralisez vos devis, factures et paiements avec un suivi budgétaire automatisé',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50'
    },
    {
      icon: 'mobile',
      title: 'Accès multi-plateforme',
      description: 'Travaillez depuis n\'importe où avec nos applications web, mobile et desktop synchronisées',
      color: 'from-teal-500 to-blue-500',
      bgColor: 'from-teal-50 to-blue-50'
    },
    {
      icon: 'security',
      title: 'Sécurité renforcée',
      description: 'Vos données sont protégées par un chiffrement de niveau bancaire et des sauvegardes automatiques',
      color: 'from-gray-600 to-gray-800',
      bgColor: 'from-gray-50 to-gray-100'
    }
  ];

  const processus = [
    {
      numero: '01',
      titre: 'Créez votre projet',
      description: 'Définissez vos besoins et trouvez les bons professionnels',
      icon: 'project'
    },
    {
      numero: '02',
      titre: 'Collaborez en équipe',
      description: 'Coordonnez vos équipes et suivez chaque étape',
      icon: 'team'
    },
    {
      numero: '03',
      titre: 'Livrez avec succès',
      description: 'Finalisez votre projet dans les temps et le budget',
      icon: 'success'
    }
  ];

  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden">
      {/* Fond décoratif */}
      <div className="absolute inset-0 opacity-5">
        <FinitioIllustration type="construction" size="xl" className="absolute top-20 left-10 rotate-12" />
        <FinitioIllustration type="blueprint" size="lg" className="absolute bottom-20 right-10 -rotate-12" />
      </div>

      <div className="container mx-auto relative z-10">
        {/* En-tête de section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Fonctionnalités 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> avancées</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez tous les outils dont vous avez besoin pour mener à bien vos projets de construction, 
            de la planification à la livraison.
          </p>
        </div>

        {/* Grille des fonctionnalités */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {fonctionnalites.map((fonctionnalite, index) => (
            <div 
              key={index}
              className="group relative animate-fade-in-up hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`p-8 rounded-3xl bg-gradient-to-br ${fonctionnalite.bgColor} border border-white/50 shadow-lg backdrop-blur-sm transition-all duration-500 group-hover:shadow-2xl h-full`}>
                {/* Icône */}
                <div className="mb-6">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${fonctionnalite.color} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <FinitioIcon 
                      type={fonctionnalite.icon} 
                      size="md" 
                      className="filter brightness-0 invert" 
                    />
                  </div>
                </div>

                {/* Contenu */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {fonctionnalite.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {fonctionnalite.description}
                </p>

                {/* Effet de survol */}
                <div className={`absolute inset-0 bg-gradient-to-br ${fonctionnalite.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Section processus */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 animate-fade-in-up">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Un processus simple et efficace en 3 étapes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {processus.map((etape, index) => (
              <div 
                key={index}
                className="relative text-center animate-slide-in-right"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Ligne de connexion */}
                {index < processus.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform translate-x-1/2 z-0"></div>
                )}

                {/* Numéro */}
                <div className="relative z-10 w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {etape.numero}
                </div>

                {/* Icône */}
                <div className="mb-4">
                  <FinitioIcon 
                    type={etape.icon} 
                    size="lg" 
                    className="mx-auto opacity-80" 
                  />
                </div>

                {/* Contenu */}
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  {etape.titre}
                </h4>
                <p className="text-gray-600">
                  {etape.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section CTA */}
        <div className="text-center mt-16 animate-fade-in-up">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à transformer vos projets ?
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de professionnels qui utilisent déjà Finitio pour optimiser leurs chantiers
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-premium group">
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Commencer gratuitement
                </span>
              </button>
              
              <button className="px-8 py-4 rounded-2xl font-semibold text-white border-2 border-white/30 hover:border-white/60 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm hover:bg-white/10">
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Voir la démo
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
