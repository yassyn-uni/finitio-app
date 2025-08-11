-- 🚀 OPTIMISATION SIMPLE DE LA BASE DE DONNÉES FINITIO
-- Script sans contraintes complexes, focalisé sur les performances
-- Version simplifiée qui évite tous les problèmes de compatibilité

-- ============================================================================
-- 📊 ÉTAPE 1: INDEX ESSENTIELS POUR LES PERFORMANCES
-- ============================================================================

-- Index pour les utilisateurs
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Index pour les fournisseurs
CREATE INDEX IF NOT EXISTS idx_fournisseurs_nom ON fournisseurs(nom);
CREATE INDEX IF NOT EXISTS idx_fournisseurs_email ON fournisseurs(email);

-- Index pour les produits
CREATE INDEX IF NOT EXISTS idx_produits_fournisseur_id ON produits(fournisseur_id);
CREATE INDEX IF NOT EXISTS idx_produits_nom ON produits(nom);
CREATE INDEX IF NOT EXISTS idx_produits_prix ON produits(prix);

-- Index pour les commandes
CREATE INDEX IF NOT EXISTS idx_commandes_fournisseur_id ON commandes(fournisseur_id);
CREATE INDEX IF NOT EXISTS idx_commandes_client_email ON commandes(client_email);
CREATE INDEX IF NOT EXISTS idx_commandes_statut ON commandes(statut);
CREATE INDEX IF NOT EXISTS idx_commandes_created_at ON commandes(created_at);
CREATE INDEX IF NOT EXISTS idx_commandes_numero ON commandes(numero_commande);

-- Index pour les lignes de commande
CREATE INDEX IF NOT EXISTS idx_lignes_commande_id ON lignes_commande(commande_id);
CREATE INDEX IF NOT EXISTS idx_lignes_produit_id ON lignes_commande(produit_id);

-- Index pour les publicités
CREATE INDEX IF NOT EXISTS idx_publicites_fournisseur_id ON publicites(fournisseur_id);
CREATE INDEX IF NOT EXISTS idx_publicites_statut ON publicites(statut);
CREATE INDEX IF NOT EXISTS idx_publicites_date_debut ON publicites(date_debut);
CREATE INDEX IF NOT EXISTS idx_publicites_date_fin ON publicites(date_fin);

-- ============================================================================
-- 📈 ÉTAPE 2: VUES SIMPLES POUR LE SITE WEB
-- ============================================================================

-- Vue des produits avec fournisseurs
CREATE OR REPLACE VIEW v_produits_site AS
SELECT 
    p.id,
    p.nom as produit_nom,
    p.description,
    p.prix,
    p.unite,
    p.image_url,
    f.nom as fournisseur_nom,
    f.email as fournisseur_email,
    f.telephone as fournisseur_telephone
FROM produits p
LEFT JOIN fournisseurs f ON p.fournisseur_id = f.id;

-- Vue des commandes avec détails
CREATE OR REPLACE VIEW v_commandes_site AS
SELECT 
    c.id,
    c.numero_commande,
    c.statut,
    c.total_ht,
    c.total_ttc,
    c.created_at,
    c.date_livraison_prevue,
    f.nom as fournisseur_nom,
    u.nom as client_nom,
    u.email as client_email
FROM commandes c
LEFT JOIN fournisseurs f ON c.fournisseur_id = f.id
LEFT JOIN users u ON c.client_email = u.email;

-- Vue des publicités actives
CREATE OR REPLACE VIEW v_publicites_site AS
SELECT 
    p.id,
    p.titre,
    p.description,
    p.image_url,
    p.url_destination,
    p.type_campagne,
    p.nb_impressions,
    p.nb_clics,
    f.nom as fournisseur_nom
FROM publicites p
LEFT JOIN fournisseurs f ON p.fournisseur_id = f.id
WHERE p.statut = 'active';

-- ============================================================================
-- 🔧 ÉTAPE 3: FONCTIONS UTILES POUR LE SITE
-- ============================================================================

-- Fonction simple de recherche de produits
CREATE OR REPLACE FUNCTION recherche_produits_simple(terme TEXT)
RETURNS TABLE(
    id UUID,
    nom TEXT,
    description TEXT,
    prix NUMERIC,
    fournisseur_nom TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.nom,
        p.description,
        p.prix,
        f.nom as fournisseur_nom
    FROM produits p
    LEFT JOIN fournisseurs f ON p.fournisseur_id = f.id
    WHERE p.nom ILIKE '%' || terme || '%'
        OR p.description ILIKE '%' || terme || '%'
    ORDER BY p.nom
    LIMIT 50;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les statistiques d'un fournisseur
CREATE OR REPLACE FUNCTION stats_fournisseur_simple(fournisseur_id_param UUID)
RETURNS TABLE(
    nb_produits BIGINT,
    nb_commandes BIGINT,
    chiffre_affaires NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM produits WHERE fournisseur_id = fournisseur_id_param),
        (SELECT COUNT(*) FROM commandes WHERE fournisseur_id = fournisseur_id_param),
        (SELECT COALESCE(SUM(total_ttc), 0) FROM commandes WHERE fournisseur_id = fournisseur_id_param AND statut != 'annulee');
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 📊 ÉTAPE 4: VUES DE MONITORING SIMPLES
-- ============================================================================

-- Vue de monitoring basique
CREATE OR REPLACE VIEW v_monitoring_base AS
SELECT 
    'Nombre d''utilisateurs' as metrique,
    COUNT(*)::TEXT as valeur
FROM users
UNION ALL
SELECT 
    'Nombre de fournisseurs' as metrique,
    COUNT(*)::TEXT as valeur
FROM fournisseurs
UNION ALL
SELECT 
    'Nombre de produits' as metrique,
    COUNT(*)::TEXT as valeur
FROM produits
UNION ALL
SELECT 
    'Nombre de commandes' as metrique,
    COUNT(*)::TEXT as valeur
FROM commandes
UNION ALL
SELECT 
    'Nombre de publicités' as metrique,
    COUNT(*)::TEXT as valeur
FROM publicites;

-- Vue des tables les plus volumineuses
CREATE OR REPLACE VIEW v_tailles_tables AS
SELECT 
    t.table_name,
    pg_size_pretty(pg_total_relation_size('public.' || t.table_name)) as taille
FROM information_schema.tables t
WHERE t.table_schema = 'public' 
    AND t.table_type = 'BASE TABLE'
ORDER BY pg_total_relation_size('public.' || t.table_name) DESC;

-- ============================================================================
-- 🔄 ÉTAPE 5: FONCTION DE MAINTENANCE SIMPLE
-- ============================================================================

-- Fonction de maintenance basique
CREATE OR REPLACE FUNCTION maintenance_simple()
RETURNS TEXT AS $$
BEGIN
    -- Analyser les tables principales
    ANALYZE users;
    ANALYZE fournisseurs;
    ANALYZE produits;
    ANALYZE commandes;
    ANALYZE lignes_commande;
    ANALYZE publicites;
    
    RETURN 'Maintenance terminée - Tables analysées';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ✅ ÉTAPE 6: VÉRIFICATIONS
-- ============================================================================

-- Vérifier les index créés
SELECT 
    'Index créés' as info,
    COUNT(*) as nombre
FROM pg_indexes 
WHERE schemaname = 'public' 
    AND indexname LIKE 'idx_%';

-- Vérifier les vues créées
SELECT 
    'Vues créées' as info,
    COUNT(*) as nombre
FROM information_schema.views
WHERE table_schema = 'public'
    AND table_name LIKE 'v_%';

-- Vérifier les fonctions créées
SELECT 
    'Fonctions créées' as info,
    COUNT(*) as nombre
FROM information_schema.routines
WHERE routine_schema = 'public'
    AND routine_name IN ('recherche_produits_simple', 'stats_fournisseur_simple', 'maintenance_simple');

-- Test des vues
SELECT 'Test vue produits' as test, COUNT(*) as resultat FROM v_produits_site;
SELECT 'Test vue commandes' as test, COUNT(*) as resultat FROM v_commandes_site;
SELECT 'Test vue publicités' as test, COUNT(*) as resultat FROM v_publicites_site;
SELECT 'Test monitoring' as test, COUNT(*) as resultat FROM v_monitoring_base;

SELECT '🚀 Optimisation simple terminée avec succès!' as message;
