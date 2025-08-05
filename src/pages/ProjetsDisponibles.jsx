import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ErrorHandler from '../utils/errorHandler';
import NotificationSystem from '../utils/notifications';

export default function ProjetsDisponibles() {
  const [filtreType, setFiltreType] = useState('tous');
  const [filtreLocalisation, setFiltreLocalisation] = useState('tous');
  const [filtreBudget, setFiltreBudget] = useState('tous');
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Charger les données au montage
  useEffect(() => {
    loadUserAndProjects();
  }, []);

  const loadUserAndProjects = async () => {
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

      // Vérifier que l'utilisateur est un prestataire
      if (profile.role !== 'prestataire') {
        ErrorHandler.showUserError('Cette page est réservée aux prestataires');
        return;
      }

      // Charger les projets disponibles
      await loadAvailableProjects();

    } catch (error) {
      ErrorHandler.log(error, 'ProjetsDisponibles.loadUserAndProjects');
      ErrorHandler.showUserError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableProjects = async () => {
    try {
      // Récupérer les projets ouverts (sans prestataire assigné ou acceptant plusieurs candidatures)
      const { data: projetsData, error: projetsError } = await supabase
        .from('projets')
        .select(`
          *,
          profiles:client_id (
            prenom,
            nom,
            avatar_url
          ),
          devis (
            id,
            statut
          )
        `)
        .eq('statut', 'ouvert')
        .order('created_at', { ascending: false });

      if (projetsError) throw projetsError;

      // Transformer les données pour correspondre au format attendu
      const projetsFormatted = projetsData?.map(projet => {
        const devisCount = projet.devis?.length || 0;
        const budgetRange = getBudgetRange(projet.budget);
        
        return {
          id: projet.id,
          titre: projet.titre,
          type: projet.type || 'Construction',
          localisation: projet.localisation,
          budget: projet.budget,
          budgetRange,
          description: projet.description,
          client: {
            nom: `${projet.profiles?.prenom || ''} ${projet.profiles?.nom || ''}`.trim() || 'Client anonyme',
            avatar: projet.profiles?.avatar_url
          },
          dateCreation: projet.created_at,
          dateDebut: projet.date_debut,
          dateFin: projet.date_fin,
          specialites: projet.specialites_requises || [],
          candidatures: devisCount,
          statut: projet.statut,
          urgence: projet.urgence || 'normale',
          surface: projet.surface,
          etages: projet.etages
        };
      }) || [];

      setProjets(projetsFormatted);

    } catch (error) {
      ErrorHandler.log(error, 'ProjetsDisponibles.loadAvailableProjects');
      ErrorHandler.showUserError('Erreur lors du chargement des projets');
    }
  };

  const getBudgetRange = (budget) => {
    if (!budget) return 'non-specifie';
    if (budget < 50000) return 'petit';
    if (budget < 200000) return 'moyen';
    return 'grand';
  };

  // Fonction pour postuler à un projet
  const postulerProjet = async (projetId) => {
    try {
      if (!currentUser) {
        ErrorHandler.showUserError('Vous devez être connecté pour postuler');
        return;
      }

      // Vérifier si l'utilisateur a déjà postulé
      const { data: existingDevis, error: checkError } = await supabase
        .from('devis')
        .select('id')
        .eq('projet_id', projetId)
        .eq('prestataire_id', currentUser.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingDevis) {
        ErrorHandler.showUserWarning('Vous avez déjà postulé à ce projet');
        return;
      }

      // Créer un devis de candidature
      const { error: devisError } = await supabase
        .from('devis')
        .insert({
          projet_id: projetId,
          prestataire_id: currentUser.id,
          statut: 'en_attente',
          titre: 'Candidature pour le projet',
          description: 'Candidature soumise via la page projets disponibles',
          montant: 0, // À définir plus tard
          created_at: new Date().toISOString()
        });

      if (devisError) throw devisError;

      NotificationSystem.success('Candidature envoyée avec succès !');
      
      // Recharger les projets pour mettre à jour le compteur
      await loadAvailableProjects();

    } catch (error) {
      ErrorHandler.log(error, 'ProjetsDisponibles.postulerProjet');
      ErrorHandler.showUserError('Erreur lors de l\'envoi de la candidature');
    }
  };

  // Filtrer les projets
  const projetsFiltres = projets.filter(projet => {
    const matchType = filtreType === 'tous' || projet.type.toLowerCase() === filtreType.toLowerCase();
    const matchLocalisation = filtreLocalisation === 'tous' || 
      projet.localisation.toLowerCase().includes(filtreLocalisation.toLowerCase());
    const matchBudget = filtreBudget === 'tous' || projet.budgetRange === filtreBudget;
    
    return matchType && matchLocalisation && matchBudget;
  });

  // Calculer les statistiques
  const stats = {
    construction: projets.filter(p => p.type === 'Construction').length,
    renovation: projets.filter(p => p.type === 'Rénovation').length,
    extension: projets.filter(p => p.type === 'Extension').length,
    amenagement: projets.filter(p => p.type === 'Aménagement').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des projets disponibles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Particules d'arrière-plan */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                🏠 Projets Disponibles
              </h1>
              <p className="text-gray-600 text-lg">
                Découvrez les projets de construction disponibles et postulez
              </p>
            </div>
            <div className="flex gap-3">
              <button className="btn-modern">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtres avancés
              </button>
              <button className="btn-primary">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Publier un projet
              </button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="card-interactive bg-white/80 backdrop-blur-sm p-4 text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="card-interactive bg-blue-50/80 backdrop-blur-sm p-4 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-2xl font-bold text-blue-600">{stats.construction}</div>
              <div className="text-sm text-blue-600">Construction</div>
            </div>
            <div className="card-interactive bg-green-50/80 backdrop-blur-sm p-4 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-2xl font-bold text-green-600">{stats.renovation}</div>
              <div className="text-sm text-green-600">Rénovation</div>
            </div>
            <div className="card-interactive bg-orange-50/80 backdrop-blur-sm p-4 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-2xl font-bold text-orange-600">{stats.extension}</div>
              <div className="text-sm text-orange-600">Extension</div>
            </div>
            <div className="card-interactive bg-purple-50/80 backdrop-blur-sm p-4 text-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="text-2xl font-bold text-purple-600">{stats.amenagement}</div>
              <div className="text-sm text-purple-600">Aménagement</div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="card-interactive bg-white/80 backdrop-blur-sm p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de projet</label>
              <select 
                value={filtreType} 
                onChange={(e) => setFiltreType(e.target.value)}
                className="input-modern w-full"
              >
                <option value="tous">Tous les types</option>
                <option value="construction">Construction</option>
                <option value="renovation">Rénovation</option>
                <option value="extension">Extension</option>
                <option value="amenagement">Aménagement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
              <select 
                value={filtreLocalisation} 
                onChange={(e) => setFiltreLocalisation(e.target.value)}
                className="input-modern w-full"
              >
                <option value="tous">Toutes les villes</option>
                {projets.map(projet => (
                  <option key={projet.id} value={projet.localisation}>{projet.localisation}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
              <select 
                value={filtreBudget} 
                onChange={(e) => setFiltreBudget(e.target.value)}
                className="input-modern w-full"
              >
                <option value="tous">Tous les budgets</option>
                <option value="petit">Moins de 100k€</option>
                <option value="moyen">100k€ - 300k€</option>
                <option value="grand">Plus de 300k€</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des projets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projetsFiltres.map((projet, index) => (
            <div 
              key={projet.id} 
              className="card-interactive bg-white/80 backdrop-blur-sm p-6 animate-fade-in-up"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              {/* En-tête du projet */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getTypeIcon(projet.type)}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{projet.titre}</h3>
                    <p className="text-gray-600">{projet.client.nom}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(projet.type)}`}>
                    {projet.type.charAt(0).toUpperCase() + projet.type.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatutColor(projet.statut)}`}>
                    {projet.statut === 'ouvert' ? 'Ouvert' : 'Urgent'}
                  </span>
                </div>
              </div>

              {/* Informations clés */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">📍 Localisation</p>
                  <p className="font-medium text-gray-800">{projet.localisation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">💰 Budget</p>
                  <p className="font-medium text-gray-800">{projet.budget.toLocaleString()}€</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">📏 Surface</p>
                  <p className="font-medium text-gray-800">{projet.surface}m²</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">👥 Candidatures</p>
                  <p className="font-medium text-gray-800">{projet.candidatures} reçues</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-2">{projet.description}</p>

              {/* Spécialités requises */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">🔧 Spécialités requises</p>
                <div className="flex flex-wrap gap-2">
                  {projet.specialites.slice(0, 3).map(specialite => (
                    <span key={specialite} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                      {specialite}
                    </span>
                  ))}
                  {projet.specialites.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                      +{projet.specialites.length - 3} autres
                    </span>
                  )}
                </div>
              </div>

              {/* Dates et urgence */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">📅 Échéance</p>
                  <p className="font-medium text-gray-800">
                    {new Date(projet.dateFin).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgenceColor(projet.urgence)}`}>
                  {projet.urgence === 'haute' ? '🔥 Urgent' : '⏰ Normal'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button 
                  onClick={() => postulerProjet(projet.id)} 
                  className="btn-primary flex-1"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Postuler
                </button>
                <button className="btn-modern">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Détails
                </button>
                <button className="btn-modern">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun projet */}
        {projetsFiltres.length === 0 && (
          <div className="card-interactive bg-white/80 backdrop-blur-sm p-12 text-center animate-fade-in-up">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun projet trouvé</h3>
            <p className="text-gray-600 mb-6">
              Aucun projet ne correspond aux filtres sélectionnés.
            </p>
            <button 
              onClick={() => {
                setFiltreType('tous');
                setFiltreLocalisation('tous');
                setFiltreBudget('tous');
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

const getTypeIcon = (type) => {
  switch (type) {
    case 'construction': return '🏗️';
    case 'renovation': return '🔨';
    case 'extension': return '📐';
    case 'amenagement': return '🎨';
    default: return '🏠';
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case 'construction': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'renovation': return 'bg-green-100 text-green-800 border-green-200';
    case 'extension': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'amenagement': return 'bg-purple-100 text-purple-800 border-purple-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getUrgenceColor = (urgence) => {
  switch (urgence) {
    case 'haute': return 'bg-red-100 text-red-800 border-red-200';
    case 'normale': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatutColor = (statut) => {
  switch (statut) {
    case 'ouvert': return 'bg-green-100 text-green-800 border-green-200';
    case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
