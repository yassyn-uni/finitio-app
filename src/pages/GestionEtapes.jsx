import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function GestionEtapes() {
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [filtreProjet, setFiltreProjet] = useState('tous');

  // Données simulées pour les étapes
  const etapes = [
    {
      id: 1,
      nom: "Étude de faisabilité",
      projet: "Villa Moderne",
      statut: "termine",
      progression: 100,
      dateDebut: "2024-01-15",
      dateFin: "2024-02-15",
      responsable: "Jean Dupont",
      description: "Analyse technique et financière du projet",
      taches: 8,
      tachesTerminees: 8,
      budget: 15000,
      budgetUtilise: 14500
    },
    {
      id: 2,
      nom: "Plans architecturaux",
      projet: "Villa Moderne",
      statut: "en_cours",
      progression: 75,
      dateDebut: "2024-02-16",
      dateFin: "2024-03-30",
      responsable: "Marie Martin",
      description: "Conception des plans détaillés",
      taches: 12,
      tachesTerminees: 9,
      budget: 25000,
      budgetUtilise: 18750
    },
    {
      id: 3,
      nom: "Permis de construire",
      projet: "Villa Moderne",
      statut: "en_attente",
      progression: 30,
      dateDebut: "2024-03-01",
      dateFin: "2024-04-15",
      responsable: "Pierre Durand",
      description: "Dépôt et suivi du permis de construire",
      taches: 6,
      tachesTerminees: 2,
      budget: 8000,
      budgetUtilise: 2400
    },
    {
      id: 4,
      nom: "Gros œuvre",
      projet: "Rénovation Appartement",
      statut: "planifie",
      progression: 0,
      dateDebut: "2024-05-01",
      dateFin: "2024-07-31",
      responsable: "Paul Leroy",
      description: "Travaux de structure et maçonnerie",
      taches: 20,
      tachesTerminees: 0,
      budget: 45000,
      budgetUtilise: 0
    },
    {
      id: 5,
      nom: "Second œuvre",
      projet: "Rénovation Appartement",
      statut: "planifie",
      progression: 0,
      dateDebut: "2024-08-01",
      dateFin: "2024-10-15",
      responsable: "Sophie Bernard",
      description: "Électricité, plomberie, cloisons",
      taches: 15,
      tachesTerminees: 0,
      budget: 35000,
      budgetUtilise: 0
    }
  ];

  const projets = [...new Set(etapes.map(etape => etape.projet))];

  const etapesFiltrees = etapes.filter(etape => {
    const filtreStatutOk = filtreStatut === 'tous' || etape.statut === filtreStatut;
    const filtreProjetOk = filtreProjet === 'tous' || etape.projet === filtreProjet;
    return filtreStatutOk && filtreProjetOk;
  });

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'termine': return 'bg-green-100 text-green-800 border-green-200';
      case 'en_cours': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'en_attente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'planifie': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'termine': return '✅';
      case 'en_cours': return '🔄';
      case 'en_attente': return '⏳';
      case 'planifie': return '📅';
      default: return '📋';
    }
  };

  const getProgressionColor = (progression) => {
    if (progression === 100) return 'from-green-400 to-green-600';
    if (progression >= 75) return 'from-blue-400 to-blue-600';
    if (progression >= 50) return 'from-yellow-400 to-yellow-600';
    if (progression >= 25) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  // Statistiques
  const stats = {
    total: etapes.length,
    terminees: etapes.filter(e => e.statut === 'termine').length,
    enCours: etapes.filter(e => e.statut === 'en_cours').length,
    enAttente: etapes.filter(e => e.statut === 'en_attente').length,
    planifiees: etapes.filter(e => e.statut === 'planifie').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Particules d'arrière-plan */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                🏗️ Gestion des Étapes
              </h1>
              <p className="text-gray-600 text-lg">
                Suivez et gérez toutes les étapes de vos projets de construction
              </p>
            </div>
            <button className="btn-primary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouvelle Étape
            </button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="card-interactive bg-white/80 backdrop-blur-sm p-4 text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="card-interactive bg-green-50/80 backdrop-blur-sm p-4 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-2xl font-bold text-green-600">{stats.terminees}</div>
              <div className="text-sm text-green-600">Terminées</div>
            </div>
            <div className="card-interactive bg-blue-50/80 backdrop-blur-sm p-4 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-2xl font-bold text-blue-600">{stats.enCours}</div>
              <div className="text-sm text-blue-600">En cours</div>
            </div>
            <div className="card-interactive bg-yellow-50/80 backdrop-blur-sm p-4 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-2xl font-bold text-yellow-600">{stats.enAttente}</div>
              <div className="text-sm text-yellow-600">En attente</div>
            </div>
            <div className="card-interactive bg-gray-50/80 backdrop-blur-sm p-4 text-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="text-2xl font-bold text-gray-600">{stats.planifiees}</div>
              <div className="text-sm text-gray-600">Planifiées</div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="card-interactive bg-white/80 backdrop-blur-sm p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par statut</label>
              <select 
                value={filtreStatut} 
                onChange={(e) => setFiltreStatut(e.target.value)}
                className="input-modern w-full"
              >
                <option value="tous">Tous les statuts</option>
                <option value="termine">Terminées</option>
                <option value="en_cours">En cours</option>
                <option value="en_attente">En attente</option>
                <option value="planifie">Planifiées</option>
              </select>
            </div>
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par projet</label>
              <select 
                value={filtreProjet} 
                onChange={(e) => setFiltreProjet(e.target.value)}
                className="input-modern w-full"
              >
                <option value="tous">Tous les projets</option>
                {projets.map(projet => (
                  <option key={projet} value={projet}>{projet}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Liste des étapes */}
        <div className="space-y-6">
          {etapesFiltrees.map((etape, index) => (
            <div 
              key={etape.id} 
              className="card-interactive bg-white/80 backdrop-blur-sm p-6 animate-fade-in-up"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Informations principales */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{getStatutIcon(etape.statut)}</span>
                    <h3 className="text-xl font-bold text-gray-800">{etape.nom}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(etape.statut)}`}>
                      {etape.statut.replace('_', ' ').charAt(0).toUpperCase() + etape.statut.replace('_', ' ').slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Projet</p>
                      <p className="font-medium text-gray-800">{etape.projet}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Responsable</p>
                      <p className="font-medium text-gray-800">{etape.responsable}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Période</p>
                      <p className="font-medium text-gray-800">
                        {new Date(etape.dateDebut).toLocaleDateString()} - {new Date(etape.dateFin).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tâches</p>
                      <p className="font-medium text-gray-800">
                        {etape.tachesTerminees}/{etape.taches} terminées
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{etape.description}</p>
                </div>

                {/* Progression et budget */}
                <div className="lg:w-80 space-y-4">
                  {/* Barre de progression */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progression</span>
                      <span className="text-sm font-bold text-gray-800">{etape.progression}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill bg-gradient-to-r ${getProgressionColor(etape.progression)}`}
                        style={{ width: `${etape.progression}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Budget</span>
                      <span className="text-sm font-bold text-gray-800">
                        {((etape.budgetUtilise / etape.budget) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="progress-bar mb-2">
                      <div 
                        className="progress-fill bg-gradient-to-r from-green-400 to-green-600"
                        style={{ width: `${(etape.budgetUtilise / etape.budget) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{etape.budgetUtilise.toLocaleString()}€ utilisés</span>
                      <span className="text-gray-800 font-medium">{etape.budget.toLocaleString()}€ total</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="btn-modern flex-1 text-sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Modifier
                    </button>
                    <button className="btn-modern flex-1 text-sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Détails
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucune étape */}
        {etapesFiltrees.length === 0 && (
          <div className="card-interactive bg-white/80 backdrop-blur-sm p-12 text-center animate-fade-in-up">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune étape trouvée</h3>
            <p className="text-gray-600 mb-6">
              Aucune étape ne correspond aux filtres sélectionnés.
            </p>
            <button 
              onClick={() => {
                setFiltreStatut('tous');
                setFiltreProjet('tous');
              }}
              className="btn-primary"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
