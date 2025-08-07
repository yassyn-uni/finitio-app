-- ========================================
-- 🔧 FIX KANBAN VIDE - AJOUT ÉTAPES TEST
-- ========================================

-- Nettoyer les anciennes étapes de test
DELETE FROM etapes WHERE nom LIKE '%Test%' OR nom LIKE '%Exemple%';

-- Récupérer les projets existants pour ajouter des étapes
DO $$
DECLARE
    projet_record RECORD;
    etape_count INTEGER := 0;
BEGIN
    -- Pour chaque projet existant
    FOR projet_record IN 
        SELECT id, nom FROM projets 
        ORDER BY created_at DESC 
        LIMIT 10
    LOOP
        RAISE NOTICE 'Ajout d''étapes pour le projet: %', projet_record.nom;
        
        -- Étape 1: À faire
        INSERT INTO etapes (
            id,
            nom,
            description,
            statut,
            projet_id,
            ordre,
            budget_estime,
            created_at
        ) VALUES (
            gen_random_uuid(),
            'Étude de faisabilité',
            'Analyse technique et réglementaire du projet',
            'à faire',
            projet_record.id,
            1,
            15000,
            NOW()
        );
        
        -- Étape 2: En cours
        INSERT INTO etapes (
            id,
            nom,
            description,
            statut,
            projet_id,
            ordre,
            budget_estime,
            created_at
        ) VALUES (
            gen_random_uuid(),
            'Plans architecturaux',
            'Conception des plans détaillés',
            'en cours',
            projet_record.id,
            2,
            25000,
            NOW()
        );
        
        -- Étape 3: Terminée
        INSERT INTO etapes (
            id,
            nom,
            description,
            statut,
            projet_id,
            ordre,
            budget_estime,
            created_at
        ) VALUES (
            gen_random_uuid(),
            'Permis de construire',
            'Dépôt et validation des autorisations',
            'terminée',
            projet_record.id,
            3,
            5000,
            NOW()
        );
        
        -- Étape 4: À faire
        INSERT INTO etapes (
            id,
            nom,
            description,
            statut,
            projet_id,
            ordre,
            budget_estime,
            created_at
        ) VALUES (
            gen_random_uuid(),
            'Gros œuvre',
            'Fondations, murs porteurs, charpente',
            'à faire',
            projet_record.id,
            4,
            120000,
            NOW()
        );
        
        -- Étape 5: À faire
        INSERT INTO etapes (
            id,
            nom,
            description,
            statut,
            projet_record.id,
            ordre,
            budget_estime,
            created_at
        ) VALUES (
            gen_random_uuid(),
            'Second œuvre',
            'Plomberie, électricité, cloisons',
            'à faire',
            projet_record.id,
            5,
            80000,
            NOW()
        );
        
        etape_count := etape_count + 5;
    END LOOP;
    
    RAISE NOTICE 'Total étapes créées: %', etape_count;
END $$;

-- Vérification des résultats
SELECT 
    p.nom as projet,
    COUNT(e.id) as nb_etapes,
    COUNT(CASE WHEN e.statut = 'à faire' THEN 1 END) as todo,
    COUNT(CASE WHEN e.statut = 'en cours' THEN 1 END) as en_cours,
    COUNT(CASE WHEN e.statut = 'terminée' THEN 1 END) as terminee
FROM projets p
LEFT JOIN etapes e ON p.id = e.projet_id
GROUP BY p.id, p.nom
ORDER BY p.created_at DESC;

-- Statistiques finales
SELECT 
    'RÉSULTAT FINAL' as info,
    COUNT(*) as total_etapes,
    COUNT(CASE WHEN statut = 'à faire' THEN 1 END) as todo,
    COUNT(CASE WHEN statut = 'en cours' THEN 1 END) as en_cours,
    COUNT(CASE WHEN statut = 'terminée' THEN 1 END) as terminee
FROM etapes;
