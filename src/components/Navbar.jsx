import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#03045E] text-white px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="text-xl sm:text-2xl font-bold">Finitio</div>

        {/* Menu mobile */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="focus:outline-none p-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              {isOpen ? (
                <path fillRule="evenodd" d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              ) : (
                <path fillRule="evenodd" d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              )}
            </svg>
          </button>
        </div>

        {/* Menu desktop */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-teal-300 transition-colors">Accueil</Link>
          <Link to="/inscription" className="hover:text-teal-300 transition-colors">Inscription</Link>
          <Link to="/connexion" className="bg-teal-500 px-4 py-2 rounded hover:bg-teal-600 transition-colors">Connexion</Link>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-blue-700">
          <div className="flex flex-col space-y-3 pt-4">
            <Link 
              to="/" 
              className="block py-2 px-4 hover:bg-blue-700 rounded transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              to="/inscription" 
              className="block py-2 px-4 hover:bg-blue-700 rounded transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Inscription
            </Link>
            <Link 
              to="/connexion" 
              className="block bg-teal-500 py-2 px-4 rounded hover:bg-teal-600 transition-colors text-center"
              onClick={() => setIsOpen(false)}
            >
              Connexion
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
