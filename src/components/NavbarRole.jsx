import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function NavbarRole({ role, bgColor, textColor }) {
  const [userEmail, setUserEmail] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
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

  const handleLogout = async () => {
    console.log('🚪 Début de la déconnexion...');
    
    try {
      // Fermer le menu déroulant immédiatement
      setMenuOpen(false);
      
      // Nettoyer TOUT le localStorage
      console.log('🧹 Nettoyage localStorage...');
      localStorage.clear();
      
      // Nettoyer également sessionStorage
      sessionStorage.clear();
      
      // Déconnexion Supabase avec timeout
      console.log('🔐 Déconnexion Supabase...');
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      );
      
      await Promise.race([signOutPromise, timeoutPromise]);
      console.log('✅ Déconnexion Supabase réussie');
      
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
    } finally {
      // TOUJOURS rediriger, même en cas d'erreur
      console.log('🔄 Redirection forcée vers /connexion');
      
      // Méthode 1: window.location.replace (ne garde pas l'historique)
      window.location.replace('/connexion');
      
      // Méthode 2: Fallback après 1 seconde
      setTimeout(() => {
        window.location.href = '/connexion';
      }, 1000);
      
      // Méthode 3: Fallback ultime après 2 secondes
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <nav className={`w-full py-4 px-8 ${bgColor} ${textColor} shadow-md flex items-center justify-between`}>
      <div className="text-xl font-semibold">
        🛠️ Finitio — Espace {role}
      </div>

      {/* Utilisateur connecté */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 bg-white text-sm text-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition"
        >
          <span className="hidden sm:block">{userEmail}</span>
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              onClick={handleLogout}
            >
              🚪 Se déconnecter
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
