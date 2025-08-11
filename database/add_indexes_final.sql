-- 📊 INDEX FINAUX ADAPTÉS AUX COLONNES RÉELLES
-- Basé sur la structure réelle des tables

-- ============================================================================
-- 📊 INDEX POUR PERFORMANCES
-- ============================================================================

-- Index sur users (à adapter selon la structure réelle)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index sur fournisseurs (à adapter selon la structure réelle) 
CREATE INDEX IF NOT EXISTS idx_fournisseurs_id ON fournisseurs(id);

-- Index sur produits (à adapter selon la structure réelle)
CREATE INDEX IF NOT EXISTS idx_produits_id ON produits(id);
CREATE INDEX IF NOT EXISTS idx_produits_fournisseur ON produits(fournisseur_id);

-- Index sur commandes (à adapter selon la structure réelle)
CREATE INDEX IF NOT EXISTS idx_commandes_id ON commandes(id);
CREATE INDEX IF NOT EXISTS idx_commandes_fournisseur ON commandes(fournisseur_id);

-- Index sur lignes_commande (à adapter selon la structure réelle)
CREATE INDEX IF NOT EXISTS idx_lignes_commande_id ON lignes_commande(id);
CREATE INDEX IF NOT EXISTS idx_lignes_commande_commande ON lignes_commande(commande_id);
CREATE INDEX IF NOT EXISTS idx_lignes_commande_produit ON lignes_commande(produit_id);

-- Index sur publicites (structure confirmée)
CREATE INDEX IF NOT EXISTS idx_publicites_id ON publicites(id);
CREATE INDEX IF NOT EXISTS idx_publicites_fournisseur ON publicites(fournisseur_id);
CREATE INDEX IF NOT EXISTS idx_publicites_statut ON publicites(statut);
CREATE INDEX IF NOT EXISTS idx_publicites_type ON publicites(type_campagne);
CREATE INDEX IF NOT EXISTS idx_publicites_dates ON publicites(date_debut, date_fin);

-- ============================================================================
-- ✅ VÉRIFICATION
-- ============================================================================

SELECT 'Index créés avec succès!' as message;

-- Lister tous les index
SELECT 
  'Index créés:' as info,
  indexname,
  tablename
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'fournisseurs', 'produits', 'commandes', 'lignes_commande', 'publicites')
ORDER BY tablename, indexname;
