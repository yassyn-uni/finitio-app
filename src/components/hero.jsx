import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="construction-hero">
      <div className="container">
        <div className="animate-fade-in">
          {/* Icône principale */}
          <div className="feature-icon mx-auto">
            <i className="fas fa-hard-hat"></i>
          </div>
          
          <h1 className="heading-1">
            L'Excellence en
            <span className="text-orange block">Construction</span>
          </h1>
          
          <p className="text-xl text-gray mb-8 max-w-2xl mx-auto">
            Gérez vos projets de construction avec efficacité. 
            Suivi en temps réel, collaboration simplifiée, résultats garantis.
          </p>

          {/* Boutons CTA avec icônes */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/inscription" className="btn btn-orange">
              <i className="fas fa-rocket icon"></i>
              Commencer gratuitement
            </Link>
            <Link to="/demo" className="btn btn-white">
              <i className="fas fa-play icon"></i>
              Voir la démo
            </Link>
          </div>

          {/* Statistiques avec icônes */}
          <div className="stats-container">
            <div className="stat-item">
              <div className="feature-icon mx-auto mb-2" style={{width: '3rem', height: '3rem', fontSize: '1rem'}}>
                <i className="fas fa-building"></i>
              </div>
              <div className="stat-number">2500+</div>
              <div className="stat-label">Projets réalisés</div>
            </div>
            
            <div className="stat-item">
              <div className="feature-icon mx-auto mb-2" style={{width: '3rem', height: '3rem', fontSize: '1rem'}}>
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-number">1200+</div>
              <div className="stat-label">Utilisateurs actifs</div>
            </div>
            
            <div className="stat-item">
              <div className="feature-icon mx-auto mb-2" style={{width: '3rem', height: '3rem', fontSize: '1rem'}}>
                <i className="fas fa-star"></i>
              </div>
              <div className="stat-number">98.5%</div>
              <div className="stat-label">Satisfaction client</div>
            </div>
          </div>

          {/* Photo de construction */}
          <div className="photo-container max-w-4xl mx-auto mt-12">
            <img 
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Équipe de construction professionnelle"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
