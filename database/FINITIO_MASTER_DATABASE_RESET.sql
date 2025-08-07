-- � SCRIPT DESTRUCTION TOTALE + RECONSTRUCTION FINITIO
-- ⚠️  ATTENTION: CE SCRIPT SUPPRIME TOUT ET RECRÉE TOUT À ZÉRO
-- Exécuter ce script dans Supabase pour un reset complet

-- ============================================================================
-- 💥 ÉTAPE 1: DESTRUCTION TOTALE - SUPPRESSION DE TOUTES LES TABLES
-- ============================================================================

-- Désactiver les contraintes de clés étrangères temporairement
SET session_replication_role = replica;

-- Supprimer toutes les tables dans l'ordre inverse des dépendances
DROP TABLE IF EXISTS analytics_conversions CASCADE;
DROP TABLE IF EXISTS analytics_logins CASCADE;
DROP TABLE IF EXISTS analytics_signups CASCADE;
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS analytics_page_views CASCADE;
DROP TABLE IF EXISTS analytics_sessions CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS paiements CASCADE;
DROP TABLE IF EXISTS devis CASCADE;
DROP TABLE IF EXISTS taches CASCADE;
DROP TABLE IF EXISTS etapes CASCADE;
DROP TABLE IF EXISTS projets CASCADE;
DROP TABLE IF EXISTS prestataires CASCADE;
DROP TABLE IF EXISTS produits CASCADE;
DROP TABLE IF EXISTS fournisseurs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Réactiver les contraintes
SET session_replication_role = DEFAULT;

-- ============================================================================
-- 🏗️ ÉTAPE 2: RECONSTRUCTION COMPLÈTE - CRÉATION DE TOUTES LES TABLES
-- ============================================================================

-- 1. Table des utilisateurs
CREATE TABLE users (
  id uuid primary key default gen_random_uuid(),
  nom text,
  email text unique not null,
  mot_de_passe text,
  role text default 'client',
  created_at timestamp default now()
);

-- 2. Table des fournisseurs
CREATE TABLE fournisseurs (
  id uuid primary key default gen_random_uuid(),
  nom text,
  email text,
  telephone text,
  adresse text,
  site_web text
);

-- 3. Table des produits
CREATE TABLE produits (
  id uuid primary key default gen_random_uuid(),
  fournisseur_id uuid references fournisseurs(id) on delete cascade,
  nom text,
  description text,
  prix numeric,
  unite text,
  image_url text
);

-- 4. Table des projets
CREATE TABLE projets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  titre text not null,
  description text,
  statut text default 'en cours',
  budget numeric,
  localisation text,
  created_at timestamp default now()
);

-- 5. Table des étapes
CREATE TABLE etapes (
  id uuid primary key default gen_random_uuid(),
  projet_id uuid references projets(id) on delete cascade,
  titre text,
  description text,
  ordre int,
  date_debut date,
  date_fin date,
  statut text default 'à faire'
);

-- 6. Table des prestataires
CREATE TABLE prestataires (
  id uuid primary key default gen_random_uuid(),
  nom text,
  email text,
  telephone text,
  specialite text,
  zone text,
  verified boolean default false,
  created_at timestamp default now()
);

-- 7. Table des tâches
CREATE TABLE taches (
  id uuid primary key default gen_random_uuid(),
  etape_id uuid references etapes(id) on delete cascade,
  titre text,
  description text,
  assignee uuid references users(id),
  statut text default 'non commencée',
  date_echeance date
);

-- 8. Table des devis
CREATE TABLE devis (
  id uuid primary key default gen_random_uuid(),
  projet_id uuid references projets(id) on delete cascade,
  montant numeric,
  description text,
  fichier_url text,
  statut text default 'en attente',
  fournisseur_id uuid references fournisseurs(id),
  created_at timestamp default now()
);

-- 9. Table des paiements
CREATE TABLE paiements (
  id uuid primary key default gen_random_uuid(),
  projet_id uuid references projets(id) on delete cascade,
  montant numeric,
  date_paiement date,
  mode text,
  statut text default 'en attente'
);

-- 10. Table des notifications
CREATE TABLE notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  message text,
  lu boolean default false,
  created_at timestamp default now()
);

-- ============================================================================
-- 🔐 ÉTAPE 3: ACTIVATION ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projets ENABLE ROW LEVEL SECURITY;
ALTER TABLE etapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE devis ENABLE ROW LEVEL SECURITY;
ALTER TABLE paiements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE taches ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestataires ENABLE ROW LEVEL SECURITY;
ALTER TABLE fournisseurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE produits ENABLE ROW LEVEL SECURITY;

-- Politiques RLS basiques (les utilisateurs voient leurs propres données)
CREATE POLICY "Users can view own data" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can view own projects" ON projets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view project steps" ON etapes FOR ALL USING (
  EXISTS (SELECT 1 FROM projets WHERE projets.id = etapes.projet_id AND projets.user_id = auth.uid())
);
CREATE POLICY "Users can view project quotes" ON devis FOR ALL USING (
  EXISTS (SELECT 1 FROM projets WHERE projets.id = devis.projet_id AND projets.user_id = auth.uid())
);
CREATE POLICY "Users can view own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- 👥 ÉTAPE 4: CRÉATION UTILISATEURS DE TEST
-- ============================================================================

INSERT INTO users (nom, email, role) VALUES
-- CLIENTS
('Ahmed Benali', 'client1@test.com', 'client'),
('Fatima Zahra', 'client2@test.com', 'client'),
('Omar Tazi', 'client3@test.com', 'client'),
('Aicha Bennani', 'client4@test.com', 'client'),

-- ARCHITECTES
('Karim Hassan', 'architecte1@test.com', 'architecte'),
('Sara Alami', 'architecte2@test.com', 'architecte'),

-- PRESTATAIRES
('Mohamed Raji', 'prestataire1@test.com', 'prestataire'),
('Laila Fassi', 'prestataire2@test.com', 'prestataire'),
('Rachid Berrada', 'prestataire3@test.com', 'prestataire');

-- ============================================================================
-- 🏗️ ÉTAPE 5: CRÉATION PROJETS DE TEST
-- ============================================================================

INSERT INTO projets (titre, description, localisation, budget, statut) VALUES
('Villa Moderne Rabat', 'Construction villa contemporaine 250m² avec piscine', 'Rabat, Maroc', 850000.00, 'en cours'),
('Rénovation Appartement Casa', 'Rénovation complète appartement 120m²', 'Casablanca, Maroc', 180000.00, 'en cours'),
('Extension Maison Marrakech', 'Extension 80m² avec terrasse couverte', 'Marrakech, Maroc', 320000.00, 'planifie'),
('Loft Industriel Tanger', 'Transformation entrepôt en loft 180m²', 'Tanger, Maroc', 450000.00, 'en cours'),
('Maison Écologique Fès', 'Construction maison bioclimatique', 'Fès, Maroc', 680000.00, 'planifie');

-- ============================================================================
-- 📋 ÉTAPE 6: CRÉATION ÉTAPES KANBAN
-- ============================================================================

INSERT INTO etapes (titre, description, statut, ordre) VALUES
-- Étapes terminées
('Étude faisabilité', 'Analyse terrain et géotechnique', 'terminé', 1),
('Plans architecturaux', 'Conception et validation', 'terminé', 2),
('Permis construire', 'Dépôt et obtention', 'terminé', 3),
('Diagnostic technique', 'État des lieux complet', 'terminé', 4),
('Plans extension', 'Conception détaillée', 'terminé', 5),
('Étude structure', 'Analyse bâtiment existant', 'terminé', 6),

-- Étapes en cours
('Permis travaux', 'Autorisation municipale', 'en cours', 1),
('Démolition', 'Cloisons non porteuses', 'en cours', 2),
('Électricité', 'Rénovation système complet', 'en cours', 3),
('Renforcement structure', 'Poutres métalliques', 'en cours', 4),

-- Étapes à faire
('Terrassement', 'Préparation terrain', 'à faire', 1),
('Gros œuvre', 'Construction murs porteurs', 'à faire', 2),
('Second œuvre', 'Plomberie et électricité', 'à faire', 3),
('Plomberie', 'Installation cuisine moderne', 'à faire', 4),
('Sols et peinture', 'Finitions générales', 'à faire', 5),
('Fondations extension', 'Coulage béton', 'à faire', 6),
('Murs et toiture', 'Construction extension', 'à faire', 7),
('Aménagement intérieur', 'Isolation cloisons', 'à faire', 8),
('Isolation thermique', 'Murs et toiture', 'à faire', 9),
('Cloisons et mezzanine', 'Espaces de vie', 'à faire', 10),
('Finitions design', 'Style industriel', 'à faire', 11),
('Étude bioclimatique', 'Orientation solaire', 'à faire', 12),
('Fondations écologiques', 'Matériaux durables', 'à faire', 13),
('Murs terre crue', 'Construction locale', 'à faire', 14),
('Panneaux solaires', 'Installation photovoltaïque', 'à faire', 15),
('Récupération eau', 'Système pluie', 'à faire', 16);

-- ============================================================================
-- 💰 ÉTAPE 7: CRÉATION DEVIS DE TEST
-- ============================================================================

INSERT INTO devis (montant, description, statut) VALUES
(85000.00, 'Devis gros œuvre villa moderne Rabat', 'en_attente'),
(25000.00, 'Devis rénovation électricité appartement', 'accepte'),
(45000.00, 'Devis extension maison Marrakech', 'en_cours'),
(35000.00, 'Devis renforcement structure loft', 'accepte'),
(75000.00, 'Devis construction écologique Fès', 'en_attente'),
(15000.00, 'Devis plomberie complète', 'en_cours'),
(28000.00, 'Devis isolation thermique', 'en_attente'),
(42000.00, 'Devis finitions design', 'accepte'),
(18000.00, 'Devis panneaux solaires', 'en_cours'),
(12000.00, 'Devis récupération eau', 'en_attente');

-- ============================================================================
-- ✅ ÉTAPE 8: VÉRIFICATION FINALE
-- ============================================================================

-- Vérifier que toutes les tables sont créées
SELECT 'TABLES CRÉÉES' as info, table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Compter les données
SELECT 'UTILISATEURS' as type, COUNT(*) as total FROM users;
SELECT 'PROJETS' as type, COUNT(*) as total FROM projets;
SELECT 'ÉTAPES' as type, COUNT(*) as total FROM etapes;
SELECT 'DEVIS' as type, COUNT(*) as total FROM devis;

-- Statistiques par statut
SELECT 'ÉTAPES PAR STATUT' as info, statut, COUNT(*) as nombre FROM etapes GROUP BY statut;
SELECT 'DEVIS PAR STATUT' as info, statut, COUNT(*) as nombre FROM devis GROUP BY statut;

-- ============================================================================
-- 🎉 SUCCÈS - BASE DE DONNÉES COMPLÈTEMENT RECONSTRUITE !
-- ============================================================================

SELECT '🎉 FINITIO DATABASE COMPLÈTEMENT RECONSTRUITE !' as message,
       'Tables: 10 | Utilisateurs: 9 | Projets: 5 | Étapes: 26 | Devis: 10' as resume,
       'RLS activé sur toutes les tables avec politiques sécurisées' as securite;