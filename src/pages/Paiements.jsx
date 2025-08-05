import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Paiements() {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [filter, setFilter] = useState('tous'); // tous, en_attente, paye, en_retard

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchPaiements();
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

  const fetchPaiements = async () => {
    try {
      setLoading(true);
      
      // Simuler des données de paiements (à remplacer par vraie requête)
      const mockPaiements = [
        {
          id: '1',
          projet_titre: 'Rénovation Appartement Paris',
          montant: 15000,
          statut: 'en_attente',
          date_echeance: '2024-02-15',
          date_creation: '2024-01-15',
          type: 'acompte',
          description: 'Acompte 30% - Début des travaux'
        },
        {
          id: '2',
          projet_titre: 'Construction Villa Casablanca',
          montant: 45000,
          statut: 'paye',
          date_echeance: '2024-01-30',
          date_paiement: '2024-01-28',
          type: 'facture',
          description: 'Facture finale - Livraison projet'
        },
        {
          id: '3',
          projet_titre: 'Extension Maison Rabat',
          montant: 8500,
          statut: 'en_retard',
          date_echeance: '2024-01-10',
          type: 'facture',
          description: 'Facture intermédiaire - Phase 2'
        }
      ];

      // Filtrer selon le statut sélectionné
      const filteredPaiements = filter === 'tous' 
        ? mockPaiements 
        : mockPaiements.filter(p => p.statut === filter);

      setPaiements(filteredPaiements);
    } catch (error) {
      console.error('Erreur récupération paiements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'paye': return 'bg-green-100 text-green-800';
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'en_retard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'paye': return '✅';
      case 'en_attente': return '⏳';
      case 'en_retard': return '⚠️';
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
          <p className="mt-2 text-gray-500">Chargement des paiements...</p>
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
              <h1 className="text-2xl font-bold text-[#03045E]">💳 Gestion des Paiements</h1>
              <p className="text-gray-600 mt-1">
                Suivez vos factures et paiements
              </p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              ➕ Nouvelle Facture
            </button>
          </div>

          {/* Filtres */}
          <div className="mt-4 flex gap-2">
            {[
              { key: 'tous', label: 'Tous', count: paiements.length },
              { key: 'en_attente', label: 'En attente', count: 1 },
              { key: 'paye', label: 'Payés', count: 1 },
              { key: 'en_retard', label: 'En retard', count: 1 }
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
              <div className="text-2xl font-bold text-blue-600">68 500 MAD</div>
              <div className="text-sm text-blue-800">Total facturé</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">45 000 MAD</div>
              <div className="text-sm text-green-800">Payé</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">15 000 MAD</div>
              <div className="text-sm text-yellow-800">En attente</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">8 500 MAD</div>
              <div className="text-sm text-red-800">En retard</div>
            </div>
          </div>
        </div>

        {/* Liste des paiements */}
        <div className="divide-y divide-gray-200">
          {paiements.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun paiement
              </h3>
              <p className="text-gray-500 mb-4">
                Vos factures et paiements apparaîtront ici
              </p>
              <Link
                to="/projets"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                📋 Voir mes projets
              </Link>
            </div>
          ) : (
            paiements.map((paiement) => (
              <div key={paiement.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getStatutIcon(paiement.statut)}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {paiement.projet_titre}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {paiement.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Type: {paiement.type}</span>
                      <span>Échéance: {formatDate(paiement.date_echeance)}</span>
                      {paiement.date_paiement && (
                        <span>Payé le: {formatDate(paiement.date_paiement)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {formatMontant(paiement.montant)}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(paiement.statut)}`}>
                      {paiement.statut.replace('_', ' ')}
                    </span>
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
