import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useParams } from 'react-router-dom';

export default function EtapesProjet() {
  const { id } = useParams(); // projet_id
  const [etapes, setEtapes] = useState([]);

  useEffect(() => {
    const fetchEtapes = async () => {
      const { data, error } = await supabase
        .from('etapes')
        .select('*')
        .eq('projet_id', id)
        .order('ordre', { ascending: true });
      if (!error) setEtapes(data);
    };
    fetchEtapes();
  }, [id]);

  const handleToggle = async (etape) => {
    const newStatut = etape.statut === 'terminée' ? 'à faire' : 'terminée';
    await supabase.from('etapes').update({ statut: newStatut }).eq('id', etape.id);
    setEtapes(etapes.map(e => e.id === etape.id ? { ...e, statut: newStatut } : e));
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">🗂️ Étapes du projet</h3>
      <ul className="space-y-2">
        {etapes.map(etape => (
          <li
            key={etape.id}
            className={`flex items-center justify-between border p-3 rounded ${etape.statut === 'terminée' ? 'bg-green-50' : 'bg-gray-50'}`}
          >
            <div>
              <strong>{etape.titre}</strong>
              <p className="text-sm text-gray-600">{etape.description}</p>
            </div>
            <button
              onClick={() => handleToggle(etape)}
              className={`text-sm font-medium px-3 py-1 rounded ${
                etape.statut === 'terminée' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-800'
              }`}
            >
              {etape.statut === 'terminée' ? '✔ Terminé' : '⏳ À faire'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
