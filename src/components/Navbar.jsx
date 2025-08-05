import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FinitioLogo } from '../assets/FinitioAssets';

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
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfil(userProfile);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleNavClick = (navItem) => {
    // Navigation tracking removed
  };

  const handleProfileToggle = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleMobileToggle = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const navLinks = [
    { name: 'Accueil', path: '/', icon: '🏠' },
    { name: 'Services', path: '/services', icon: '⚙️' },
    { name: 'Projets', path: '/projets', icon: '🏗️' },
    { name: 'À propos', path: '/about', icon: 'ℹ️' }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-white border-opacity-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Premium Harmonisé */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 group"
            onClick={() => handleNavClick('logo')}
          >
            <div className="p-3 construction-accent-gradient rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <FinitioLogo variant="main" size="sm" className="filter brightness-0 invert" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-display font-bold text-gray-900">Finitio</h1>
              <p className="text-xs text-gray-500 -mt-1 font-medium">Construction Excellence</p>
            </div>
          </Link>

          {/* Navigation principale harmonisée */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => handleNavClick(link.name.toLowerCase())}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'construction-accent-gradient text-white shadow-lg'
                    : 'text-gray-700 hover:text-accent-600 hover:bg-accent-50'
                }`}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Actions utilisateur harmonisées */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
            ) : user && profil ? (
              <div className="relative">
                <button
                  onClick={handleProfileToggle}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white hover:bg-opacity-50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 construction-accent-gradient rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-xl transition-all duration-300">
                    {profil.nom?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-semibold text-gray-900">{profil.nom}</div>
                    <div className="text-xs text-gray-500 capitalize font-medium">{profil.role}</div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Menu profil premium harmonisé */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 construction-accent-gradient rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {profil.nom?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-lg">{profil.nom}</div>
                          <div className="text-sm text-gray-500">{profil.email}</div>
                          <div className="text-xs text-accent-600 font-medium capitalize bg-accent-50 px-2 py-1 rounded-full mt-1">
                            {profil.role}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        to={`/dashboard-${profil.role}`}
                        className="flex items-center px-6 py-3 text-gray-700 hover:bg-accent-50 hover:text-accent-600 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <span className="mr-3">📊</span>
                        Mon Dashboard
                      </Link>
                      
                      <Link
                        to="/profil"
                        className="flex items-center px-6 py-3 text-gray-700 hover:bg-accent-50 hover:text-accent-600 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <span className="mr-3">👤</span>
                        Mon Profil
                      </Link>
                      
                      <Link
                        to="/parametres"
                        className="flex items-center px-6 py-3 text-gray-700 hover:bg-accent-50 hover:text-accent-600 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <span className="mr-3">⚙️</span>
                        Paramètres
                      </Link>
                      
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-6 py-3 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <span className="mr-3">🚪</span>
                          Se déconnecter
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
                  className="btn btn-secondary px-6 py-2 text-sm font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="btn btn-primary px-6 py-2 text-sm font-medium"
                >
                  Inscription
                </Link>
              </div>
            )}

            {/* Menu mobile toggle */}
            <button
              onClick={handleMobileToggle}
              className="md:hidden p-2 rounded-xl hover:bg-white hover:bg-opacity-50 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile harmonisé */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-white border-opacity-20 animate-fade-in">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => {
                    handleNavClick(link.name.toLowerCase());
                    setShowMobileMenu(false);
                  }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'construction-accent-gradient text-white'
                      : 'text-gray-700 hover:text-accent-600 hover:bg-accent-50'
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
