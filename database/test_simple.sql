-- 🧪 TEST SIMPLE DES OPTIMISATIONS FINITIO
-- Vérification rapide que tout fonctionne

-- ============================================================================
-- 🔍 VÉRIFICATION DES INDEX
-- ============================================================================

SELECT 
    '📊 INDEX CRÉÉS' as titre,
    COUNT(*) as nombre_index
FROM pg_indexes 
WHERE schemaname = 'public' 
    AND indexname LIKE 'idx_%';

-- Liste des index créés
SELECT 
    '📋 Liste des index:' as info,
    tablename as table_name,
    indexname as index_name
FROM pg_indexes 
WHERE schemaname = 'public' 
    AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- ============================================================================
-- 🔍 VÉRIFICATION DES VUES
-- ============================================================================

SELECT 
    '📈 VUES CRÉÉES' as titre,
    COUNT(*) as nombre_vues
FROM information_schema.views
WHERE table_schema = 'public'
    AND table_name LIKE 'v_%';

-- Test des vues (nombre de lignes)
SELECT 'v_produits_site' as vue, COUNT(*) as nb_lignes FROM v_produits_site
UNION ALL
SELECT 'v_commandes_site' as vue, COUNT(*) as nb_lignes FROM v_commandes_site
UNION ALL
SELECT 'v_publicites_site' as vue, COUNT(*) as nb_lignes FROM v_publicites_site
UNION ALL
SELECT 'v_monitoring_base' as vue, COUNT(*) as nb_lignes FROM v_monitoring_base
UNION ALL
SELECT 'v_tailles_tables' as vue, COUNT(*) as nb_lignes FROM v_tailles_tables;

-- ============================================================================
-- 🔍 VÉRIFICATION DES FONCTIONS
-- ============================================================================

SELECT 
    '🔧 FONCTIONS CRÉÉES' as titre,
    COUNT(*) as nombre_fonctions
FROM information_schema.routines
WHERE routine_schema = 'public'
    AND routine_name IN ('recherche_produits_simple', 'stats_fournisseur_simple', 'maintenance_simple');

-- ============================================================================
-- 🔍 TEST DES FONCTIONNALITÉS
-- ============================================================================

-- Test de la fonction de maintenance
SELECT 
    '🔧 Test maintenance:' as test,
    maintenance_simple() as resultat;

-- Test de recherche (si des produits existent)
SELECT 
    '🔍 Test recherche:' as test,
    COUNT(*) as nb_resultats
FROM recherche_produits_simple('test');

-- ============================================================================
-- 🔍 MONITORING BASIQUE
-- ============================================================================

-- Afficher les statistiques générales
SELECT 
    '📊 STATISTIQUES GÉNÉRALES' as titre,
    metrique,
    valeur
FROM v_monitoring_base;

-- Afficher les tailles des tables
SELECT 
    '💾 TAILLES DES TABLES' as titre,
    table_name,
    taille
FROM v_tailles_tables
LIMIT 10;

-- ============================================================================
-- ✅ RÉSUMÉ DU TEST
-- ============================================================================

SELECT 
    '🎯 RÉSUMÉ DU TEST' as titre,
    'Index: ' || (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND indexname LIKE 'idx_%') ||
    ', Vues: ' || (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public' AND table_name LIKE 'v_%') ||
    ', Fonctions: ' || (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name IN ('recherche_produits_simple', 'stats_fournisseur_simple', 'maintenance_simple'))
    as elements_crees;

SELECT '✅ Test terminé - Optimisations fonctionnelles!' as message;
