-- 🔍 DIAGNOSTIC ET CORRECTION COMPLÈTE - FINITIO
-- Script pour identifier et corriger tous les problèmes de redirection de rôles

-- ============================================================================
-- 📊 ÉTAPE 1: DIAGNOSTIC COMPLET
-- ============================================================================

-- Vérifier la structure de la table users
SELECT '🔍 STRUCTURE TABLE USERS:' as diagnostic;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;

-- Vérifier les utilisateurs existants
SELECT '👥 UTILISATEURS EXISTANTS:' as diagnostic;
SELECT id, email, role, created_at
FROM users
ORDER BY created_at;

-- Vérifier les utilisateurs Supabase Auth
SELECT '🔐 UTILISATEURS SUPABASE AUTH:' as diagnostic;
SELECT id, email, created_at
FROM auth.users
ORDER BY created_at;

-- Identifier les problèmes de synchronisation
SELECT '⚠️ PROBLÈMES DE SYNCHRONISATION:' as diagnostic;
SELECT 
  'Auth users sans profil public' as probleme,
  COUNT(*) as nombre
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- ============================================================================
-- 🔧 ÉTAPE 2: CORRECTION STRUCTURE TABLE USERS
-- ============================================================================

-- Ajouter les colonnes manquantes
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS nom text,
ADD COLUMN IF NOT EXISTS prenom text,
ADD COLUMN IF NOT EXISTS role text DEFAULT 'client',
ADD COLUMN IF NOT EXISTS telephone text,
ADD COLUMN IF NOT EXISTS ville text,
ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now();

-- ============================================================================
-- 🔄 ÉTAPE 3: SYNCHRONISATION AUTH → PUBLIC
-- ============================================================================

-- Créer les profils manquants pour les utilisateurs Auth
INSERT INTO public.users (id, email, role, created_at)
SELECT 
  au.id,
  au.email,
  'client' as role,
  au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 👥 ÉTAPE 4: CRÉATION UTILISATEURS DE TEST AVEC RÔLES
-- ============================================================================

-- Supprimer les anciens utilisateurs de test s'ils existent
DELETE FROM users WHERE email IN (
  'client1@test.com', 'architecte1@test.com', 'prestataire1@test.com', 
  'fournisseur1@test.com', 'fournisseur2@test.com'
);

-- Créer les utilisateurs de test avec des UUIDs fixes
INSERT INTO users (id, email, nom, prenom, role, created_at) VALUES
-- Client
('11111111-1111-1111-1111-111111111111', 'client1@test.com', 'Ahmed', 'Benali', 'client', now()),

-- Architecte  
('22222222-2222-2222-2222-222222222222', 'architecte1@test.com', 'Karim', 'Hassan', 'architecte', now()),

-- Prestataire
('33333333-3333-3333-3333-333333333333', 'prestataire1@test.com', 'Omar', 'Tazi', 'prestataire', now()),

-- Fournisseurs
('44444444-4444-4444-4444-444444444444', 'fournisseur1@test.com', 'Sara', 'Alami', 'fournisseur', now()),
('55555555-5555-5555-5555-555555555555', 'fournisseur2@test.com', 'Fatima', 'Zahra', 'fournisseur', now())

ON CONFLICT (email) DO UPDATE SET
  nom = EXCLUDED.nom,
  prenom = EXCLUDED.prenom,
  role = EXCLUDED.role,
  updated_at = now();

-- ============================================================================
-- 🔐 ÉTAPE 5: SYNCHRONISATION AVEC SUPABASE AUTH
-- ============================================================================

-- Créer les comptes Auth correspondants (à faire manuellement dans Supabase Auth)
SELECT '🔐 COMPTES AUTH À CRÉER MANUELLEMENT:' as instruction;
SELECT 
  email,
  'Mot de passe: test123' as mot_de_passe,
  role
FROM users 
WHERE email LIKE '%@test.com'
ORDER BY role;

-- ============================================================================
-- 📊 ÉTAPE 6: VÉRIFICATION FINALE
-- ============================================================================

-- Vérifier la synchronisation
SELECT '✅ VÉRIFICATION SYNCHRONISATION:' as verification;
SELECT 
  u.email,
  u.role,
  CASE 
    WHEN au.id IS NOT NULL THEN '✅ Sync OK'
    ELSE '❌ Manque Auth'
  END as statut_auth
FROM public.users u
LEFT JOIN auth.users au ON u.id = au.id
WHERE u.email LIKE '%@test.com'
ORDER BY u.role;

-- Compter les utilisateurs par rôle
SELECT '📊 UTILISATEURS PAR RÔLE:' as statistiques;
SELECT 
  role,
  COUNT(*) as nombre
FROM users
GROUP BY role
ORDER BY role;

-- ============================================================================
-- 🎯 ÉTAPE 7: TESTS DE REDIRECTION
-- ============================================================================

-- Script de test pour vérifier les redirections
SELECT '🧪 TESTS DE REDIRECTION:' as tests;
SELECT 
  email,
  role,
  CASE role
    WHEN 'client' THEN '/dashboard-client'
    WHEN 'architecte' THEN '/dashboard-architecte'
    WHEN 'prestataire' THEN '/dashboard-prestataire'
    WHEN 'fournisseur' THEN '/dashboard-fournisseur'
    ELSE '/dashboard'
  END as redirection_attendue
FROM users
WHERE email LIKE '%@test.com'
ORDER BY role;

-- ============================================================================
-- ✅ RÉSUMÉ FINAL
-- ============================================================================

SELECT '🎉 DIAGNOSTIC ET CORRECTION TERMINÉS !' as message,
       'Utilisateurs de test créés avec rôles corrects' as details,
       'Prochaine étape: Créer les comptes Auth manuellement' as action_requise;
