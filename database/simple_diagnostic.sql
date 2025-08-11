-- 🔍 DIAGNOSTIC SIMPLE
-- Vérification rapide de la structure

-- Vérifier la table fournisseurs
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'fournisseurs'
ORDER BY ordinal_position;
