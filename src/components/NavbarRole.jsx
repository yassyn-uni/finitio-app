import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function NavbarRole({ role, bgColor, textColor }) {
  const [userEmail, setUserEmail] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        setUserEmail(data.user.email);
      }
    };
    fetchUser();
  }, []);

  // FONCTION DE DÉCONNEXION ULTRA-ROBUSTE
  const handleLogout = async (e) => {
    // Empêcher la propagation et le comportement par défaut
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('🚪 DÉCONNEXION FORCÉE INITIÉE...');
    
    // Éviter les clics multiples
    if (isLoggingOut) {
      console.log('⏳ Déconnexion déjà en cours...');
      return;
    }
    
    setIsLoggingOut(true);
    setMenuOpen(false);
    
    try {
      console.log('🧹 Nettoyage complet du stockage...');
      
      // Nettoyage BRUTAL de tout le stockage
      localStorage.clear();
      sessionStorage.clear();
      
      // Supprimer tous les cookies du domaine
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      console.log('🔐 Déconnexion Supabase avec timeout...');
      
      // Déconnexion Supabase avec timeout très court
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout déconnexion')), 2000)
      );
      
      try {
        await Promise.race([signOutPromise, timeoutPromise]);
        console.log('✅ Déconnexion Supabase réussie');
      } catch (timeoutError) {
        console.log('⚠️ Timeout Supabase, mais on continue...');
      }
      
    } catch (error) {
      console.error('❌ Erreur déconnexion:', error);
    }
    
    // REDIRECTION FORCÉE IMMÉDIATE
    console.log('🔄 REDIRECTION FORCÉE IMMÉDIATE');
    
    // Méthode 1: Redirection immédiate
    window.location.replace('/connexion');
    
    // Méthode 2: Fallback après 500ms
    setTimeout(() => {
      console.log('🔄 Fallback 1: window.location.href');
      window.location.href = '/connexion';
    }, 500);
    
    // Méthode 3: Fallback ultime après 1s
    setTimeout(() => {
      console.log('🔄 Fallback 2: Rechargement complet');
      window.location.reload();
    }, 1000);
  };

  // FONCTION DE DÉCONNEXION D'URGENCE (accessible globalement)
  useEffect(() => {
    window.forceLogout = handleLogout;
    return () => {
      delete window.forceLogout;
    };
  }, []);

  return (
    <nav className={`w-full py-4 px-8 ${bgColor} ${textColor} shadow-md flex items-center justify-between`}>
      <div className="text-xl font-semibold">
        🛠️ Finitio — Espace {role}
      </div>

      {/* Section utilisateur avec bouton de déconnexion direct */}
      <div className="flex items-center gap-4">
        {/* Email utilisateur */}
        <span className="hidden sm:block text-sm bg-white bg-opacity-20 px-3 py-1 rounded">
          {userEmail}
        </span>
        
        {/* BOUTON DE DÉCONNEXION DIRECT */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`
            flex items-center gap-2 px-4 py-2 rounded font-medium transition-all
            ${isLoggingOut 
              ? 'bg-gray-400 cursor-not-allowed opacity-50' 
              : 'bg-red-600 hover:bg-red-700 text-white hover:scale-105'
            }
          `}
          title="Se déconnecter immédiatement"
        >
          {isLoggingOut ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="hidden sm:inline">Déconnexion...</span>
            </>
          ) : (
            <>
              🚪
              <span className="hidden sm:inline">Déconnecter</span>
            </>
          )}
        </button>
        
        {/* Menu déroulant alternatif (gardé pour compatibilité) */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-1 bg-white bg-opacity-20 px-2 py-1 rounded hover:bg-opacity-30 transition"
            title="Menu utilisateur"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Menu déroulant */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg text-sm text-gray-700 z-50">
              <div className="px-4 py-2 border-b font-medium">{userEmail}</div>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => alert('🚧 Paramètres à venir')}
              >
                ⚙️ Paramètres
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 font-medium"
                onClick={handleLogout}
              >
                🚪 Se déconnecter (Alt)
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
