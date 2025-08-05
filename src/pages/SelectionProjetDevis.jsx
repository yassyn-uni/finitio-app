import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function SelectionProjetDevis() {
  const [projets, setProjets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjets = async () => {
      try {
        const { data, error } = await supabase
          .from('projets')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erreur récupération projets:', error);
        } else {
          setProjets(data || []);
        }
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjets();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des projets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link 
          to="/dashboard-prestataire"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Retour au dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          💰 Soumettre un devis
        </h1>
        <p className="text-gray-600 mb-6">
          Sélectionnez un projet pour lequel vous souhaitez soumettre un devis
        </p>

        {projets.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Aucun projet disponible
            </h3>
            <p className="text-gray-600">
              Il n'y a actuellement aucun projet pour lequel soumettre un devis.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {projets.map((projet) => (
              <div 
                key={projet.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {projet.titre}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {projet.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        📍 {projet.localisation}
                      </span>
                      <span className="flex items-center gap-1">
                        💰 {projet.budget?.toLocaleString()} MAD
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Link
                      to={`/projets/${projet.id}/ajouter-devis`}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-block"
                    >
                      💰 Soumettre devis
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">💡 Comment ça marche ?</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Parcourez les projets disponibles</li>
            <li>• Cliquez sur "Soumettre devis" pour le projet qui vous intéresse</li>
            <li>• Remplissez les détails de votre devis (montant, description, etc.)</li>
            <li>• Votre devis sera envoyé au client/architecte pour validation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
