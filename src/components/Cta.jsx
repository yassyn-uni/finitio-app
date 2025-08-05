import { Link } from 'react-router-dom';

export default function Cta() {
  return (
    <section className="construction-gradient text-white text-center py-12 md:py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Overlay pour améliorer le contraste */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
          Prêt à démarrer votre projet ?
        </h2>
        <p className="mb-8 text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-white font-light">
          Rejoignez des milliers de professionnels qui font confiance à Finitio
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/inscription" 
            className="btn btn-primary btn-lg px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="mr-2">🚀</span>
            Commencer gratuitement
          </Link>
          
          <Link 
            to="/demo" 
            className="btn btn-outline btn-lg px-8 py-4 text-lg font-semibold text-white border-white border-2 hover:bg-white hover:text-gray-900 shadow-xl"
          >
            <span className="mr-2">🎥</span>
            Voir la démo
          </Link>
        </div>
        
        {/* Statistiques de confiance */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="stats-card">
            <div className="stats-number">2500+</div>
            <div className="stats-label">Projets Réalisés</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">98.5%</div>
            <div className="stats-label">Satisfaction Client</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">24h</div>
            <div className="stats-label">Support Réactif</div>
          </div>
        </div>
      </div>
      
      {/* Éléments décoratifs harmonisés */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-orange-400 bg-opacity-20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-500 bg-opacity-15 rounded-full blur-xl animate-pulse delay-1000"></div>
    </section>
  );
}
