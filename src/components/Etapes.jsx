export default function Etapes() {
  return (
    <section className="bg-[#CAF0F8] py-20 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-[#0077B6] mb-10">Comment ça marche ?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        <div className="p-6 bg-white rounded-xl shadow-md border-t-4 border-[#00B4D8] hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-semibold text-[#03045E] mb-2">1. Créez votre compte</h3>
          <p className="text-gray-700">Inscrivez-vous en quelques clics, gratuitement.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md border-t-4 border-[#00B4D8] hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-semibold text-[#03045E] mb-2">2. Décrivez votre projet</h3>
          <p className="text-gray-700">Indiquez votre chantier, vos besoins et vos préférences.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md border-t-4 border-[#00B4D8] hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-semibold text-[#03045E] mb-2">3. Suivez en temps réel</h3>
          <p className="text-gray-700">Pilotez les étapes, échangez avec les prestataires.</p>
        </div>
      </div>
    </section>
  );
}
