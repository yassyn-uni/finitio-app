-- 🏗️ CRÉATION TABLES FOURNISSEUR POUR FINITIO - VERSION AUTH
-- Ce script crée les tables spécialisées pour les fournisseurs
-- Utilise directement auth.users (système Supabase natif)

-- ============================================================================
-- 📦 ÉTAPE 1: TABLE FOURNISSEURS (Profils étendus)
-- ============================================================================

-- Table pour les informations étendues des fournisseurs
CREATE TABLE IF NOT EXISTS fournisseurs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  nom_entreprise text,
  ICE numeric,
  adresse text,
  ville text,
  code_postal text,
  telephone text,
  site_web text,
  description text,
  logo_url text,
  statut text default 'actif', -- actif, suspendu, en_attente
  note_moyenne numeric default 0,
  nb_commandes integer default 0,
  ca_total numeric default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ============================================================================
-- 📦 ÉTAPE 2: TABLE PRODUITS (Catalogue fournisseurs)
-- ============================================================================

CREATE TABLE IF NOT EXISTS produits (
  id uuid primary key default gen_random_uuid(),
  fournisseur_id uuid references fournisseurs(id) on delete cascade,
  nom text not null,
  description text,
  categorie text, -- Carrelage, Sanitaire, Aluminium, Verre, Revêtements
  prix numeric not null,
  unite text default 'unité', -- unité, m², m³, kg, etc.
  stock integer default 0,
  stock_min integer default 5,
  image_url text,
  statut text default 'actif', -- actif, rupture, discontinué
  poids numeric,
  dimensions text, -- "60x60x8cm"
  marque text,
  reference text,
  delai_livraison integer default 7, -- jours
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ============================================================================
-- 📦 ÉTAPE 3: TABLE COMMANDES (Gestion des commandes)
-- ============================================================================

CREATE TABLE IF NOT EXISTS commandes (
  id uuid primary key default gen_random_uuid(),
  fournisseur_id uuid references fournisseurs(id) on delete cascade,
  client_id uuid references auth.users(id) on delete cascade,
  projet_id uuid, -- Référence optionnelle aux projets (si table existe)
  numero_commande text unique not null,
  statut text default 'en_attente', -- en_attente, confirmée, expédiée, livrée, annulée
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
-- 📦 ÉTAPE 4: TABLE LIGNES_COMMANDE (Détail des commandes)
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
-- 📦 ÉTAPE 5: TABLE PUBLICITES (Campagnes publicitaires)
-- ============================================================================

CREATE TABLE IF NOT EXISTS publicites (
  id uuid primary key default gen_random_uuid(),
  fournisseur_id uuid references fournisseurs(id) on delete cascade,
  titre text not null,
  description text,
  image_url text,
  url_destination text,
  type_campagne text default 'banniere', -- banniere, spotlight, premium
  budget numeric not null,
  budget_utilise numeric default 0,
  cible_geographique text[], -- ['Casablanca', 'Rabat']
  cible_roles text[], -- ['client', 'architecte', 'prestataire']
  date_debut date not null,
  date_fin date not null,
  statut text default 'brouillon', -- brouillon, active, pausée, terminée
  nb_impressions integer default 0,
  nb_clics integer default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ============================================================================
-- 📊 ÉTAPE 6: POLITIQUES RLS (Row Level Security)
-- ============================================================================

-- Activer RLS sur toutes les tables
ALTER TABLE fournisseurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE produits ENABLE ROW LEVEL SECURITY;
ALTER TABLE commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lignes_commande ENABLE ROW LEVEL SECURITY;
ALTER TABLE publicites ENABLE ROW LEVEL SECURITY;

-- Politique fournisseurs : accès à son propre profil
CREATE POLICY "Fournisseurs peuvent voir leur profil" ON fournisseurs
  FOR ALL USING (auth.uid() = user_id);

-- Politique produits : fournisseur gère ses produits, autres peuvent voir
CREATE POLICY "Fournisseurs gèrent leurs produits" ON produits
  FOR ALL USING (
    fournisseur_id IN (
      SELECT id FROM fournisseurs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Tous peuvent voir les produits actifs" ON produits
  FOR SELECT USING (statut = 'actif');

-- Politique commandes : fournisseur et client voient leurs commandes
CREATE POLICY "Accès aux commandes" ON commandes
  FOR ALL USING (
    fournisseur_id IN (
      SELECT id FROM fournisseurs WHERE user_id = auth.uid()
    ) OR client_id = auth.uid()
  );

-- Politique lignes_commande : via commandes
CREATE POLICY "Accès aux lignes de commande" ON lignes_commande
  FOR ALL USING (
    commande_id IN (
      SELECT id FROM commandes WHERE 
        fournisseur_id IN (
          SELECT id FROM fournisseurs WHERE user_id = auth.uid()
        ) OR client_id = auth.uid()
    )
  );

-- Politique publicités : fournisseur gère ses campagnes
CREATE POLICY "Fournisseurs gèrent leurs publicités" ON publicites
  FOR ALL USING (
    fournisseur_id IN (
      SELECT id FROM fournisseurs WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- 🔗 ÉTAPE 7: INDEX POUR PERFORMANCES
-- ============================================================================

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_fournisseurs_user_id ON fournisseurs(user_id);
CREATE INDEX IF NOT EXISTS idx_produits_fournisseur ON produits(fournisseur_id);
CREATE INDEX IF NOT EXISTS idx_produits_categorie ON produits(categorie);
CREATE INDEX IF NOT EXISTS idx_produits_statut ON produits(statut);
CREATE INDEX IF NOT EXISTS idx_commandes_fournisseur ON commandes(fournisseur_id);
CREATE INDEX IF NOT EXISTS idx_commandes_client ON commandes(client_id);
CREATE INDEX IF NOT EXISTS idx_commandes_statut ON commandes(statut);
CREATE INDEX IF NOT EXISTS idx_publicites_fournisseur ON publicites(fournisseur_id);
CREATE INDEX IF NOT EXISTS idx_publicites_statut ON publicites(statut);

-- ============================================================================
-- ✅ SCRIPT TERMINÉ
-- ============================================================================

-- Afficher un résumé
SELECT 
  'Tables fournisseur créées avec succès!' as message,
  COUNT(*) as nb_tables_creees
FROM information_schema.tables 
WHERE table_name IN ('fournisseurs', 'produits', 'commandes', 'lignes_commande', 'publicites')
  AND table_schema = 'public';
