import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function DashboardFournisseur() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    produits: 0,
    commandes: 0,
    ca_mensuel: 0,
    vues_catalogue: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkUserAndFetchData();
  }, []);

  const checkUserAndFetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/connexion');
        return;
      }

      setUser(user);

      // Récupérer le profil utilisateur
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erreur profil:', error);
      } else {
        setUserProfile(profile);
      }

      // Simuler des statistiques fournisseur
      setStats({
        produits: 156,
        commandes: 23,
        ca_mensuel: 45000,
        vues_catalogue: 1247
      });

    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleClick = (module) => {
    console.log(`Navigation vers ${module}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Particules flottantes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-300 rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6">
        {/* En-tête */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Espace Fournisseur
              </h1>
              <p className="text-gray-600 mt-2">
                Gérez votre catalogue et développez votre activité
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {userProfile?.nom || 'Fournisseur'} - Compte professionnel actif
              </p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-xs text-green-600">En ligne</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              icon: '📦', 
              label: 'Produits', 
              value: stats.produits, 
              color: 'purple',
              trend: '+12%'
            },
            { 
              icon: '🛒', 
              label: 'Commandes', 
              value: stats.commandes, 
              color: 'pink',
              trend: '+8%'
            },
            { 
              icon: '💰', 
              label: 'CA Mensuel', 
              value: `${stats.ca_mensuel.toLocaleString()}€`, 
              color: 'indigo',
              trend: '+15%'
            },
            { 
              icon: '👁️', 
              label: 'Vues Catalogue', 
              value: stats.vues_catalogue, 
              color: 'violet',
              trend: '+25%'
            }
          ].map((stat, index) => (
            <div
              key={index}
              className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`text-xs px-2 py-1 rounded-full bg-${stat.color}-100 text-${stat.color}-600`}>
                  {stat.trend}
                </span>
              </div>
              <h3 className={`text-2xl font-bold text-${stat.color}-600 mb-1`}>
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Modules principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: '📦 Catalogue Produits',
              description: 'Gérer votre catalogue de matériaux et équipements',
              link: '/catalogue-produits',
              color: 'purple',
              features: ['Ajouter produits', 'Gestion stock', 'Prix dynamiques']
            },
            {
              title: '🛒 Gestion Commandes',
              description: 'Suivre et traiter vos commandes clients',
              link: '/commandes-fournisseur',
              color: 'pink',
              features: ['Commandes en cours', 'Historique', 'Facturation']
            },
            {
              title: '📊 Publicités Ciblées',
              description: 'Créer des campagnes publicitaires ciblées',
              link: '/publicites-fournisseur',
              color: 'indigo',
              features: ['Ciblage clients', 'Analytics', 'ROI tracking']
            },
            {
              title: '🚚 Suivi Livraisons',
              description: 'Gérer la logistique et les livraisons',
              link: '/livraisons-fournisseur',
              color: 'violet',
              features: ['Planning livraisons', 'Tracking', 'Notifications']
            },
            {
              title: '👥 Réseau Clients',
              description: 'Développer votre réseau de clients professionnels',
              link: '/reseau-clients',
              color: 'purple',
              features: ['Prospects', 'Fidélisation', 'Communication']
            },
            {
              title: '📈 Analytics & Rapports',
              description: 'Analyser vos performances et optimiser',
              link: '/analytics-fournisseur',
              color: 'pink',
              features: ['Ventes', 'Tendances', 'Prévisions']
            }
          ].map((module, index) => (
            <div
              key={index}
              className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group animate-fade-in-up`}
              style={{ animationDelay: `${200 + index * 100}ms` }}
              onClick={() => handleModuleClick(module.link)}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className={`text-lg font-semibold text-${module.color}-700 group-hover:text-${module.color}-800 transition-colors`}>
                  {module.title}
                </h3>
                <div className={`w-8 h-8 rounded-lg bg-${module.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <i className={`fas fa-arrow-right text-${module.color}-600 text-sm`}></i>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {module.description}
              </p>
              
              <div className="space-y-1">
                {module.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-xs text-gray-500">
                    <div className={`w-1 h-1 rounded-full bg-${module.color}-400 mr-2`}></div>
                    {feature}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className={`text-xs font-medium text-${module.color}-600 group-hover:text-${module.color}-700 transition-colors`}>
                  Accéder →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Section actualités fournisseurs */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🔔 Actualités Fournisseurs
          </h3>
          <div className="space-y-3">
            {[
              { text: 'Nouveau: Intégration avec les systèmes ERP', time: '2h', type: 'info' },
              { text: 'Promotion: Réduction de 20% sur les frais de commission', time: '1j', type: 'success' },
              { text: 'Webinar: Optimiser votre catalogue produits', time: '3j', type: 'warning' }
            ].map((news, index) => (
              <div key={index} className={`flex items-center p-3 rounded-lg bg-${news.type === 'info' ? 'blue' : news.type === 'success' ? 'green' : 'orange'}-50 border border-${news.type === 'info' ? 'blue' : news.type === 'success' ? 'green' : 'orange'}-200`}>
                <div className={`w-2 h-2 rounded-full bg-${news.type === 'info' ? 'blue' : news.type === 'success' ? 'green' : 'orange'}-500 mr-3`}></div>
                <span className="text-sm text-gray-700 flex-1">{news.text}</span>
                <span className="text-xs text-gray-500">{news.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
