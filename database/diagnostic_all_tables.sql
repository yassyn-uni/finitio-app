-- 🔍 DIAGNOSTIC COMPLET DE TOUTES LES TABLES
-- Vérification de la structure réelle de chaque table

-- Table users
SELECT 'TABLE USERS:' as info, column_name, data_type
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;

-- Table fournisseurs  
SELECT 'TABLE FOURNISSEURS:' as info, column_name, data_type
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'fournisseurs'
ORDER BY ordinal_position;

-- Table produits
SELECT 'TABLE PRODUITS:' as info, column_name, data_type
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'produits'
ORDER BY ordinal_position;

-- Table commandes
SELECT 'TABLE COMMANDES:' as info, column_name, data_type
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'commandes'
ORDER BY ordinal_position;

-- Table lignes_commande
SELECT 'TABLE LIGNES_COMMANDE:' as info, column_name, data_type
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'lignes_commande'
ORDER BY ordinal_position;

-- Table publicites
SELECT 'TABLE PUBLICITES:' as info, column_name, data_type
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'publicites'
ORDER BY ordinal_position;
