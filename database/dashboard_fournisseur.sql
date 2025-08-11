-- 🏢 GESTION DASHBOARD FOURNISSEUR
-- Fonctions pour rediriger les fournisseurs vers leur dashboard après connexion

-- ============================================================================
-- 🔐 FONCTION D'AUTHENTIFICATION FOURNISSEUR
-- ============================================================================

-- Fonction pour vérifier les credentials et obtenir les infos fournisseur
CREATE OR REPLACE FUNCTION authentifier_fournisseur(
    p_email TEXT,
    p_mot_de_passe TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    fournisseur_id UUID,
    nom TEXT,
    email TEXT,
    role TEXT,
    redirect_url TEXT,
    message TEXT
) AS $$
DECLARE
    v_user_record RECORD;
    v_fournisseur_record RECORD;
BEGIN
    -- Vérifier d'abord dans la table users
    SELECT u.id, u.nom, u.email, u.role, u.mot_de_passe
    INTO v_user_record
    FROM users u
    WHERE u.email = p_email;
    
    -- Si utilisateur trouvé et mot de passe correct
    IF FOUND AND v_user_record.mot_de_passe = p_mot_de_passe THEN
        
        -- Si c'est un fournisseur, récupérer ses infos
        IF v_user_record.role = 'fournisseur' THEN
            SELECT f.id, f.nom, f.email
            INTO v_fournisseur_record
            FROM fournisseurs f
            WHERE f.email = p_email;
            
            IF FOUND THEN
                -- Connexion réussie - redirection vers dashboard fournisseur
                RETURN QUERY SELECT 
                    TRUE as success,
                    v_fournisseur_record.id as fournisseur_id,
                    v_fournisseur_record.nom as nom,
                    v_fournisseur_record.email as email,
                    v_user_record.role as role,
                    '/dashboard/fournisseur' as redirect_url,
                    'Connexion réussie - Redirection vers dashboard fournisseur' as message;
            ELSE
                -- Utilisateur fournisseur mais pas dans table fournisseurs
                RETURN QUERY SELECT 
                    FALSE as success,
                    NULL::UUID as fournisseur_id,
                    NULL::TEXT as nom,
                    NULL::TEXT as email,
                    NULL::TEXT as role,
                    '/error' as redirect_url,
                    'Erreur: Profil fournisseur incomplet' as message;
            END IF;
            
        ELSE
            -- Utilisateur valide mais pas fournisseur - redirection appropriée
            RETURN QUERY SELECT 
                TRUE as success,
                NULL::UUID as fournisseur_id,
                v_user_record.nom as nom,
                v_user_record.email as email,
                v_user_record.role as role,
                CASE 
                    WHEN v_user_record.role = 'admin' THEN '/dashboard/admin'
                    WHEN v_user_record.role = 'client' THEN '/dashboard/client'
                    ELSE '/dashboard'
                END as redirect_url,
                'Connexion réussie - Redirection vers dashboard ' || v_user_record.role as message;
        END IF;
        
    ELSE
        -- Échec de connexion
        RETURN QUERY SELECT 
            FALSE as success,
            NULL::UUID as fournisseur_id,
            NULL::TEXT as nom,
            NULL::TEXT as email,
            NULL::TEXT as role,
            '/login' as redirect_url,
            'Email ou mot de passe incorrect' as message;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 📊 FONCTION DASHBOARD FOURNISSEUR - DONNÉES PRINCIPALES
-- ============================================================================

-- Fonction pour obtenir les données du dashboard fournisseur
CREATE OR REPLACE FUNCTION dashboard_fournisseur_data(p_fournisseur_id UUID)
RETURNS TABLE(
    -- Informations générales
    nom_fournisseur TEXT,
    email_fournisseur TEXT,
    telephone TEXT,
    
    -- Statistiques produits
    nb_produits BIGINT,
    produit_plus_cher NUMERIC,
    produit_moins_cher NUMERIC,
    
    -- Statistiques commandes
    nb_commandes_total BIGINT,
    nb_commandes_en_cours BIGINT,
    nb_commandes_livrees BIGINT,
    
    -- Chiffre d'affaires
    ca_total NUMERIC,
    ca_mois_courant NUMERIC,
    ca_mois_precedent NUMERIC,
    
    -- Publicités
    nb_publicites_actives BIGINT,
    nb_impressions_total BIGINT,
    nb_clics_total BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        -- Informations fournisseur
        f.nom as nom_fournisseur,
        f.email as email_fournisseur,
        f.telephone,
        
        -- Statistiques produits
        COUNT(DISTINCT p.id) as nb_produits,
        COALESCE(MAX(p.prix), 0) as produit_plus_cher,
        COALESCE(MIN(p.prix), 0) as produit_moins_cher,
        
        -- Statistiques commandes
        COUNT(DISTINCT c.id) as nb_commandes_total,
        COUNT(DISTINCT CASE WHEN c.statut IN ('en_attente', 'confirmee', 'en_preparation') THEN c.id END) as nb_commandes_en_cours,
        COUNT(DISTINCT CASE WHEN c.statut = 'livree' THEN c.id END) as nb_commandes_livrees,
        
        -- Chiffre d'affaires
        COALESCE(SUM(CASE WHEN c.statut != 'annulee' THEN c.total_ttc END), 0) as ca_total,
        COALESCE(SUM(CASE WHEN c.statut != 'annulee' AND DATE_TRUNC('month', c.created_at) = DATE_TRUNC('month', CURRENT_DATE) THEN c.total_ttc END), 0) as ca_mois_courant,
        COALESCE(SUM(CASE WHEN c.statut != 'annulee' AND DATE_TRUNC('month', c.created_at) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') THEN c.total_ttc END), 0) as ca_mois_precedent,
        
        -- Publicités
        COUNT(DISTINCT CASE WHEN pub.statut = 'active' THEN pub.id END) as nb_publicites_actives,
        COALESCE(SUM(pub.nb_impressions), 0) as nb_impressions_total,
        COALESCE(SUM(pub.nb_clics), 0) as nb_clics_total
        
    FROM fournisseurs f
    LEFT JOIN produits p ON f.id = p.fournisseur_id
    LEFT JOIN commandes c ON f.id = c.fournisseur_id
    LEFT JOIN publicites pub ON f.id = pub.fournisseur_id
    WHERE f.id = p_fournisseur_id
    GROUP BY f.id, f.nom, f.email, f.telephone;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 📈 FONCTION DASHBOARD - COMMANDES RÉCENTES
-- ============================================================================

-- Fonction pour obtenir les commandes récentes d'un fournisseur
CREATE OR REPLACE FUNCTION dashboard_commandes_recentes(
    p_fournisseur_id UUID,
    p_limite INTEGER DEFAULT 10
)
RETURNS TABLE(
    commande_id UUID,
    numero_commande TEXT,
    statut TEXT,
    total_ttc NUMERIC,
    client_email TEXT,
    client_nom TEXT,
    created_at TIMESTAMP,
    nb_articles BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id as commande_id,
        c.numero_commande,
        c.statut,
        c.total_ttc,
        c.client_email,
        u.nom as client_nom,
        c.created_at,
        COUNT(lc.id) as nb_articles
    FROM commandes c
    LEFT JOIN users u ON c.client_email = u.email
    LEFT JOIN lignes_commande lc ON c.id = lc.commande_id
    WHERE c.fournisseur_id = p_fournisseur_id
    GROUP BY c.id, c.numero_commande, c.statut, c.total_ttc, c.client_email, u.nom, c.created_at
    ORDER BY c.created_at DESC
    LIMIT p_limite;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 🛍️ FONCTION DASHBOARD - PRODUITS POPULAIRES
-- ============================================================================

-- Fonction pour obtenir les produits les plus vendus d'un fournisseur
CREATE OR REPLACE FUNCTION dashboard_produits_populaires(
    p_fournisseur_id UUID,
    p_limite INTEGER DEFAULT 5
)
RETURNS TABLE(
    produit_id UUID,
    nom_produit TEXT,
    prix NUMERIC,
    nb_ventes BIGINT,
    quantite_vendue BIGINT,
    ca_produit NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as produit_id,
        p.nom as nom_produit,
        p.prix,
        COUNT(DISTINCT lc.commande_id) as nb_ventes,
        SUM(lc.quantite) as quantite_vendue,
        SUM(lc.total_ligne) as ca_produit
    FROM produits p
    LEFT JOIN lignes_commande lc ON p.id = lc.produit_id
    LEFT JOIN commandes c ON lc.commande_id = c.id
    WHERE p.fournisseur_id = p_fournisseur_id
        AND (c.statut IS NULL OR c.statut != 'annulee')
    GROUP BY p.id, p.nom, p.prix
    ORDER BY quantite_vendue DESC NULLS LAST
    LIMIT p_limite;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ✅ TESTS DES FONCTIONS DASHBOARD
-- ============================================================================

-- Test de la fonction d'authentification (exemple)
-- SELECT * FROM authentifier_fournisseur('test@example.com', 'password');

-- Test des données dashboard (remplacer par un vrai UUID)
-- SELECT * FROM dashboard_fournisseur_data('uuid-du-fournisseur');

-- Test des commandes récentes
-- SELECT * FROM dashboard_commandes_recentes('uuid-du-fournisseur', 5);

-- Test des produits populaires
-- SELECT * FROM dashboard_produits_populaires('uuid-du-fournisseur', 3);

SELECT '🏢 Fonctions dashboard fournisseur créées avec succès!' as message;
