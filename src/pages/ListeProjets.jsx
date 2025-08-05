import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function ListeProjets() {
  const [projets, setProjets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjets = async () => {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('projets')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('created_at', { ascending: false });

      if (!error) setProjets(data);
    };
    fetchProjets();
  }, []);

  const handleDelete = async (id) => {
    await supabase.from('projets').delete().eq('id', id);
    setProjets(projets.filter(p => p.id !== id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Mes Projets</h2>
      <button onClick={() => navigate('/nouveau-projet')} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded">+ Nouveau</button>
      {projets.map(projet => (
        <div key={projet.id} className="border p-4 rounded mb-3">
          <h3 className="font-bold text-lg">{projet.titre}</h3>
          <p>{projet.description}</p>
          <div className="mt-2 flex gap-2">
            <button onClick={() => navigate(`/projet/${projet.id}`)} className="text-blue-600 underline">Voir</button>
            <button onClick={() => handleDelete(projet.id)} className="text-red-500">Supprimer</button>
          </div>
        </div>
      ))}
    </div>
  );
}
