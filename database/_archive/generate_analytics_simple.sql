-- 🎯 SCRIPT ANALYTICS SIMPLE - DONNÉES DE TEST BASIQUES
-- Exécuter ce script dans Supabase pour avoir des données dans le dashboard

-- ✅ 1. SESSIONS SIMPLES
INSERT INTO analytics_sessions (session_id, device_info, utm_source, created_at)
VALUES 
  ('session_1', '{"type":"desktop"}', 'google', NOW() - INTERVAL '1 day'),
  ('session_2', '{"type":"mobile"}', 'facebook', NOW() - INTERVAL '2 hours'),
  ('session_3', '{"type":"tablet"}', 'direct', NOW() - INTERVAL '1 hour');

-- ✅ 2. PAGES VUES SIMPLES
INSERT INTO analytics_page_views (session_id, page_name, page_path, page_title, created_at)
VALUES 
  ('session_1', 'accueil', '/', 'Accueil - Finitio', NOW() - INTERVAL '1 day'),
  ('session_1', 'inscription', '/inscription', 'Inscription - Finitio', NOW() - INTERVAL '1 day' + INTERVAL '1 minute'),
  ('session_2', 'accueil', '/', 'Accueil - Finitio', NOW() - INTERVAL '2 hours'),
  ('session_2', 'connexion', '/connexion', 'Connexion - Finitio', NOW() - INTERVAL '2 hours' + INTERVAL '30 seconds'),
  ('session_3', 'dashboard', '/dashboard-client', 'Dashboard - Finitio', NOW() - INTERVAL '1 hour');

-- ✅ 3. ÉVÉNEMENTS SIMPLES
INSERT INTO analytics_events (session_id, event_name, created_at)
VALUES 
  ('session_1', 'hero_cta_click', NOW() - INTERVAL '1 day'),
  ('session_1', 'navbar_click', NOW() - INTERVAL '1 day' + INTERVAL '1 minute'),
  ('session_2', 'hero_view', NOW() - INTERVAL '2 hours'),
  ('session_3', 'dashboard_view', NOW() - INTERVAL '1 hour');

-- ✅ 4. INSCRIPTIONS SIMPLES
INSERT INTO analytics_signups (email, role, created_at)
VALUES 
  ('test1@finitio.com', 'client', NOW() - INTERVAL '1 day'),
  ('test2@finitio.com', 'prestataire', NOW() - INTERVAL '2 hours'),
  ('test3@finitio.com', 'architecte', NOW() - INTERVAL '1 hour');

-- ✅ 5. CONNEXIONS SIMPLES
INSERT INTO analytics_logins (email, success, created_at)
VALUES 
  ('uniform.outlet@aluxury.ma', true, NOW() - INTERVAL '30 minutes'),
  ('test1@finitio.com', true, NOW() - INTERVAL '1 hour'),
  ('test2@finitio.com', false, NOW() - INTERVAL '2 hours');

-- ✅ 6. VUES SIMPLES POUR LE DASHBOARD
CREATE OR REPLACE VIEW analytics_simple_stats AS
SELECT 
  'Sessions' as metric,
  COUNT(*) as value
FROM analytics_sessions
UNION ALL
SELECT 
  'Page Views' as metric,
  COUNT(*) as value
FROM analytics_page_views
UNION ALL
SELECT 
  'Events' as metric,
  COUNT(*) as value
FROM analytics_events
UNION ALL
SELECT 
  'Signups' as metric,
  COUNT(*) as value
FROM analytics_signups
UNION ALL
SELECT 
  'Logins' as metric,
  COUNT(*) as value
FROM analytics_logins;

-- ✅ 7. VÉRIFICATION
SELECT * FROM analytics_simple_stats;

-- 🎉 DONNÉES SIMPLES CRÉÉES !
-- Le dashboard devrait maintenant afficher :
-- - 3 sessions
-- - 5 pages vues
-- - 4 événements
-- - 3 inscriptions
-- - 3 connexions
