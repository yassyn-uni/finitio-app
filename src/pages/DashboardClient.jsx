import React from 'react';
import { Link } from 'react-router-dom';

const modules = [
  { title: 'Mes projets', icon: '🏗️', link: '/projets' },
  { title: 'Créer un projet', icon: '➕', link: '/nouveau-projet' },
  { title: 'Suivi de mes projets', icon: '📊', link: '/projets/suivi' },
  { title: 'Paiements & devis', icon: '💸', link: '/projets/paiements' },
  { title: 'Liste d’achats', icon: '🧰', link: '/projets/liste-achats' },
  { title: 'Trouver un prestataire', icon: '🔍', link: '/annuaire-prestataires' },
  { title: 'Messagerie', icon: '📬', link: '/messages' },
];

export default function DashboardClient() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#03045E] mb-6">Bienvenue sur votre tableau de bord client</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <Link key={index} to={module.link}>
            <div className="bg-white shadow-md rounded-2xl p-5 hover:shadow-xl transition duration-300 flex flex-col items-center text-center">
              <div className="text-4xl mb-3">{module.icon}</div>
              <div className="font-semibold text-lg text-[#03045E]">{module.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
