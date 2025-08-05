-- 📊 SCHÉMA BASE DE DONNÉES ANALYTICS FINITIO
-- ============================================

-- 🔐 Activer RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- 📈 Table des sessions utilisateur
CREATE TABLE IF NOT EXISTS analytics_sessions (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    total_duration INTEGER, -- en millisecondes
    user_agent TEXT,
    screen_resolution VARCHAR(50),
    viewport_size VARCHAR(50),
    referrer TEXT,
    landing_page VARCHAR(255),
    last_page VARCHAR(255),
    device_type VARCHAR(20), -- mobile, tablet, desktop
    browser VARCHAR(50),
    os VARCHAR(50),
    is_mobile BOOLEAN DEFAULT FALSE,
    timezone VARCHAR(100),
    language VARCHAR(10),
    pages_visited INTEGER DEFAULT 0,
    events_triggered INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 📄 Table des vues de pages
CREATE TABLE IF NOT EXISTS analytics_page_views (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    page_path VARCHAR(255) NOT NULL,
    page_title VARCHAR(255),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    time_on_previous_page INTEGER, -- temps passé sur la page précédente en ms
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 🎯 Table des événements personnalisés
CREATE TABLE IF NOT EXISTS analytics_events (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_name VARCHAR(100) NOT NULL,
    event_data JSONB,
    page_path VARCHAR(255),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 👤 Table des inscriptions
CREATE TABLE IF NOT EXISTS analytics_signups (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50),
    signup_method VARCHAR(50) DEFAULT 'email',
    referrer TEXT,
    landing_page VARCHAR(255),
    pages_visited INTEGER DEFAULT 0,
    time_to_signup INTEGER, -- temps avant inscription en ms
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 🔐 Table des connexions
CREATE TABLE IF NOT EXISTS analytics_logins (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    login_method VARCHAR(50) DEFAULT 'email',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 💼 Table des conversions business
CREATE TABLE IF NOT EXISTS analytics_conversions (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    conversion_type VARCHAR(100) NOT NULL, -- signup, project_created, payment, etc.
    conversion_data JSONB,
    page_path VARCHAR(255),
    time_to_conversion INTEGER, -- temps avant conversion en ms
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 📊 Vue pour les statistiques quotidiennes
CREATE OR REPLACE VIEW analytics_daily_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) as total_page_views,
    AVG(time_on_previous_page) as avg_time_on_page
FROM analytics_page_views 
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- 📈 Vue pour les statistiques de conversion
CREATE OR REPLACE VIEW analytics_conversion_stats AS
SELECT 
    DATE(s.created_at) as date,
    COUNT(DISTINCT s.session_id) as total_sessions,
    COUNT(DISTINCT su.session_id) as signups,
    ROUND(
        (COUNT(DISTINCT su.session_id)::DECIMAL / COUNT(DISTINCT s.session_id)) * 100, 
        2
    ) as conversion_rate
FROM analytics_sessions s
LEFT JOIN analytics_signups su ON s.session_id = su.session_id
GROUP BY DATE(s.created_at)
ORDER BY date DESC;

-- 🎯 Vue pour les pages les plus visitées
CREATE OR REPLACE VIEW analytics_popular_pages AS
SELECT 
    page_path,
    page_title,
    COUNT(*) as views,
    COUNT(DISTINCT session_id) as unique_sessions,
    AVG(time_on_previous_page) as avg_time_on_page
FROM analytics_page_views 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY page_path, page_title
ORDER BY views DESC;

-- 📱 Vue pour les statistiques par appareil
CREATE OR REPLACE VIEW analytics_device_stats AS
SELECT 
    device_type,
    browser,
    os,
    COUNT(DISTINCT session_id) as sessions,
    COUNT(DISTINCT user_id) as unique_users,
    AVG(total_duration) as avg_session_duration
FROM analytics_sessions 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY device_type, browser, os
ORDER BY sessions DESC;

-- 🔍 Vue pour les sources de trafic
CREATE OR REPLACE VIEW analytics_traffic_sources AS
SELECT 
    CASE 
        WHEN referrer = '' OR referrer IS NULL THEN 'Direct'
        WHEN referrer LIKE '%google%' THEN 'Google'
        WHEN referrer LIKE '%facebook%' THEN 'Facebook'
        WHEN referrer LIKE '%linkedin%' THEN 'LinkedIn'
        ELSE 'Other'
    END as source,
    COUNT(DISTINCT session_id) as sessions,
    COUNT(DISTINCT user_id) as unique_users
FROM analytics_sessions 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY source
ORDER BY sessions DESC;

-- 🎯 Vue pour les événements les plus fréquents
CREATE OR REPLACE VIEW analytics_top_events AS
SELECT 
    event_name,
    COUNT(*) as event_count,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(DISTINCT user_id) as unique_users
FROM analytics_events 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY event_name
ORDER BY event_count DESC;

-- 🔒 Configuration RLS (Row Level Security)

-- Sessions : utilisateurs peuvent voir leurs propres sessions
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sessions" ON analytics_sessions
    FOR SELECT USING (auth.uid() = user_id);

-- Page views : utilisateurs peuvent voir leurs propres vues
ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own page views" ON analytics_page_views
    FOR SELECT USING (auth.uid() = user_id);

-- Events : utilisateurs peuvent voir leurs propres événements
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own events" ON analytics_events
    FOR SELECT USING (auth.uid() = user_id);

-- Signups : utilisateurs peuvent voir leur propre inscription
ALTER TABLE analytics_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own signup" ON analytics_signups
    FOR SELECT USING (auth.uid() = user_id);

-- Logins : utilisateurs peuvent voir leurs propres connexions
ALTER TABLE analytics_logins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own logins" ON analytics_logins
    FOR SELECT USING (auth.uid() = user_id);

-- Conversions : utilisateurs peuvent voir leurs propres conversions
ALTER TABLE analytics_conversions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own conversions" ON analytics_conversions
    FOR SELECT USING (auth.uid() = user_id);

-- 🔧 Politique d'insertion pour le système analytics
CREATE POLICY "Allow analytics inserts" ON analytics_sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow analytics inserts" ON analytics_page_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow analytics inserts" ON analytics_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow analytics inserts" ON analytics_signups
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow analytics inserts" ON analytics_logins
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow analytics inserts" ON analytics_conversions
    FOR INSERT WITH CHECK (true);

-- 📊 Index pour optimiser les performances
CREATE INDEX idx_analytics_sessions_user_id ON analytics_sessions(user_id);
CREATE INDEX idx_analytics_sessions_created_at ON analytics_sessions(created_at);
CREATE INDEX idx_analytics_sessions_device_type ON analytics_sessions(device_type);

CREATE INDEX idx_analytics_page_views_session_id ON analytics_page_views(session_id);
CREATE INDEX idx_analytics_page_views_page_path ON analytics_page_views(page_path);
CREATE INDEX idx_analytics_page_views_created_at ON analytics_page_views(created_at);

CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

CREATE INDEX idx_analytics_signups_created_at ON analytics_signups(created_at);
CREATE INDEX idx_analytics_logins_created_at ON analytics_logins(created_at);
CREATE INDEX idx_analytics_conversions_created_at ON analytics_conversions(created_at);

-- 🧹 Fonction de nettoyage automatique (optionnel)
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void AS $$
BEGIN
    -- Supprimer les données de plus de 2 ans
    DELETE FROM analytics_sessions WHERE created_at < NOW() - INTERVAL '2 years';
    DELETE FROM analytics_page_views WHERE created_at < NOW() - INTERVAL '2 years';
    DELETE FROM analytics_events WHERE created_at < NOW() - INTERVAL '2 years';
    DELETE FROM analytics_signups WHERE created_at < NOW() - INTERVAL '2 years';
    DELETE FROM analytics_logins WHERE created_at < NOW() - INTERVAL '2 years';
    DELETE FROM analytics_conversions WHERE created_at < NOW() - INTERVAL '2 years';
END;
$$ LANGUAGE plpgsql;

-- 📅 Programmer le nettoyage automatique (à configurer avec pg_cron si disponible)
-- SELECT cron.schedule('cleanup-analytics', '0 2 * * 0', 'SELECT cleanup_old_analytics();');
