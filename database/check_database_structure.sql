-- 🔍 VÉRIFICATION STRUCTURE BASE DE DONNÉES SUPABASE
-- Ce script vérifie l'existence des tables nécessaires

-- ============================================================================
-- 📋 ÉTAPE 1: VÉRIFIER LES TABLES EXISTANTES
-- ============================================================================

-- Lister toutes les tables dans le schéma public
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- ============================================================================
-- 👤 ÉTAPE 2: VÉRIFIER LA TABLE USERS
-- ============================================================================

-- Vérifier si la table users existe et sa structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'users'
ORDER BY ordinal_position;

-- ============================================================================
-- 🔑 ÉTAPE 3: VÉRIFIER LES UTILISATEURS AUTH
-- ============================================================================

-- Vérifier les utilisateurs dans auth.users (système Supabase)
SELECT 
  id,
  email,
  created_at
FROM auth.users
LIMIT 5;

-- ============================================================================
-- 📊 ÉTAPE 4: VÉRIFIER LES UTILISATEURS PUBLICS
-- ============================================================================

-- Vérifier les utilisateurs dans la table publique users (si elle existe)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    RAISE NOTICE 'Table users existe - Affichage des données:';
    PERFORM * FROM users LIMIT 5;
  ELSE
    RAISE NOTICE 'Table users n''existe pas dans le schéma public';
  END IF;
END $$;
