-- 🔧 SOLUTION DIRECTE - SYNCHRONISATION UUID SIMPLE
-- Supprime et recrée la table users avec les bons UUID de auth

-- ============================================================================
-- 🗑️ ÉTAPE 1: NETTOYER LA TABLE USERS
-- ============================================================================

-- Supprimer toutes les données de la table users
DELETE FROM public.users;

-- ============================================================================
-- 🔄 ÉTAPE 2: RECRÉER LES UTILISATEURS AVEC LES BONS UUID
-- ============================================================================

-- Insérer les utilisateurs avec les UUID de auth.users (FORMAT CORRIGÉ)
INSERT INTO public.users (id, nom, email, role, created_at)
VALUES 
-- CLIENTS (nouveaux utilisateurs ajoutés)
('4c4e72d5-f2c7-47c0-a0f8-848b79cfe68e', 'Client 2', 'client2@test.com', 'client', now()),
('84f62e05-0f59-44d4-8b5f-86ce4fadbd7d', 'Client 1', 'client1@test.com', 'client', now()),
('33b37d66-cf25-42b5-8221-94489c3cd903', 'Atelier Azrail', 'atelier.azrail@gmail.com', 'client', now()),
('68403674-0dd4-464a-9f7d-7cfbd2f97268', 'Ismael Idrag', 'ismael.idrag@gmail.com', 'client', now()),
('4ead693b-330a-48b6-a8f3-77dd985e4031', 'Yassyn FIP', 'yassyn.fip@gmail.com', 'client', now()),
('605c0f6d-bf52-4f15-9f07-48535528f0b5', 'Ta', 'ta@ha.com', 'client', now()),
('094bf7c5-208c-45b3-9d0f-f84b4ba76671', 'Uniform Outlet', 'uniform.outlet@aluxury.ma', 'client', now()),

-- PRESTATAIRES (UUID CORRIGÉS avec tirets) - DÉPLACÉS AVANT LA FIN
('aea7fbd2-318d-47fc-a036-2f5b15e0b504', 'Prestataire 3', 'prestataire3@test.com', 'prestataire', now()),
('df019be2-daca-45b9-9ad9-b31119d494ff', 'Prestataire 2', 'prestataire2@test.com', 'prestataire', now()),
('13c42fcf-ec1f-4f70-adc8-37953f32ff9a', 'Prestataire 1', 'prestataire1@test.com', 'prestataire', now()),

-- ARCHITECTES (UUID CORRIGÉS avec tirets)
('f37e5506-3b60-4140-a698-3208345664c5', 'Architecte 2', 'architecte2@test.com', 'architecte', now()),
('f2e48c29-e53e-4867-9e59-67f5b4492454', 'Architecte 1', 'architecte1@test.com', 'architecte', now()),

-- CLIENTS (UUID CORRIGÉS avec tirets)
('562adffb-ffdb-4950-ac43-c358cf30aef1', 'Client 4', 'client4@test.com', 'client', now()),
('978656fa-303c-46d5-9e6c-1b907fc27e59', 'Client 3', 'client3@test.com', 'client', now());

-- ============================================================================
-- ✅ ÉTAPE 3: VÉRIFICATION
-- ============================================================================

-- Vérifier que les UUID correspondent maintenant
SELECT 
  'VÉRIFICATION' as etape,
  au.email,
  au.id as auth_uuid,
  pu.id as public_uuid,
  pu.role,
  CASE 
    WHEN au.id = pu.id THEN '✅ SYNCHRONISÉ'
    ELSE '❌ ERREUR'
  END as statut
FROM auth.users au
JOIN public.users pu ON au.email = pu.email
ORDER BY pu.role, au.email;

-- Compter les utilisateurs
SELECT 'RÉSULTAT' as info, COUNT(*) as total_synchronise 
FROM auth.users au
JOIN public.users pu ON au.id = pu.id;

-- Statistiques par rôle
SELECT 'STATISTIQUES' as info, role, COUNT(*) as nombre 
FROM public.users 
GROUP BY role 
ORDER BY role;

SELECT '🎉 SYNCHRONISATION COMPLÈTE TERMINÉE !' as message,
       'Total: 14 utilisateurs synchronisés' as details;
