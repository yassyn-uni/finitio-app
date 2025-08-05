import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import NotificationCenter from './NotificationCenter';
import { FinitioLogo, FinitioIcon } from '../assets/FinitioAssets';

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

  const getRoleIcon = (role) => {
    switch (role) {
      case 'client': return 'client';
      case 'prestataire': return 'contractor';
      case 'architecte': return 'architect';
      default: return 'client';
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-xl shadow-xl border-b border-white/30' 
        : 'bg-white/70 backdrop-blur-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo premium avec animation */}
          <Link to="/" className="group flex items-center space-x-3 hover-lift">
            <div className="relative">
              <FinitioLogo 
                variant="icon" 
                size="sm" 
                className="transform group-hover:scale-110 transition-all duration-300 hover-glow" 
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse-soft"></div>
            </div>
            <div className="hidden sm:block">
              <FinitioLogo 
                variant="main" 
                size="md" 
                className="transform group-hover:scale-105 transition-all duration-300" 
              />
            </div>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {user ? (
              <>
                {/* Liens de navigation avec effets premium */}
                <Link 
                  to="/projets" 
                  className="px-6 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-300 font-medium hover-lift backdrop-blur-sm"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                    </svg>
                    Projets
                  </span>
                </Link>
                <Link 
                  to="/messages" 
                  className="px-6 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-300 font-medium hover-lift backdrop-blur-sm"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Messages
                  </span>
                </Link>
                
                {/* Centre de notifications premium */}
                <div className="mx-2">
                  <NotificationCenter />
                </div>

                {/* Profil utilisateur premium avec dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-gray-50/80 transition-all duration-300 backdrop-blur-sm hover-lift">
                    {/* Avatar avec icône métier */}
                    <div className="relative">
                      <FinitioIcon 
                        type={getRoleIcon(userData?.role)} 
                        size="sm" 
                        className="transform group-hover:scale-110 transition-all duration-300" 
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse-soft"></div>
                    </div>
                    
                    <div className="text-left hidden lg:block">
                      <div className="text-sm font-semibold text-gray-900">
                        {userData?.nom || 'Utilisateur'}
                      </div>
                      <div className="flex items-center gap-2">
                        {getRoleBadge(userData?.role)}
                      </div>
                    </div>
                    
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors duration-300 transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown menu premium avec glassmorphism */}
                  <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-3xl shadow-premium border border-white/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-6">
                      {/* En-tête du profil */}
                      <div className="flex items-center space-x-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                        <FinitioIcon 
                          type={getRoleIcon(userData?.role)} 
                          size="lg" 
                          className="shadow-lg" 
                        />
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 text-lg">{userData?.nom}</div>
                          <div className="text-sm text-gray-600 mb-2">{userData?.email}</div>
                          {getRoleBadge(userData?.role)}
                        </div>
                      </div>
                      
                      {/* Menu de navigation */}
                      <div className="space-y-2">
                        <Link 
                          to="/profil" 
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-300 hover-lift"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium">Mon profil</span>
                        </Link>
                        
                        <Link 
                          to="/parametres" 
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-300 hover-lift"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-medium">Paramètres</span>
                        </Link>
                        
                        <div className="border-t border-gray-200 my-3"></div>
                        
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50/80 transition-all duration-300 hover-lift"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="font-medium">Déconnexion</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/connexion" 
                  className="px-6 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover-lift"
                >
                  Connexion
                </Link>
                <Link 
                  to="/inscription" 
                  className="btn-premium"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Inscription
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* Menu mobile premium */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-300 hover-lift backdrop-blur-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile dropdown premium */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-white/30 shadow-premium animate-fade-in-up">
            <div className="px-4 py-6 space-y-3">
              {user ? (
                <>
                  {/* Profil mobile */}
                  <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 mb-4">
                    <FinitioIcon 
                      type={getRoleIcon(userData?.role)} 
                      size="md" 
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{userData?.nom}</div>
                      {getRoleBadge(userData?.role)}
                    </div>
                  </div>
                  
                  <Link to="/projets" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50/80 transition-all duration-300 font-medium">
                    Projets
                  </Link>
                  <Link to="/messages" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50/80 transition-all duration-300 font-medium">
                    Messages
                  </Link>
                  <Link to="/profil" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50/80 transition-all duration-300 font-medium">
                    Mon profil
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50/80 transition-all duration-300 font-medium"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/connexion" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50/80 transition-all duration-300 font-medium">
                    Connexion
                  </Link>
                  <Link to="/inscription" className="block px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center transition-all duration-300 font-medium hover-lift">
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
