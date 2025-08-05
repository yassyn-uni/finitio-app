export default function Hero() {
  return (
    <section className="text-center py-12 md:py-20 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white min-h-[60vh] flex flex-col justify-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
          Bienvenue sur Finitio
        </h2>
        <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          La plateforme BTP intelligente pour particuliers et professionnels
        </p>
      </div>
    </section>
  );
}
