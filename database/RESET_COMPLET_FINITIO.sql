-- 🔥 RESET COMPLET FINITIO - SUPPRESSION TOTALE ET RECONSTRUCTION
-- Script pour supprimer TOUTES les tables et recommencer depuis zéro

-- ====================================
-- ⚠️ ATTENTION - SUPPRESSION TOTALE ⚠️
-- ====================================
/*
CE SCRIPT VA SUPPRIMER TOUTES LES DONNÉES !
- Toutes les tables public.*
- Tous les utilisateurs
- Toutes les données de l'application

UTILISATION:
1. Exécutez ce script dans Supabase SQL Editor
2. Toutes les tables seront supprimées et recréées
3. 5 utilisateurs test seront créés avec des UUID simples
4. La structure sera propre et fonctionnelle

IMPORTANT: Sauvegardez vos données importantes avant d'exécuter !
*/

-- ====================================
-- 1. SUPPRESSION TOTALE DES TABLES
-- ====================================

-- Désactiver temporairement les contraintes de clés étrangères
SET session_replication_role = replica;

-- Supprimer toutes les tables dans l'ordre inverse des dépendances
DROP TABLE IF EXISTS public.lignes_commande CASCADE;
DROP TABLE IF EXISTS public.commandes CASCADE;
DROP TABLE IF EXISTS public.publicites CASCADE;
DROP TABLE IF EXISTS public.produits CASCADE;
DROP TABLE IF EXISTS public.fournisseurs CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Supprimer les fonctions personnalisées
DROP FUNCTION IF EXISTS diagnostic_synchronisation() CASCADE;
DROP FUNCTION IF EXISTS verifier_correction() CASCADE;

-- Réactiver les contraintes
SET session_replication_role = DEFAULT;

-- ====================================
-- 2. CRÉATION STRUCTURE PROPRE
-- ====================================

-- Table USERS (structure simplifiée et propre)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nom VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'client',
    telephone VARCHAR(20),
    ville VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table FOURNISSEURS
CREATE TABLE public.fournisseurs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    adresse TEXT,
    site_web VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table PRODUITS
CREATE TABLE public.produits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fournisseur_id UUID REFERENCES public.fournisseurs(id) ON DELETE CASCADE,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    unite VARCHAR(50) DEFAULT 'unité',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table COMMANDES
CREATE TABLE public.commandes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fournisseur_id UUID REFERENCES public.fournisseurs(id) ON DELETE SET NULL,
    client_email VARCHAR(255) NOT NULL,
    projet_id UUID,
    numero_commande VARCHAR(100) UNIQUE NOT NULL,
    statut VARCHAR(50) DEFAULT 'en_attente',
    total_ht DECIMAL(10,2) DEFAULT 0,
    total_ttc DECIMAL(10,2) DEFAULT 0,
    tva DECIMAL(5,2) DEFAULT 20.00,
    adresse_livraison TEXT,
    date_livraison_prevue DATE,
    date_livraison_reelle DATE,
    transporteur VARCHAR(255),
    numero_suivi VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table LIGNES_COMMANDE
CREATE TABLE public.lignes_commande (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commande_id UUID REFERENCES public.commandes(id) ON DELETE CASCADE,
    produit_id UUID REFERENCES public.produits(id) ON DELETE CASCADE,
    quantite INTEGER NOT NULL DEFAULT 1,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    total_ligne DECIMAL(10,2) GENERATED ALWAYS AS (quantite * prix_unitaire) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table PUBLICITES
CREATE TABLE public.publicites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fournisseur_id UUID REFERENCES public.fournisseurs(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    url_destination TEXT,
    type_campagne VARCHAR(50) DEFAULT 'standard',
    budget DECIMAL(10,2) DEFAULT 0,
    budget_utilise DECIMAL(10,2) DEFAULT 0,
    cible_geographique TEXT[] DEFAULT '{}',
    cible_roles TEXT[] DEFAULT '{}',
    date_debut DATE DEFAULT CURRENT_DATE,
    date_fin DATE,
    statut VARCHAR(50) DEFAULT 'active',
    nb_impressions INTEGER DEFAULT 0,
    nb_clics INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 3. CRÉATION UTILISATEURS TEST SIMPLES
-- ====================================

-- Insérer 5 utilisateurs test avec des UUID très simples
INSERT INTO public.users (id, email, nom, role, telephone, ville, created_at, updated_at) VALUES
-- Architecte
('00000000-0000-0000-0000-000000000001', 'architecte1@test.com', 'Ahmed Architecte', 'architecte', '+212600000001', 'Casablanca', NOW(), NOW()),

-- Prestataire
('00000000-0000-0000-0000-000000000002', 'prestataire1@test.com', 'Omar Prestataire', 'prestataire', '+212600000002', 'Rabat', NOW(), NOW()),

-- Fournisseur
('00000000-0000-0000-0000-000000000003', 'fournisseur1@test.com', 'Youssef Fournisseur', 'fournisseur', '+212600000003', 'Marrakech', NOW(), NOW()),

-- Client
('00000000-0000-0000-0000-000000000004', 'client1@test.com', 'Sara Client', 'client', '+212600000004', 'Tanger', NOW(), NOW()),

-- Admin (pour tests)
('00000000-0000-0000-0000-000000000005', 'admin@test.com', 'Admin Test', 'admin', '+212600000005', 'Casablanca', NOW(), NOW());

-- ====================================
-- 4. CONFIGURATION RLS (ROW LEVEL SECURITY)
-- ====================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fournisseurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lignes_commande ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publicites ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table users
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Politique temporaire pour les tests (TRÈS PERMISSIVE - à restreindre en production)
CREATE POLICY "Allow test users full access" ON public.users
    FOR ALL USING (email LIKE '%@test.com' OR auth.uid() = id);

-- Politiques pour les autres tables (accès basé sur le rôle)
CREATE POLICY "Fournisseurs can manage their data" ON public.fournisseurs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('fournisseur', 'admin')
        )
    );

CREATE POLICY "Public can view products" ON public.produits
    FOR SELECT USING (true);

CREATE POLICY "Fournisseurs can manage their products" ON public.produits
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('fournisseur', 'admin')
        )
    );

-- ====================================
-- 5. INDEX POUR PERFORMANCE
-- ====================================

-- Index sur les colonnes fréquemment utilisées
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_produits_fournisseur ON public.produits(fournisseur_id);
CREATE INDEX idx_commandes_client ON public.commandes(client_email);
CREATE INDEX idx_commandes_statut ON public.commandes(statut);

-- ====================================
-- 6. TRIGGERS POUR UPDATED_AT
-- ====================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger à toutes les tables avec updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fournisseurs_updated_at BEFORE UPDATE ON public.fournisseurs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_produits_updated_at BEFORE UPDATE ON public.produits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commandes_updated_at BEFORE UPDATE ON public.commandes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_publicites_updated_at BEFORE UPDATE ON public.publicites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- 7. VÉRIFICATION DE LA STRUCTURE
-- ====================================

-- Lister toutes les tables créées
SELECT 
    'TABLES CRÉÉES' as type,
    tablename,
    schemaname
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Vérifier les utilisateurs test
SELECT 
    'UTILISATEURS TEST' as type,
    id,
    email,
    nom,
    role
FROM public.users
ORDER BY role, email;

-- Compter les enregistrements par table
SELECT 'users' as table_name, COUNT(*) as count FROM public.users
UNION ALL
SELECT 'fournisseurs' as table_name, COUNT(*) as count FROM public.fournisseurs
UNION ALL
SELECT 'produits' as table_name, COUNT(*) as count FROM public.produits
UNION ALL
SELECT 'commandes' as table_name, COUNT(*) as count FROM public.commandes
UNION ALL
SELECT 'lignes_commande' as table_name, COUNT(*) as count FROM public.lignes_commande
UNION ALL
SELECT 'publicites' as table_name, COUNT(*) as count FROM public.publicites;

-- ====================================
-- INSTRUCTIONS POUR SUPABASE AUTH
-- ====================================

/*
🔐 ÉTAPES SUIVANTES - CRÉATION COMPTES SUPABASE AUTH:

Maintenant que la base est propre, créez les comptes Auth avec ces UUID EXACTS :

1. Allez dans Supabase Dashboard → Authentication → Users
2. Supprimez TOUS les utilisateurs existants dans Auth
3. Créez les nouveaux utilisateurs avec ces informations EXACTES :

   📧 Email: architecte1@test.com
   🔑 Password: test123
   🆔 User ID: 00000000-0000-0000-0000-000000000001
   ✅ Email confirmed: OUI

   📧 Email: prestataire1@test.com
   🔑 Password: test123
   🆔 User ID: 00000000-0000-0000-0000-000000000002
   ✅ Email confirmed: OUI

   📧 Email: fournisseur1@test.com
   🔑 Password: test123
   🆔 User ID: 00000000-0000-0000-0000-000000000003
   ✅ Email confirmed: OUI

   📧 Email: client1@test.com
   🔑 Password: test123
   🆔 User ID: 00000000-0000-0000-0000-000000000004
   ✅ Email confirmed: OUI

   📧 Email: admin@test.com
   🔑 Password: test123
   🆔 User ID: 00000000-0000-0000-0000-000000000005
   ✅ Email confirmed: OUI

IMPORTANT: 
- Utilisez EXACTEMENT ces UUID (avec les zéros)
- Confirmez les emails
- Utilisez le mot de passe "test123" pour tous
*/

-- ====================================
-- RÉSUMÉ DU RESET COMPLET
-- ====================================

/*
✅ RESET COMPLET EFFECTUÉ:

🔥 SUPPRESSION:
   - Toutes les tables public.* supprimées
   - Toutes les fonctions personnalisées supprimées
   - Toutes les données effacées

🏗️ RECONSTRUCTION:
   - 6 tables recréées avec structure propre
   - 5 utilisateurs test avec UUID simples (000...001, 002, etc.)
   - RLS configuré avec politiques de base
   - Index de performance créés
   - Triggers updated_at configurés

👥 UTILISATEURS TEST:
   - architecte1@test.com (UUID: ...001)
   - prestataire1@test.com (UUID: ...002)
   - fournisseur1@test.com (UUID: ...003)
   - client1@test.com (UUID: ...004)
   - admin@test.com (UUID: ...005)

🎯 PROCHAINES ÉTAPES:
   1. Créer les comptes Supabase Auth avec les UUID exacts
   2. Tester la connexion et redirection
   3. Vérifier que la déconnexion fonctionne
   4. Ajouter des données de test si nécessaire

BASE DE DONNÉES PROPRE ET PRÊTE ! 🎉
*/
