import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function CatalogueProduits() {
  const [produits, setProduits] = useState([]);
  const [filtres, setFiltres] = useState({
    categorie: 'tous',
    disponibilite: 'tous',
    recherche: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [nouveauProduit, setNouveauProduit] = useState({
    nom: '',
    categorie: '',
    prix: '',
    stock: '',
    description: '',
    image: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    en_stock: 0,
    rupture: 0,
    categories: 0
  });

  useEffect(() => {
    chargerProduits();
  }, []);

  const chargerProduits = () => {
    // Données simulées pour le catalogue
    const produitsSimules = [
      {
        id: 1,
        nom: 'Carrelage Porcelaine Premium',
        categorie: 'Carrelage',
        prix: 45.90,
        stock: 250,
        description: 'Carrelage porcelaine haute qualité 60x60cm, finition mate',
        image: '🏺',
        statut: 'en_stock',
        ventes_mois: 45,
        note: 4.8
      },
      {
        id: 2,
        nom: 'Lavabo Design Moderne',
        categorie: 'Sanitaire',
        prix: 189.00,
        stock: 12,
        description: 'Lavabo suspendu en céramique blanche, design contemporain',
        image: '🚿',
        statut: 'stock_bas',
        ventes_mois: 8,
        note: 4.6
      },
      {
        id: 3,
        nom: 'Profilé Aluminium 40x40',
        categorie: 'Aluminium',
        prix: 12.50,
        stock: 0,
        description: 'Profilé aluminium anodisé, longueur 6m',
        image: '⚡',
        statut: 'rupture',
        ventes_mois: 0,
        note: 4.5
      },
      {
        id: 4,
        nom: 'Verre Trempé Sécurit',
        categorie: 'Verre',
        prix: 85.00,
        stock: 35,
        description: 'Verre trempé 8mm, dimensions sur mesure',
        image: '🪟',
        statut: 'en_stock',
        ventes_mois: 15,
        note: 4.9
      },
      {
        id: 5,
        nom: 'Parquet Chêne Massif',
        categorie: 'Revêtements',
        prix: 65.00,
        stock: 180,
        description: 'Parquet chêne massif huilé, lames 140x20mm',
        image: '🪵',
        statut: 'en_stock',
        ventes_mois: 32,
        note: 4.7
      },
      {
        id: 6,
        nom: 'Robinetterie Thermostatique',
        categorie: 'Sanitaire',
        prix: 245.00,
        stock: 8,
        description: 'Mitigeur thermostatique douche, finition chromée',
        image: '🔧',
        statut: 'stock_bas',
        ventes_mois: 6,
        note: 4.4
      }
    ];

    setProduits(produitsSimules);
    
    // Calculer les statistiques
    setStats({
      total: produitsSimules.length,
      en_stock: produitsSimules.filter(p => p.statut === 'en_stock').length,
      rupture: produitsSimules.filter(p => p.statut === 'rupture').length,
      categories: [...new Set(produitsSimules.map(p => p.categorie))].length
    });
  };

  const produitsFiltres = produits.filter(produit => {
    const matchCategorie = filtres.categorie === 'tous' || produit.categorie === filtres.categorie;
    const matchDisponibilite = filtres.disponibilite === 'tous' || produit.statut === filtres.disponibilite;
    const matchRecherche = produit.nom.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
                          produit.description.toLowerCase().includes(filtres.recherche.toLowerCase());
    
    return matchCategorie && matchDisponibilite && matchRecherche;
  });

  const handleAjouterProduit = () => {
    const nouveauId = Math.max(...produits.map(p => p.id)) + 1;
    const produit = {
      ...nouveauProduit,
      id: nouveauId,
      prix: parseFloat(nouveauProduit.prix),
      stock: parseInt(nouveauProduit.stock),
      statut: parseInt(nouveauProduit.stock) > 10 ? 'en_stock' : 
              parseInt(nouveauProduit.stock) > 0 ? 'stock_bas' : 'rupture',
      ventes_mois: 0,
      note: 0,
      image: '📦'
    };
    
    setProduits([...produits, produit]);
    setShowModal(false);
    setNouveauProduit({
      nom: '',
      categorie: '',
      prix: '',
      stock: '',
      description: '',
      image: ''
    });
  };

  const getStatutColor = (statut) => {
    switch(statut) {
      case 'en_stock': return 'green';
      case 'stock_bas': return 'orange';
      case 'rupture': return 'red';
      default: return 'gray';
    }
  };

  const getStatutTexte = (statut) => {
    switch(statut) {
      case 'en_stock': return 'En stock';
      case 'stock_bas': return 'Stock bas';
      case 'rupture': return 'Rupture';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-6">
      {/* En-tête */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              📦 Catalogue Produits
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez votre catalogue de matériaux et équipements
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
          >
            ➕ Ajouter un produit
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { icon: '📦', label: 'Total Produits', value: stats.total, color: 'purple' },
          { icon: '✅', label: 'En Stock', value: stats.en_stock, color: 'green' },
          { icon: '⚠️', label: 'Ruptures', value: stats.rupture, color: 'red' },
          { icon: '🏷️', label: 'Catégories', value: stats.categories, color: 'blue' }
        ].map((stat, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            <select
              value={filtres.categorie}
              onChange={(e) => setFiltres({...filtres, categorie: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="tous">Toutes les catégories</option>
              <option value="Carrelage">Carrelage</option>
              <option value="Sanitaire">Sanitaire</option>
              <option value="Aluminium">Aluminium</option>
              <option value="Verre">Verre</option>
              <option value="Revêtements">Revêtements</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilité</label>
            <select
              value={filtres.disponibilite}
              onChange={(e) => setFiltres({...filtres, disponibilite: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="tous">Tous les statuts</option>
              <option value="en_stock">En stock</option>
              <option value="stock_bas">Stock bas</option>
              <option value="rupture">Rupture</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={filtres.recherche}
              onChange={(e) => setFiltres({...filtres, recherche: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {produitsFiltres.map((produit) => (
          <div key={produit.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <span className="text-3xl mr-3">{produit.image}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{produit.nom}</h3>
                  <p className="text-sm text-gray-500">{produit.categorie}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full bg-${getStatutColor(produit.statut)}-100 text-${getStatutColor(produit.statut)}-600`}>
                {getStatutTexte(produit.statut)}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{produit.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Prix unitaire:</span>
                <span className="font-semibold text-purple-600">{produit.prix}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Stock:</span>
                <span className={`font-semibold text-${getStatutColor(produit.statut)}-600`}>
                  {produit.stock} unités
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Ventes ce mois:</span>
                <span className="font-semibold text-blue-600">{produit.ventes_mois}</span>
              </div>
              {produit.note > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Note:</span>
                  <span className="font-semibold text-yellow-600">
                    ⭐ {produit.note}/5
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-purple-100 text-purple-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors">
                ✏️ Modifier
              </button>
              <button className="flex-1 bg-blue-100 text-blue-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                📊 Stats
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Ajouter Produit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Ajouter un nouveau produit</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du produit</label>
                <input
                  type="text"
                  value={nouveauProduit.nom}
                  onChange={(e) => setNouveauProduit({...nouveauProduit, nom: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  value={nouveauProduit.categorie}
                  onChange={(e) => setNouveauProduit({...nouveauProduit, categorie: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="Carrelage">Carrelage</option>
                  <option value="Sanitaire">Sanitaire</option>
                  <option value="Aluminium">Aluminium</option>
                  <option value="Verre">Verre</option>
                  <option value="Revêtements">Revêtements</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={nouveauProduit.prix}
                    onChange={(e) => setNouveauProduit({...nouveauProduit, prix: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input
                    type="number"
                    value={nouveauProduit.stock}
                    onChange={(e) => setNouveauProduit({...nouveauProduit, stock: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={nouveauProduit.description}
                  onChange={(e) => setNouveauProduit({...nouveauProduit, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-100 text-gray-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAjouterProduit}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
