import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import usePageTracking from '../hooks/usePageTracking';

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
    // trackCTAClick(moduleName, 'dashboard_client');
    // trackEvent('dashboard_module_click', {
    //   module_name: moduleName,
    //   module_path: modulePath,
    //   user_role: 'client',
    //   timestamp: new Date().toISOString()
    // });
  };

  // 📈 Tracker les interactions avec les statistiques
  const handleStatClick = (statName, statValue) => {
    // trackEvent('dashboard_stat_interaction', {
    //   stat_name: statName,
    //   stat_value: statValue,
    //   user_role: 'client',
    //   timestamp: new Date().toISOString()
    // });
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
      // trackEvent('dashboard_loaded', {
      //   user_role: 'client',
      //   projects_count: projetsData?.length || 0,
      //   timestamp: new Date().toISOString()
      // });
    };

    getUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center">
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
      delay: '0ms'
    },
    {
      title: 'Paiements',
      description: 'Suivre vos factures et paiements',
      icon: '💳',
      path: '/paiements',
      color: 'from-green-500 to-green-600',
      delay: '100ms'
    },
    {
      title: 'Devis Reçus',
      description: 'Consulter et valider les devis',
      icon: '📋',
      path: '/devis',
      color: 'from-purple-500 to-purple-600',
      delay: '200ms'
    },
    {
      title: 'Liste d\'Achats',
      description: 'Gérer vos achats de matériaux',
      icon: '🛒',
      path: '/liste-achats',
      color: 'from-orange-500 to-orange-600',
      delay: '300ms'
    },
    {
      title: 'Messages',
      description: 'Communiquer avec votre équipe',
      icon: '💬',
      path: '/messages',
      color: 'from-pink-500 to-rose-600',
      delay: '400ms'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6">
      {/* Header avec animation */}
      <div className="animate-fade-in-up mb-8">
        <div className="text-center mb-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Espace Client
          </h1>
          <p className="text-gray-600 text-lg">
            Pilotez vos projets de construction en toute sérénité
          </p>
        </div>
        
        {/* Indicateur de statut */}
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-soft"></div>
            <span className="text-sm font-medium text-gray-700">
              {userProfile?.nom || user?.email} - Compte actif
            </span>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-6xl mx-auto">
        {stats.map((stat, index) => (
          <div 
            key={stat.name}
            className="card-interactive animate-fade-in-up bg-white/80 backdrop-blur-sm border border-white/20"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => handleStatClick(stat.name, stat.value)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
            
            <div className="relative p-6 text-center">
              <div className="text-3xl mb-2 transform hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grille des modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {modules.map((module, index) => (
          <Link 
            key={index} 
            to={module.path}
            className="group"
            style={{ animationDelay: module.delay }}
            onClick={() => handleModuleClick(module.title, module.path)}
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
                <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {module.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                  {module.description}
                </p>
                
                {/* Indicateur de navigation */}
                <div className="mt-4 flex items-center text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                  <span>Accéder</span>
                  <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Particules flottantes en arrière-plan */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-300 rounded-full animate-float opacity-30"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-indigo-300 rounded-full animate-float opacity-20" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-purple-300 rounded-full animate-float opacity-40" style={{animationDelay: '4s'}}></div>
      </div>
    </div>
  );
}
