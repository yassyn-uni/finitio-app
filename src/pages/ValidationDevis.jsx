import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function ValidationDevis() {
  const [devisAValider, setDevisAValider] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [filter, setFilter] = useState('tous'); // tous, en_attente, valide, rejete
  const [selectedDevis, setSelectedDevis] = useState(null);
  const [commentaire, setCommentaire] = useState('');

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchDevisAValider();
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

  const fetchDevisAValider = async () => {
    try {
      setLoading(true);
      
      // Simuler des données de devis à valider (à remplacer par vraie requête)
      const mockDevis = [
        {
          id: '1',
          projet_titre: 'Rénovation Appartement Paris',
          client_nom: 'Aicha Benali',
          prestataire: 'Entreprise Martin',
          montant: 25000,
          statut: 'en_attente',
          date_soumission: '2024-02-01',
          date_limite: '2024-02-15',
          description: 'Rénovation complète cuisine et salle de bain',
          details: {
            surface: '45 m²',
            duree: '6 semaines',
            garantie: '2 ans',
            prestations: ['Démolition existant', 'Plomberie', 'Électricité', 'Carrelage', 'Peinture']
          },
          documents: ['Plan technique', 'Devis détaillé', 'Certificats'],
          conformite: {
            normes_construction: true,
            reglementation: true,
            budget_respecte: true,
            delais_realistes: false
          }
        },
        {
          id: '2',
          projet_titre: 'Construction Villa Casablanca',
          client_nom: 'Ahmed Benali',
          prestataire: 'BTP Constructions',
          montant: 150000,
          statut: 'valide',
          date_soumission: '2024-01-15',
          date_validation: '2024-01-20',
          description: 'Construction villa 200m² avec piscine',
          details: {
            surface: '200 m²',
            duree: '8 mois',
            garantie: '10 ans',
            prestations: ['Gros œuvre', 'Second œuvre', 'Piscine', 'Aménagements extérieurs']
          },
          documents: ['Plans architecturaux', 'Étude de sol', 'Permis de construire'],
          conformite: {
            normes_construction: true,
            reglementation: true,
            budget_respecte: true,
            delais_realistes: true
          },
          commentaire_validation: 'Projet conforme aux normes. Excellent travail.'
        },
        {
          id: '3',
          projet_titre: 'Extension Maison Rabat',
          client_nom: 'Fatima Alami',
          prestataire: 'Artisans Réunis',
          montant: 18500,
          statut: 'rejete',
          date_soumission: '2024-01-10',
          date_rejet: '2024-01-12',
          description: 'Extension 40m² avec terrasse',
          details: {
            surface: '40 m²',
            duree: '4 semaines',
            garantie: '1 an',
            prestations: ['Extension structure', 'Toiture', 'Isolation', 'Finitions']
          },
          documents: ['Plan extension', 'Devis matériaux'],
          conformite: {
            normes_construction: false,
            reglementation: true,
            budget_respecte: true,
            delais_realistes: false
          },
          commentaire_validation: 'Non-conformité aux normes d\'isolation thermique. Délais trop courts.'
        }
      ];

      // Filtrer selon le statut sélectionné
      const filteredDevis = filter === 'tous' 
        ? mockDevis 
        : mockDevis.filter(d => d.statut === filter);

      setDevisAValider(filteredDevis);
    } catch (error) {
      console.error('Erreur récupération devis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'valide': return 'bg-green-100 text-green-800';
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'rejete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'valide': return '✅';
      case 'en_attente': return '⏳';
      case 'rejete': return '❌';
      default: return '📋';
    }
  };

  const getConformiteIcon = (conforme) => {
    return conforme ? '✅' : '❌';
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

  const validerDevis = async (devisId, decision, commentaire) => {
    try {
      // Ici, vous ajouteriez la logique pour valider/rejeter le devis
      console.log('Validation devis:', { devisId, decision, commentaire });
      
      // Simuler la mise à jour
      setDevisAValider(prev => prev.map(devis => 
        devis.id === devisId 
          ? { 
              ...devis, 
              statut: decision, 
              date_validation: decision === 'valide' ? new Date().toISOString() : undefined,
              date_rejet: decision === 'rejete' ? new Date().toISOString() : undefined,
              commentaire_validation: commentaire 
            }
          : devis
      ));
      
      setSelectedDevis(null);
      setCommentaire('');
      
      alert(`✅ Devis ${decision === 'valide' ? 'validé' : 'rejeté'} avec succès !`);
    } catch (error) {
      console.error('Erreur validation devis:', error);
      alert('❌ Erreur lors de la validation');
    }
  };

  if (loading) {
    return (
      <div className="container-responsive section-padding">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Chargement des devis à valider...</p>
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
              <h1 className="text-2xl font-bold text-[#03045E]">✅ Validation des Devis</h1>
              <p className="text-gray-600 mt-1">
                Validez les devis soumis par les prestataires
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Architecte:</span>
              <span className="font-medium text-gray-900">{currentUser?.nom || 'Utilisateur'}</span>
            </div>
          </div>

          {/* Filtres */}
          <div className="mt-4 flex gap-2">
            {[
              { key: 'tous', label: 'Tous', count: devisAValider.length },
              { key: 'en_attente', label: 'En attente', count: 1 },
              { key: 'valide', label: 'Validés', count: 1 },
              { key: 'rejete', label: 'Rejetés', count: 1 }
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

        {/* Statistiques rapides */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-blue-800">Total devis</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <div className="text-sm text-yellow-800">En attente</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">1</div>
              <div className="text-sm text-green-800">Validés</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-red-800">Rejetés</div>
            </div>
          </div>
        </div>

        {/* Liste des devis */}
        <div className="divide-y divide-gray-200">
          {devisAValider.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun devis à valider
              </h3>
              <p className="text-gray-500 mb-4">
                Les devis soumis par les prestataires apparaîtront ici
              </p>
              <Link
                to="/projets"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                📋 Voir les projets
              </Link>
            </div>
          ) : (
            devisAValider.map((devis) => (
              <div key={devis.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{getStatutIcon(devis.statut)}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {devis.projet_titre}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Client: {devis.client_nom} • Prestataire: {devis.prestataire}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">
                      {devis.description}
                    </p>

                    {/* Détails techniques */}
                    <div className="mb-3 bg-gray-50 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Détails techniques :</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Surface:</span>
                          <span className="ml-1 font-medium">{devis.details.surface}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Durée:</span>
                          <span className="ml-1 font-medium">{devis.details.duree}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Garantie:</span>
                          <span className="ml-1 font-medium">{devis.details.garantie}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Documents:</span>
                          <span className="ml-1 font-medium">{devis.documents.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Analyse de conformité */}
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Analyse de conformité :</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <span>{getConformiteIcon(devis.conformite.normes_construction)}</span>
                          <span>Normes construction</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{getConformiteIcon(devis.conformite.reglementation)}</span>
                          <span>Réglementation</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{getConformiteIcon(devis.conformite.budget_respecte)}</span>
                          <span>Budget respecté</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{getConformiteIcon(devis.conformite.delais_realistes)}</span>
                          <span>Délais réalistes</span>
                        </div>
                      </div>
                    </div>

                    {/* Commentaire de validation */}
                    {devis.commentaire_validation && (
                      <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-900 mb-1">Commentaire :</h4>
                        <p className="text-sm text-blue-800">{devis.commentaire_validation}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Soumis le: {formatDate(devis.date_soumission)}</span>
                      {devis.date_limite && (
                        <span>Limite: {formatDate(devis.date_limite)}</span>
                      )}
                      {devis.date_validation && (
                        <span>Validé le: {formatDate(devis.date_validation)}</span>
                      )}
                      {devis.date_rejet && (
                        <span>Rejeté le: {formatDate(devis.date_rejet)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right ml-6">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {formatMontant(devis.montant)}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(devis.statut)} mb-3`}>
                      {devis.statut.replace('_', ' ')}
                    </span>
                    
                    {devis.statut === 'en_attente' && (
                      <div className="flex flex-col gap-1">
                        <button 
                          onClick={() => setSelectedDevis(devis)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Examiner
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de validation */}
      {selectedDevis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">
              Validation du devis - {selectedDevis.projet_titre}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commentaire (optionnel) :
              </label>
              <textarea
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                placeholder="Ajoutez vos observations..."
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => validerDevis(selectedDevis.id, 'valide', commentaire)}
                className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
              >
                ✅ Valider
              </button>
              <button
                onClick={() => validerDevis(selectedDevis.id, 'rejete', commentaire)}
                className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
              >
                ❌ Rejeter
              </button>
              <button
                onClick={() => {
                  setSelectedDevis(null);
                  setCommentaire('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
