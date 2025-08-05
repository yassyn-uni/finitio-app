-- 🎯 SCRIPT DE GÉNÉRATION DE DONNÉES DE TEST ANALYTICS - VERSION FINALE CORRIGÉE
-- Exécuter ce script dans Supabase pour avoir des données dans le dashboard

-- ✅ 1. GÉNÉRER DES SESSIONS DE TEST
INSERT INTO analytics_sessions (user_id, session_id, device_info, browser_info, ip_address, user_agent, referrer, utm_source, utm_medium, utm_campaign, created_at)
VALUES 
  (NULL, 'session_test_1', '{"type":"desktop","os":"Windows"}', '{"name":"Chrome","version":"120"}', '192.168.1.1', 'Mozilla/5.0 Chrome/120', 'https://google.com', 'google', 'organic', 'search', NOW() - INTERVAL '1 day'),
  (NULL, 'session_test_2', '{"type":"mobile","os":"iOS"}', '{"name":"Safari","version":"17"}', '192.168.1.2', 'Mozilla/5.0 Safari/17', 'https://facebook.com', 'facebook', 'social', 'post', NOW() - INTERVAL '2 hours'),
  (NULL, 'session_test_3', '{"type":"tablet","os":"Android"}', '{"name":"Chrome","version":"119"}', '192.168.1.3', 'Mozilla/5.0 Chrome/119', 'direct', 'direct', 'direct', 'direct', NOW() - INTERVAL '30 minutes'),
  (NULL, 'session_test_4', '{"type":"desktop","os":"macOS"}', '{"name":"Firefox","version":"121"}', '192.168.1.4', 'Mozilla/5.0 Firefox/121', 'https://linkedin.com', 'linkedin', 'social', 'share', NOW() - INTERVAL '3 hours'),
  (NULL, 'session_test_5', '{"type":"mobile","os":"Android"}', '{"name":"Chrome","version":"120"}', '192.168.1.5', 'Mozilla/5.0 Chrome/120', 'https://twitter.com', 'twitter', 'social', 'tweet', NOW() - INTERVAL '5 hours');

-- ✅ 2. GÉNÉRER DES PAGES VUES DE TEST
INSERT INTO analytics_page_views (user_id, session_id, page_name, page_path, page_title, referrer, time_on_page_seconds, scroll_depth_percent, created_at)
VALUES 
  (NULL, 'session_test_1', 'accueil', '/', 'Accueil - Finitio', 'https://google.com', 45, 85, NOW() - INTERVAL '1 day'),
  (NULL, 'session_test_1', 'inscription', '/inscription', 'Inscription - Finitio', '/', 120, 95, NOW() - INTERVAL '1 day' + INTERVAL '45 seconds'),
  (NULL, 'session_test_2', 'accueil', '/', 'Accueil - Finitio', 'https://facebook.com', 30, 60, NOW() - INTERVAL '2 hours'),
  (NULL, 'session_test_2', 'connexion', '/connexion', 'Connexion - Finitio', '/', 90, 100, NOW() - INTERVAL '2 hours' + INTERVAL '30 seconds'),
  (NULL, 'session_test_3', 'dashboard_client', '/dashboard-client', 'Dashboard Client - Finitio', 'direct', 180, 75, NOW() - INTERVAL '30 minutes'),
  (NULL, 'session_test_4', 'accueil', '/', 'Accueil - Finitio', 'https://linkedin.com', 60, 70, NOW() - INTERVAL '3 hours'),
  (NULL, 'session_test_4', 'projets', '/projets', 'Projets - Finitio', '/', 240, 90, NOW() - INTERVAL '3 hours' + INTERVAL '1 minute'),
  (NULL, 'session_test_5', 'accueil', '/', 'Accueil - Finitio', 'https://twitter.com', 25, 50, NOW() - INTERVAL '5 hours'),
  (NULL, 'session_test_5', 'inscription', '/inscription', 'Inscription - Finitio', '/', 150, 100, NOW() - INTERVAL '5 hours' + INTERVAL '25 seconds');

-- ✅ 3. GÉNÉRER DES ÉVÉNEMENTS DE TEST
INSERT INTO analytics_events (user_id, session_id, event_name, event_category, event_label, event_value, properties, page_path, created_at)
VALUES 
  (NULL, 'session_test_1', 'hero_cta_click', 'engagement', 'cta_primary', 1, '{"cta_type":"primary","cta_text":"Commencer gratuitement","location":"hero_section"}', '/', NOW() - INTERVAL '1 day'),
  (NULL, 'session_test_1', 'navbar_navigation', 'navigation', 'menu_click', 1, '{"nav_item":"inscription","current_page":"/"}', '/', NOW() - INTERVAL '1 day' + INTERVAL '45 seconds'),
  (NULL, 'session_test_2', 'hero_stat_interaction', 'engagement', 'stat_click', 1, '{"stat_name":"Projets réalisés","stat_value":"15K+","interaction_type":"click"}', '/', NOW() - INTERVAL '2 hours'),
  (NULL, 'session_test_2', 'navbar_navigation', 'navigation', 'menu_click', 1, '{"nav_item":"connexion","current_page":"/"}', '/', NOW() - INTERVAL '2 hours' + INTERVAL '30 seconds'),
  (NULL, 'session_test_3', 'dashboard_module_click', 'engagement', 'module_access', 1, '{"module_name":"Mes projets","module_type":"primary"}', '/dashboard-client', NOW() - INTERVAL '30 minutes'),
  (NULL, 'session_test_4', 'hero_cta_click', 'engagement', 'cta_secondary', 1, '{"cta_type":"secondary","cta_text":"Se connecter","location":"hero_section"}', '/', NOW() - INTERVAL '3 hours'),
  (NULL, 'session_test_4', 'navbar_navigation', 'navigation', 'menu_click', 1, '{"nav_item":"projets","current_page":"/"}', '/', NOW() - INTERVAL '3 hours' + INTERVAL '1 minute'),
  (NULL, 'session_test_5', 'hero_cta_click', 'engagement', 'cta_primary', 1, '{"cta_type":"primary","cta_text":"Commencer gratuitement","location":"hero_section"}', '/', NOW() - INTERVAL '5 hours');

-- ✅ 4. GÉNÉRER DES INSCRIPTIONS DE TEST
INSERT INTO analytics_signups (user_id, email, role, nom, signup_method, referrer, utm_source, utm_medium, utm_campaign, metadata, created_at)
VALUES 
  (NULL, 'test1@finitio.com', 'client', 'Test Client 1', 'email_password', 'https://google.com', 'google', 'organic', 'search', '{"source":"hero_cta","device":"desktop"}', NOW() - INTERVAL '1 day'),
  (NULL, 'test2@finitio.com', 'prestataire', 'Test Prestataire 1', 'email_password', 'https://facebook.com', 'facebook', 'social', 'post', '{"source":"navbar_cta","device":"mobile"}', NOW() - INTERVAL '5 hours'),
  (NULL, 'test3@finitio.com', 'architecte', 'Test Architecte 1', 'email_password', 'direct', 'direct', 'direct', 'direct', '{"source":"hero_cta","device":"tablet"}', NOW() - INTERVAL '2 hours');

-- ✅ 5. GÉNÉRER DES CONNEXIONS DE TEST (AVEC LES VRAIES COLONNES)
INSERT INTO analytics_logins (user_id, email, role, nom, login_method, success, failure_reason, metadata, created_at)
VALUES 
  (NULL, 'uniform.outlet@aluxury.ma', 'client', 'Uniform Outlet', 'email_password', true, NULL, '{"source":"login_form","device":"desktop"}', NOW() - INTERVAL '30 minutes'),
  (NULL, 'test1@finitio.com', 'client', 'Test Client 1', 'email_password', true, NULL, '{"source":"login_form","device":"mobile"}', NOW() - INTERVAL '2 hours'),
  (NULL, 'test2@finitio.com', 'prestataire', 'Test Prestataire 1', 'email_password', false, 'Invalid credentials', '{"source":"login_form","device":"desktop"}', NOW() - INTERVAL '3 hours'),
  (NULL, 'test3@finitio.com', 'architecte', 'Test Architecte 1', 'email_password', true, NULL, '{"source":"login_form","device":"tablet"}', NOW() - INTERVAL '1 day');

-- ✅ 6. GÉNÉRER DES CONVERSIONS DE TEST
INSERT INTO analytics_conversions (session_id, conversion_type, conversion_data, value, created_at)
VALUES 
  ('session_test_1', 'signup', '{"role":"client","source":"hero_cta"}', 1, NOW() - INTERVAL '1 day'),
  ('session_test_2', 'login', '{"source":"navbar_cta"}', 1, NOW() - INTERVAL '2 hours'),
  ('session_test_5', 'signup', '{"role":"prestataire","source":"hero_cta"}', 1, NOW() - INTERVAL '5 hours');

-- ✅ 7. CRÉER DES VUES SIMPLIFIÉES POUR LE DASHBOARD
CREATE OR REPLACE VIEW analytics_daily_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT session_id) as sessions,
  COUNT(*) as page_views,
  AVG(time_on_page_seconds) as avg_time_on_page
FROM analytics_page_views 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE OR REPLACE VIEW analytics_conversion_stats AS
SELECT 
  DATE(created_at) as date,
  conversion_type,
  COUNT(*) as conversions,
  SUM(value) as total_value
FROM analytics_conversions 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), conversion_type
ORDER BY date DESC;

CREATE OR REPLACE VIEW analytics_popular_pages AS
SELECT 
  page_name,
  page_path,
  page_title,
  COUNT(*) as views,
  AVG(time_on_page_seconds) as avg_time_on_page,
  AVG(scroll_depth_percent) as avg_scroll_depth
FROM analytics_page_views 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY page_name, page_path, page_title
ORDER BY views DESC;

CREATE OR REPLACE VIEW analytics_device_stats AS
SELECT 
  device_info->>'type' as device_type,
  device_info->>'os' as os,
  COUNT(*) as sessions
FROM analytics_sessions 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY device_info->>'type', device_info->>'os'
ORDER BY sessions DESC;

CREATE OR REPLACE VIEW analytics_traffic_sources AS
SELECT 
  utm_source,
  utm_medium,
  utm_campaign,
  COUNT(*) as sessions,
  COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_sessions 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY utm_source, utm_medium, utm_campaign
ORDER BY sessions DESC;

CREATE OR REPLACE VIEW analytics_event_stats AS
SELECT 
  event_name,
  event_category,
  COUNT(*) as event_count,
  COUNT(DISTINCT session_id) as unique_sessions,
  AVG(event_value) as avg_value
FROM analytics_events 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY event_name, event_category
ORDER BY event_count DESC;

CREATE OR REPLACE VIEW analytics_signup_stats AS
SELECT 
  DATE(created_at) as date,
  role,
  signup_method,
  utm_source,
  COUNT(*) as signups
FROM analytics_signups 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), role, signup_method, utm_source
ORDER BY date DESC, signups DESC;

CREATE OR REPLACE VIEW analytics_login_stats AS
SELECT 
  DATE(created_at) as date,
  role,
  login_method,
  success,
  COUNT(*) as logins,
  COUNT(CASE WHEN success = true THEN 1 END) as successful_logins,
  COUNT(CASE WHEN success = false THEN 1 END) as failed_logins
FROM analytics_logins 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), role, login_method, success
ORDER BY date DESC, logins DESC;

-- ✅ 8. VÉRIFIER LES DONNÉES CRÉÉES
SELECT 'Sessions' as table_name, COUNT(*) as count FROM analytics_sessions
UNION ALL
SELECT 'Page Views' as table_name, COUNT(*) as count FROM analytics_page_views
UNION ALL
SELECT 'Events' as table_name, COUNT(*) as count FROM analytics_events
UNION ALL
SELECT 'Signups' as table_name, COUNT(*) as count FROM analytics_signups
UNION ALL
SELECT 'Logins' as table_name, COUNT(*) as count FROM analytics_logins
UNION ALL
SELECT 'Conversions' as table_name, COUNT(*) as count FROM analytics_conversions;

-- 🎉 DONNÉES DE TEST CRÉÉES AVEC SUCCÈS !
-- Le dashboard analytics devrait maintenant afficher des données réalistes avec :
-- - 5 sessions de test avec appareils variés (desktop, mobile, tablet)
-- - 9 pages vues avec temps de visite (25-240s) et scroll depth (50-100%)
-- - 8 événements trackés avec propriétés détaillées (CTA, navigation, interactions)
-- - 3 inscriptions avec noms, méthodes et métadonnées UTM
-- - 4 connexions avec noms, rôles et statuts (3 succès, 1 échec)
-- - 3 conversions trackées (signup, login)
-- - 8 vues SQL optimisées pour le dashboard analytics

-- 📝 NOTE: Tous les user_id sont NULL pour éviter les contraintes de clés étrangères
-- Cela permet de tester le système analytics sans créer de vrais utilisateurs
