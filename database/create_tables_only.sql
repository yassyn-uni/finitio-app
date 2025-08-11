-- 🏗️ CRÉATION TABLES SEULEMENT - SANS RLS
-- Script minimal pour créer les tables sans politiques de sécurité
-- Testons d'abord la création des tables, RLS plus tard

-- ============================================================================
-- 👤 ÉTAPE 1: COMPLÉTER LA TABLE USERS
-- ============================================================================

-- Ajouter les colonnes manquantes à la table users existante
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS nom text,
ADD COLUMN IF NOT EXISTS role text DEFAULT 'client',
ADD COLUMN IF NOT EXISTS telephone text,
ADD COLUMN IF NOT EXISTS ville text,
ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now();

-- ============================================================================
-- 📦 ÉTAPE 2: TABLE FOURNISSEURS (Profils étendus)
-- ============================================================================

CREATE TABLE IF NOT EXISTS fournisseurs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade unique,
  nom_entreprise text,
  ICE numeric,
  adresse text,
  ville text,
  code_postal text,
  telephone text,
  site_web text,
  description text,
  logo_url text,
  statut text default 'actif',
  note_moyenne numeric default 0,
  nb_commandes integer default 0,
  ca_total numeric default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ============================================================================
-- 📦 ÉTAPE 3: TABLE PRODUITS
-- ============================================================================

CREATE TABLE IF NOT EXISTS produits (
  id uuid primary key default gen_random_uuid(),
  fournisseur_id uuid references fournisseurs(id) on delete cascade,
  nom text not null,
  description text,
  categorie text,
  prix numeric not null,
  unite text default 'unité',
  stock integer default 0,
  stock_min integer default 5,
  image_url text,
  statut text default 'actif',
  poids numeric,
  dimensions text,
  marque text,
  reference text,
  delai_livraison integer default 7,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ============================================================================
-- 📦 ÉTAPE 4: TABLE COMMANDES
-- ============================================================================

CREATE TABLE IF NOT EXISTS commandes (
  id uuid primary key default gen_random_uuid(),
  fournisseur_id uuid references fournisseurs(id) on delete cascade,
  client_id uuid references users(id) on delete cascade,
  projet_id uuid,
  numero_commande text unique not null,
  statut text default 'en_attente',
  total_ht numeric not null,
  total_ttc numeric not null,
  tva numeric default 20,
  adresse_livraison text,
  date_livraison_prevue date,
  date_livraison_reelle date,
  transporteur text,
  numero_suivi text,
  notes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ============================================================================
-- 📦 ÉTAPE 5: TABLE LIGNES_COMMANDE
-- ============================================================================

CREATE TABLE IF NOT EXISTS lignes_commande (
  id uuid primary key default gen_random_uuid(),
  commande_id uuid references commandes(id) on delete cascade,
  produit_id uuid references produits(id) on delete cascade,
  quantite integer not null,
  prix_unitaire numeric not null,
  total_ligne numeric not null,
  created_at timestamp default now()
);

-- ============================================================================
-- 📦 ÉTAPE 6: TABLE PUBLICITES
-- ============================================================================

CREATE TABLE IF NOT EXISTS publicites (
  id uuid primary key default gen_random_uuid(),
  fournisseur_id uuid references fournisseurs(id) on delete cascade,
  titre text not null,
  description text,
  image_url text,
  url_destination text,
  type_campagne text default 'banniere',
  budget numeric not null,
  budget_utilise numeric default 0,
  cible_geographique text[],
  cible_roles text[],
  date_debut date not null,
  date_fin date not null,
  statut text default 'brouillon',
  nb_impressions integer default 0,
  nb_clics integer default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ============================================================================
-- 🔗 ÉTAPE 7: INDEX BASIQUES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_fournisseurs_user_id ON fournisseurs(user_id);
CREATE INDEX IF NOT EXISTS idx_produits_fournisseur ON produits(fournisseur_id);
CREATE INDEX IF NOT EXISTS idx_commandes_fournisseur ON commandes(fournisseur_id);

-- ============================================================================
-- ✅ VÉRIFICATION FINALE
-- ============================================================================

-- Vérifier la table users
SELECT 'Table users:' as info, column_name, data_type
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;

-- Compter les tables créées
SELECT 'Tables fournisseur créées:' as info, COUNT(*) as nombre
FROM information_schema.tables 
WHERE table_name IN ('fournisseurs', 'produits', 'commandes', 'lignes_commande', 'publicites')
  AND table_schema = 'public';
