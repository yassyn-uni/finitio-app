import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import usePageTracking from '../hooks/usePageTracking';

export default function DashboardArchitecte() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [projets, setProjets] = useState([]);
  const [etapes, setEtapes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 📊 Tracker cette page
  usePageTracking('Dashboard Architecte', {
    user_role: 'architecte',
    page_category: 'dashboard'
  });

  // 🎯 Tracker les clics sur les modules
  const handleModuleClick = (moduleName, modulePath) => {
    // trackCTAClick(moduleName, 'dashboard_architecte');
  };

  // 📈 Tracker les interactions avec les statistiques
  const handleStatClick = (statName, statValue) => {
    // trackEvent('dashboard_stat_interaction', {
    //   stat_name: statName,
    //   stat_value: statValue,
    //   user_role: 'architecte'
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

      // Récupérer les projets de l'architecte
      const { data: projetsData } = await supabase
        .from('projets')
        .select('*')
        .eq('architecte_id', user.id)
        .order('created_at', { ascending: false });

      setProjets(projetsData || []);

      // Simuler des étapes pour les statistiques
      const etapesSimulees = [
        { id: 1, statut: 'terminee', projet_id: 1 },
        { id: 2, statut: 'en_cours', projet_id: 1 },
        { id: 3, statut: 'en_attente', projet_id: 2 },
        { id: 4, statut: 'planifiee', projet_id: 2 },
        { id: 5, statut: 'terminee', projet_id: 3 },
      ];
      setEtapes(etapesSimulees);

      setLoading(false);
    };

    getUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const stats = [
    { 
      name: 'Projets actifs', 
      value: projets.filter(p => p.statut !== 'terminé').length,
      icon: '🏗️',
      color: 'from-emerald-500 to-emerald-600'
    },
    { 
      name: 'Étapes terminées', 
      value: etapes.filter(e => e.statut === 'terminee').length,
      icon: '✅',
      color: 'from-green-500 to-green-600'
    },
    { 
      name: 'Étapes en cours', 
      value: etapes.filter(e => e.statut === 'en_cours').length,
      icon: '⏳',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      name: 'Devis à valider', 
      value: '4',
      icon: '📋',
      color: 'from-orange-500 to-orange-600'
    }
  ];

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
      link: '/gestion-etapes',
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
      icon: '👥', 
      link: '/annuaire-prestataires',
      description: 'Trouvez des partenaires qualifiés',
      color: 'from-orange-500 to-amber-600',
      delay: '400ms'
    },
  ];

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
            <span className="text-sm font-medium text-gray-700">
              {userProfile?.nom || user?.email} - Certification professionnelle active
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
            to={module.link}
            className="group"
            style={{ animationDelay: module.delay }}
            onClick={() => handleModuleClick(module.title, module.link)}
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
                <div className="mt-4 flex items-center text-xs text-gray-500 group-hover:text-emerald-600 transition-colors duration-300">
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
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-300 rounded-full animate-float opacity-30"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-teal-300 rounded-full animate-float opacity-20" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-cyan-300 rounded-full animate-float opacity-40" style={{animationDelay: '4s'}}></div>
      </div>
    </div>
  );
}
