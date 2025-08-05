import React from 'react';
import { Link } from 'react-router-dom';

const modules = [
  { title: 'Créer un projet', icon: '🏗️', link: '/nouveau-projet' },
  { title: 'Mes projets', icon: '📁', link: '/projets' },
  { title: 'Gestion des étapes', icon: '📋', link: '/projets' },
  { title: 'Validation des devis', icon: '✅', link: '/validation-devis' },
  { title: 'Annuaire prestataires', icon: '📋', link: '/annuaire-prestataires' },
];

export default function DashboardArchitecte() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#047857] mb-6">Bienvenue sur votre tableau de bord architecte</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <Link key={index} to={module.link}>
            <div className="bg-white shadow-md rounded-2xl p-5 hover:shadow-xl transition duration-300 flex flex-col items-center text-center">
              <div className="text-4xl mb-3">{module.icon}</div>
              <div className="font-semibold text-lg text-[#047857]">{module.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
