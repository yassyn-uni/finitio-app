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
  
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // 🔐 Récupérer l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (data?.user) {
          setUserId(data.user.id);
        } else {
          setErreur("Vous devez être connecté pour créer un projet.");
          console.error(error);
        }
      } catch (error) {
        console.error('Erreur récupération utilisateur:', error);
        setErreur("Erreur de connexion. Veuillez vous reconnecter.");
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setProjet({ ...projet, [e.target.name]: e.target.value });
    // Effacer l'erreur quand l'utilisateur tape
    if (erreur) setErreur('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setLoading(true);

    const { titre, localisation, budget, description } = projet;

    // Validation des champs
    if (!titre.trim() || !localisation.trim() || !budget.trim() || !description.trim()) {
      setErreur("Tous les champs sont obligatoires.");
      setLoading(false);
      return;
    }

    if (!userId) {
      setErreur("Vous devez être connecté pour créer un projet.");
      setLoading(false);
      return;
    }

    try {
      // Tentative d'insertion dans Supabase
      const { data, error } = await supabase
        .from('projets')
        .insert([{
          user_id: userId,
          titre,
          localisation,
          budget: parseFloat(budget),
          description,
          statut: 'en_cours',
          date_creation: new Date().toISOString(),
        }]);

      if (error) {
        console.error('Erreur Supabase:', error);
        
        // Fallback : stockage local temporaire
        const projetsLocaux = JSON.parse(localStorage.getItem('projets_locaux') || '[]');
        const nouveauProjet = {
          id: Date.now().toString(),
          user_id: userId,
          titre,
          localisation,
          budget: parseFloat(budget),
          description,
          statut: 'en_cours',
          date_creation: new Date().toISOString(),
          local: true // Marqueur pour indiquer que c'est stocké localement
        };
        
        projetsLocaux.push(nouveauProjet);
        localStorage.setItem('projets_locaux', JSON.stringify(projetsLocaux));
        
        alert('✅ Projet créé avec succès ! (Stocké temporairement en local)');
        navigate('/projets');
      } else {
        alert('✅ Projet créé avec succès !');
        navigate('/projets');
      }
    } catch (error) {
      console.error('Erreur création projet:', error);
      setErreur(`Erreur lors de la création du projet: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#03045E] mb-2">🏗️ Créer un nouveau projet</h2>
        <p className="text-gray-600">Remplissez les informations de votre projet de construction</p>
      </div>
      
      {erreur && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            <p className="text-red-700">{erreur}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-lg rounded-2xl p-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre du projet *
          </label>
          <input
            name="titre"
            placeholder="Ex: Rénovation appartement, Construction villa..."
            value={projet.titre}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Localisation *
          </label>
          <input
            name="localisation"
            placeholder="Ex: Casablanca, Rabat, Marrakech..."
            value={projet.localisation}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget estimé (MAD) *
          </label>
          <input
            name="budget"
            type="number"
            placeholder="Ex: 50000"
            value={projet.budget}
            onChange={handleChange}
            required
            min="0"
            step="1000"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description du projet *
          </label>
          <textarea
            name="description"
            placeholder="Décrivez votre projet en détail..."
            value={projet.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/projets')}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 px-6 py-3 rounded-lg text-white font-medium transition-colors ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Création...
              </div>
            ) : (
              '✅ Créer le projet'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
