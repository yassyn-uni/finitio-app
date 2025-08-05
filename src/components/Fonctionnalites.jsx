export default function Fonctionnalites() {
  const features = [
    "Suivi en temps réel de vos chantiers",
    "Messagerie client/prestataire",
    "Checklist de travaux",
    "Devis & factures centralisés",
    "Accès mobile et desktop",
  ];

  return (
    <section className="bg-gray-100 px-6 py-12">
      <h2 className="text-3xl text-center text-teal-600 font-bold mb-8">Fonctionnalités</h2>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto text-gray-800">
        {features.map((f, i) => (
          <li key={i} className="bg-white p-4 rounded shadow hover:shadow-lg transition">{f}</li>
        ))}
      </ul>
    </section>
  );
}
