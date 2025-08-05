import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function ListeAchats() {
  const [listes, setListes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [filter, setFilter] = useState('tous'); // tous, en_cours, termine
  const [showNewList, setShowNewList] = useState(false);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchListes();
    }
  }, [currentUser, filter]);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error);
    }
  };

  const fetchListes = async () => {
    try {
      setLoading(true);
      
      // Simuler des données de listes d'achats (à remplacer par vraie requête)
      const mockListes = [
        {
          id: '1',
          nom: 'Matériaux Rénovation Appartement',
          projet_titre: 'Rénovation Appartement Paris',
          statut: 'en_cours',
          date_creation: '2024-02-01',
          total_items: 12,
          items_achetes: 8,
          budget_prevu: 5000,
          budget_utilise: 3200,
          items: [
            { nom: 'Carrelage salle de bain', quantite: '15 m²', prix: 800, achete: true },
            { nom: 'Peinture cuisine', quantite: '4 pots', prix: 120, achete: true },
            { nom: 'Robinetterie', quantite: '1 set', prix: 350, achete: false },
            { nom: 'Électroménager', quantite: '1 set', prix: 1200, achete: false }
          ]
        },
        {
          id: '2',
          nom: 'Équipements Villa',
          projet_titre: 'Construction Villa Casablanca',
          statut: 'termine',
          date_creation: '2024-01-15',
          date_completion: '2024-01-30',
          total_items: 25,
          items_achetes: 25,
          budget_prevu: 15000,
          budget_utilise: 14500,
          items: [
            { nom: 'Système électrique', quantite: '1 installation', prix: 3500, achete: true },
            { nom: 'Plomberie complète', quantite: '1 installation', prix: 2800, achete: true },
            { nom: 'Isolation thermique', quantite: '200 m²', prix: 1200, achete: true }
          ]
        },
        {
          id: '3',
          nom: 'Finitions Extension',
          projet_titre: 'Extension Maison Rabat',
          statut: 'en_cours',
          date_creation: '2024-02-05',
          total_items: 8,
          items_achetes: 3,
          budget_prevu: 2500,
          budget_utilise: 800,
          items: [
            { nom: 'Parquet flottant', quantite: '40 m²', prix: 600, achete: true },
            { nom: 'Cloisons sèches', quantite: '20 m²', prix: 200, achete: true },
            { nom: 'Portes intérieures', quantite: '3 unités', prix: 450, achete: false },
            { nom: 'Luminaires', quantite: '5 unités', prix: 300, achete: false }
          ]
        }
      ];

      // Filtrer selon le statut sélectionné
      const filteredListes = filter === 'tous' 
        ? mockListes 
        : mockListes.filter(l => l.statut === filter);

      setListes(filteredListes);
    } catch (error) {
      console.error('Erreur récupération listes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'termine': return 'bg-green-100 text-green-800';
      case 'en_cours': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'termine': return '✅';
      case 'en_cours': return '🛒';
      default: return '📝';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }).format(montant);
  };

  const getProgressPercentage = (achetes, total) => {
    return Math.round((achetes / total) * 100);
  };

  const createNewList = () => {
    if (newListName.trim()) {
      // Ici, vous ajouteriez la logique pour créer une nouvelle liste
      console.log('Créer nouvelle liste:', newListName);
      setNewListName('');
      setShowNewList(false);
      // Recharger les listes
      fetchListes();
    }
  };

  if (loading) {
    return (
      <div className="container-responsive section-padding">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Chargement des listes d'achats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive section-padding">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#03045E]">🧰 Listes d'Achats</h1>
              <p className="text-gray-600 mt-1">
                Gérez vos achats de matériaux et équipements
              </p>
            </div>
            <button 
              onClick={() => setShowNewList(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              ➕ Nouvelle Liste
            </button>
          </div>

          {/* Filtres */}
          <div className="mt-4 flex gap-2">
            {[
              { key: 'tous', label: 'Toutes', count: listes.length },
              { key: 'en_cours', label: 'En cours', count: 2 },
              { key: 'termine', label: 'Terminées', count: 1 }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Modal nouvelle liste */}
        {showNewList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Créer une nouvelle liste</h3>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Nom de la liste d'achats"
                className="w-full p-3 border border-gray-300 rounded-md mb-4"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={createNewList}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Créer
                </button>
                <button
                  onClick={() => {
                    setShowNewList(false);
                    setNewListName('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques rapides */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-blue-800">Listes actives</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">36</div>
              <div className="text-sm text-green-800">Articles achetés</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">9</div>
              <div className="text-sm text-yellow-800">En attente</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">22 500 MAD</div>
              <div className="text-sm text-purple-800">Budget total</div>
            </div>
          </div>
        </div>

        {/* Liste des listes d'achats */}
        <div className="divide-y divide-gray-200">
          {listes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🧰</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune liste d'achats
              </h3>
              <p className="text-gray-500 mb-4">
                Créez votre première liste pour organiser vos achats
              </p>
              <button
                onClick={() => setShowNewList(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                ➕ Créer une liste
              </button>
            </div>
          ) : (
            listes.map((liste) => (
              <div key={liste.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{getStatutIcon(liste.statut)}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {liste.nom}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Projet: {liste.projet_titre}
                        </p>
                      </div>
                    </div>
                    
                    {/* Barre de progression */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Progression des achats</span>
                        <span>{liste.items_achetes}/{liste.total_items} articles</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(liste.items_achetes, liste.total_items)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {getProgressPercentage(liste.items_achetes, liste.total_items)}% terminé
                      </div>
                    </div>

                    {/* Aperçu des articles */}
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Derniers articles :</h4>
                      <div className="space-y-1">
                        {liste.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className={item.achete ? '✅' : '⏳'}></span>
                              <span className={item.achete ? 'line-through text-gray-500' : 'text-gray-700'}>
                                {item.nom} ({item.quantite})
                              </span>
                            </div>
                            <span className="text-gray-600">{formatMontant(item.prix)}</span>
                          </div>
                        ))}
                        {liste.items.length > 3 && (
                          <div className="text-xs text-gray-500">
                            ... et {liste.items.length - 3} autres articles
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Créée le: {formatDate(liste.date_creation)}</span>
                      {liste.date_completion && (
                        <span>Terminée le: {formatDate(liste.date_completion)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right ml-6">
                    <div className="mb-2">
                      <div className="text-lg font-bold text-gray-900">
                        {formatMontant(liste.budget_utilise)}
                      </div>
                      <div className="text-sm text-gray-500">
                        sur {formatMontant(liste.budget_prevu)}
                      </div>
                    </div>
                    
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(liste.statut)} mb-3`}>
                      {liste.statut.replace('_', ' ')}
                    </span>
                    
                    <div className="flex flex-col gap-1">
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                        Voir détails
                      </button>
                      {liste.statut === 'en_cours' && (
                        <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                          Ajouter article
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
