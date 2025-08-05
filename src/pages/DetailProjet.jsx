import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import EtapesKanban from './EtapesKanban'; // 👉 ou EtapesProjet si tu veux une simple to-do

export default function DetailProjet() {
  const { id } = useParams();
  const [projet, setProjet] = useState(null);
  const [devis, setDevis] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // ✅ Vérifier que l'ID existe avant de faire les requêtes
      if (!id) {
        console.warn('⚠️ ID de projet manquant');
        return;
      }

      try {
        console.log('🔍 Récupération projet avec ID:', id);
        
        const { data: p, error: errorProjet } = await supabase
          .from('projets')
          .select('*')
          .eq('id', id)
          .single();
        
        if (errorProjet) {
          console.error('❌ Erreur récupération projet:', errorProjet);
        } else {
          setProjet(p);
        }

        const { data: d, error: errorDevis } = await supabase
          .from('devis')
          .select('*')
          .eq('projet_id', id);
        
        if (errorDevis) {
          console.error('❌ Erreur récupération devis:', errorDevis);
        } else {
          setDevis(d || []);
        }
      } catch (err) {
        console.error('❌ Erreur inattendue:', err);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {projet ? (
        <>
          <h2 className="text-2xl font-bold text-[#03045E] mb-2">{projet.titre}</h2>
          <p className="text-gray-700 mb-4">{projet.description}</p>
          <p className="text-sm text-gray-500 mb-4">
            📍 Localisation : {projet.localisation} &nbsp; | &nbsp; 💰 Budget : {projet.budget} MAD
          </p>

          {/* Lien ajouter étape */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">📋 Étapes du projet</h3>
            <Link
              to={`/projet/${id}/ajouter-etape`}
              className="text-blue-600 underline hover:text-blue-800"
            >
              ➕ Ajouter une étape
            </Link>
          </div>

          <EtapesKanban />
          {/* ou <EtapesProjet /> si tu veux version simple */}

          {/* Lien ajouter devis */}
          <div className="flex items-center justify-between mt-8 mb-4">
            <h3 className="text-lg font-semibold">📄 Devis associés</h3>
            <Link
              to={`/projet/${id}/ajouter-devis`}
              className="text-green-600 underline hover:text-green-800"
            >
              ➕ Ajouter un devis
            </Link>
          </div>

          <ul>
            {devis.map(d => (
              <li key={d.id} className="border rounded p-3 mb-2 bg-white shadow-sm">
                💸 <strong>{d.montant} MAD</strong> — <span className="text-gray-600">{d.description}</span>
              </li>
            ))}
            {devis.length === 0 && (
              <li className="text-sm text-gray-500 italic">Aucun devis encore enregistré.</li>
            )}
          </ul>
        </>
      ) : (
        <p className="text-center text-gray-500">Chargement du projet...</p>
      )}
    </div>
  );
}
