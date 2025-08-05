import { useState, useEffect } from 'react';
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
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Récupérer le profil utilisateur complet
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
          setCurrentUser(userData || user);
        } else {
          setError("Vous devez être connecté pour ajouter un devis.");
        }
      } catch (error) {
        console.error('Erreur récupération utilisateur:', error);
        setError("Erreur de connexion. Veuillez vous reconnecter.");
      }
    };
    getCurrentUser();
  }, []);

  const handleChange = (e) => {
    setDevis({ ...devis, [e.target.name]: e.target.value });
    if (error) setError(''); // Effacer l'erreur lors de la saisie
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!devis.montant || !devis.description) {
      setError("Le montant et la description sont obligatoires.");
      setIsLoading(false);
      return;
    }

    if (!currentUser) {
      setError("Vous devez être connecté pour ajouter un devis.");
      setIsLoading(false);
      return;
    }

    try {
      // Tentative d'insertion dans Supabase avec l'ID utilisateur
      const devisData = {
        montant: parseFloat(devis.montant),
        description: devis.description,
        fichier_url: devis.fichier_url || null,
        fournisseur_id: devis.fournisseur_id || currentUser.id, // Utiliser l'ID utilisateur si pas de fournisseur
        projet_id: id,
        user_id: currentUser.id, // Ajouter l'ID utilisateur pour RLS
        statut: 'en_attente',
        date_creation: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('devis')
        .insert([devisData]);

      if (error) {
        console.error('Erreur Supabase:', error);
        
        // Fallback : stockage local
        const devisLocaux = JSON.parse(localStorage.getItem('devis_locaux') || '[]');
        const nouveauDevis = {
          id: Date.now().toString(),
          ...devisData,
          local: true // Marqueur pour indiquer stockage local
        };
        
        devisLocaux.push(nouveauDevis);
        localStorage.setItem('devis_locaux', JSON.stringify(devisLocaux));
        
        alert('✅ Devis ajouté avec succès ! (Stocké temporairement en local)');
        navigate(`/projets/${id}`);
      } else {
        alert('✅ Devis ajouté avec succès !');
        navigate(`/projets/${id}`);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError(`Erreur lors de l'ajout du devis: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Si pas d'utilisateur connecté
  if (!currentUser && !error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#03045E] mb-2">💰 Ajouter un Devis</h2>
        <p className="text-gray-600">Ajoutez un devis pour ce projet</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            <p className="text-red-700">{error}</p>
          </div>
          {!currentUser && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => navigate('/connexion')}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              >
                Se connecter
              </button>
              <button
                onClick={() => navigate('/inscription')}
                className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
              >
                S'inscrire
              </button>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-lg rounded-2xl p-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Montant du devis (MAD) *
          </label>
          <input
            type="number"
            name="montant"
            placeholder="Ex: 50000"
            value={devis.montant}
            onChange={handleChange}
            required
            min="0"
            step="100"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description du devis *
          </label>
          <textarea
            name="description"
            placeholder="Décrivez les travaux inclus dans ce devis..."
            value={devis.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL du fichier (optionnel)
          </label>
          <input
            type="url"
            name="fichier_url"
            placeholder="https://exemple.com/devis.pdf"
            value={devis.fichier_url}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Fournisseur (optionnel)
          </label>
          <input
            type="text"
            name="fournisseur_id"
            placeholder="Ex: FOURNISSEUR_001"
            value={devis.fournisseur_id}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <p className="text-sm text-gray-500 mt-1">
            Si vide, votre ID utilisateur sera utilisé par défaut
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(`/projets/${id}`)}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading || !currentUser}
            className={`flex-1 px-6 py-3 rounded-lg text-white font-medium transition-colors ${
              isLoading || !currentUser
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Ajout en cours...
              </div>
            ) : (
              '💰 Ajouter le Devis'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
