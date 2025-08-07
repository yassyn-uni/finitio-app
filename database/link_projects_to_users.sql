-- 🔗 LIAISON AUTOMATIQUE PROJETS ↔ UTILISATEURS + ÉTAPES KANBAN
-- Assigne les projets existants aux utilisateurs synchronisés et crée les étapes Kanban

-- ============================================================================
-- 🔍 ÉTAPE 1: DIAGNOSTIC - VOIR L'ÉTAT ACTUEL
-- ============================================================================

-- Voir les projets sans utilisateur
SELECT 'PROJETS ORPHELINS' as type, COUNT(*) as nombre
FROM projets 
WHERE user_id IS NULL;

-- Voir tous les projets
SELECT 'PROJETS EXISTANTS' as info, id, titre, user_id, created_at
FROM projets 
ORDER BY created_at;

-- Voir les utilisateurs disponibles
SELECT 'UTILISATEURS DISPONIBLES' as info, id, nom, email, role
FROM users 
ORDER BY role, nom;

-- Voir les étapes existantes
SELECT 'ÉTAPES EXISTANTES' as info, COUNT(*) as nombre
FROM etapes;

-- ============================================================================
-- 🔄 ÉTAPE 2: LIAISON INTELLIGENTE DES PROJETS
-- ============================================================================

-- Assigner les projets aux utilisateurs par rôle et ordre chronologique
WITH projet_assignments AS (
  SELECT 
    p.id as projet_id,
    p.titre,
    ROW_NUMBER() OVER (ORDER BY p.created_at) as projet_rank
  FROM projets p
  WHERE p.user_id IS NULL
),
user_assignments AS (
  SELECT 
    u.id as user_id,
    u.nom,
    u.role,
    ROW_NUMBER() OVER (ORDER BY 
      CASE u.role 
        WHEN 'client' THEN 1 
        WHEN 'architecte' THEN 2 
        WHEN 'prestataire' THEN 3 
      END, u.nom
    ) as user_rank
  FROM users u
)

-- Mise à jour des projets avec assignation cyclique
UPDATE projets 
SET user_id = (
  SELECT user_id 
  FROM user_assignments 
  WHERE user_rank = ((
    SELECT projet_rank - 1 
    FROM projet_assignments 
    WHERE projet_id = projets.id
  ) % (SELECT COUNT(*) FROM users)) + 1
)
WHERE user_id IS NULL;

-- ============================================================================
-- 📋 ÉTAPE 3: CRÉATION DES ÉTAPES KANBAN POUR CHAQUE PROJET
-- ============================================================================

-- Supprimer les anciennes étapes orphelines
DELETE FROM etapes WHERE projet_id NOT IN (SELECT id FROM projets);

-- Créer les étapes Kanban standard pour chaque projet (SANS created_at)
INSERT INTO etapes (id, projet_id, titre, description, statut, ordre)
SELECT 
  gen_random_uuid(),
  p.id,
  etape_template.titre,
  etape_template.description,
  etape_template.statut,
  etape_template.ordre
FROM projets p
CROSS JOIN (
  VALUES 
    ('📋 Planification', 'Définition des besoins et planification du projet', 'a_faire', 1),
    ('🎨 Conception', 'Création des maquettes et designs', 'a_faire', 2),
    ('🏗️ Développement', 'Réalisation et construction du projet', 'en_cours', 3),
    ('🔍 Tests & Validation', 'Tests qualité et validation client', 'a_faire', 4),
    ('🚀 Livraison', 'Finalisation et livraison du projet', 'a_faire', 5)
) AS etape_template(titre, description, statut, ordre)
WHERE NOT EXISTS (
  SELECT 1 FROM etapes e 
  WHERE e.projet_id = p.id 
  AND e.titre = etape_template.titre
);

-- ============================================================================
-- 🎯 ÉTAPE 4: ASSIGNATIONS SPÉCIFIQUES PAR RÔLE (OPTIONNEL)
-- ============================================================================

-- Si vous voulez des assignations plus spécifiques, décommentez ci-dessous :

/*
-- Assigner le premier projet au premier client
UPDATE projets 
SET user_id = (SELECT id FROM users WHERE role = 'client' ORDER BY nom LIMIT 1)
WHERE titre LIKE '%Projet 1%' OR id = (SELECT MIN(id) FROM projets WHERE user_id IS NULL);

-- Assigner le deuxième projet au premier architecte
UPDATE projets 
SET user_id = (SELECT id FROM users WHERE role = 'architecte' ORDER BY nom LIMIT 1)
WHERE titre LIKE '%Projet 2%' OR id = (SELECT MIN(id) FROM projets WHERE user_id IS NULL AND id > (SELECT MIN(id) FROM projets));

-- Assigner le troisième projet au premier prestataire
UPDATE projets 
SET user_id = (SELECT id FROM users WHERE role = 'prestataire' ORDER BY nom LIMIT 1)
WHERE titre LIKE '%Projet 3%' OR id = (SELECT MIN(id) FROM projets WHERE user_id IS NULL);
*/

-- ============================================================================
-- 🎲 ÉTAPE 5: RANDOMISATION DES STATUTS D'ÉTAPES (RÉALISME)
-- ============================================================================

-- Mettre quelques étapes en cours ou terminées pour plus de réalisme
UPDATE etapes 
SET statut = 'termine'
WHERE titre = '📋 Planification' 
AND random() < 0.7; -- 70% des planifications terminées

UPDATE etapes 
SET statut = 'en_cours'
WHERE titre = '🎨 Conception' 
AND random() < 0.5; -- 50% des conceptions en cours

UPDATE etapes 
SET statut = 'termine'
WHERE titre = '🎨 Conception' 
AND random() < 0.3; -- 30% des conceptions terminées

UPDATE etapes 
SET statut = 'en_cours'
WHERE titre = '🏗️ Développement' 
AND random() < 0.4; -- 40% des développements en cours

-- ============================================================================
-- ✅ ÉTAPE 6: VÉRIFICATION DES LIAISONS ET ÉTAPES
-- ============================================================================

-- Vérifier les assignations de projets
SELECT 
  'LIAISON VÉRIFIÉE' as statut,
  p.id as projet_id,
  p.titre,
  u.nom as proprietaire,
  u.email,
  u.role,
  p.created_at
FROM projets p
JOIN users u ON p.user_id = u.id
ORDER BY p.created_at;

-- Statistiques des projets par rôle
SELECT 
  'PROJETS PAR RÔLE' as info,
  u.role,
  COUNT(p.id) as nombre_projets
FROM users u
LEFT JOIN projets p ON u.id = p.user_id
GROUP BY u.role
ORDER BY u.role;

-- Statistiques des étapes par projet
SELECT 
  'ÉTAPES PAR PROJET' as info,
  p.titre as projet,
  u.nom as proprietaire,
  COUNT(e.id) as nombre_etapes
FROM projets p
JOIN users u ON p.user_id = u.id
LEFT JOIN etapes e ON p.id = e.projet_id
GROUP BY p.id, p.titre, u.nom
ORDER BY p.titre;

-- Statistiques des étapes par statut
SELECT 
  'ÉTAPES PAR STATUT' as info,
  e.statut,
  COUNT(*) as nombre
FROM etapes e
GROUP BY e.statut
ORDER BY e.statut;

-- Vérifier qu'il n'y a plus de projets orphelins
SELECT 'PROJETS ORPHELINS RESTANTS' as type, COUNT(*) as nombre
FROM projets 
WHERE user_id IS NULL;

-- Aperçu du Kanban créé
SELECT 
  'APERÇU KANBAN' as vue,
  p.titre as projet,
  u.nom as proprietaire,
  e.titre as etape,
  e.statut,
  e.ordre
FROM projets p
JOIN users u ON p.user_id = u.id
JOIN etapes e ON p.id = e.projet_id
ORDER BY p.titre, e.ordre
LIMIT 20;

SELECT '🎉 LIAISON PROJETS ↔ UTILISATEURS + KANBAN TERMINÉE !' as message,
       'Tous les projets ont des propriétaires et des étapes Kanban' as details;
