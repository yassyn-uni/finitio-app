-- 🔧 SCRIPT DE CORRECTION SIMPLIFIÉ - PROFILS UTILISATEURS FINITIO
-- Exécuter ce script dans l'éditeur SQL de Supabase

-- ✅ 1. VÉRIFIER LA STRUCTURE DE LA TABLE USERS EXISTANTE
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public';

-- ✅ 2. CORRIGER LE PROFIL DE L'UTILISATEUR EXISTANT (VERSION SIMPLE)
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Récupérer l'UUID de l'utilisateur depuis auth.users
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = 'uniform.outlet@aluxury.ma';
    
    IF user_uuid IS NOT NULL THEN
        -- Insérer ou mettre à jour le profil utilisateur (SANS updated_at)
        INSERT INTO users (id, nom, email, role)
        VALUES (
            user_uuid,
            'Utilisateur Test',
            'uniform.outlet@aluxury.ma',
            'client'
        )
        ON CONFLICT (id) DO UPDATE SET
            nom = EXCLUDED.nom,
            email = EXCLUDED.email,
            role = EXCLUDED.role;
            
        RAISE NOTICE 'Profil utilisateur créé/mis à jour pour: %', 'uniform.outlet@aluxury.ma';
    ELSE
        RAISE NOTICE 'Utilisateur non trouvé dans auth.users: %', 'uniform.outlet@aluxury.ma';
    END IF;
END $$;

-- ✅ 3. VÉRIFIER QUE LE PROFIL EST CRÉÉ
SELECT 
    u.id,
    u.email,
    p.nom,
    p.role
FROM auth.users u
LEFT JOIN users p ON u.id = p.id
WHERE u.email = 'uniform.outlet@aluxury.ma';

-- ✅ 4. ACTIVER RLS SI PAS DÉJÀ FAIT
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ✅ 5. CRÉER LES POLITIQUES RLS (SUPPRESSION SÉCURISÉE)
DO $$
BEGIN
    -- Supprimer les anciennes politiques si elles existent
    DROP POLICY IF EXISTS "Users can view own profile" ON users;
    DROP POLICY IF EXISTS "Users can update own profile" ON users;
    DROP POLICY IF EXISTS "Users can insert own profile" ON users;
    
    -- Créer les nouvelles politiques
    CREATE POLICY "Users can view own profile" ON users
        FOR SELECT USING (auth.uid()::text = id::text);
    
    CREATE POLICY "Users can update own profile" ON users
        FOR UPDATE USING (auth.uid()::text = id::text);
    
    CREATE POLICY "Users can insert own profile" ON users
        FOR INSERT WITH CHECK (auth.uid()::text = id::text);
        
    RAISE NOTICE 'Politiques RLS créées avec succès';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erreur lors de la création des politiques: %', SQLERRM;
END $$;

-- ✅ 6. AFFICHER TOUS LES UTILISATEURS AVEC LEURS PROFILS
SELECT 
    u.email,
    COALESCE(p.nom, 'Nom manquant') as nom,
    COALESCE(p.role, 'Rôle manquant') as role,
    CASE 
        WHEN p.id IS NULL THEN '❌ Profil manquant'
        ELSE '✅ Profil OK'
    END as statut
FROM auth.users u
LEFT JOIN users p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 10;

-- 🎉 SCRIPT TERMINÉ - TEST DE CONNEXION MAINTENANT POSSIBLE !
