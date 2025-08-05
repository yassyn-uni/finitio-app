import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/connexion');
        return;
      }

      setUser(user);

      // Récupérer le profil utilisateur pour déterminer le rôle
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      setUserProfile(profile);

      // Rediriger automatiquement vers le dashboard spécifique si un rôle est défini
      if (profile?.role) {
        switch (profile.role.toLowerCase()) {
          case 'client':
            navigate('/dashboard-client');
            return;
          case 'architecte':
            navigate('/dashboard-architecte');
            return;
          case 'prestataire':
            navigate('/dashboard-prestataire');
            return;
        }
      }

      setLoading(false);
    };

    checkUserAndRedirect();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-700 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-700 text-white">
      <header className="p-6 shadow-md bg-indigo-950/90 backdrop-blur-md">
        <h1 className="text-3xl font-bold">
          Bienvenue {userProfile?.nom || user?.email} ! 👋
        </h1>
        <p className="text-white/70 mt-1">Choisissez votre espace de travail</p>
      </header>

      <main className="p-6">
        {/* Message d'orientation */}
        <div className="bg-white/10 rounded-xl p-6 mb-8 backdrop-blur-sm border border-white/20">
          <h2 className="text-xl font-semibold mb-3">🎯 Accès rapide aux dashboards</h2>
          <p className="text-white/80 mb-4">
            Votre rôle n'est pas encore défini. Choisissez l'espace qui correspond à votre profil :
          </p>
        </div>

        {/* Grille des dashboards spécialisés */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Dashboard Client */}
          <Link 
            to="/dashboard-client"
            className="group bg-white/10 rounded-xl p-6 shadow-lg hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-sm border border-white/20"
          >
            <div className="text-4xl mb-4 group-hover:animate-bounce">🏠</div>
            <h2 className="text-xl font-semibold mb-2">Espace Client</h2>
            <p className="text-white/80 text-sm">
              Gérez vos projets de construction, suivez les devis et communiquez avec vos équipes.
            </p>
            <div className="mt-4 flex items-center text-blue-300 group-hover:text-blue-200">
              <span className="text-sm font-medium">Accéder</span>
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Dashboard Architecte */}
          <Link 
            to="/dashboard-architecte"
            className="group bg-white/10 rounded-xl p-6 shadow-lg hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-sm border border-white/20"
          >
            <div className="text-4xl mb-4 group-hover:animate-bounce">🏛️</div>
            <h2 className="text-xl font-semibold mb-2">Espace Architecte</h2>
            <p className="text-white/80 text-sm">
              Concevez et supervisez vos projets, gérez les étapes et validez les devis techniques.
            </p>
            <div className="mt-4 flex items-center text-emerald-300 group-hover:text-emerald-200">
              <span className="text-sm font-medium">Accéder</span>
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Dashboard Prestataire */}
          <Link 
            to="/dashboard-prestataire"
            className="group bg-white/10 rounded-xl p-6 shadow-lg hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-sm border border-white/20"
          >
            <div className="text-4xl mb-4 group-hover:animate-bounce">🔨</div>
            <h2 className="text-xl font-semibold mb-2">Espace Prestataire</h2>
            <p className="text-white/80 text-sm">
              Découvrez des projets, soumettez vos devis et développez votre activité.
            </p>
            <div className="mt-4 flex items-center text-orange-300 group-hover:text-orange-200">
              <span className="text-sm font-medium">Accéder</span>
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Section d'aide */}
        <div className="mt-12 text-center">
          <div className="bg-white/10 rounded-xl p-6 max-w-2xl mx-auto backdrop-blur-sm border border-white/20">
            <h3 className="text-lg font-semibold mb-3">💡 Besoin d'aide ?</h3>
            <p className="text-white/80 text-sm mb-4">
              Si vous ne savez pas quel espace choisir, contactez notre support pour configurer votre profil.
            </p>
            <Link 
              to="/contact"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-300"
            >
              📨 Contacter le support
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
