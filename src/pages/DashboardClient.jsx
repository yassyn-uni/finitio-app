import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import usePageTracking from '../hooks/usePageTracking';
import { trackEvent, trackCTAClick } from '../utils/analytics';

export default function DashboardClient() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 📊 Tracker cette page
  usePageTracking('Dashboard Client', {
    user_role: 'client',
    page_category: 'dashboard'
  });

  // 🎯 Tracker les clics sur les modules
  const handleModuleClick = (moduleName, modulePath) => {
    trackCTAClick(moduleName, 'dashboard_client');
    trackEvent('dashboard_module_click', {
      module_name: moduleName,
      module_path: modulePath,
      user_role: 'client',
      timestamp: new Date().toISOString()
    });
  };

  // 📈 Tracker les interactions avec les statistiques
  const handleStatClick = (statName, statValue) => {
    trackEvent('dashboard_stat_interaction', {
      stat_name: statName,
      stat_value: statValue,
      user_role: 'client',
      timestamp: new Date().toISOString()
    });
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/connexion');
        return;
      }

      setUser(user);

      // Récupérer le profil utilisateur
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      setUserProfile(profile);

      // Récupérer les projets du client
      const { data: projetsData } = await supabase
        .from('projets')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      setProjets(projetsData || []);
      setLoading(false);

      // 📊 Tracker le chargement du dashboard
      trackEvent('dashboard_loaded', {
        user_role: 'client',
        projects_count: projetsData?.length || 0,
        timestamp: new Date().toISOString()
      });
    };

    getUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    { 
      name: 'Projets actifs', 
      value: projets.filter(p => p.statut !== 'terminé').length,
      icon: '🏗️',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      name: 'Projets terminés', 
      value: projets.filter(p => p.statut === 'terminé').length,
      icon: '✅',
      color: 'from-green-500 to-green-600'
    },
    { 
      name: 'Budget total', 
      value: `${projets.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}€`,
      icon: '💰',
      color: 'from-yellow-500 to-yellow-600'
    },
    { 
      name: 'Messages non lus', 
      value: '3',
      icon: '💬',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const modules = [
    {
      title: 'Mes Projets',
      description: 'Gérer et suivre vos projets de construction',
      icon: '🏗️',
      path: '/projets',
      color: 'from-blue-500 to-blue-600',
      features: ['Suivi en temps réel', 'Gestion des étapes', 'Communication équipe']
    },
    {
      title: 'Paiements',
      description: 'Suivre vos factures et paiements',
      icon: '💳',
      path: '/paiements',
      color: 'from-green-500 to-green-600',
      features: ['Factures en ligne', 'Historique paiements', 'Alertes échéances']
    },
    {
      title: 'Devis Reçus',
      description: 'Consulter et valider les devis',
      icon: '📋',
      path: '/devis',
      color: 'from-purple-500 to-purple-600',
      features: ['Comparaison devis', 'Validation rapide', 'Négociation prix']
    },
    {
      title: 'Liste d\'Achats',
      description: 'Gérer vos achats de matériaux',
      icon: '🛒',
      path: '/liste-achats',
      color: 'from-orange-500 to-orange-600',
      features: ['Liste partagée', 'Suivi livraisons', 'Contrôle budget']
    },
    {
      title: 'Messages',
      description: 'Communiquer avec votre équipe',
      icon: '💬',
      path: '/messages',
      color: 'from-indigo-500 to-indigo-600',
      features: ['Chat temps réel', 'Partage fichiers', 'Notifications push']
    },
    {
      title: 'Annuaire',
      description: 'Trouver des professionnels qualifiés',
      icon: '👥',
      path: '/annuaire',
      color: 'from-teal-500 to-teal-600',
      features: ['Recherche avancée', 'Avis clients', 'Contact direct']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header avec particules animées */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        {/* Particules flottantes */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
                Bienvenue, {userProfile?.nom || 'Client'} ! 👋
              </h1>
              <p className="text-xl text-blue-100 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Gérez vos projets de construction en toute simplicité
              </p>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {stats.map((stat, index) => (
                <div
                  key={stat.name}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleStatClick(stat.name, stat.value)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300`}>
                      {stat.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-blue-200 text-sm">{stat.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modules principaux */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Vos outils de gestion</h2>
          <p className="text-xl text-gray-600">Accédez rapidement à toutes vos fonctionnalités</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <Link
              key={module.title}
              to={module.path}
              className="group block"
              onClick={() => handleModuleClick(module.title, module.path)}
            >
              <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Header du module */}
                <div className={`bg-gradient-to-r ${module.color} p-6 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-4">{module.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                    <p className="text-white/90 text-sm">{module.description}</p>
                  </div>
                </div>

                {/* Contenu du module */}
                <div className="p-6">
                  <ul className="space-y-2">
                    {module.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-center text-blue-600 group-hover:text-blue-700 font-medium">
                    Accéder au module
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Section projets récents */}
      {projets.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Projets récents</h3>
              <Link
                to="/projets"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                onClick={() => handleModuleClick('Voir tous les projets', '/projets')}
              >
                Voir tout
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projets.slice(0, 3).map((projet) => (
                <Link
                  key={projet.id}
                  to={`/projets/${projet.id}`}
                  className="block p-6 border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all duration-300"
                  onClick={() => handleModuleClick(`Projet ${projet.titre}`, `/projets/${projet.id}`)}
                >
                  <h4 className="font-semibold text-gray-900 mb-2">{projet.titre}</h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{projet.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      projet.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                      projet.statut === 'terminé' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {projet.statut?.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {projet.budget?.toLocaleString()}€
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
