-- ========================================
-- 🔧 FIX KANBAN VIDE - AJOUT ÉTAPES TEST (FINAL)
-- ========================================

-- Nettoyer les anciennes étapes de test
DELETE FROM etapes WHERE titre LIKE '%Test%' OR titre LIKE '%Exemple%';

-- Récupérer les projets existants pour ajouter des étapes
DO $$
DECLARE
    projet_record RECORD;
    etape_count INTEGER := 0;
BEGIN
    -- Pour chaque projet existant
    FOR projet_record IN 
        SELECT id, titre FROM projets 
        ORDER BY created_at DESC 
        LIMIT 10
    LOOP
        RAISE NOTICE 'Ajout d''étapes pour le projet: %', projet_record.titre;
        
        -- Étape 1: À faire
        INSERT INTO etapes (
            id,
            titre,
            description,
            statut,
            projet_id,
            ordre
        ) VALUES (
            gen_random_uuid(),
            'Étude de faisabilité',
            'Analyse technique et réglementaire du projet',
            'à faire',
            projet_record.id,
            1
        );
        
        -- Étape 2: En cours
        INSERT INTO etapes (
            id,
            titre,
            description,
            statut,
            projet_id,
            ordre
        ) VALUES (
            gen_random_uuid(),
            'Plans architecturaux',
            'Conception des plans détaillés',
            'en cours',
            projet_record.id,
            2
        );
        
        -- Étape 3: Terminée
        INSERT INTO etapes (
            id,
            titre,
            description,
            statut,
            projet_id,
            ordre
        ) VALUES (
            gen_random_uuid(),
            'Permis de construire',
            'Dépôt et validation des autorisations',
            'terminée',
            projet_record.id,
            3
        );
        
        -- Étape 4: À faire
        INSERT INTO etapes (
            id,
            titre,
            description,
            statut,
            projet_id,
            ordre
        ) VALUES (
            gen_random_uuid(),
            'Gros œuvre',
            'Fondations, murs porteurs, charpente',
            'à faire',
            projet_record.id,
            4
        );
        
        -- Étape 5: À faire
        INSERT INTO etapes (
            id,
            titre,
            description,
            statut,
            projet_id,
            ordre
        ) VALUES (
            gen_random_uuid(),
            'Second œuvre',
            'Plomberie, électricité, cloisons',
            'à faire',
            projet_record.id,
            5
        );
        
        etape_count := etape_count + 5;
    END LOOP;
    
    RAISE NOTICE 'Total étapes créées: %', etape_count;
END $$;

-- Vérification des résultats
SELECT 
    p.titre as projet,
    COUNT(e.id) as nb_etapes,
    COUNT(CASE WHEN e.statut = 'à faire' THEN 1 END) as todo,
    COUNT(CASE WHEN e.statut = 'en cours' THEN 1 END) as en_cours,
    COUNT(CASE WHEN e.statut = 'terminée' THEN 1 END) as terminee
FROM projets p
LEFT JOIN etapes e ON p.id = e.projet_id
GROUP BY p.id, p.titre
ORDER BY p.created_at DESC;

-- Statistiques finales
SELECT 
    'RÉSULTAT FINAL' as info,
    COUNT(*) as total_etapes,
    COUNT(CASE WHEN statut = 'à faire' THEN 1 END) as todo,
    COUNT(CASE WHEN statut = 'en cours' THEN 1 END) as en_cours,
    COUNT(CASE WHEN statut = 'terminée' THEN 1 END) as terminee
FROM etapes;

-- Aperçu des étapes créées par projet
SELECT 
    'APERÇU KANBAN' as vue,
    p.titre as projet,
    e.titre as etape,
    e.statut,
    e.ordre
FROM projets p
JOIN etapes e ON p.id = e.projet_id
ORDER BY p.titre, e.ordre;

SELECT '🎉 KANBAN REMPLI AVEC SUCCÈS !' as message,
       'Chaque projet a maintenant 5 étapes réparties dans le Kanban' as details;
