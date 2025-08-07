-- 🔧 SCRIPT SYNCHRONISATION UUID SUPABASE AUTH ↔ TABLE USERS
-- Résout le problème de désynchronisation entre auth.users et public.users

-- ============================================================================
-- 🔍 ÉTAPE 1: DIAGNOSTIC - VÉRIFIER LE PROBLÈME
-- ============================================================================

-- Voir les utilisateurs dans auth.users
SELECT 'AUTH USERS' as source, id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- Voir les utilisateurs dans public.users
SELECT 'PUBLIC USERS' as source, id, email, created_at 
FROM public.users 
ORDER BY created_at DESC;

-- Identifier les désynchronisations
SELECT 
  'DÉSYNCHRONISATION' as probleme,
  au.email,
  au.id as auth_uuid,
  pu.id as public_uuid,
  CASE 
    WHEN au.id = pu.id THEN '✅ SYNC'
    ELSE '❌ DÉSYNC'
  END as statut
FROM auth.users au
FULL OUTER JOIN public.users pu ON au.email = pu.email
WHERE au.email IS NOT NULL OR pu.email IS NOT NULL
ORDER BY au.created_at DESC;

-- ============================================================================
-- 🔧 ÉTAPE 2: CORRECTION - SYNCHRONISER LES UUID
-- ============================================================================

-- Supprimer les anciens utilisateurs de test de public.users
DELETE FROM public.users 
WHERE email LIKE '%@test.com' 
AND id NOT IN (SELECT id FROM auth.users WHERE email LIKE '%@test.com');

-- Insérer/Mettre à jour les vrais utilisateurs avec les bons UUID de auth
INSERT INTO public.users (id, nom, email, role, created_at)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'nom', split_part(au.email, '@', 1)) as nom,
  au.email,
  COALESCE(au.raw_user_meta_data->>'role', 'client') as role,
  au.created_at
FROM auth.users au
WHERE au.email NOT LIKE '%@test.com'
ON CONFLICT (id) DO UPDATE SET
  nom = EXCLUDED.nom,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  created_at = EXCLUDED.created_at;

-- Mettre à jour les utilisateurs test existants avec les bons UUID
UPDATE public.users 
SET id = (
  SELECT au.id 
  FROM auth.users au 
  WHERE au.email = public.users.email
)
WHERE email LIKE '%@test.com'
AND EXISTS (
  SELECT 1 FROM auth.users au 
  WHERE au.email = public.users.email
);

-- ============================================================================
-- 🔗 ÉTAPE 3: SYNCHRONISER LES RELATIONS
-- ============================================================================

-- Mettre à jour les projets avec les nouveaux UUID
UPDATE projets 
SET user_id = (
  SELECT pu.id 
  FROM public.users pu 
  WHERE pu.email = (
    SELECT email FROM auth.users WHERE id = projets.user_id
  )
)
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Mettre à jour les notifications avec les nouveaux UUID
UPDATE notifications 
SET user_id = (
  SELECT pu.id 
  FROM public.users pu 
  WHERE pu.email = (
    SELECT email FROM auth.users WHERE id = notifications.user_id
  )
)
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- ============================================================================
-- ✅ ÉTAPE 4: VÉRIFICATION FINALE
-- ============================================================================

-- Vérifier la synchronisation
SELECT 
  'VÉRIFICATION FINALE' as etape,
  au.email,
  au.id as auth_uuid,
  pu.id as public_uuid,
  pu.role,
  CASE 
    WHEN au.id = pu.id THEN '✅ SYNCHRONISÉ'
    ELSE '❌ PROBLÈME PERSISTE'
  END as statut
FROM auth.users au
JOIN public.users pu ON au.email = pu.email
ORDER BY au.created_at DESC;

-- Compter les utilisateurs synchronisés
SELECT 
  'STATISTIQUES' as info,
  COUNT(*) as total_auth_users
FROM auth.users;

SELECT 
  'STATISTIQUES' as info,
  COUNT(*) as total_public_users
FROM public.users;

SELECT 
  'STATISTIQUES' as info,
  COUNT(*) as utilisateurs_synchronises
FROM auth.users au
JOIN public.users pu ON au.id = pu.id;

-- ============================================================================
-- 🎉 SUCCÈS - UUID SYNCHRONISÉS !
-- ============================================================================

SELECT '🎉 SYNCHRONISATION UUID TERMINÉE !' as message,
       'Vérifiez les statistiques ci-dessus pour confirmer' as instruction;
