import React from 'react';

const Pourquoi = () => {
  const avantages = [
    {
      id: 'gain-temps',
      title: 'Gagnez 40% de temps',
      description: 'Automatisez vos tâches répétitives et concentrez-vous sur l\'essentiel.',
      icon: 'fas fa-clock',
      stat: '40%'
    },
    {
      id: 'reduction-erreurs',
      title: 'Réduisez les erreurs',
      description: 'Éliminez les erreurs de communication et les oublis grâce à notre système centralisé.',
      icon: 'fas fa-check-circle',
      stat: '85%'
    },
    {
      id: 'satisfaction-client',
      title: 'Clients plus satisfaits',
      description: 'Offrez une transparence totale et une communication fluide à vos clients.',
      icon: 'fas fa-heart',
      stat: '98%'
    },
    {
      id: 'rentabilite',
      title: 'Augmentez votre rentabilité',
      description: 'Optimisez vos ressources et maximisez vos profits sur chaque projet.',
      icon: 'fas fa-chart-line',
      stat: '+25%'
    }
  ];

  const temoignages = [
    {
      id: 'karim-hassan',
      nom: 'Karim Hassan',
      poste: 'Directeur de Travaux',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      temoignage: 'Finitio a révolutionné notre façon de gérer les projets. Nous avons réduit nos délais de 30% et nos clients sont ravis de la transparence.',
      note: 5
    },
    {
      id: 'sara-bennani',
      nom: 'Sara Bennani',
      poste: 'Architecte',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      temoignage: 'L\'interface est intuitive et la collaboration avec les équipes n\'a jamais été aussi fluide. Un outil indispensable pour tout professionnel.',
      note: 5
    },
    {
      id: 'omar-tazi',
      nom: 'Omar Tazi',
      poste: 'Chef d\'Entreprise',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      temoignage: 'Depuis que nous utilisons Finitio, notre productivité a explosé. Le ROI a été immédiat et nos équipes sont plus motivées.',
      note: 5
    }
  ];

  return (
    <section className="section-white">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="feature-icon mx-auto" style={{backgroundColor: 'var(--dark-gray)'}}>
            <i className="fas fa-question-circle"></i>
          </div>
          <h2 className="heading-2" style={{color: 'var(--dark-gray)'}}>
            Pourquoi choisir Finitio ?
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{color: 'var(--light-gray)'}}>
            Découvrez pourquoi plus de 2500 professionnels de la construction font confiance à notre plateforme.
          </p>
        </div>

        {/* Avantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {avantages.map((avantage) => (
            <div key={avantage.id} className="card-white">
              <div className="flex items-start gap-4">
                <div className="feature-icon" style={{backgroundColor: 'var(--orange)'}}>
                  <i className={avantage.icon}></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="heading-3" style={{color: 'var(--dark-gray)'}}>{avantage.title}</h3>
                    <span 
                      className="text-2xl font-bold px-3 py-1 rounded-full text-white"
                      style={{backgroundColor: 'var(--orange)'}}
                    >
                      {avantage.stat}
                    </span>
                  </div>
                  <p style={{color: 'var(--light-gray)'}}>{avantage.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Témoignages */}
        <div className="text-center mb-12">
          <div className="feature-icon mx-auto" style={{backgroundColor: 'var(--dark-gray)'}}>
            <i className="fas fa-quote-right"></i>
          </div>
          <h3 className="heading-2" style={{color: 'var(--dark-gray)'}}>
            Ils nous font confiance
          </h3>
          <p className="text-xl" style={{color: 'var(--light-gray)'}}>
            Découvrez les retours de nos utilisateurs satisfaits
          </p>
        </div>

        <div className="grid-3">
          {temoignages.map((temoignage) => (
            <div key={temoignage.id} className="card-white text-center">
              {/* Photo profil */}
              <div className="photo-container w-20 h-20 mx-auto mb-4">
                <img 
                  src={temoignage.photo}
                  alt={temoignage.nom}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Étoiles */}
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(temoignage.note)].map((_, i) => (
                  <i key={i} className="fas fa-star text-orange"></i>
                ))}
              </div>

              {/* Témoignage */}
              <p className="mb-4 italic" style={{color: 'var(--light-gray)'}}>
                "{temoignage.temoignage}"
              </p>

              {/* Infos */}
              <div>
                <h4 className="font-bold" style={{color: 'var(--dark-gray)'}}>
                  {temoignage.nom}
                </h4>
                <p className="text-sm" style={{color: 'var(--light-gray)'}}>
                  {temoignage.poste}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA section */}
        <div className="text-center mt-16 p-8 rounded-xl" style={{backgroundColor: 'var(--dark-gray)'}}>
          <div className="feature-icon mx-auto">
            <i className="fas fa-users"></i>
          </div>
          <h3 className="heading-3 text-white mb-4">
            Rejoignez la communauté Finitio
          </h3>
          <p className="text-xl text-gray mb-6 max-w-2xl mx-auto">
            Plus de 2500 professionnels utilisent déjà Finitio pour transformer leurs projets de construction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/inscription" className="btn btn-orange">
              <i className="fas fa-user-plus icon"></i>
              Rejoindre maintenant
            </a>
            <a href="/temoignages" className="btn btn-outline">
              <i className="fas fa-comments icon"></i>
              Voir plus de témoignages
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pourquoi;
