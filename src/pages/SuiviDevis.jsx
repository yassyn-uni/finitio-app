import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function SuiviDevis() {
  const [devis, setDevis] = useState([]);
  const [projets, setProjets] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDevis = async () => {
      try {
        // Récupérer tous les devis
        const { data: devisData, error: devisError } = await supabase
          .from('devis')
          .select('*')
          .order('created_at', { ascending: false });

        if (devisError) {
          console.error('Erreur récupération devis:', devisError);
          return;
        }

        setDevis(devisData || []);

        // Récupérer les projets associés
        if (devisData && devisData.length > 0) {
          // ✅ Filtrer les IDs null/undefined avant de faire la requête
          const projetIds = [...new Set(
            devisData
              .map(d => d.projet_id)
              .filter(id => id && id !== null && id !== undefined)
          )];
          
          console.log('🔍 IDs projets à récupérer:', projetIds);
          
          if (projetIds.length > 0) {
            const { data: projetsData, error: projetsError } = await supabase
              .from('projets')
              .select('*')
              .in('id', projetIds);

            if (projetsError) {
              console.error('Erreur récupération projets:', projetsError);
            } else {
              // Créer un objet pour accès rapide aux projets
              const projetsMap = {};
              projetsData?.forEach(p => {
                projetsMap[p.id] = p;
              });
              setProjets(projetsMap);
            }
          } else {
            console.warn('⚠️ Aucun projet_id valide trouvé dans les devis');
          }
        }
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevis();
  }, []);

  const getStatutColor = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'accepté':
      case 'validé':
        return 'bg-green-100 text-green-800';
      case 'refusé':
      case 'rejeté':
        return 'bg-red-100 text-red-800';
      case 'en attente':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de vos devis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Link 
          to="/dashboard-prestataire"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Retour au dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              🧾 Suivi de mes devis
            </h1>
            <p className="text-gray-600">
              Suivez l'état de tous vos devis soumis
            </p>
          </div>
          <Link
            to="/devis/nouveau"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            ➕ Nouveau devis
          </Link>
        </div>

        {devis.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Aucun devis soumis
            </h3>
            <p className="text-gray-600 mb-4">
              Vous n'avez pas encore soumis de devis.
            </p>
            <Link
              to="/devis/nouveau"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
            >
              Soumettre mon premier devis
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {devis.map((devisItem) => {
              const projet = projets[devisItem.projet_id];
              return (
                <div 
                  key={devisItem.id} 
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {projet?.titre || 'Projet inconnu'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(devisItem.statut)}`}>
                          {devisItem.statut || 'En attente'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">
                        {devisItem.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          💰 <strong>{devisItem.montant?.toLocaleString()} MAD</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          📍 {projet?.localisation || 'Non spécifié'}
                        </span>
                        <span className="flex items-center gap-1">
                          📅 {new Date(devisItem.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col gap-2">
                      {projet && (
                        <Link
                          to={`/projets/${projet.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center"
                        >
                          👁️ Voir projet
                        </Link>
                      )}
                      {devisItem.fichier_url && (
                        <a
                          href={devisItem.fichier_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center"
                        >
                          📄 Fichier
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">📊 Statistiques</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{devis.length}</div>
              <div className="text-blue-700">Total devis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {devis.filter(d => d.statut === 'accepté').length}
              </div>
              <div className="text-green-700">Acceptés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {devis.filter(d => !d.statut || d.statut === 'en attente').length}
              </div>
              <div className="text-yellow-700">En attente</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
