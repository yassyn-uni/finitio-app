import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const liens = {
    produit: [
      { nom: 'Fonctionnalités', url: '/fonctionnalites' },
      { nom: 'Tarifs', url: '/tarifs' },
      { nom: 'Démo', url: '/demo' },
      { nom: 'Mises à jour', url: '/updates' }
    ],
    entreprise: [
      { nom: 'À propos', url: '/about' },
      { nom: 'Équipe', url: '/team' },
      { nom: 'Carrières', url: '/careers' },
      { nom: 'Presse', url: '/press' }
    ],
    support: [
      { nom: 'Centre d\'aide', url: '/help' },
      { nom: 'Contact', url: '/contact' },
      { nom: 'Documentation', url: '/docs' },
      { nom: 'API', url: '/api' }
    ],
    legal: [
      { nom: 'Confidentialité', url: '/privacy' },
      { nom: 'Conditions', url: '/terms' },
      { nom: 'Cookies', url: '/cookies' },
      { nom: 'RGPD', url: '/gdpr' }
    ]
  };

  const reseauxSociaux = [
    { nom: 'LinkedIn', url: '#', icon: 'fab fa-linkedin' },
    { nom: 'Twitter', url: '#', icon: 'fab fa-twitter' },
    { nom: 'Facebook', url: '#', icon: 'fab fa-facebook' },
    { nom: 'Instagram', url: '#', icon: 'fab fa-instagram' }
  ];

  return (
    <footer className="section-dark border-t border-gray-600">
      <div className="container">
        {/* Section principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <Link to="/" className="logo text-2xl mb-4 block">
              <i className="fas fa-hard-hat icon"></i>
              Finitio
            </Link>
            <p className="text-gray mb-6 max-w-sm">
              La plateforme de référence pour la gestion de projets de construction. 
              Simplicité, efficacité, résultats.
            </p>
            
            {/* Réseaux sociaux */}
            <div className="flex gap-4">
              {reseauxSociaux.map((reseau) => (
                <a 
                  key={reseau.nom}
                  href={reseau.url}
                  className="feature-icon hover:scale-110 transition-transform"
                  style={{width: '2.5rem', height: '2.5rem', fontSize: '1rem'}}
                  aria-label={reseau.nom}
                >
                  <i className={reseau.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Liens Produit */}
          <div>
            <h3 className="heading-3 text-white mb-4">
              <i className="fas fa-cogs icon"></i>
              Produit
            </h3>
            <ul className="space-y-2">
              {liens.produit.map((lien) => (
                <li key={lien.nom}>
                  <Link to={lien.url} className="nav-link text-sm">
                    {lien.nom}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens Entreprise */}
          <div>
            <h3 className="heading-3 text-white mb-4">
              <i className="fas fa-building icon"></i>
              Entreprise
            </h3>
            <ul className="space-y-2">
              {liens.entreprise.map((lien) => (
                <li key={lien.nom}>
                  <Link to={lien.url} className="nav-link text-sm">
                    {lien.nom}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens Support */}
          <div>
            <h3 className="heading-3 text-white mb-4">
              <i className="fas fa-headset icon"></i>
              Support
            </h3>
            <ul className="space-y-2">
              {liens.support.map((lien) => (
                <li key={lien.nom}>
                  <Link to={lien.url} className="nav-link text-sm">
                    {lien.nom}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens Légal */}
          <div>
            <h3 className="heading-3 text-white mb-4">
              <i className="fas fa-balance-scale icon"></i>
              Légal
            </h3>
            <ul className="space-y-2">
              {liens.legal.map((lien) => (
                <li key={lien.nom}>
                  <Link to={lien.url} className="nav-link text-sm">
                    {lien.nom}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="card mb-12 text-center">
          <div className="feature-icon mx-auto">
            <i className="fas fa-envelope"></i>
          </div>
          <h3 className="heading-3 mb-4">Restez informé</h3>
          <p className="text-gray mb-6 max-w-2xl mx-auto">
            Recevez les dernières actualités, conseils et mises à jour de Finitio directement dans votre boîte mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-medium-gray text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange"
            />
            <button className="btn btn-orange">
              <i className="fas fa-paper-plane icon"></i>
              S'abonner
            </button>
          </div>
        </div>

        {/* Statistiques footer */}
        <div className="stats-container mb-12">
          <div className="stat-item">
            <div className="feature-icon mx-auto mb-2" style={{width: '3rem', height: '3rem', fontSize: '1rem'}}>
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-number">2500+</div>
            <div className="stat-label">Utilisateurs actifs</div>
          </div>
          
          <div className="stat-item">
            <div className="feature-icon mx-auto mb-2" style={{width: '3rem', height: '3rem', fontSize: '1rem'}}>
              <i className="fas fa-building"></i>
            </div>
            <div className="stat-number">1200+</div>
            <div className="stat-label">Projets livrés</div>
          </div>
          
          <div className="stat-item">
            <div className="feature-icon mx-auto mb-2" style={{width: '3rem', height: '3rem', fontSize: '1rem'}}>
              <i className="fas fa-globe"></i>
            </div>
            <div className="stat-number">15</div>
            <div className="stat-label">Pays</div>
          </div>
          
          <div className="stat-item">
            <div className="feature-icon mx-auto mb-2" style={{width: '3rem', height: '3rem', fontSize: '1rem'}}>
              <i className="fas fa-award"></i>
            </div>
            <div className="stat-number">5</div>
            <div className="stat-label">Prix remportés</div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-600 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray">
              2024 Finitio. Tous droits réservés. Fait avec 
              <i className="fas fa-heart text-orange mx-1"></i>
              au Maroc.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-gray text-sm">Disponible sur :</span>
              <div className="flex gap-2">
                <div className="feature-icon" style={{width: '2rem', height: '2rem', fontSize: '0.8rem'}}>
                  <i className="fab fa-apple"></i>
                </div>
                <div className="feature-icon" style={{width: '2rem', height: '2rem', fontSize: '0.8rem'}}>
                  <i className="fab fa-google-play"></i>
                </div>
                <div className="feature-icon" style={{width: '2rem', height: '2rem', fontSize: '0.8rem'}}>
                  <i className="fas fa-desktop"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
