import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import NotificationCenter from './NotificationCenter';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Effet de scroll pour la navbar
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Récupérer l'utilisateur actuel
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        setUserData(data);
      }
    };

    getUser();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setUserData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'client': return 'from-blue-500 to-purple-500';
      case 'prestataire': return 'from-orange-500 to-red-500';
      case 'architecte': return 'from-emerald-500 to-teal-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      client: 'bg-gradient-to-r from-blue-500 to-purple-500',
      prestataire: 'bg-gradient-to-r from-orange-500 to-red-500',
      architecte: 'bg-gradient-to-r from-emerald-500 to-teal-500'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${colors[role] || 'bg-gray-500'}`}>
        {role?.charAt(0).toUpperCase() + role?.slice(1)}
      </span>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20' 
        : 'bg-white/60 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo avec animation */}
          <Link to="/" className="group flex items-center space-x-2">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse-soft"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
              Finitio
            </span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {user ? (
              <>
                {/* Liens de navigation avec effets */}
                <Link 
                  to="/projets" 
                  className="px-4 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium"
                >
                  Projets
                </Link>
                <Link 
                  to="/messages" 
                  className="px-4 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium"
                >
                  Messages
                </Link>
                
                {/* Centre de notifications */}
                <div className="mx-2">
                  <NotificationCenter />
                </div>

                {/* Profil utilisateur avec dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-300">
                    {/* Avatar avec gradient selon le rôle */}
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getRoleColor(userData?.role)} flex items-center justify-center text-white font-semibold text-sm shadow-lg`}>
                      {userData?.nom?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {userData?.nom || 'Utilisateur'}
                      </div>
                      <div className="flex items-center gap-2">
                        {getRoleBadge(userData?.role)}
                      </div>
                    </div>
                    
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown menu avec glassmorphism */}
                  <div className="absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRoleColor(userData?.role)} flex items-center justify-center text-white font-bold shadow-lg`}>
                          {userData?.nom?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{userData?.nom}</div>
                          <div className="text-sm text-gray-500">{userData?.email}</div>
                          {getRoleBadge(userData?.role)}
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <Link 
                          to="/profil" 
                          className="flex items-center space-x-2 px-3 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Mon profil</span>
                        </Link>
                        
                        <Link 
                          to="/parametres" 
                          className="flex items-center space-x-2 px-3 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Paramètres</span>
                        </Link>
                        
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300 mt-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Déconnexion</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/connexion" 
                  className="px-6 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-300"
                >
                  Connexion
                </Link>
                <Link 
                  to="/inscription" 
                  className="btn-primary"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Menu mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-white/20 shadow-lg animate-fade-in-up">
            <div className="px-4 py-4 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRoleColor(userData?.role)} flex items-center justify-center text-white font-bold`}>
                      {userData?.nom?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-semibold">{userData?.nom}</div>
                      {getRoleBadge(userData?.role)}
                    </div>
                  </div>
                  
                  <Link to="/projets" className="block px-3 py-2 rounded-xl text-gray-700 hover:bg-blue-50 transition-all duration-300">
                    Projets
                  </Link>
                  <Link to="/messages" className="block px-3 py-2 rounded-xl text-gray-700 hover:bg-blue-50 transition-all duration-300">
                    Messages
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/connexion" className="block px-3 py-2 rounded-xl text-gray-700 hover:bg-blue-50 transition-all duration-300">
                    Connexion
                  </Link>
                  <Link to="/inscription" className="block px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center transition-all duration-300">
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
