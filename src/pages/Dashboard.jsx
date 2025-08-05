import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-700 text-white">
      <header className="p-6 shadow-md bg-indigo-950/90 backdrop-blur-md">
        <h1 className="text-3xl font-bold">Bienvenue sur votre tableau de bord</h1>
        <p className="text-white/70 mt-1">Gérez vos projets et suivez vos activités</p>
      </header>

      <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carte Projets */}
        <div className="bg-white/10 rounded-xl p-5 shadow hover:bg-white/20 transition">
          <h2 className="text-lg font-semibold">📁 Mes projets</h2>
          <p className="text-white/80 text-sm mt-1">Accédez à vos projets enregistrés.</p>
        </div>

        {/* Carte Paiements */}
        <div className="bg-white/10 rounded-xl p-5 shadow hover:bg-white/20 transition">
          <h2 className="text-lg font-semibold">💰 Paiements</h2>
          <p className="text-white/80 text-sm mt-1">Consultez vos factures et historiques.</p>
        </div>

        {/* Carte Support */}
        <div className="bg-white/10 rounded-xl p-5 shadow hover:bg-white/20 transition">
          <h2 className="text-lg font-semibold">📨 Assistance</h2>
          <p className="text-white/80 text-sm mt-1">Contactez notre support client.</p>
        </div>
      </main>
    </div>
  );
}
