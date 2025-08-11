-- 🔄 SYNCHRONISATION COMPLÈTE UUID - FINITIO MAROC
-- =====================================================
-- Synchronise tous les UUID entre Supabase Auth et les tables

-- ====================================
-- 1. DÉSACTIVER TEMPORAIREMENT LES CONTRAINTES
-- ====================================
ALTER TABLE public.architectes DISABLE TRIGGER ALL;
ALTER TABLE public.prestataires DISABLE TRIGGER ALL;
ALTER TABLE public.fournisseurs DISABLE TRIGGER ALL;
ALTER TABLE public.projets DISABLE TRIGGER ALL;
ALTER TABLE public.etapes_projet DISABLE TRIGGER ALL;
ALTER TABLE public.messages DISABLE TRIGGER ALL;

-- ====================================
-- 2. MISE À JOUR USERS AVEC UUID RÉELS
-- ====================================
-- Admin
UPDATE public.users SET id = '21f21e16-e621-4b7e-9e63-464102eec16c' WHERE email = 'admin@finitio.ma';

-- Architectes
UPDATE public.users SET id = 'c2b891d1-13e1-4ce4-b66c-3db1d364df40' WHERE email = 'y.bennani@architecte.ma';
UPDATE public.users SET id = '1f1c8d40-90c9-4200-93ea-2c0d9f840fc3b' WHERE email = 'f.alaoui@design.ma';

-- Fournisseurs  
UPDATE public.users SET id = '338a406-b905-4b60-9f9b-b2a86081d719' WHERE email = 'h.materiaux@fournisseur.ma';
UPDATE public.users SET id = 'cf9cf7f1-0744-4bb1-a51e-c5c9f98fa9e0' WHERE email = 'contact@bricomaroc.ma';

-- Prestataires
UPDATE public.users SET id = '53a30367-87c7-4465-8b75-df35b8afe137' WHERE email = 'a.maconnerie@prestataire.ma';
UPDATE public.users SET id = '1ad88999-0a93-4507-ba2e-415dddd2ee5b' WHERE email = 'electro.plus@prestataire.ma';
UPDATE public.users SET id = '1c8b0ef4-b231-4129-bcb4-d818dc15dd2c' WHERE email = 'plomberie.moderne@prestataire.ma';

-- Clients
UPDATE public.users SET id = '8f5d1ae6-7f53-4361-a42a-7731f7f1bb54' WHERE email = 'm.client1@gmail.com';
UPDATE public.users SET id = '8b2b9e1b-9ff1-4a9a-b1aa-4c9ae5a7bb5b' WHERE email = 'a.benali@gmail.com';
UPDATE public.users SET id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' WHERE email = 'o.tazi@gmail.com';
UPDATE public.users SET id = 'cccccccc-cccc-cccc-cccc-cccccccccccc' WHERE email = 'k.fassi@gmail.com';
UPDATE public.users SET id = 'e53374eb-86c9-4a5a-aa32-523c483609439' WHERE email = 'r.amrani@gmail.com';

-- ====================================
-- 3. MISE À JOUR ARCHITECTES
-- ====================================
UPDATE public.architectes SET user_id = 'c2b891d1-13e1-4ce4-b66c-3db1d364df40' 
WHERE user_id = '22222222-2222-2222-2222-222222222222';

UPDATE public.architectes SET user_id = '1f1c8d40-90c9-4200-93ea-2c0d9f840fc3b' 
WHERE user_id = '33333333-3333-3333-3333-333333333333';

-- ====================================
-- 4. MISE À JOUR PRESTATAIRES
-- ====================================
UPDATE public.prestataires SET user_id = '53a30367-87c7-4465-8b75-df35b8afe137' 
WHERE user_id = '66666666-6666-6666-6666-666666666666';

UPDATE public.prestataires SET user_id = '1ad88999-0a93-4507-ba2e-415dddd2ee5b' 
WHERE user_id = '77777777-7777-7777-7777-777777777777';

UPDATE public.prestataires SET user_id = '1c8b0ef4-b231-4129-bcb4-d818dc15dd2c' 
WHERE user_id = '88888888-8888-8888-8888-888888888888';

-- ====================================
-- 5. MISE À JOUR FOURNISSEURS
-- ====================================
UPDATE public.fournisseurs SET user_id = '338a406-b905-4b60-9f9b-b2a86081d719' 
WHERE user_id = '44444444-4444-4444-4444-444444444444';

UPDATE public.fournisseurs SET user_id = 'cf9cf7f1-0744-4bb1-a51e-c5c9f98fa9e0' 
WHERE user_id = '55555555-5555-5555-5555-555555555555';

-- ====================================
-- 6. MISE À JOUR PROJETS
-- ====================================
-- Clients
UPDATE public.projets SET client_id = '8f5d1ae6-7f53-4361-a42a-7731f7f1bb54' 
WHERE client_id = '99999999-9999-9999-9999-999999999999';

UPDATE public.projets SET client_id = '8b2b9e1b-9ff1-4a9a-b1aa-4c9ae5a7bb5b' 
WHERE client_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

UPDATE public.projets SET client_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' 
WHERE client_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

-- Architectes
UPDATE public.projets SET architecte_id = 'c2b891d1-13e1-4ce4-b66c-3db1d364df40' 
WHERE architecte_id = '22222222-2222-2222-2222-222222222222';

UPDATE public.projets SET architecte_id = '1f1c8d40-90c9-4200-93ea-2c0d9f840fc3b' 
WHERE architecte_id = '33333333-3333-3333-3333-333333333333';

-- ====================================
-- 7. MISE À JOUR ÉTAPES PROJET
-- ====================================
-- Responsables architectes
UPDATE public.etapes_projet SET responsable_id = 'c2b891d1-13e1-4ce4-b66c-3db1d364df40' 
WHERE responsable_id = '22222222-2222-2222-2222-222222222222';

UPDATE public.etapes_projet SET responsable_id = '1f1c8d40-90c9-4200-93ea-2c0d9f840fc3b' 
WHERE responsable_id = '33333333-3333-3333-3333-333333333333';

-- Responsables prestataires
UPDATE public.etapes_projet SET responsable_id = '53a30367-87c7-4465-8b75-df35b8afe137' 
WHERE responsable_id = '66666666-6666-6666-6666-666666666666';

UPDATE public.etapes_projet SET responsable_id = '1ad88999-0a93-4507-ba2e-415dddd2ee5b' 
WHERE responsable_id = '77777777-7777-7777-7777-777777777777';

UPDATE public.etapes_projet SET responsable_id = '1c8b0ef4-b231-4129-bcb4-d818dc15dd2c' 
WHERE responsable_id = '88888888-8888-8888-8888-888888888888';

-- ====================================
-- 8. MISE À JOUR MESSAGES
-- ====================================
-- Expéditeurs
UPDATE public.messages SET expediteur_id = '8f5d1ae6-7f53-4361-a42a-7731f7f1bb54' 
WHERE expediteur_id = '99999999-9999-9999-9999-999999999999';

UPDATE public.messages SET expediteur_id = 'c2b891d1-13e1-4ce4-b66c-3db1d364df40' 
WHERE expediteur_id = '22222222-2222-2222-2222-222222222222';

UPDATE public.messages SET expediteur_id = '8b2b9e1b-9ff1-4a9a-b1aa-4c9ae5a7bb5b' 
WHERE expediteur_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Destinataires
UPDATE public.messages SET destinataire_id = 'c2b891d1-13e1-4ce4-b66c-3db1d364df40' 
WHERE destinataire_id = '22222222-2222-2222-2222-222222222222';

UPDATE public.messages SET destinataire_id = '53a30367-87c7-4465-8b75-df35b8afe137' 
WHERE destinataire_id = '66666666-6666-6666-6666-666666666666';

UPDATE public.messages SET destinataire_id = '1f1c8d40-90c9-4200-93ea-2c0d9f840fc3b' 
WHERE destinataire_id = '33333333-3333-3333-3333-333333333333';

-- ====================================
-- 9. RÉACTIVER LES CONTRAINTES
-- ====================================
ALTER TABLE public.architectes ENABLE TRIGGER ALL;
ALTER TABLE public.prestataires ENABLE TRIGGER ALL;
ALTER TABLE public.fournisseurs ENABLE TRIGGER ALL;
ALTER TABLE public.projets ENABLE TRIGGER ALL;
ALTER TABLE public.etapes_projet ENABLE TRIGGER ALL;
ALTER TABLE public.messages ENABLE TRIGGER ALL;

-- ====================================
-- 10. VÉRIFICATION FINALE
-- ====================================
SELECT 'SYNCHRONISATION COMPLÈTE TERMINÉE ✅' as status;

-- Vérifier les utilisateurs
SELECT '=== UTILISATEURS ===' as section;
SELECT email, id, role FROM public.users ORDER BY role, email;

-- Vérifier les architectes
SELECT '=== ARCHITECTES ===' as section;
SELECT a.nom_cabinet, u.email, a.user_id 
FROM public.architectes a 
JOIN public.users u ON a.user_id = u.id;

-- Vérifier les prestataires
SELECT '=== PRESTATAIRES ===' as section;
SELECT p.nom_entreprise, u.email, p.user_id 
FROM public.prestataires p 
JOIN public.users u ON p.user_id = u.id;

-- Vérifier les fournisseurs
SELECT '=== FOURNISSEURS ===' as section;
SELECT f.nom_entreprise, u.email, f.user_id 
FROM public.fournisseurs f 
JOIN public.users u ON f.user_id = u.id;

-- Vérifier les projets
SELECT '=== PROJETS ===' as section;
SELECT p.nom_projet, 
       uc.email as client_email, 
       ua.email as architecte_email
FROM public.projets p
JOIN public.users uc ON p.client_id = uc.id
LEFT JOIN public.users ua ON p.architecte_id = ua.id;

SELECT 'TOUTES LES TABLES SYNCHRONISÉES ✅' as final_status;
