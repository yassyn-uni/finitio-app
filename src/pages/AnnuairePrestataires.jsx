import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AnnuairePrestataires() {
  const [prestataires, setPrestataires] = useState([]);
  const [filteredPrestataires, setFilteredPrestataires] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('tous');

  useEffect(() => {
    const fetchPrestataires = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .in('role', ['prestataire', 'architecte'])
          .order('nom', { ascending: true });

        if (error) {
          console.error('Erreur récupération prestataires:', error);
        } else {
          setPrestataires(data || []);
          setFilteredPrestataires(data || []);
        }
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrestataires();
  }, []);

  useEffect(() => {
    let filtered = prestataires;

    // Filtrer par rôle
    if (selectedRole !== 'tous') {
      filtered = filtered.filter(p => p.role === selectedRole);
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.specialite?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ville?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPrestataires(filtered);
  }, [prestataires, searchTerm, selectedRole]);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'prestataire':
        return '🔨';
      case 'architecte':
        return '📐';
      default:
        return '👤';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'prestataire':
        return 'bg-orange-100 text-orange-800';
      case 'architecte':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'annuaire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Link 
          to="/dashboard"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Retour au dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📋 Annuaire des Prestataires
          </h1>
          <p className="text-gray-600">
            Trouvez les meilleurs prestataires et architectes pour vos projets
          </p>
        </div>

        {/* Filtres et recherche */}
        <div className="mb-6 space-y-4 md:space-y-0 md:flex md:gap-4 md:items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Rechercher par nom, email, spécialité, ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="md:w-48">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="tous">👥 Tous les rôles</option>
              <option value="prestataire">🔨 Prestataires</option>
              <option value="architecte">📐 Architectes</option>
            </select>
          </div>
        </div>

        {/* Statistiques */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{filteredPrestataires.length}</div>
            <div className="text-blue-700 text-sm">Résultats trouvés</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">
              {prestataires.filter(p => p.role === 'prestataire').length}
            </div>
            <div className="text-orange-700 text-sm">Prestataires</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {prestataires.filter(p => p.role === 'architecte').length}
            </div>
            <div className="text-green-700 text-sm">Architectes</div>
          </div>
        </div>

        {/* Liste des prestataires */}
        {filteredPrestataires.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Aucun prestataire trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrestataires.map((prestataire) => (
              <div 
                key={prestataire.id} 
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {prestataire.nom?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {prestataire.nom || 'Nom non renseigné'}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(prestataire.role)}`}>
                        {getRoleIcon(prestataire.role)} {prestataire.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>📧</span>
                    <span className="truncate">{prestataire.email}</span>
                  </div>
                  
                  {prestataire.telephone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>📱</span>
                      <span>{prestataire.telephone}</span>
                    </div>
                  )}
                  
                  {prestataire.ville && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>📍</span>
                      <span>{prestataire.ville}</span>
                    </div>
                  )}
                  
                  {prestataire.specialite && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>⚡</span>
                      <span className="font-medium">{prestataire.specialite}</span>
                    </div>
                  )}
                  
                  {prestataire.experience && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>🏆</span>
                      <span>{prestataire.experience} ans d'expérience</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${prestataire.email}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-center text-sm"
                    >
                      ✉️ Contacter
                    </a>
                    {prestataire.telephone && (
                      <a
                        href={`tel:${prestataire.telephone}`}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-center text-sm"
                      >
                        📞 Appeler
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Informations supplémentaires */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">💡 Comment utiliser l'annuaire ?</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Utilisez la barre de recherche pour trouver des prestataires par nom, spécialité ou ville</li>
            <li>• Filtrez par type : prestataires (artisans, entrepreneurs) ou architectes</li>
            <li>• Contactez directement par email ou téléphone</li>
            <li>• Consultez leurs spécialités et expérience avant de choisir</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
