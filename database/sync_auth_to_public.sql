-- 🔧 SYNCHRONISATION AUTH → PUBLIC USERS
-- Garde les utilisateurs Supabase Auth et crée leurs profils dans public.users

-- ============================================================================
-- 🗑️ ÉTAPE 1: NETTOYER LA TABLE PUBLIC.USERS
-- ============================================================================

-- Supprimer TOUS les utilisateurs existants dans public.users
DELETE FROM public.users;

-- ============================================================================
-- 🔄 ÉTAPE 2: CRÉER LES PROFILS POUR LES UTILISATEURS AUTH
-- ============================================================================

-- Insérer les profils avec les UUID AUTH (SANS tirets, format 32 caractères)
INSERT INTO public.users (id, nom, email, role, created_at)
VALUES 
-- PRESTATAIRES (de Supabase Auth)
('aea7bd23f8d47fca0362f5b15e0b504', 'Prestataire 3', 'prestataire3@test.com', 'prestataire', now()),
('df09be2daca45b99ad9b31119d494ff', 'Prestataire 2', 'prestataire2@test.com', 'prestataire', now()),
('13c42cfecf14f70adc83795f32ff9a', 'Prestataire 1', 'prestataire1@test.com', 'prestataire', now()),

-- ARCHITECTES (de Supabase Auth)
('f37e55063b604140a6983208345664c65', 'Architecte 2', 'architecte2@test.com', 'architecte', now()),
('f2e48c29e53e48679e5967f5b4492454', 'Architecte 1', 'architecte1@test.com', 'architecte', now()),

-- CLIENTS (de Supabase Auth)
('562adffbffdb4950ac43c358cf30aef1', 'Client 4', 'client4@test.com', 'client', now()),
('978656fa303c46d59e6c1b907fc27e59', 'Client 3', 'client3@test.com', 'client', now());

-- ============================================================================
-- ✅ ÉTAPE 3: VÉRIFICATION DE LA SYNCHRONISATION
-- ============================================================================

-- Vérifier que les UUID correspondent (conversion format)
SELECT 
  'VÉRIFICATION' as etape,
  au.email,
  au.id as auth_uid_32_chars,
  pu.id as public_uid_32_chars,
  pu.role,
  CASE 
    WHEN au.id = pu.id THEN '✅ SYNCHRONISÉ'
    ELSE '❌ ERREUR'
  END as statut
FROM auth.users au
JOIN public.users pu ON au.email = pu.email
ORDER BY pu.role, au.email;

-- Compter les utilisateurs synchronisés
SELECT 'RÉSULTAT' as info, COUNT(*) as total_synchronise 
FROM auth.users au
JOIN public.users pu ON au.id = pu.id;

-- Statistiques par rôle
SELECT 'STATISTIQUES' as info, role, COUNT(*) as nombre 
FROM public.users 
GROUP BY role 
ORDER BY role;

-- Vérifier qu'il n'y a plus d'utilisateurs orphelins
SELECT 'ORPHELINS AUTH' as type, COUNT(*) as nombre
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

SELECT 'ORPHELINS PUBLIC' as type, COUNT(*) as nombre
FROM public.users pu
LEFT JOIN auth.users au ON pu.id = au.id
WHERE au.id IS NULL;

SELECT '🎉 SYNCHRONISATION AUTH → PUBLIC TERMINÉE !' as message,
       'Utilisateurs Auth conservés avec profils créés' as details;
