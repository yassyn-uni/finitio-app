import { Link } from 'react-router-dom';

export default function Cta() {
  return (
    <section className="bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white text-center py-12 md:py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
          Prêt à simplifier votre chantier ?
        </h2>
        <p className="mb-6 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
          Rejoignez Finitio gratuitement dès aujourd'hui.
        </p>
        <Link 
          to="/inscription" 
          className="inline-block bg-white text-[#0077B6] font-semibold px-6 sm:px-8 py-3 rounded-full shadow hover:bg-gray-100 transition-all duration-300 text-sm sm:text-base"
        >
          Créer mon compte
        </Link>
      </div>
    </section>
  );
}
