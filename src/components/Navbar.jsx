import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FinitioLogo } from '../assets/FinitioAssets';
import NotificationCenter from './NotificationCenter';
import { trackEvent, trackCTAClick } from '../utils/analytics';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // 🎯 Tracker les clics sur les liens de navigation
  const handleNavClick = (linkName, linkPath) => {
    trackEvent('navbar_navigation', {
      link_name: linkName,
      link_path: linkPath,
      user_role: userProfile?.role || 'anonymous'
    });
  };

  // 📊 Tracker les interactions avec le profil
  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
    trackEvent('navbar_profile_toggle', {
      action: !isProfileOpen ? 'open' : 'close',
      user_role: userProfile?.role
    });
  };

  // 📱 Tracker les interactions mobile
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    trackEvent('navbar_mobile_menu', {
      action: !isMobileMenuOpen ? 'open' : 'close',
      device_type: 'mobile'
    });
  };

  // 🔐 Tracker la déconnexion
  const handleLogout = async () => {
    trackEvent('user_logout', {
      user_role: userProfile?.role,
      session_duration: Date.now() - (localStorage.getItem('session_start') || Date.now())
    });
    
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    navigate('/');
  };

  useEffect(() => {
    // Vérifier l'utilisateur connecté
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Récupérer le profil utilisateur
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        setUserProfile(profile);
      }
    };

    getUser();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (!session?.user) {
        setUserProfile(null);
      }
    });

    // Gérer le scroll pour l'effet glassmorphism
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fonction pour obtenir les couleurs selon le rôle
  const getRoleColors = (role) => {
    switch (role) {
      case 'client':
        return {
          gradient: 'from-blue-500 to-purple-600',
          bg: 'bg-gradient-to-r from-blue-500 to-purple-600',
          text: 'text-blue-600',
          border: 'border-blue-500'
        };
      case 'prestataire':
        return {
          gradient: 'from-orange-500 to-red-600',
          bg: 'bg-gradient-to-r from-orange-500 to-red-600',
          text: 'text-orange-600',
          border: 'border-orange-500'
        };
      case 'architecte':
        return {
          gradient: 'from-emerald-500 to-teal-600',
          bg: 'bg-gradient-to-r from-emerald-500 to-teal-600',
          text: 'text-emerald-600',
          border: 'border-emerald-500'
        };
      default:
        return {
          gradient: 'from-gray-500 to-gray-600',
          bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
          text: 'text-gray-600',
          border: 'border-gray-500'
        };
    }
  };

  const roleColors = userProfile ? getRoleColors(userProfile.role) : getRoleColors('default');

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-lg shadow-lg border-b border-white/20' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
            onClick={() => handleNavClick('Logo', '/')}
          >
            <div className="transform group-hover:scale-110 transition-transform duration-300">
              <FinitioLogo 
                variant="main" 
                size="md" 
                className={`${isScrolled ? 'text-gray-800' : 'text-white'} group-hover:animate-pulse-soft`}
              />
            </div>
            <span className={`text-2xl font-bold ${isScrolled ? 'text-gray-800' : 'text-white'} group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300`}>
              Finitio
            </span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {!user ? (
              <>
                <Link 
                  to="/" 
                  className={`font-medium hover:text-blue-600 transition-colors duration-300 ${
                    isScrolled ? 'text-gray-700' : 'text-white/90'
                  }`}
                  onClick={() => handleNavClick('Accueil', '/')}
                >
                  Accueil
                </Link>
                <Link 
                  to="/connexion" 
                  className={`font-medium hover:text-blue-600 transition-colors duration-300 ${
                    isScrolled ? 'text-gray-700' : 'text-white/90'
                  }`}
                  onClick={() => {
                    handleNavClick('Connexion', '/connexion');
                    trackCTAClick('Se connecter', 'navbar');
                  }}
                >
                  Se connecter
                </Link>
                <Link 
                  to="/inscription" 
                  className="btn-modern bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  onClick={() => {
                    handleNavClick('Inscription', '/inscription');
                    trackCTAClick('S\'inscrire', 'navbar');
                  }}
                >
                  S'inscrire
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                {/* Notifications */}
                <NotificationCenter />

                {/* Profil utilisateur */}
                <div className="relative">
                  <button
                    onClick={handleProfileToggle}
                    className="flex items-center space-x-3 p-2 rounded-full hover:bg-white/10 transition-colors duration-300 group"
                  >
                    {/* Avatar avec gradient selon le rôle */}
                    <div className={`w-10 h-10 rounded-full ${roleColors.bg} flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      {userProfile?.nom?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </div>
                    
                    {/* Informations utilisateur */}
                    <div className="hidden lg:block text-left">
                      <div className={`text-sm font-medium ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                        {userProfile?.nom || 'Utilisateur'}
                      </div>
                      <div className={`text-xs ${roleColors.text} font-semibold`}>
                        {userProfile?.role?.charAt(0).toUpperCase() + userProfile?.role?.slice(1) || 'Utilisateur'}
                      </div>
                    </div>

                    {/* Icône dropdown */}
                    <svg 
                      className={`w-4 h-4 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''} ${
                        isScrolled ? 'text-gray-600' : 'text-white/70'
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Menu dropdown du profil */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 py-2 animate-fade-in-up">
                      {/* En-tête du profil */}
                      <div className="px-6 py-4 border-b border-gray-200/50">
                        <div className="flex items-center space-x-4">
                          <div className={`w-16 h-16 rounded-full ${roleColors.bg} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                            {userProfile?.nom?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-gray-800">
                              {userProfile?.nom || 'Utilisateur'}
                            </div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${roleColors.bg} text-white mt-2`}>
                              {userProfile?.role?.charAt(0).toUpperCase() + userProfile?.role?.slice(1) || 'Utilisateur'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Liens du menu */}
                      <div className="py-2">
                        <Link
                          to={`/dashboard-${userProfile?.role || 'client'}`}
                          className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100/50 transition-colors duration-200"
                          onClick={() => {
                            handleNavClick('Dashboard', `/dashboard-${userProfile?.role}`);
                            setIsProfileOpen(false);
                          }}
                        >
                          <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          </svg>
                          Tableau de bord
                        </Link>

                        <Link
                          to="/projets"
                          className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100/50 transition-colors duration-200"
                          onClick={() => {
                            handleNavClick('Projets', '/projets');
                            setIsProfileOpen(false);
                          }}
                        >
                          <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Mes projets
                        </Link>

                        <Link
                          to="/messages"
                          className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100/50 transition-colors duration-200"
                          onClick={() => {
                            handleNavClick('Messages', '/messages');
                            setIsProfileOpen(false);
                          }}
                        >
                          <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Messages
                        </Link>

                        {/* Lien Analytics pour les administrateurs */}
                        {userProfile?.role === 'architecte' && (
                          <Link
                            to="/analytics"
                            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100/50 transition-colors duration-200"
                            onClick={() => {
                              handleNavClick('Analytics', '/analytics');
                              setIsProfileOpen(false);
                            }}
                          >
                            <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Analytics
                          </Link>
                        )}

                        <hr className="my-2 border-gray-200/50" />

                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-6 py-3 text-red-600 hover:bg-red-50/50 transition-colors duration-200"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Se déconnecter
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bouton menu mobile */}
          <div className="md:hidden">
            <button
              onClick={handleMobileMenuToggle}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg rounded-2xl mt-4 mb-4 shadow-2xl border border-white/20 animate-fade-in-up">
            <div className="py-4">
              {!user ? (
                <>
                  <Link
                    to="/"
                    className="block px-6 py-3 text-gray-700 hover:bg-gray-100/50 transition-colors duration-200"
                    onClick={() => {
                      handleNavClick('Accueil Mobile', '/');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Accueil
                  </Link>
                  <Link
                    to="/connexion"
                    className="block px-6 py-3 text-gray-700 hover:bg-gray-100/50 transition-colors duration-200"
                    onClick={() => {
                      handleNavClick('Connexion Mobile', '/connexion');
                      trackCTAClick('Se connecter', 'navbar_mobile');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Se connecter
                  </Link>
                  <Link
                    to="/inscription"
                    className="block mx-6 my-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-center font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    onClick={() => {
                      handleNavClick('Inscription Mobile', '/inscription');
                      trackCTAClick('S\'inscrire', 'navbar_mobile');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    S'inscrire
                  </Link>
                </>
              ) : (
                <>
                  {/* Profil utilisateur mobile */}
                  <div className="px-6 py-4 border-b border-gray-200/50">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full ${roleColors.bg} flex items-center justify-center text-white font-bold`}>
                        {userProfile?.nom?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {userProfile?.nom || 'Utilisateur'}
                        </div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleColors.bg} text-white mt-1`}>
                          {userProfile?.role?.charAt(0).toUpperCase() + userProfile?.role?.slice(1) || 'Utilisateur'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/dashboard-${userProfile?.role || 'client'}`}
                    className="block px-6 py-3 text-gray-700 hover:bg-gray-100/50 transition-colors duration-200"
                    onClick={() => {
                      handleNavClick('Dashboard Mobile', `/dashboard-${userProfile?.role}`);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Tableau de bord
                  </Link>
                  <Link
                    to="/projets"
                    className="block px-6 py-3 text-gray-700 hover:bg-gray-100/50 transition-colors duration-200"
                    onClick={() => {
                      handleNavClick('Projets Mobile', '/projets');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Mes projets
                  </Link>
                  <Link
                    to="/messages"
                    className="block px-6 py-3 text-gray-700 hover:bg-gray-100/50 transition-colors duration-200"
                    onClick={() => {
                      handleNavClick('Messages Mobile', '/messages');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Messages
                  </Link>

                  {/* Analytics pour les architectes */}
                  {userProfile?.role === 'architecte' && (
                    <Link
                      to="/analytics"
                      className="block px-6 py-3 text-gray-700 hover:bg-gray-100/50 transition-colors duration-200"
                      onClick={() => {
                        handleNavClick('Analytics Mobile', '/analytics');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Analytics
                    </Link>
                  )}

                  <hr className="my-2 border-gray-200/50" />
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-6 py-3 text-red-600 hover:bg-red-50/50 transition-colors duration-200"
                  >
                    Se déconnecter
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
