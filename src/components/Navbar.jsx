import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
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
                <span className="text-white font-medium">{user.email}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline">
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
              <Link to="/inscription" className="btn btn-orange">
                <i className="fas fa-user-plus icon"></i>
                Inscription
              </Link>
            </div>
          )}

          {/* Menu mobile toggle */}
          <button 
            className="md:hidden text-white text-xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-medium-gray border-t border-gray-600">
          <div className="container py-4">
            <ul className="space-y-4">
              <li>
                <Link to="/" className="nav-link block py-2">
                  <i className="fas fa-home icon"></i>
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/fonctionnalites" className="nav-link block py-2">
                  <i className="fas fa-cogs icon"></i>
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link to="/tarifs" className="nav-link block py-2">
                  <i className="fas fa-euro-sign icon"></i>
                  Tarifs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="nav-link block py-2">
                  <i className="fas fa-envelope icon"></i>
                  Contact
                </Link>
              </li>
            </ul>
            
            {!user && (
              <div className="mt-4 space-y-2">
                <Link to="/connexion" className="btn btn-white w-full">
                  <i className="fas fa-sign-in-alt icon"></i>
                  Connexion
                </Link>
                <Link to="/inscription" className="btn btn-orange w-full">
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
