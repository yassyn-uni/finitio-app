import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#03045E] text-white px-6 py-4 flex items-center justify-between">
      <div className="text-2xl font-bold">Finitio</div>

      {/* Menu mobile */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Liens */}
      <div className={`md:flex items-center gap-4 ${isOpen ? 'block mt-4' : 'hidden'} md:mt-0`}>
        <Link to="/" className="hover:text-[#00B4D8]">Accueil</Link>
        <a href="#pourquoi" className="hover:text-[#00B4D8]">À propos</a>
        <a href="#contact" className="hover:text-[#00B4D8]">Contact</a>
        <Link to="/inscription" className="hover:underline">Inscription</Link>
        <Link
          to="/connexion"
          className="bg-[#00B4D8] hover:bg-[#0096c7] text-white px-4 py-2 rounded-lg font-semibold"
        >
          Connexion
        </Link>
      </div>
    </nav>
  );
}
