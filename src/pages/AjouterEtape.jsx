import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AjouterEtape() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [etape, setEtape] = useState({ 
    nom: '', 
    description: '', 
    statut: 'à faire' 
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setEtape({ ...etape, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('etapes')
        .insert([{ 
          nom: etape.nom,
          description: etape.description,
          statut: etape.statut,
          projet_id: id 
        }]);

      if (error) {
        console.error('Erreur ajout étape:', error);
        alert('❌ Erreur lors de l\'ajout de l\'étape: ' + error.message);
      } else {
        alert('✅ Étape ajoutée avec succès !');
        // Redirection vers le Kanban
        navigate(`/projets/${id}/kanban`);
      }
    } catch (err) {
      console.error('Erreur:', err);
      alert('❌ Erreur inattendue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="mb-4">
        <button 
          onClick={() => navigate(`/projets/${id}/kanban`)}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Retour au Kanban
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">➕ Ajouter une étape</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom de l'étape *
          </label>
          <input 
            name="nom" 
            placeholder="Ex: Installation électrique" 
            value={etape.nom} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea 
            name="description" 
            placeholder="Description détaillée de l'étape..." 
            value={etape.description} 
            onChange={handleChange} 
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut initial
          </label>
          <select 
            name="statut" 
            value={etape.statut} 
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="à faire">📋 À faire</option>
            <option value="en cours">⚡ En cours</option>
            <option value="terminée">✅ Terminée</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button 
            type="submit" 
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {isLoading ? '⏳ Ajout...' : '✅ Ajouter l\'étape'}
          </button>
          
          <button 
            type="button"
            onClick={() => navigate(`/projets/${id}/kanban`)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
