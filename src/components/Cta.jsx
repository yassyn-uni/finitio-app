import React from 'react';
import { Link } from 'react-router-dom';

const Cta = () => {
  return (
    <section className="section-dark">
      <div className="container text-center">
        {/* Icône principale */}
        <div className="feature-icon mx-auto">
          <i className="fas fa-rocket"></i>
        </div>
        
        <h2 className="heading-2">
          Transformez vos projets de construction
        </h2>
        
        <p className="text-xl text-gray mb-8 max-w-3xl mx-auto">
          Rejoignez plus de 2500 professionnels qui utilisent Finitio pour gérer leurs projets 
          avec efficacité et livrer des résultats exceptionnels.
        </p>

        {/* Boutons CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/inscription" className="btn btn-orange">
            <i className="fas fa-user-plus icon"></i>
            Créer mon compte gratuit
          </Link>
          <Link to="/demo" className="btn btn-outline">
            <i className="fas fa-play icon"></i>
            Demander une démo
          </Link>
        </div>

        {/* Garanties avec icônes */}
        <div className="grid-3 mb-12">
          <div className="card text-center">
            <div className="feature-icon mx-auto">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3 className="heading-3">100% Sécurisé</h3>
            <p className="text-gray">
              Vos données sont protégées par un chiffrement de niveau bancaire
            </p>
          </div>
          
          <div className="card text-center">
            <div className="feature-icon mx-auto">
              <i className="fas fa-headset"></i>
            </div>
            <h3 className="heading-3">Support 24/7</h3>
            <p className="text-gray">
              Notre équipe d'experts vous accompagne à tout moment
            </p>
          </div>
          
          <div className="card text-center">
            <div className="feature-icon mx-auto">
              <i className="fas fa-money-bill-wave"></i>
            </div>
            <h3 className="heading-3">Essai gratuit</h3>
            <p className="text-gray">
              Testez toutes les fonctionnalités pendant 30 jours gratuitement
            </p>
          </div>
        </div>

        {/* Statistiques finales */}
        <div className="stats-container">
          <div className="stat-item">
            <div className="feature-icon mx-auto mb-2" style={{width: '3rem', height: '3rem', fontSize: '1rem'}}>
              <i className="fas fa-building"></i>
            </div>
            <div className="stat-number">2500+</div>
            <div className="stat-label">Projets livrés</div>
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
          
          <div className="stat-item">
            <div className="feature-icon mx-auto mb-2" style={{width: '3rem', height: '3rem', fontSize: '1rem'}}>
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-number">24h</div>
            <div className="stat-label">Temps de réponse</div>
          </div>
        </div>

        {/* Photo d'équipe finale */}
        <div className="photo-container max-w-4xl mx-auto mt-12">
          <img 
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Équipe Finitio - Professionnels de la construction"
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Cta;
