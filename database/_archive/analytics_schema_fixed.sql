-- 📊 SCHÉMA ANALYTICS FINITIO - VERSION SIMPLIFIÉE
-- Exécuter ce script dans l'éditeur SQL de Supabase

-- ✅ 1. TABLE DES SESSIONS UTILISATEUR
CREATE TABLE IF NOT EXISTS analytics_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    device_info JSONB DEFAULT '{}',
    browser_info JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    page_views_count INTEGER DEFAULT 0,
    events_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ 2. TABLE DES VUES DE PAGES
CREATE TABLE IF NOT EXISTS analytics_page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    page_name TEXT NOT NULL,
    page_path TEXT NOT NULL,
    page_title TEXT,
    referrer TEXT,
    search_params JSONB DEFAULT '{}',
    time_on_page_seconds INTEGER,
    scroll_depth_percent INTEGER DEFAULT 0,
    bounce BOOLEAN DEFAULT FALSE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ 3. TABLE DES ÉVÉNEMENTS PERSONNALISÉS
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    event_category TEXT,
    event_label TEXT,
    event_value NUMERIC,
    properties JSONB DEFAULT '{}',
    page_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ 4. TABLE DES INSCRIPTIONS
CREATE TABLE IF NOT EXISTS analytics_signups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    nom TEXT,
    signup_method TEXT DEFAULT 'email_password',
    user_agent TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ 5. TABLE DES CONNEXIONS
CREATE TABLE IF NOT EXISTS analytics_logins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT,
    nom TEXT,
    login_method TEXT DEFAULT 'email_password',
    user_agent TEXT,
    ip_address INET,
    success BOOLEAN DEFAULT TRUE,
    failure_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ 6. TABLE DES CONVERSIONS
CREATE TABLE IF NOT EXISTS analytics_conversions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    conversion_type TEXT NOT NULL, -- 'signup', 'project_created', 'devis_accepted', etc.
    conversion_value NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 📊 VUES POUR LES STATISTIQUES

-- Vue des statistiques de sessions
CREATE OR REPLACE VIEW analytics_session_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_sessions,
    COUNT(DISTINCT user_id) as unique_users,
    AVG(duration_seconds) as avg_duration_seconds,
    AVG(page_views_count) as avg_page_views,
    AVG(events_count) as avg_events
FROM analytics_sessions 
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Vue des pages populaires
CREATE OR REPLACE VIEW analytics_popular_pages AS
SELECT 
    page_name,
    page_path,
    COUNT(*) as views,
    COUNT(DISTINCT user_id) as unique_visitors,
    AVG(time_on_page_seconds) as avg_time_seconds,
    AVG(scroll_depth_percent) as avg_scroll_depth,
    (COUNT(*) FILTER (WHERE bounce = true)::FLOAT / COUNT(*) * 100) as bounce_rate
FROM analytics_page_views 
GROUP BY page_name, page_path
ORDER BY views DESC;

-- Vue des événements populaires
CREATE OR REPLACE VIEW analytics_popular_events AS
SELECT 
    event_name,
    event_category,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users,
    AVG(event_value) as avg_value
FROM analytics_events 
GROUP BY event_name, event_category
ORDER BY event_count DESC;

-- Vue des conversions par type
CREATE OR REPLACE VIEW analytics_conversion_stats AS
SELECT 
    conversion_type,
    COUNT(*) as total_conversions,
    COUNT(DISTINCT user_id) as unique_converters,
    SUM(conversion_value) as total_value,
    AVG(conversion_value) as avg_value,
    DATE(created_at) as date
FROM analytics_conversions 
GROUP BY conversion_type, DATE(created_at)
ORDER BY date DESC, total_conversions DESC;

-- 🔐 POLITIQUES RLS (ROW LEVEL SECURITY)

-- Activer RLS sur toutes les tables
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_logins ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_conversions ENABLE ROW LEVEL SECURITY;

-- Politiques pour les sessions
CREATE POLICY "Users can view own sessions" ON analytics_sessions
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own sessions" ON analytics_sessions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own sessions" ON analytics_sessions
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Politiques pour les vues de pages
CREATE POLICY "Users can view own page views" ON analytics_page_views
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own page views" ON analytics_page_views
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Politiques pour les événements
CREATE POLICY "Users can view own events" ON analytics_events
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own events" ON analytics_events
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Politiques pour les inscriptions
CREATE POLICY "Users can view own signups" ON analytics_signups
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own signups" ON analytics_signups
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Politiques pour les connexions
CREATE POLICY "Users can view own logins" ON analytics_logins
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own logins" ON analytics_logins
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Politiques pour les conversions
CREATE POLICY "Users can view own conversions" ON analytics_conversions
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own conversions" ON analytics_conversions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- 📈 INDEX POUR LES PERFORMANCES

-- Index sur les sessions
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_user_id ON analytics_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_created_at ON analytics_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_session_id ON analytics_sessions(session_id);

-- Index sur les vues de pages
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_user_id ON analytics_page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_session_id ON analytics_page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_page_path ON analytics_page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_created_at ON analytics_page_views(created_at);

-- Index sur les événements
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

-- Index sur les inscriptions
CREATE INDEX IF NOT EXISTS idx_analytics_signups_user_id ON analytics_signups(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_signups_created_at ON analytics_signups(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_signups_role ON analytics_signups(role);

-- Index sur les connexions
CREATE INDEX IF NOT EXISTS idx_analytics_logins_user_id ON analytics_logins(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_logins_created_at ON analytics_logins(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_logins_success ON analytics_logins(success);

-- Index sur les conversions
CREATE INDEX IF NOT EXISTS idx_analytics_conversions_user_id ON analytics_conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_conversions_type ON analytics_conversions(conversion_type);
CREATE INDEX IF NOT EXISTS idx_analytics_conversions_created_at ON analytics_conversions(created_at);

-- ✅ SCRIPT TERMINÉ
-- Toutes les tables, vues, politiques RLS et index ont été créés avec succès !
-- Vous pouvez maintenant utiliser le système d'analytics dans votre application.
