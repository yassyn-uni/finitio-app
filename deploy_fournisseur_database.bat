@echo off
echo ========================================
echo 🏗️ DÉPLOIEMENT BASE DE DONNÉES FOURNISSEUR
echo ========================================

echo.
echo 📋 TABLES À CRÉER:
echo 1. fournisseurs (profils étendus)
echo 2. produits (catalogue)
echo 3. commandes (gestion commandes)
echo 4. lignes_commande (détail commandes)
echo 5. publicites (campagnes publicitaires)

echo.
echo 📦 Ajout des fichiers au git...
git add .

echo.
echo 💬 Commit des changements...
git commit -m "🏗️ CRÉATION TABLES FOURNISSEUR COMPLÈTES

📊 NOUVELLES TABLES CRÉÉES:

1️⃣ TABLE FOURNISSEURS:
- Profils étendus pour fournisseurs
- Lien avec auth.users via user_id
- Informations entreprise (SIRET, adresse, etc.)
- Statistiques (note_moyenne, nb_commandes, ca_total)
- Statuts: actif, suspendu, en_attente

2️⃣ TABLE PRODUITS:
- Catalogue complet des produits
- Catégories: Carrelage, Sanitaire, Aluminium, Verre, Revêtements
- Gestion stock (stock, stock_min)
- Informations détaillées (poids, dimensions, marque)
- Délai livraison et statuts

3️⃣ TABLE COMMANDES:
- Gestion complète des commandes
- Lien fournisseur/client/projet
- Numéro commande unique
- Statuts: en_attente, confirmée, expédiée, livrée, annulée
- Calculs TTC/HT avec TVA
- Suivi livraison (transporteur, numéro_suivi)

4️⃣ TABLE LIGNES_COMMANDE:
- Détail des commandes (produit, quantité, prix)
- Calculs automatiques total_ligne

5️⃣ TABLE PUBLICITES:
- Campagnes publicitaires ciblées
- Types: banniere, spotlight, premium
- Ciblage géographique et par rôles
- Budget et tracking (impressions, clics)
- Statuts: brouillon, active, pausée, terminée

🔒 SÉCURITÉ RLS:
- Politiques Row Level Security sur toutes les tables
- Fournisseurs accèdent uniquement à leurs données
- Clients voient produits actifs et leurs commandes
- Isolation complète des données par fournisseur

⚡ PERFORMANCES:
- Index optimisés pour recherches fréquentes
- Index sur fournisseur_id, categorie, statut
- Index pour commandes et publicités

🔗 COMPATIBILITÉ:
- Compatible avec système users.role = 'fournisseur'
- Référence auth.users pour authentification
- Intégration avec projets existants"

echo.
echo 🌐 Push vers le repository...
git push

echo.
echo ✅ SCRIPT SQL CRÉÉ !
echo.
echo 🎯 PROCHAINES ÉTAPES:
echo 1. Ouvrir Supabase Dashboard
echo 2. Aller dans SQL Editor
echo 3. Copier le contenu de database/create_fournisseur_tables.sql
echo 4. Exécuter le script SQL
echo 5. Vérifier la création des 5 tables
echo.
echo 📋 TABLES À VÉRIFIER DANS SUPABASE:
echo - fournisseurs (profils étendus)
echo - produits (catalogue)
echo - commandes (gestion commandes)  
echo - lignes_commande (détail)
echo - publicites (campagnes)
echo.
echo 🔍 VÉRIFICATIONS POST-DÉPLOIEMENT:
echo - RLS activé sur toutes les tables
echo - Politiques de sécurité créées
echo - Index de performance créés
echo - Contraintes de clés étrangères
echo.
echo 📁 FICHIER SQL: database/create_fournisseur_tables.sql
echo.
pause
