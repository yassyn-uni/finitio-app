import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AjouterDevis() {
  const { id } = useParams(); // projet_id
  const navigate = useNavigate();
  const [devis, setDevis] = useState({
    montant: '',
    description: '',
    fichier_url: '',
    fournisseur_id: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setDevis({ ...devis, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('devis')
        .insert([{ 
          montant: parseFloat(devis.montant),
          description: devis.description,
          fichier_url: devis.fichier_url || null,
          fournisseur_id: devis.fournisseur_id || null,
          projet_id: id 
        }]);

      if (error) {
        console.error('Erreur ajout devis:', error);
        alert('❌ Erreur lors de l\'ajout du devis: ' + error.message);
      } else {
        alert('✅ Devis ajouté avec succès !');
        navigate(`/projets/${id}`);
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
          onClick={() => navigate(`/projets/${id}`)}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Retour au projet
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">💰 Ajouter un devis</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Montant (€) *
          </label>
          <input 
            name="montant" 
            type="number" 
            step="0.01"
            placeholder="Ex: 15000.50" 
            value={devis.montant} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea 
            name="description" 
            placeholder="Description détaillée du devis..." 
            value={devis.description} 
            onChange={handleChange} 
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lien vers le fichier (optionnel)
          </label>
          <input 
            name="fichier_url" 
            type="url"
            placeholder="https://example.com/devis.pdf" 
            value={devis.fichier_url} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Fournisseur (optionnel)
          </label>
          <input 
            name="fournisseur_id" 
            placeholder="Ex: FOURNISSEUR_001" 
            value={devis.fournisseur_id} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button 
            type="submit" 
            disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {isLoading ? '⏳ Ajout...' : '💰 Ajouter le devis'}
          </button>
          
          <button 
            type="button"
            onClick={() => navigate(`/projets/${id}`)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
