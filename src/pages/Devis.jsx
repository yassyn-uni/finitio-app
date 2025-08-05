import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Devis() {
  const [devis, setDevis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [filter, setFilter] = useState('tous'); // tous, en_attente, accepte, refuse

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchDevis();
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

  const fetchDevis = async () => {
    try {
      setLoading(true);
      
      // Simuler des données de devis (à remplacer par vraie requête)
      const mockDevis = [
        {
          id: '1',
          projet_titre: 'Rénovation Appartement Paris',
          prestataire: 'Entreprise Martin',
          montant: 25000,
          statut: 'en_attente',
          date_creation: '2024-02-01',
          date_expiration: '2024-02-15',
          description: 'Rénovation complète cuisine et salle de bain',
          details: ['Démolition existant', 'Plomberie', 'Électricité', 'Carrelage', 'Peinture']
        },
        {
          id: '2',
          projet_titre: 'Construction Villa Casablanca',
          prestataire: 'BTP Constructions',
          montant: 150000,
          statut: 'accepte',
          date_creation: '2024-01-15',
          date_acceptation: '2024-01-20',
          description: 'Construction villa 200m² avec piscine',
          details: ['Gros œuvre', 'Second œuvre', 'Piscine', 'Aménagements extérieurs']
        },
        {
          id: '3',
          projet_titre: 'Extension Maison Rabat',
          prestataire: 'Artisans Réunis',
          montant: 18500,
          statut: 'refuse',
          date_creation: '2024-01-10',
          date_refus: '2024-01-12',
          description: 'Extension 40m² avec terrasse',
          details: ['Extension structure', 'Toiture', 'Isolation', 'Finitions']
        }
      ];

      // Filtrer selon le statut sélectionné
      const filteredDevis = filter === 'tous' 
        ? mockDevis 
        : mockDevis.filter(d => d.statut === filter);

      setDevis(filteredDevis);
    } catch (error) {
      console.error('Erreur récupération devis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'accepte': return 'bg-green-100 text-green-800';
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'refuse': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'accepte': return '✅';
      case 'en_attente': return '⏳';
      case 'refuse': return '❌';
      default: return '📄';
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

  if (loading) {
    return (
      <div className="container-responsive section-padding">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Chargement des devis...</p>
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
              <h1 className="text-2xl font-bold text-[#03045E]">📋 Gestion des Devis</h1>
              <p className="text-gray-600 mt-1">
                Suivez vos demandes de devis et propositions
              </p>
            </div>
            <Link 
              to="/devis/nouveau"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              ➕ Demander un Devis
            </Link>
          </div>

          {/* Filtres */}
          <div className="mt-4 flex gap-2">
            {[
              { key: 'tous', label: 'Tous', count: 3 },
              { key: 'en_attente', label: 'En attente', count: 1 },
              { key: 'accepte', label: 'Acceptés', count: 1 },
              { key: 'refuse', label: 'Refusés', count: 1 }
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
              <div className="text-sm text-green-800">Acceptés</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-red-800">Refusés</div>
            </div>
          </div>
        </div>

        {/* Liste des devis */}
        <div className="divide-y divide-gray-200">
          {devis.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun devis
              </h3>
              <p className="text-gray-500 mb-4">
                Vos demandes de devis apparaîtront ici
              </p>
              <Link
                to="/projets"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                📋 Voir mes projets
              </Link>
            </div>
          ) : (
            devis.map((devisItem) => (
              <div key={devisItem.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{getStatutIcon(devisItem.statut)}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {devisItem.projet_titre}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Par {devisItem.prestataire}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">
                      {devisItem.description}
                    </p>

                    {/* Détails du devis */}
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Prestations incluses :</h4>
                      <div className="flex flex-wrap gap-1">
                        {devisItem.details.map((detail, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                          >
                            {detail}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Créé le: {formatDate(devisItem.date_creation)}</span>
                      {devisItem.date_expiration && (
                        <span>Expire le: {formatDate(devisItem.date_expiration)}</span>
                      )}
                      {devisItem.date_acceptation && (
                        <span>Accepté le: {formatDate(devisItem.date_acceptation)}</span>
                      )}
                      {devisItem.date_refus && (
                        <span>Refusé le: {formatDate(devisItem.date_refus)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right ml-6">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {formatMontant(devisItem.montant)}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(devisItem.statut)} mb-2`}>
                      {devisItem.statut.replace('_', ' ')}
                    </span>
                    
                    {devisItem.statut === 'en_attente' && (
                      <div className="flex gap-2 mt-2">
                        <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                          Accepter
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                          Refuser
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
    </div>
  );
}
