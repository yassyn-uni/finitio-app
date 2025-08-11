-- 🔍 VÉRIFICATION STRUCTURE ACTUELLE
-- Vérifions ce qui a été créé exactement

-- Vérifier la structure de la table users
SELECT 'Table users:' as info, column_name, data_type
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;

-- Vérifier la structure de la table fournisseurs
SELECT 'Table fournisseurs:' as info, column_name, data_type
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'fournisseurs'
ORDER BY ordinal_position;

-- Lister toutes les tables créées
SELECT 'Tables existantes:' as info, table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'fournisseurs', 'produits', 'commandes', 'lignes_commande', 'publicites')
ORDER BY table_name;
