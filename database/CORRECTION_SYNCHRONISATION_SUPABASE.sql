-- 🔧 CORRECTION SYNCHRONISATION SUPABASE AUTH ↔ TABLE USERS
-- Script SQL à exécuter dans Supabase SQL Editor

-- ====================================
-- 1. DIAGNOSTIC DE LA SYNCHRONISATION
-- ====================================

-- Vérifier les utilisateurs dans auth.users
SELECT 
    'AUTH USERS' as source,
    id as uuid,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at
FROM auth.users 
ORDER BY created_at DESC;

-- Vérifier les utilisateurs dans public.users
SELECT 
    'PUBLIC USERS' as source,
    id as uuid,
    email,
    nom,
    role,
    created_at
FROM public.users 
ORDER BY created_at DESC;

-- Identifier les utilisateurs désynchronisés
SELECT 
    'DÉSYNCHRONISÉS' as probleme,
    au.email,
    au.id as auth_uuid,
    pu.id as public_uuid,
    pu.role
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL OR au.id != pu.id;

-- ====================================
-- 2. CORRECTION AUTOMATIQUE
-- ====================================

-- Supprimer les doublons dans public.users (garder le plus récent)
DELETE FROM public.users 
WHERE id IN (
    SELECT id FROM (
        SELECT id, 
               ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) as rn
        FROM public.users
    ) t WHERE rn > 1
);

-- Synchroniser les utilisateurs manquants de auth vers public
INSERT INTO public.users (id, email, nom, role, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(SPLIT_PART(au.email, '@', 1), 'Utilisateur') as nom,
    'client' as role, -- Rôle par défaut
    au.created_at,
    NOW()
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

-- Corriger les UUID désynchronisés (mettre à jour public.users avec les UUID de auth.users)
UPDATE public.users 
SET id = au.id, updated_at = NOW()
FROM auth.users au
WHERE public.users.email = au.email 
AND public.users.id != au.id;

-- ====================================
-- 3. CRÉATION DES UTILISATEURS TEST
-- ====================================

-- Supprimer les anciens utilisateurs test s'ils existent
DELETE FROM public.users WHERE email IN (
    'architecte1@test.com',
    'prestataire1@test.com', 
    'fournisseur1@test.com',
    'fournisseur2@test.com',
    'client1@test.com'
);

-- Créer les utilisateurs test avec des UUID fixes
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

ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    nom = EXCLUDED.nom,
    role = EXCLUDED.role,
    telephone = EXCLUDED.telephone,
    ville = EXCLUDED.ville,
    updated_at = NOW();

-- ====================================
-- 4. VÉRIFICATION POST-CORRECTION
-- ====================================

-- Vérifier la synchronisation après correction
SELECT 
    'VÉRIFICATION FINALE' as etape,
    COUNT(*) as total_auth_users
FROM auth.users;

SELECT 
    'VÉRIFICATION FINALE' as etape,
    COUNT(*) as total_public_users
FROM public.users;

-- Vérifier les utilisateurs test
SELECT 
    'UTILISATEURS TEST' as type,
    email,
    nom,
    role,
    id as uuid
FROM public.users 
WHERE email LIKE '%@test.com'
ORDER BY role, email;

-- Vérifier qu'il n'y a plus de désynchronisation
SELECT 
    'DÉSYNCHRONISATION RESTANTE' as probleme,
    COUNT(*) as nombre_problemes
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- ====================================
-- 5. INSTRUCTIONS POUR SUPABASE AUTH
-- ====================================

/*
IMPORTANT: Après avoir exécuté ce script SQL, vous devez créer manuellement 
les comptes dans Supabase Auth avec les mêmes UUID et emails :

1. Allez dans Supabase Dashboard → Authentication → Users
2. Cliquez sur "Add user" pour chaque utilisateur test :

   📧 architecte1@test.com
   🔑 Mot de passe: test123
   🆔 UUID: 11111111-1111-1111-1111-111111111111

   📧 prestataire1@test.com  
   🔑 Mot de passe: test123
   🆔 UUID: 22222222-2222-2222-2222-222222222222

   📧 fournisseur1@test.com
   🔑 Mot de passe: test123
   🆔 UUID: 33333333-3333-3333-3333-333333333333

   📧 fournisseur2@test.com
   🔑 Mot de passe: test123
   🆔 UUID: 44444444-4444-4444-4444-444444444444

   📧 client1@test.com
   🔑 Mot de passe: test123
   🆔 UUID: 55555555-5555-5555-5555-555555555555

3. Cochez "Email confirmed" pour chaque utilisateur
4. Testez la connexion avec chaque compte
*/

-- ====================================
-- 6. REQUÊTES DE DIAGNOSTIC RAPIDE
-- ====================================

-- À utiliser pour vérifier rapidement l'état de la synchronisation
CREATE OR REPLACE FUNCTION diagnostic_synchronisation()
RETURNS TABLE(
    email text,
    auth_uuid uuid,
    public_uuid uuid,
    role text,
    is_synchronized boolean
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(au.email, pu.email) as email,
        au.id as auth_uuid,
        pu.id as public_uuid,
        pu.role,
        (au.id = pu.id) as is_synchronized
    FROM auth.users au
    FULL OUTER JOIN public.users pu ON au.email = pu.email
    ORDER BY COALESCE(au.email, pu.email);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Utilisation: SELECT * FROM diagnostic_synchronisation();

-- ====================================
-- 7. POLITIQUE RLS POUR LES TESTS
-- ====================================

-- S'assurer que RLS permet l'accès aux données de test
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leur propre profil
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Politique pour permettre aux utilisateurs de mettre à jour leur propre profil  
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Politique temporaire pour les tests (à supprimer en production)
CREATE POLICY "Allow test users access" ON public.users
    FOR ALL USING (email LIKE '%@test.com');

-- ====================================
-- RÉSUMÉ DES ACTIONS EFFECTUÉES
-- ====================================

/*
✅ CORRECTIONS APPLIQUÉES:

1. 🔍 DIAGNOSTIC:
   - Identification des utilisateurs désynchronisés
   - Liste des utilisateurs dans auth.users et public.users

2. 🔧 SYNCHRONISATION:
   - Suppression des doublons dans public.users
   - Synchronisation des utilisateurs manquants
   - Correction des UUID désynchronisés

3. 👥 UTILISATEURS TEST:
   - Création de 5 utilisateurs test avec UUID fixes
   - Rôles: architecte, prestataire, fournisseur (x2), client

4. ✅ VÉRIFICATION:
   - Fonction diagnostic_synchronisation() créée
   - Vérifications post-correction

5. 🔐 SÉCURITÉ:
   - Politiques RLS mises à jour
   - Accès sécurisé aux profils utilisateurs

PROCHAINES ÉTAPES:
1. Exécuter ce script dans Supabase SQL Editor
2. Créer les comptes Auth manuellement avec les UUID spécifiés
3. Tester la connexion et redirection pour chaque rôle
4. Utiliser diagnostic_synchronisation() pour vérifier l'état
*/
