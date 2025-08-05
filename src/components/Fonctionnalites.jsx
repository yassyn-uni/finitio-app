import React from 'react';

const Fonctionnalites = () => {
  const features = [
    {
      id: 'suivi-temps-reel',
      title: 'Suivi en temps réel',
      description: 'Surveillez l\'avancement de vos projets en temps réel avec des mises à jour instantanées.',
      icon: 'fas fa-clock'
    },
    {
      id: 'messagerie-integree',
      title: 'Messagerie intégrée',
      description: 'Communiquez efficacement avec votre équipe directement dans la plateforme.',
      icon: 'fas fa-comments'
    },
    {
      id: 'gestion-documents',
      title: 'Gestion documentaire',
      description: 'Centralisez tous vos documents de projet dans un espace sécurisé et organisé.',
      icon: 'fas fa-folder-open'
    },
    {
      id: 'planning-intelligent',
      title: 'Planning intelligent',
      description: 'Optimisez vos ressources avec un système de planification automatisé.',
      icon: 'fas fa-calendar-alt'
    },
    {
      id: 'reporting-avance',
      title: 'Reporting avancé',
      description: 'Générez des rapports détaillés pour analyser les performances de vos projets.',
      icon: 'fas fa-chart-bar'
    },
    {
      id: 'mobile-first',
      title: 'Mobile First',
      description: 'Accédez à vos projets partout, à tout moment, depuis votre smartphone.',
      icon: 'fas fa-mobile-alt'
    }
  ];

  const processSteps = [
    {
      id: 'creation',
      title: 'Créer votre projet',
      description: 'Définissez les paramètres, équipes et objectifs de votre projet de construction.',
      icon: 'fas fa-plus-circle',
      step: '01'
    },
    {
      id: 'collaboration',
      title: 'Collaborer efficacement',
      description: 'Invitez votre équipe, partagez les documents et communiquez en temps réel.',
      icon: 'fas fa-users-cog',
      step: '02'
    },
    {
      id: 'livraison',
      title: 'Livrer avec succès',
      description: 'Suivez les progrès, respectez les délais et livrez des projets de qualité.',
      icon: 'fas fa-trophy',
      step: '03'
    }
  ];

  return (
    <>
      {/* Section Fonctionnalités */}
      <section className="section-gray">
        <div className="container">
          <div className="text-center mb-12">
            <div className="feature-icon mx-auto">
              <i className="fas fa-cogs"></i>
            </div>
            <h2 className="heading-2">Fonctionnalités puissantes</h2>
            <p className="text-xl text-gray max-w-2xl mx-auto">
              Découvrez tous les outils dont vous avez besoin pour gérer vos projets de construction avec excellence.
            </p>
          </div>

          <div className="grid-3">
            {features.map((feature) => (
              <div key={feature.id} className="card animate-fade-in">
                <div className="feature-icon">
                  <i className={feature.icon}></i>
                </div>
                <h3 className="heading-3">{feature.title}</h3>
                <p className="text-gray">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Processus */}
      <section className="section-white">
        <div className="container">
          <div className="text-center mb-12">
            <div className="feature-icon mx-auto" style={{backgroundColor: 'var(--dark-gray)'}}>
              <i className="fas fa-route"></i>
            </div>
            <h2 className="heading-2" style={{color: 'var(--dark-gray)'}}>Comment ça marche</h2>
            <p className="text-xl max-w-2xl mx-auto" style={{color: 'var(--light-gray)'}}>
              Un processus simple en 3 étapes pour transformer vos projets de construction.
            </p>
          </div>

          <div className="grid-3">
            {processSteps.map((step, index) => (
              <div key={step.id} className="card-white text-center">
                <div className="relative mb-6">
                  <div className="feature-icon mx-auto" style={{backgroundColor: 'var(--dark-gray)'}}>
                    <i className={step.icon}></i>
                  </div>
                  <div 
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{backgroundColor: 'var(--orange)', color: 'white'}}
                  >
                    {step.step}
                  </div>
                </div>
                <h3 className="heading-3" style={{color: 'var(--dark-gray)'}}>{step.title}</h3>
                <p style={{color: 'var(--light-gray)'}}>{step.description}</p>
              </div>
            ))}
          </div>

          {/* Photo d'équipe */}
          <div className="photo-container max-w-4xl mx-auto mt-12">
            <img 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2126&q=80"
              alt="Réunion de chantier avec équipe utilisant des tablettes"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Section CTA finale */}
      <section className="section-dark">
        <div className="container text-center">
          <div className="feature-icon mx-auto">
            <i className="fas fa-rocket"></i>
          </div>
          <h2 className="heading-2">Prêt à transformer vos projets ?</h2>
          <p className="text-xl text-gray mb-8 max-w-2xl mx-auto">
            Rejoignez plus de 2500 professionnels qui font confiance à Finitio pour leurs projets de construction.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/inscription" className="btn btn-orange">
              <i className="fas fa-user-plus icon"></i>
              Créer mon compte gratuit
            </a>
            <a href="/contact" className="btn btn-outline">
              <i className="fas fa-phone icon"></i>
              Parler à un expert
            </a>
          </div>

          {/* Statistiques finales */}
          <div className="stats-container mt-12">
            <div className="stat-item">
              <div className="feature-icon mx-auto mb-2" style={{width: '3rem', height: '3rem', fontSize: '1rem'}}>
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="stat-number">100%</div>
              <div className="stat-label">Sécurisé</div>
            </div>
            
            <div className="stat-item">
              <div className="feature-icon mx-auto mb-2" style={{width: '3rem', height: '3rem', fontSize: '1rem'}}>
                <i className="fas fa-headset"></i>
              </div>
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
            
            <div className="stat-item">
              <div className="feature-icon mx-auto mb-2" style={{width: '3rem', height: '3rem', fontSize: '1rem'}}>
                <i className="fas fa-money-bill-wave"></i>
              </div>
              <div className="stat-number">0€</div>
              <div className="stat-label">Pour commencer</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Fonctionnalites;
