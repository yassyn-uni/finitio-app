import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Écouter les changements d'authentification en temps réel
  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Toujours récupérer le rôle depuis la base de données pour être sûr
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (profile?.role) {
          setUserRole(profile.role);
          localStorage.setItem('user_role', profile.role);
        }
      } else {
        // Nettoyer si pas d'utilisateur
        setUserRole('');
        localStorage.removeItem('user_role');
      }
    };

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        
        // Récupérer le rôle immédiatement après connexion
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (profile?.role) {
          setUserRole(profile.role);
          localStorage.setItem('user_role', profile.role);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserRole('');
        localStorage.removeItem('user_role');
      }
    });

    // Récupérer l'utilisateur initial
    getUser();

    // Nettoyer l'abonnement
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole('');
    localStorage.removeItem('user_role');
    navigate('/');
  };

  const getDashboardPath = () => {
    switch (userRole.toLowerCase()) {
      case 'client':
        return '/dashboard-client';
      case 'architecte':
        return '/dashboard-architecte';
      case 'prestataire':
        return '/dashboard-prestataire';
      case 'fournisseur':
        return '/dashboard-fournisseur';
      default:
        return '/dashboard';
    }
  };

  const getDashboardLabel = () => {
    switch (userRole.toLowerCase()) {
      case 'client':
        return 'Mon Espace Client';
      case 'architecte':
        return 'Espace Architecte';
      case 'prestataire':
        return 'Espace Prestataire';
      case 'fournisseur':
        return 'Espace Fournisseur';
      default:
        return 'Dashboard';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo avec icône */}
        <Link to="/" className="logo">
          <i className="fas fa-hard-hat icon"></i>
          Finitio
        </Link>

        {/* Navigation desktop */}
        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-link">
              <i className="fas fa-home icon"></i>
              Accueil
            </Link>
          </li>
          {user && (
            <li>
              <Link to={getDashboardPath()} className="nav-link">
                <i className="fas fa-tachometer-alt icon"></i>
                {getDashboardLabel()}
              </Link>
            </li>
          )}
          <li>
            <Link to="/fonctionnalites" className="nav-link">
              <i className="fas fa-cogs icon"></i>
              Fonctionnalités
            </Link>
          </li>
          <li>
            <Link to="/tarifs" className="nav-link">
              <i className="fas fa-euro-sign icon"></i>
              Tarifs
            </Link>
          </li>
          <li>
            <Link to="/contact" className="nav-link">
              <i className="fas fa-envelope icon"></i>
              Contact
            </Link>
          </li>
        </ul>

        {/* Boutons d'action */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="feature-icon" style={{width: '2rem', height: '2rem', fontSize: '0.8rem'}}>
                  <i className="fas fa-user"></i>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-medium text-sm">{user.email}</span>
                  {userRole && (
                    <span className="text-blue-200 text-xs capitalize">
                      {userRole === 'client' ? '🏠 Client' : userRole === 'architecte' ? '🏛️ Architecte' : userRole === 'prestataire' ? '🔨 Prestataire' : '📦 Fournisseur'}
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={handleLogout} 
                className="btn btn-outline hover:bg-red-500 hover:border-red-500 transition-all duration-300"
                title="Se déconnecter"
              >
                <i className="fas fa-sign-out-alt icon"></i>
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/connexion" className="btn btn-white">
                <i className="fas fa-sign-in-alt icon"></i>
                Connexion
              </Link>
              <Link to="/inscription" className="btn btn-primary">
                <i className="fas fa-user-plus icon"></i>
                Inscription
              </Link>
            </div>
          )}

          {/* Menu mobile */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-blue-600 to-indigo-600 border-t border-blue-500">
          <div className="px-4 py-2 space-y-2">
            <Link to="/" className="block py-2 text-white hover:text-blue-200 transition-colors">
              <i className="fas fa-home icon"></i>
              Accueil
            </Link>
            {user && (
              <Link to={getDashboardPath()} className="block py-2 text-white hover:text-blue-200 transition-colors">
                <i className="fas fa-tachometer-alt icon"></i>
                {getDashboardLabel()}
              </Link>
            )}
            <Link to="/fonctionnalites" className="block py-2 text-white hover:text-blue-200 transition-colors">
              <i className="fas fa-cogs icon"></i>
              Fonctionnalités
            </Link>
            <Link to="/tarifs" className="block py-2 text-white hover:text-blue-200 transition-colors">
              <i className="fas fa-euro-sign icon"></i>
              Tarifs
            </Link>
            <Link to="/contact" className="block py-2 text-white hover:text-blue-200 transition-colors">
              <i className="fas fa-envelope icon"></i>
              Contact
            </Link>
            
            {/* Section utilisateur mobile */}
            {user ? (
              <div className="border-t border-blue-500 pt-2 mt-2">
                <div className="flex items-center gap-2 py-2 text-white">
                  <i className="fas fa-user text-blue-200"></i>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.email}</span>
                    {userRole && (
                      <span className="text-xs text-blue-200 capitalize">
                        {userRole === 'client' ? '🏠 Client' : userRole === 'architecte' ? '🏛️ Architecte' : userRole === 'prestataire' ? '🔨 Prestataire' : '📦 Fournisseur'}
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left py-2 text-red-300 hover:text-red-200 transition-colors"
                >
                  <i className="fas fa-sign-out-alt icon"></i>
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="border-t border-blue-500 pt-2 mt-2 space-y-2">
                <Link to="/connexion" className="block py-2 text-white hover:text-blue-200 transition-colors">
                  <i className="fas fa-sign-in-alt icon"></i>
                  Connexion
                </Link>
                <Link to="/inscription" className="block py-2 text-white hover:text-blue-200 transition-colors">
                  <i className="fas fa-user-plus icon"></i>
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
