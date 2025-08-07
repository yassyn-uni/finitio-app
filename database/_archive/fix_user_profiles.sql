
-- SCRIPT DE CORRECTION - PROFILS UTILISATEURS FINITIO
-- Exécuter ce script dans l'éditeur SQL de Supabase pour corriger les profils

-- 1. CRÉER LA TABLE USERS SI ELLE N'EXISTE PAS
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    nom VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) CHECK (role IN ('client', 'prestataire', 'architecte')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ACTIVER RLS SUR LA TABLE USERS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 3. CRÉER LES POLITIQUES RLS POUR LA TABLE USERS
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- 4. CORRIGER LE PROFIL DE L'UTILISATEUR EXISTANT
-- Remplacer par l'ID réel de l'utilisateur uniform.outlet@aluxury.ma
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Récupérer l'UUID de l'utilisateur depuis auth.users
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = 'uniform.outlet@aluxury.ma';
    
    IF user_uuid IS NOT NULL THEN
        -- Insérer ou mettre à jour le profil utilisateur
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
            role = EXCLUDED.role,
            updated_at = NOW();
            
        RAISE NOTICE 'Profil utilisateur créé/mis à jour pour: %', 'uniform.outlet@aluxury.ma';
    ELSE
        RAISE NOTICE 'Utilisateur non trouvé dans auth.users: %', 'uniform.outlet@aluxury.ma';
    END IF;
END $$;

-- 5. CRÉER UNE FONCTION POUR CRÉER AUTOMATIQUEMENT LES PROFILS
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, nom, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nom', 'Nouvel utilisateur'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'client')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. CRÉER LE TRIGGER POUR CRÉER AUTOMATIQUEMENT LES PROFILS
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile();

-- 7. VÉRIFIER LES DONNÉES
SELECT 
    u.id,
    u.email,
    p.nom,
    p.role,
    p.created_at
FROM auth.users u
LEFT JOIN users p ON u.id = p.id
WHERE u.email = 'uniform.outlet@aluxury.ma';

-- 8. CRÉER QUELQUES UTILISATEURS DE TEST SUPPLÉMENTAIRES
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'client.test@finitio.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW()),
    (gen_random_uuid(), 'prestataire.test@finitio.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW()),
    (gen_random_uuid(), 'architecte.test@finitio.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- 9. CRÉER LES PROFILS POUR LES UTILISATEURS DE TEST
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN 
        SELECT id, email FROM auth.users 
        WHERE email IN ('client.test@finitio.com', 'prestataire.test@finitio.com', 'architecte.test@finitio.com')
    LOOP
        INSERT INTO users (id, nom, email, role)
        VALUES (
            user_record.id,
            CASE 
                WHEN user_record.email LIKE 'client%' THEN 'Client Test'
                WHEN user_record.email LIKE 'prestataire%' THEN 'Prestataire Test'
                WHEN user_record.email LIKE 'architecte%' THEN 'Architecte Test'
                ELSE 'Utilisateur Test'
            END,
            user_record.email,
            CASE 
                WHEN user_record.email LIKE 'client%' THEN 'client'
                WHEN user_record.email LIKE 'prestataire%' THEN 'prestataire'
                WHEN user_record.email LIKE 'architecte%' THEN 'architecte'
                ELSE 'client'
            END
        )
        ON CONFLICT (id) DO NOTHING;
    END LOOP;
END $$;

-- 10. AFFICHER TOUS LES UTILISATEURS AVEC LEURS PROFILS
SELECT 
    u.email,
    p.nom,
    p.role,
    CASE 
        WHEN p.id IS NULL THEN ' Profil manquant'
        ELSE ' Profil OK'
    END as statut
FROM auth.users u
LEFT JOIN users p ON u.id = p.id
ORDER BY u.created_at DESC;

-- SCRIPT TERMINÉ - PROFILS UTILISATEURS CORRIGÉS !