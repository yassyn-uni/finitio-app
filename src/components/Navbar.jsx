import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FinitioLogo } from '../assets/FinitioAssets';
import { trackEvent } from '../utils/analytics';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        getUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfil(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const getUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: profilData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfil(profilData);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    trackEvent('navbar_logout', { user_role: profil?.role });
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleNavClick = (navItem) => {
    trackEvent('navbar_navigation', { nav_item: navItem, current_page: location.pathname });
  };

  const handleProfileToggle = () => {
    setShowProfileMenu(!showProfileMenu);
    trackEvent('navbar_profile_toggle', { action: showProfileMenu ? 'close' : 'open' });
  };

  const handleMobileToggle = () => {
    setShowMobileMenu(!showMobileMenu);
    trackEvent('navbar_mobile_toggle', { action: showMobileMenu ? 'close' : 'open' });
  };

  const navLinks = [
    { name: 'Accueil', path: '/', icon: '🏠' },
    { name: 'Services', path: '/services', icon: '⚙️' },
    { name: 'Projets', path: '/projets', icon: '🏗️' },
    { name: 'À propos', path: '/about', icon: 'ℹ️' }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo professionnel */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            onClick={() => handleNavClick('logo')}
          >
            <div className="p-2 bg-blue-600 rounded-lg shadow-md">
              <FinitioLogo variant="main" size="sm" className="filter brightness-0 invert" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">Finitio</h1>
              <p className="text-xs text-gray-500 -mt-1">Construction Excellence</p>
            </div>
          </Link>

          {/* Navigation principale - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => handleNavClick(link.name.toLowerCase())}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : user && profil ? (
              <div className="relative">
                <button
                  onClick={handleProfileToggle}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {profil.nom?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-semibold text-gray-900">{profil.nom}</div>
                    <div className="text-xs text-gray-500 capitalize">{profil.role}</div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Menu profil */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {profil.nom?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{profil.nom}</div>
                          <div className="text-sm text-gray-500">{profil.email}</div>
                          <div className="text-xs text-blue-600 capitalize font-medium">{profil.role}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        to={`/dashboard-${profil.role}`}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          handleNavClick('dashboard');
                          setShowProfileMenu(false);
                        }}
                      >
                        <span className="text-blue-600">📊</span>
                        <span>Dashboard</span>
                      </Link>
                      
                      <Link
                        to="/analytics"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          handleNavClick('analytics');
                          setShowProfileMenu(false);
                        }}
                      >
                        <span className="text-green-600">📈</span>
                        <span>Analytics</span>
                      </Link>
                      
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <span>🚪</span>
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/connexion"
                  onClick={() => handleNavClick('connexion')}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Se connecter
                </Link>
                <Link
                  to="/inscription"
                  onClick={() => handleNavClick('inscription')}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Bouton menu mobile */}
            <button
              onClick={handleMobileToggle}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => {
                  handleNavClick(link.name.toLowerCase());
                  setShowMobileMenu(false);
                }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}
            
            {!user && (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  to="/connexion"
                  onClick={() => {
                    handleNavClick('connexion');
                    setShowMobileMenu(false);
                  }}
                  className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Se connecter
                </Link>
                <Link
                  to="/inscription"
                  onClick={() => {
                    handleNavClick('inscription');
                    setShowMobileMenu(false);
                  }}
                  className="block px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
