import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ErrorHandler from '../utils/errorHandler';
import NotificationSystem from '../utils/notifications';

export default function GestionEtapes() {
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [filtreProjet, setFiltreProjet] = useState('tous');
  const [etapes, setEtapes] = useState([]);
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Charger les données au montage
  useEffect(() => {
    loadUserAndData();
  }, []);

  const loadUserAndData = async () => {
    try {
      // Récupérer l'utilisateur connecté
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!user) {
        ErrorHandler.showUserError('Vous devez être connecté pour accéder à cette page');
        return;
      }

      // Récupérer le profil utilisateur
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setCurrentUser(profile);

      // Charger les projets et étapes selon le rôle
      await loadProjectsAndSteps(profile);

    } catch (error) {
      ErrorHandler.log(error, 'GestionEtapes.loadUserAndData');
      ErrorHandler.showUserError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const loadProjectsAndSteps = async (profile) => {
    try {
      let projetsQuery = supabase.from('projets').select('*');
      
      // Filtrer selon le rôle
      if (profile.role === 'client') {
        projetsQuery = projetsQuery.eq('client_id', profile.id);
      } else if (profile.role === 'architecte') {
        projetsQuery = projetsQuery.eq('architecte_id', profile.id);
      }
      // Les prestataires peuvent voir tous les projets où ils sont assignés

      const { data: projetsData, error: projetsError } = await projetsQuery;
      if (projetsError) throw projetsError;

      setProjets(projetsData || []);

      // Charger les étapes pour ces projets
      if (projetsData && projetsData.length > 0) {
        const projetIds = projetsData.map(p => p.id);
        
        const { data: etapesData, error: etapesError } = await supabase
          .from('etapes')
          .select(`
            *,
            projets:projet_id (
              titre,
              client_id,
              architecte_id
            )
          `)
          .in('projet_id', projetIds)
          .order('date_debut', { ascending: false });

        if (etapesError) throw etapesError;

        // Transformer les données pour correspondre au format attendu
        const etapesFormatted = etapesData?.map(etape => ({
          id: etape.id,
          nom: etape.nom,
          projet: etape.projets?.titre || 'Projet inconnu',
          statut: etape.statut,
          progression: etape.progression || 0,
          dateDebut: etape.date_debut,
          dateFin: etape.date_fin,
          responsable: etape.responsable || 'Non assigné',
          description: etape.description || '',
          taches: etape.nombre_taches || 0,
          tachesTerminees: etape.taches_terminees || 0,
          budget: etape.budget || 0,
          budgetUtilise: etape.budget_utilise || 0
        })) || [];

        setEtapes(etapesFormatted);
      }

    } catch (error) {
      ErrorHandler.log(error, 'GestionEtapes.loadProjectsAndSteps');
      ErrorHandler.showUserError('Erreur lors du chargement des projets et étapes');
    }
  };

  // Fonction pour mettre à jour une étape
  const updateEtape = async (etapeId, updates) => {
    try {
      const { error } = await supabase
        .from('etapes')
        .update(updates)
        .eq('id', etapeId);

      if (error) throw error;

      // Recharger les données
      await loadProjectsAndSteps(currentUser);
      NotificationSystem.success('Étape mise à jour avec succès');

    } catch (error) {
      ErrorHandler.log(error, 'GestionEtapes.updateEtape');
      ErrorHandler.showUserError('Erreur lors de la mise à jour de l\'étape');
    }
  };

  // Filtrer les étapes
  const etapesFiltrees = etapes.filter(etape => {
    const matchStatut = filtreStatut === 'tous' || etape.statut === filtreStatut;
    const matchProjet = filtreProjet === 'tous' || etape.projet === filtreProjet;
    return matchStatut && matchProjet;
  });

  // Calculer les statistiques
  const stats = {
    total: etapes.length,
    terminees: etapes.filter(e => e.statut === 'termine').length,
    enCours: etapes.filter(e => e.statut === 'en_cours').length,
    enAttente: etapes.filter(e => e.statut === 'en_attente').length,
    planifiees: etapes.filter(e => e.statut === 'planifie').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des étapes...</p>
        </div>
      </div>
    );
  }

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
                  <option key={projet.id} value={projet.titre}>{projet.titre}</option>
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
