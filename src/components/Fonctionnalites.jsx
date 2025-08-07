import React from 'react';

const Fonctionnalites = () => {
  const features = [
    {
      id: 'gestion-projets',
      title: 'Gestion de Projets Complète',
      description: 'Créez, organisez et suivez tous vos projets de construction depuis une interface unique et intuitive.',
      icon: 'fas fa-project-diagram',
      details: ['Création de projets illimitée', 'Suivi d\'avancement en temps réel', 'Gestion des budgets', 'Planification des délais']
    },
    {
      id: 'kanban-etapes',
      title: 'Kanban des Étapes',
      description: 'Visualisez et gérez l\'avancement de vos projets avec un système Kanban intuitif.',
      icon: 'fas fa-tasks',
      details: ['Glisser-déposer des étapes', 'Statuts personnalisables', 'Notifications automatiques', 'Historique des modifications']
    },
    {
      id: 'gestion-devis',
      title: 'Système de Devis Avancé',
      description: 'Créez, envoyez et suivez vos devis avec un système de gestion complet.',
      icon: 'fas fa-file-invoice-dollar',
      details: ['Modèles de devis', 'Calculs automatiques', 'Suivi des acceptations', 'Intégration facturation']
    },
    {
      id: 'messagerie-integree',
      title: 'Messagerie Intégrée',
      description: 'Communiquez efficacement avec votre équipe directement dans la plateforme.',
      icon: 'fas fa-comments',
      details: ['Chat en temps réel', 'Notifications push', 'Partage de fichiers', 'Historique des conversations']
    },
    {
      id: 'annuaire-prestataires',
      title: 'Annuaire des Prestataires',
      description: 'Trouvez et contactez facilement des prestataires qualifiés pour vos projets.',
      icon: 'fas fa-users',
      details: ['Base de données étendue', 'Filtres avancés', 'Évaluations et avis', 'Contact direct']
    },
    {
      id: 'catalogue-fournisseurs',
      title: 'Catalogue Fournisseurs',
      description: 'Accédez à un vaste catalogue de matériaux et équipements de construction.',
      icon: 'fas fa-warehouse',
      details: ['Milliers de produits', 'Comparaison de prix', 'Commande en ligne', 'Livraison trackée']
    },
    {
      id: 'gestion-paiements',
      title: 'Gestion des Paiements',
      description: 'Suivez vos factures, paiements et budget projet en temps réel.',
      icon: 'fas fa-credit-card',
      details: ['Facturation automatique', 'Suivi des paiements', 'Rapports financiers', 'Intégration bancaire']
    },
    {
      id: 'planning-intelligent',
      title: 'Planning Intelligent',
      description: 'Optimisez vos ressources avec un système de planification automatisé.',
      icon: 'fas fa-calendar-alt',
      details: ['Planification automatique', 'Gestion des ressources', 'Détection de conflits', 'Optimisation des délais']
    },
    {
      id: 'reporting-avance',
      title: 'Reporting Avancé',
      description: 'Générez des rapports détaillés sur l\'avancement et la performance de vos projets.',
      icon: 'fas fa-chart-line',
      details: ['Tableaux de bord interactifs', 'Rapports personnalisables', 'Export PDF/Excel', 'Analyses prédictives']
    }
  ];

  const roles = [
    {
      name: 'Clients',
      icon: 'fas fa-home',
      color: 'blue',
      features: ['Suivi de projets', 'Communication équipe', 'Validation devis', 'Gestion paiements']
    },
    {
      id: 'architectes',
      title: 'Architectes',
      icon: 'fas fa-drafting-compass',
      color: 'emerald',
      features: ['Conception projets', 'Validation technique', 'Gestion étapes', 'Coordination équipes']
    },
    {
      id: 'prestataires',
      title: 'Prestataires',
      icon: 'fas fa-hard-hat',
      color: 'orange',
      features: ['Recherche projets', 'Soumission devis', 'Gestion chantiers', 'Facturation']
    },
    {
      id: 'fournisseurs',
      title: 'Fournisseurs',
      icon: 'fas fa-truck',
      color: 'purple',
      features: ['Catalogue produits', 'Gestion commandes', 'Publicités ciblées', 'Suivi livraisons']
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Fonctionnalités Complètes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez toutes les fonctionnalités qui font de Finitio la plateforme de référence 
            pour la gestion de projets de construction au Maroc.
          </p>
        </div>

        {/* Fonctionnalités principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <i className={`${feature.icon} text-blue-600 text-xl`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
              </div>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {feature.description}
              </p>
              
              <ul className="space-y-2">
                {feature.details.map((detail, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Section rôles */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Adapté à Tous les Acteurs du BTP
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role) => (
              <div 
                key={role.name}
                className={`bg-${role.color}-50 border border-${role.color}-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300`}
              >
                <div className={`w-16 h-16 bg-${role.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <i className={`${role.icon} text-${role.color}-600 text-2xl`}></i>
                </div>
                
                <h4 className={`text-xl font-semibold text-${role.color}-800 mb-4`}>
                  {role.name}
                </h4>
                
                <ul className="space-y-2">
                  {role.features.map((feature, index) => (
                    <li key={index} className={`text-sm text-${role.color}-700`}>
                      • {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Prêt à transformer votre façon de gérer vos projets ?
          </h3>
          <p className="text-gray-600 mb-8">
            Rejoignez plus de 2500+ professionnels qui font confiance à Finitio
          </p>
          <div className="space-x-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Commencer gratuitement
            </button>
            <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Voir la démo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Fonctionnalites;
