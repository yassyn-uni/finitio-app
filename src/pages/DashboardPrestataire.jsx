import React from 'react';
import { Link } from 'react-router-dom';

const modules = [
  { title: 'Projets disponibles', icon: '📋', link: '/projets' },
  { title: 'Soumettre un devis', icon: '📤', link: '/devis/nouveau' },
  { title: 'Mes devis', icon: '🧾', link: '/devis' },
  { title: 'Paiements', icon: '💳', link: '/paiements' },
  { title: 'Messagerie', icon: '📨', link: '/messages' },
];

export default function DashboardPrestataire() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#92400e] mb-6">Bienvenue sur votre tableau de bord prestataire</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <Link key={index} to={module.link}>
            <div className="bg-white shadow-md rounded-2xl p-5 hover:shadow-xl transition duration-300 flex flex-col items-center text-center">
              <div className="text-4xl mb-3">{module.icon}</div>
              <div className="font-semibold text-lg text-[#92400e]">{module.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
