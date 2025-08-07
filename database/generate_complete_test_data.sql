-- 🎯 GÉNÉRATION COMPLÈTE DE DONNÉES DE TEST FINITIO
-- Crée des projets et étapes Kanban pour TOUS les rôles (prestataires, architectes, clients)

-- ============================================================================
-- 🗑️ ÉTAPE 1: NETTOYER LES DONNÉES EXISTANTES
-- ============================================================================

-- Supprimer toutes les étapes existantes
DELETE FROM etapes;

-- Supprimer tous les projets existants
DELETE FROM projets;

-- ============================================================================
-- 📋 ÉTAPE 2: CRÉER DES PROJETS POUR CHAQUE RÔLE
-- ============================================================================

-- Projets pour CLIENTS
INSERT INTO projets (id, titre, description, statut, budget, user_id, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Rénovation ' || u.nom,
  'Projet de rénovation complète pour ' || u.nom,
  'en_cours',
  50000 + (random() * 100000)::int,
  u.id,
  now() - (random() * interval '30 days'),
  now()
FROM users u 
WHERE u.role = 'client';

INSERT INTO projets (id, titre, description, statut, budget, user_id, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Extension ' || u.nom,
  'Projet d''extension de maison pour ' || u.nom,
  'planifie',
  75000 + (random() * 50000)::int,
  u.id,
  now() - (random() * interval '20 days'),
  now()
FROM users u 
WHERE u.role = 'client';

-- Projets pour ARCHITECTES
INSERT INTO projets (id, titre, description, statut, budget, user_id, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Conception Villa ' || u.nom,
  'Conception architecturale d''une villa moderne par ' || u.nom,
  'en_cours',
  120000 + (random() * 80000)::int,
  u.id,
  now() - (random() * interval '25 days'),
  now()
FROM users u 
WHERE u.role = 'architecte';

INSERT INTO projets (id, titre, description, statut, budget, user_id, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Immeuble Commercial ' || u.nom,
  'Conception d''un immeuble commercial par ' || u.nom,
  'planifie',
  200000 + (random() * 100000)::int,
  u.id,
  now() - (random() * interval '15 days'),
  now()
FROM users u 
WHERE u.role = 'architecte';

-- Projets pour PRESTATAIRES
INSERT INTO projets (id, titre, description, statut, budget, user_id, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Chantier ' || u.nom,
  'Travaux de construction gérés par ' || u.nom,
  'en_cours',
  80000 + (random() * 60000)::int,
  u.id,
  now() - (random() * interval '35 days'),
  now()
FROM users u 
WHERE u.role = 'prestataire';

INSERT INTO projets (id, titre, description, statut, budget, user_id, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Réhabilitation ' || u.nom,
  'Réhabilitation de bâtiment par ' || u.nom,
  'termine',
  45000 + (random() * 40000)::int,
  u.id,
  now() - (random() * interval '45 days'),
  now()
FROM users u 
WHERE u.role = 'prestataire';

-- ============================================================================
-- 📋 ÉTAPE 3: CRÉER LES ÉTAPES KANBAN POUR TOUS LES PROJETS
-- ============================================================================

-- Créer 5 étapes pour chaque projet existant
INSERT INTO etapes (id, projet_id, titre, description, statut, ordre)
SELECT 
  gen_random_uuid(),
  p.id,
  etape_template.titre,
  etape_template.description,
  CASE 
    WHEN etape_template.ordre <= 2 THEN 'termine'
    WHEN etape_template.ordre = 3 THEN 'en_cours'
    ELSE 'a_faire'
  END as statut,
  etape_template.ordre
FROM projets p
CROSS JOIN (
  VALUES 
    ('📋 Analyse des besoins', 'Étude détaillée des besoins du client', 1),
    ('🎨 Conception & Design', 'Création des plans et maquettes', 2),
    ('🏗️ Réalisation', 'Phase de construction/développement', 3),
    ('🔍 Contrôle Qualité', 'Tests et vérifications qualité', 4),
    ('🚀 Livraison Finale', 'Finalisation et remise du projet', 5)
) AS etape_template(titre, description, ordre);

-- ============================================================================
-- 🎲 ÉTAPE 4: RANDOMISATION RÉALISTE DES STATUTS
-- ============================================================================

-- Randomiser quelques statuts pour plus de réalisme
UPDATE etapes 
SET statut = 'termine'
WHERE titre = '📋 Analyse des besoins' 
AND random() < 0.9; -- 90% des analyses terminées

UPDATE etapes 
SET statut = 'termine'
WHERE titre = '🎨 Conception & Design' 
AND random() < 0.6; -- 60% des conceptions terminées

UPDATE etapes 
SET statut = 'en_cours'
WHERE titre = '🎨 Conception & Design' 
AND statut = 'a_faire'
AND random() < 0.7; -- 70% des conceptions restantes en cours

UPDATE etapes 
SET statut = 'en_cours'
WHERE titre = '🏗️ Réalisation' 
AND random() < 0.5; -- 50% des réalisations en cours

UPDATE etapes 
SET statut = 'termine'
WHERE titre = '🏗️ Réalisation' 
AND random() < 0.2; -- 20% des réalisations terminées

-- ============================================================================
-- ✅ ÉTAPE 5: VÉRIFICATIONS COMPLÈTES
-- ============================================================================

-- Statistiques des projets par rôle
SELECT 
  '📊 PROJETS PAR RÔLE' as info,
  u.role,
  COUNT(p.id) as nombre_projets,
  ROUND(AVG(p.budget)) as budget_moyen
FROM users u
LEFT JOIN projets p ON u.id = p.user_id
GROUP BY u.role
ORDER BY u.role;

-- Statistiques des étapes par statut
SELECT 
  '📋 ÉTAPES PAR STATUT' as info,
  e.statut,
  COUNT(*) as nombre
FROM etapes e
GROUP BY e.statut
ORDER BY 
  CASE e.statut 
    WHEN 'termine' THEN 1
    WHEN 'en_cours' THEN 2
    WHEN 'a_faire' THEN 3
  END;

-- Aperçu des projets par utilisateur
SELECT 
  '👤 PROJETS PAR UTILISATEUR' as vue,
  u.nom,
  u.role,
  u.email,
  COUNT(p.id) as nb_projets,
  COUNT(e.id) as nb_etapes
FROM users u
LEFT JOIN projets p ON u.id = p.user_id
LEFT JOIN etapes e ON p.id = e.projet_id
GROUP BY u.id, u.nom, u.role, u.email
ORDER BY u.role, u.nom;

-- Aperçu détaillé du Kanban
SELECT 
  '🎯 APERÇU KANBAN COMPLET' as vue,
  u.nom as proprietaire,
  u.role,
  p.titre as projet,
  e.titre as etape,
  e.statut,
  e.ordre
FROM users u
JOIN projets p ON u.id = p.user_id
JOIN etapes e ON p.id = e.projet_id
ORDER BY u.role, u.nom, p.titre, e.ordre
LIMIT 30;

SELECT '🎉 GÉNÉRATION COMPLÈTE TERMINÉE !' as message,
       'Tous les rôles ont maintenant des projets et étapes Kanban' as details;
