import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function NouveauProjet() {
  const [projet, setProjet] = useState({
    titre: '',
    localisation: '',
    budget: '',
    description: '',
  });
  

  const [erreur, setErreur] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // 🔐 Récupérer l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      } else {
        setErreur("Impossible de récupérer l'utilisateur.");
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setProjet({ ...projet, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');

    const { titre, localisation, budget, description } = projet;

    const { data, error } = await supabase
      .from('projets')
      .insert([{
        user_id: userId,
        titre,
        localisation,
        budget,
        description,
      }]);

    if (error) {
      setErreur("Erreur lors de la création du projet.");
      console.error(error);
    } else {
      navigate('/projets'); // redirection vers la liste des projets
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold text-[#03045E] mb-4">Créer un nouveau projet</h2>
      {erreur && <p className="text-red-600 mb-3">{erreur}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow rounded-2xl p-6">
        <input
          name="titre"
          placeholder="Titre du projet"
          value={projet.titre}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        />
        <input
          name="localisation"
          placeholder="Localisation"
          value={projet.localisation}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        />
        <input
          name="budget"
          placeholder="Budget estimatif"
          type="number"
          value={projet.budget}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={projet.description}
          onChange={handleChange}
          rows={4}
          className="w-full p-3 border rounded"
        />
        <button
          type="submit"
          className="bg-[#03045E] text-white px-6 py-2 rounded hover:bg-[#023e8a]"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
