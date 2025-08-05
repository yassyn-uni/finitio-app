import React from 'react';
import { Link } from 'react-router-dom';
import { FinitioLogo, FinitioIcon } from '../assets/FinitioAssets';

export default function Footer() {
  const liens = {
    produit: [
      { nom: 'Fonctionnalités', url: '#fonctionnalites' },
      { nom: 'Tarifs', url: '/tarifs' },
      { nom: 'Sécurité', url: '/securite' },
      { nom: 'API', url: '/api' }
    ],
    entreprise: [
      { nom: 'À propos', url: '/a-propos' },
      { nom: 'Carrières', url: '/carrieres' },
      { nom: 'Presse', url: '/presse' },
      { nom: 'Partenaires', url: '/partenaires' }
    ],
    support: [
      { nom: 'Centre d\'aide', url: '/aide' },
      { nom: 'Documentation', url: '/docs' },
      { nom: 'Contact', url: '/contact' },
      { nom: 'Statut', url: '/statut' }
    ],
    legal: [
      { nom: 'Confidentialité', url: '/confidentialite' },
      { nom: 'Conditions', url: '/conditions' },
      { nom: 'Cookies', url: '/cookies' },
      { nom: 'RGPD', url: '/rgpd' }
    ]
  };

  const reseauxSociaux = [
    { nom: 'LinkedIn', url: '#', icon: 'linkedin' },
    { nom: 'Twitter', url: '#', icon: 'twitter' },
    { nom: 'Facebook', url: '#', icon: 'facebook' },
    { nom: 'Instagram', url: '#', icon: 'instagram' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Fond décoratif */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Section principale */}
        <div className="grid lg:grid-cols-5 gap-12 mb-12">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <FinitioLogo 
                variant="main" 
                size="lg" 
                className="filter brightness-0 invert mb-4" 
              />
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                La plateforme BTP nouvelle génération qui connecte clients, prestataires et architectes 
                pour des projets de construction réussis.
              </p>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">500+</div>
                <div className="text-gray-400 text-sm">Projets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">98%</div>
                <div className="text-gray-400 text-sm">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">150+</div>
                <div className="text-gray-400 text-sm">Professionnels</div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold mb-3">Restez informé</h4>
              <p className="text-gray-300 text-sm mb-4">
                Recevez nos dernières actualités et conseils BTP
              </p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Votre email"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                />
                <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
                  S'abonner
                </button>
              </div>
            </div>
          </div>

          {/* Liens organisés */}
          <div className="lg:col-span-3 grid md:grid-cols-4 gap-8">
            {/* Produit */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Produit</h4>
              <ul className="space-y-3">
                {liens.produit.map((lien, index) => (
                  <li key={index}>
                    <Link 
                      to={lien.url}
                      className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                    >
                      {lien.nom}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Entreprise */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Entreprise</h4>
              <ul className="space-y-3">
                {liens.entreprise.map((lien, index) => (
                  <li key={index}>
                    <Link 
                      to={lien.url}
                      className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                    >
                      {lien.nom}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
              <ul className="space-y-3">
                {liens.support.map((lien, index) => (
                  <li key={index}>
                    <Link 
                      to={lien.url}
                      className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                    >
                      {lien.nom}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Légal */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Légal</h4>
              <ul className="space-y-3">
                {liens.legal.map((lien, index) => (
                  <li key={index}>
                    <Link 
                      to={lien.url}
                      className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                    >
                      {lien.nom}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section CTA */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 mb-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Prêt à démarrer votre projet ?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Rejoignez des milliers de professionnels qui font confiance à Finitio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/inscription"
              className="btn-premium group"
            >
              <span className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Commencer gratuitement
              </span>
            </Link>
            <Link 
              to="/contact"
              className="px-8 py-4 rounded-2xl font-semibold text-white border-2 border-white/30 hover:border-white/60 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm hover:bg-white/10"
            >
              Nous contacter
            </Link>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-gray-400 text-center md:text-left">
              <p>&copy; 2025 Finitio. Tous droits réservés.</p>
              <p className="text-sm mt-1">
                Fait avec ❤️ pour les professionnels du BTP
              </p>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm mr-2">Suivez-nous :</span>
              {reseauxSociaux.map((reseau, index) => (
                <a
                  key={index}
                  href={reseau.url}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                  aria-label={reseau.nom}
                >
                  <FinitioIcon 
                    type={reseau.icon} 
                    size="sm" 
                    className="filter brightness-0 invert" 
                  />
                </a>
              ))}
            </div>

            {/* Badges de confiance */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-medium">Service actif</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full">
                <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-blue-400 text-xs font-medium">Sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
