-- 📊 INDEX BASIQUES SEULEMENT
-- Index uniquement sur les colonnes garanties (id, email, created_at)

-- ============================================================================
-- 📊 INDEX DE BASE
-- ============================================================================

-- Index sur users (colonnes de base)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index sur fournisseurs (colonnes de base)
CREATE INDEX IF NOT EXISTS idx_fournisseurs_id ON fournisseurs(id);

-- Index sur produits (colonnes de base)
CREATE INDEX IF NOT EXISTS idx_produits_id ON produits(id);

-- Index sur commandes (colonnes de base)
CREATE INDEX IF NOT EXISTS idx_commandes_id ON commandes(id);

-- Index sur lignes_commande (colonnes de base)
CREATE INDEX IF NOT EXISTS idx_lignes_commande_id ON lignes_commande(id);

-- Index sur publicites (colonnes de base)
CREATE INDEX IF NOT EXISTS idx_publicites_id ON publicites(id);

-- ============================================================================
-- ✅ VÉRIFICATION
-- ============================================================================

SELECT 'Index de base créés avec succès!' as message;

-- Lister les index créés
SELECT 
  indexname,
  tablename
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'fournisseurs', 'produits', 'commandes', 'lignes_commande', 'publicites')
ORDER BY tablename;
