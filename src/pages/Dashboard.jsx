import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserAndRedirect();
  }, []);

  const checkUserAndRedirect = async () => {
    try {
      console.log('🔍 Dashboard: Vérification utilisateur...');
      
      // Récupérer l'utilisateur connecté
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('❌ Erreur Auth:', authError);
        navigate('/connexion');
        return;
      }

      if (!user) {
        console.log('❌ Aucun utilisateur connecté - redirection vers connexion');
        navigate('/connexion');
        return;
      }

      console.log('✅ Utilisateur connecté:', user.email);
      console.log('🆔 UUID:', user.id);
      setUser(user);

      // Récupérer le profil utilisateur avec double vérification
      let profile = null;
      
      // Méthode 1: Recherche par UUID
      const { data: profileByUUID, error: uuidError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileByUUID && !uuidError) {
        profile = profileByUUID;
        console.log('✅ Profil trouvé par UUID:', profile);
      } else {
        console.log('⚠️ Profil non trouvé par UUID, tentative par email...');
        
        // Méthode 2: Recherche par email (fallback)
        const { data: profileByEmail, error: emailError } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single();

        if (profileByEmail && !emailError) {
          profile = profileByEmail;
          console.log('✅ Profil trouvé par email:', profile);
        } else {
          console.error('❌ Aucun profil trouvé:', { uuidError, emailError });
        }
      }

      setUserProfile(profile);
      setDebugInfo({
        userEmail: user.email,
        userId: user.id,
        profileFound: !!profile,
        profileRole: profile?.role,
        searchMethod: profileByUUID ? 'UUID' : 'Email'
      });

      // REDIRECTION FORCÉE SELON LE RÔLE
      if (profile?.role) {
        const role = profile.role.toLowerCase();
        console.log('🎯 Redirection pour rôle:', role, 'utilisateur:', user.email);
        
        // Stocker le rôle dans localStorage
        localStorage.setItem('user_role', role);

        // Redirection immédiate avec window.location.href
        switch (role) {
          case 'client':
            console.log('➡️ Redirection vers dashboard client');
            window.location.href = '/dashboard-client';
            return;
          case 'architecte':
            console.log('➡️ Redirection vers dashboard architecte');
            window.location.href = '/dashboard-architecte';
            return;
          case 'prestataire':
            console.log('➡️ Redirection vers dashboard prestataire');
            window.location.href = '/dashboard-prestataire';
            return;
          case 'fournisseur':
            console.log('➡️ Redirection vers dashboard fournisseur');
            window.location.href = '/dashboard-fournisseur';
            return;
          case 'admin':
            console.log('➡️ Redirection vers dashboard admin');
            window.location.href = '/dashboard';
            return;
          default:
            console.log('❌ Rôle non reconnu:', role, '- affichage sélection');
            break;
        }
      } else {
        console.log('❌ Aucun rôle défini - affichage sélection');
      }

    } catch (error) {
      console.error('💥 Erreur générale:', error);
      setDebugInfo({
        error: error.message,
        userEmail: user?.email || 'Inconnu'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Chargement de votre profil...</h2>
          <p className="text-gray-600">Vérification de vos permissions</p>
          
          {debugInfo && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left max-w-md mx-auto">
              <h3 className="font-semibold text-blue-900 mb-2">🔍 Informations de débogage :</h3>
              <pre className="text-xs text-blue-700 whitespace-pre-wrap">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header moderne */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Finitio
                </h1>
                <p className="text-sm text-gray-500">Plateforme de construction</p>
              </div>
            </div>
            
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{user.email}</p>
                  <p className="text-xs text-gray-500">
                    {userProfile?.role ? `Rôle: ${userProfile.role}` : 'Rôle non défini'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Message d'accueil */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Bienvenue sur Finitio ! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choisissez votre espace de travail pour accéder aux fonctionnalités adaptées à votre profil professionnel
          </p>
        </div>

        {/* Informations de débogage (si nécessaire) */}
        {debugInfo && (
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
            <h3 className="font-semibold text-yellow-800 mb-3">🔍 Informations de diagnostic :</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Email:</strong> {debugInfo.userEmail}
              </div>
              <div>
                <strong>Profil trouvé:</strong> {debugInfo.profileFound ? '✅ Oui' : '❌ Non'}
              </div>
              <div>
                <strong>Rôle détecté:</strong> {debugInfo.profileRole || 'Aucun'}
              </div>
              <div>
                <strong>Méthode:</strong> {debugInfo.searchMethod || 'N/A'}
              </div>
            </div>
          </div>
        )}

        {/* Grid des dashboards avec design moderne */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
          {/* Dashboard Client */}
          <Link 
            to="/dashboard-client"
            className="group relative overflow-hidden bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/10 group-hover:from-blue-500/10 group-hover:to-indigo-500/20 transition-all duration-500"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🏠</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Espace Client</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Gérez vos projets de construction, suivez les devis et communiquez avec vos équipes professionnelles.
              </p>
              <div className="flex items-center text-blue-600 group-hover:text-blue-700 font-semibold">
                <span>Accéder à l'espace</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Dashboard Architecte */}
          <Link 
            to="/dashboard-architecte"
            className="group relative overflow-hidden bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/10 group-hover:from-emerald-500/10 group-hover:to-green-500/20 transition-all duration-500"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🏛️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Espace Architecte</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Concevez et supervisez vos projets, gérez les étapes et validez les devis techniques.
              </p>
              <div className="flex items-center text-emerald-600 group-hover:text-emerald-700 font-semibold">
                <span>Accéder à l'espace</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Dashboard Prestataire */}
          <Link 
            to="/dashboard-prestataire"
            className="group relative overflow-hidden bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/10 group-hover:from-orange-500/10 group-hover:to-amber-500/20 transition-all duration-500"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🔨</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Espace Prestataire</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Découvrez des projets, soumettez vos devis et développez votre activité.
              </p>
              <div className="flex items-center text-orange-600 group-hover:text-orange-700 font-semibold">
                <span>Accéder à l'espace</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Dashboard Fournisseur */}
          <Link 
            to="/dashboard-fournisseur"
            className="group relative overflow-hidden bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/10 group-hover:from-purple-500/10 group-hover:to-pink-500/20 transition-all duration-500"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📦</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Espace Fournisseur</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Gérez votre catalogue de matériaux, traitez les commandes et développez votre réseau.
              </p>
              <div className="flex items-center text-purple-600 group-hover:text-purple-700 font-semibold">
                <span>Accéder à l'espace</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Section d'aide moderne */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Besoin d'aide ?</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Si vous ne savez pas quel espace choisir ou si votre rôle n'est pas encore configuré, 
              contactez notre équipe support pour une assistance personnalisée.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                📧 Contacter le support
              </Link>
              <Link 
                to="/connexion"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold"
              >
                🔄 Se reconnecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
