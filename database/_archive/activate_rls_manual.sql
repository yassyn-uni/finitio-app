-- 🔐 ACTIVATION MANUELLE DU RLS - ÉTAPE PAR ÉTAPE
-- Exécutez ces commandes une par une dans l'éditeur SQL Supabase

-- ✅ ÉTAPE 1: ACTIVER RLS SUR TOUTES LES TABLES
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_logins ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_conversions ENABLE ROW LEVEL SECURITY;

-- ✅ ÉTAPE 2: SUPPRIMER LES ANCIENNES POLITIQUES (si elles existent)
DROP POLICY IF EXISTS "Users can view own sessions" ON analytics_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON analytics_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON analytics_sessions;

DROP POLICY IF EXISTS "Users can view own page views" ON analytics_page_views;
DROP POLICY IF EXISTS "Users can insert own page views" ON analytics_page_views;

DROP POLICY IF EXISTS "Users can view own events" ON analytics_events;
DROP POLICY IF EXISTS "Users can insert own events" ON analytics_events;

DROP POLICY IF EXISTS "Users can view own signups" ON analytics_signups;
DROP POLICY IF EXISTS "Users can insert own signups" ON analytics_signups;

DROP POLICY IF EXISTS "Users can view own logins" ON analytics_logins;
DROP POLICY IF EXISTS "Users can insert own logins" ON analytics_logins;

DROP POLICY IF EXISTS "Users can view own conversions" ON analytics_conversions;
DROP POLICY IF EXISTS "Users can insert own conversions" ON analytics_conversions;

-- ✅ ÉTAPE 3: CRÉER LES POLITIQUES POUR analytics_sessions
CREATE POLICY "analytics_sessions_select_policy" ON analytics_sessions
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND 
        (auth.uid()::text = user_id::text OR user_id IS NULL)
    );

CREATE POLICY "analytics_sessions_insert_policy" ON analytics_sessions
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND 
        (auth.uid()::text = user_id::text OR user_id IS NULL)
    );

CREATE POLICY "analytics_sessions_update_policy" ON analytics_sessions
    FOR UPDATE USING (
        auth.uid() IS NOT NULL AND 
        (auth.uid()::text = user_id::text OR user_id IS NULL)
    );

-- ✅ ÉTAPE 4: CRÉER LES POLITIQUES POUR analytics_page_views
CREATE POLICY "analytics_page_views_select_policy" ON analytics_page_views
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND 
        (auth.uid()::text = user_id::text OR user_id IS NULL)
    );

CREATE POLICY "analytics_page_views_insert_policy" ON analytics_page_views
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND 
        (auth.uid()::text = user_id::text OR user_id IS NULL)
    );

-- ✅ ÉTAPE 5: CRÉER LES POLITIQUES POUR analytics_events
CREATE POLICY "analytics_events_select_policy" ON analytics_events
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND 
        (auth.uid()::text = user_id::text OR user_id IS NULL)
    );

CREATE POLICY "analytics_events_insert_policy" ON analytics_events
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND 
        (auth.uid()::text = user_id::text OR user_id IS NULL)
    );

-- ✅ ÉTAPE 6: CRÉER LES POLITIQUES POUR analytics_signups
CREATE POLICY "analytics_signups_select_policy" ON analytics_signups
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND 
        auth.uid()::text = user_id::text
    );

CREATE POLICY "analytics_signups_insert_policy" ON analytics_signups
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND 
        auth.uid()::text = user_id::text
    );

-- ✅ ÉTAPE 7: CRÉER LES POLITIQUES POUR analytics_logins
CREATE POLICY "analytics_logins_select_policy" ON analytics_logins
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND 
        auth.uid()::text = user_id::text
    );

CREATE POLICY "analytics_logins_insert_policy" ON analytics_logins
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND 
        auth.uid()::text = user_id::text
    );

-- ✅ ÉTAPE 8: CRÉER LES POLITIQUES POUR analytics_conversions
CREATE POLICY "analytics_conversions_select_policy" ON analytics_conversions
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND 
        auth.uid()::text = user_id::text
    );

CREATE POLICY "analytics_conversions_insert_policy" ON analytics_conversions
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND 
        auth.uid()::text = user_id::text
    );

-- ✅ ÉTAPE 9: VÉRIFIER QUE RLS EST ACTIVÉ
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename LIKE 'analytics_%' 
AND schemaname = 'public';

-- ✅ ÉTAPE 10: VÉRIFIER LES POLITIQUES CRÉÉES
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename LIKE 'analytics_%' 
AND schemaname = 'public';

-- 🎯 ALTERNATIVE: POLITIQUES PLUS PERMISSIVES (si les précédentes ne marchent pas)
-- Décommentez ces lignes si vous voulez des politiques plus ouvertes pour les tests

/*
-- Politiques permissives pour les tests
DROP POLICY IF EXISTS "analytics_sessions_select_policy" ON analytics_sessions;
DROP POLICY IF EXISTS "analytics_sessions_insert_policy" ON analytics_sessions;
DROP POLICY IF EXISTS "analytics_sessions_update_policy" ON analytics_sessions;

CREATE POLICY "analytics_sessions_all_policy" ON analytics_sessions
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "analytics_page_views_select_policy" ON analytics_page_views;
DROP POLICY IF EXISTS "analytics_page_views_insert_policy" ON analytics_page_views;

CREATE POLICY "analytics_page_views_all_policy" ON analytics_page_views
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "analytics_events_select_policy" ON analytics_events;
DROP POLICY IF EXISTS "analytics_events_insert_policy" ON analytics_events;

CREATE POLICY "analytics_events_all_policy" ON analytics_events
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "analytics_signups_select_policy" ON analytics_signups;
DROP POLICY IF EXISTS "analytics_signups_insert_policy" ON analytics_signups;

CREATE POLICY "analytics_signups_all_policy" ON analytics_signups
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "analytics_logins_select_policy" ON analytics_logins;
DROP POLICY IF EXISTS "analytics_logins_insert_policy" ON analytics_logins;

CREATE POLICY "analytics_logins_all_policy" ON analytics_logins
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "analytics_conversions_select_policy" ON analytics_conversions;
DROP POLICY IF EXISTS "analytics_conversions_insert_policy" ON analytics_conversions;

CREATE POLICY "analytics_conversions_all_policy" ON analytics_conversions
    FOR ALL USING (true) WITH CHECK (true);
*/
