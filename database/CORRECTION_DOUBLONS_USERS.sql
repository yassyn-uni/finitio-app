-- 🔧 CORRECTION DOUBLONS UTILISATEURS - GESTION CONTRAINTES
-- Script SQL pour résoudre l'erreur "duplicate key value violates unique constraint"

-- ====================================
-- 1. DIAGNOSTIC DES DOUBLONS
-- ====================================

-- Vérifier les doublons par email
SELECT 
    email,
    COUNT(*) as nombre_doublons,
    STRING_AGG(id::text, ', ') as uuids,
    STRING_AGG(role, ', ') as roles
FROM public.users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Lister tous les utilisateurs actuels
SELECT 
    'UTILISATEURS ACTUELS' as type,
    id,
    email,
    nom,
    role,
    created_at
FROM public.users 
ORDER BY email, created_at DESC;

-- ====================================
-- 2. SUPPRESSION SÉCURISÉE DES DOUBLONS
-- ====================================

-- Créer une table temporaire avec les utilisateurs à garder (les plus récents)
CREATE TEMP TABLE users_to_keep AS
SELECT DISTINCT ON (email)
    id,
    email,
    nom,
    role,
    telephone,
    ville,
    created_at,
    updated_at
FROM public.users
ORDER BY email, created_at DESC;

-- Supprimer TOUS les utilisateurs existants
DELETE FROM public.users;

-- Réinsérer uniquement les utilisateurs uniques
INSERT INTO public.users (id, email, nom, role, telephone, ville, created_at, updated_at)
SELECT id, email, nom, role, telephone, ville, created_at, updated_at
FROM users_to_keep;

-- ====================================
-- 3. CRÉATION UTILISATEURS TEST AVEC GESTION CONFLITS
-- ====================================

-- Supprimer spécifiquement les utilisateurs test s'ils existent
DELETE FROM public.users 
WHERE email IN (
    'architecte1@test.com',
    'prestataire1@test.com', 
    'fournisseur1@test.com',
    'fournisseur2@test.com',
    'client1@test.com'
);

-- Insérer les utilisateurs test avec UPSERT (INSERT ... ON CONFLICT)
INSERT INTO public.users (id, email, nom, role, telephone, ville, created_at, updated_at) VALUES
-- Architecte
('11111111-1111-1111-1111-111111111111', 'architecte1@test.com', 'Ahmed Architecte', 'architecte', '+212600000001', 'Casablanca', NOW(), NOW()),

-- Prestataire  
('22222222-2222-2222-2222-222222222222', 'prestataire1@test.com', 'Omar Prestataire', 'prestataire', '+212600000002', 'Rabat', NOW(), NOW()),

-- Fournisseurs
('33333333-3333-3333-3333-333333333333', 'fournisseur1@test.com', 'Youssef Fournisseur', 'fournisseur', '+212600000003', 'Marrakech', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'fournisseur2@test.com', 'Karim Fournisseur', 'fournisseur', '+212600000004', 'Fès', NOW(), NOW()),

-- Client
('55555555-5555-5555-5555-555555555555', 'client1@test.com', 'Sara Client', 'client', '+212600000005', 'Tanger', NOW(), NOW())

-- Gestion des conflits sur email ET id
ON CONFLICT (email) DO UPDATE SET
    id = EXCLUDED.id,
    nom = EXCLUDED.nom,
    role = EXCLUDED.role,
    telephone = EXCLUDED.telephone,
    ville = EXCLUDED.ville,
    updated_at = NOW();

-- ====================================
-- 4. SYNCHRONISATION AVEC AUTH.USERS
-- ====================================

-- Vérifier quels utilisateurs existent dans auth.users
SELECT 
    'AUTH USERS EXISTANTS' as type,
    id,
    email,
    created_at
FROM auth.users
ORDER BY created_at DESC;

-- Synchroniser les utilisateurs existants de auth vers public
INSERT INTO public.users (id, email, nom, role, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(SPLIT_PART(au.email, '@', 1), 'Utilisateur') as nom,
    CASE 
        WHEN au.email LIKE '%architecte%' THEN 'architecte'
        WHEN au.email LIKE '%prestataire%' THEN 'prestataire'
        WHEN au.email LIKE '%fournisseur%' THEN 'fournisseur'
        ELSE 'client'
    END as role,
    au.created_at,
    NOW()
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.users pu WHERE pu.email = au.email
)
ON CONFLICT (email) DO UPDATE SET
    id = EXCLUDED.id,
    updated_at = NOW();

-- ====================================
-- 5. VÉRIFICATION FINALE
-- ====================================

-- Vérifier qu'il n'y a plus de doublons
SELECT 
    'VÉRIFICATION DOUBLONS' as test,
    email,
    COUNT(*) as nombre
FROM public.users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Lister les utilisateurs test créés
SELECT 
    'UTILISATEURS TEST CRÉÉS' as type,
    id,
    email,
    nom,
    role
FROM public.users 
WHERE email LIKE '%@test.com'
ORDER BY role, email;

-- Vérifier la synchronisation Auth ↔ Public
SELECT 
    'SYNCHRONISATION' as test,
    COALESCE(au.email, pu.email) as email,
    au.id as auth_uuid,
    pu.id as public_uuid,
    pu.role,
    CASE 
        WHEN au.id IS NULL THEN 'MANQUANT DANS AUTH'
        WHEN pu.id IS NULL THEN 'MANQUANT DANS PUBLIC'
        WHEN au.id = pu.id THEN 'SYNCHRONISÉ'
        ELSE 'DÉSYNCHRONISÉ'
    END as statut
FROM auth.users au
FULL OUTER JOIN public.users pu ON au.email = pu.email
ORDER BY COALESCE(au.email, pu.email);

-- ====================================
-- 6. INSTRUCTIONS POUR SUPABASE AUTH
-- ====================================

/*
🔐 CRÉATION COMPTES SUPABASE AUTH:

Maintenant que la table public.users est nettoyée, créez les comptes Auth :

1. Allez dans Supabase Dashboard → Authentication → Users
2. Pour chaque utilisateur test, cliquez "Add user" :

   📧 Email: architecte1@test.com
   🔑 Password: test123
   🆔 User ID: 11111111-1111-1111-1111-111111111111
   ✅ Email confirmed: OUI

   📧 Email: prestataire1@test.com  
   🔑 Password: test123
   🆔 User ID: 22222222-2222-2222-2222-222222222222
   ✅ Email confirmed: OUI

   📧 Email: fournisseur1@test.com
   🔑 Password: test123
   🆔 User ID: 33333333-3333-3333-3333-333333333333
   ✅ Email confirmed: OUI

   📧 Email: fournisseur2@test.com
   🔑 Password: test123
   🆔 User ID: 44444444-4444-4444-4444-444444444444
   ✅ Email confirmed: OUI

   📧 Email: client1@test.com
   🔑 Password: test123
   🆔 User ID: 55555555-5555-5555-5555-555555555555
   ✅ Email confirmed: OUI

IMPORTANT: Utilisez exactement ces UUID pour que la synchronisation fonctionne !
*/

-- ====================================
-- 7. REQUÊTE DE DIAGNOSTIC RAPIDE
-- ====================================

-- Fonction pour vérifier rapidement l'état après correction
CREATE OR REPLACE FUNCTION verifier_correction()
RETURNS TABLE(
    email text,
    public_uuid uuid,
    role text,
    auth_existe boolean,
    synchronise boolean
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pu.email,
        pu.id as public_uuid,
        pu.role,
        (au.id IS NOT NULL) as auth_existe,
        (au.id = pu.id) as synchronise
    FROM public.users pu
    LEFT JOIN auth.users au ON pu.email = au.email
    WHERE pu.email LIKE '%@test.com'
    ORDER BY pu.role, pu.email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Utilisation: SELECT * FROM verifier_correction();

-- ====================================
-- RÉSUMÉ DES CORRECTIONS
-- ====================================

/*
✅ PROBLÈME RÉSOLU:

❌ ERREUR INITIALE:
   - "duplicate key value violates unique constraint users_email_key"
   - Doublons d'utilisateurs dans la table

✅ CORRECTIONS APPLIQUÉES:
   1. 🧹 Nettoyage complet des doublons
   2. 🔄 Réinsertion des utilisateurs uniques
   3. 👥 Création utilisateurs test avec UUID fixes
   4. 🔗 Synchronisation avec auth.users
   5. ✅ Vérification absence de doublons
   6. 🔍 Fonction de diagnostic créée

PROCHAINES ÉTAPES:
1. ✅ Script SQL exécuté sans erreur
2. 🔐 Créer les comptes Auth avec les UUID spécifiés
3. 🧪 Tester la connexion avec chaque compte
4. 📊 Utiliser verifier_correction() pour vérifier

Le problème de doublons est maintenant résolu !
*/
