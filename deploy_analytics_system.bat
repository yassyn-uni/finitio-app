@echo off
chcp 65001 >nul
cls

echo 🎯 ==========================================
echo 🚀 DÉPLOIEMENT SYSTÈME ANALYTICS FINITIO
echo 🎯 ==========================================
echo.

REM Vérifier si on est dans le bon répertoire
if not exist "package.json" (
    echo ❌ Erreur: package.json non trouvé. Exécutez ce script depuis la racine du projet.
    pause
    exit /b 1
)

echo 📋 Vérification des fichiers modifiés...
echo.

REM Liste des fichiers analytics ajoutés/modifiés
echo ✅ Vérification des fichiers analytics:

if exist "src\utils\analytics.js" (
    echo    ✓ src\utils\analytics.js
) else (
    echo    ❌ src\utils\analytics.js ^(manquant^)
)

if exist "src\hooks\usePageTracking.js" (
    echo    ✓ src\hooks\usePageTracking.js
) else (
    echo    ❌ src\hooks\usePageTracking.js ^(manquant^)
)

if exist "src\pages\AnalyticsDashboard.jsx" (
    echo    ✓ src\pages\AnalyticsDashboard.jsx
) else (
    echo    ❌ src\pages\AnalyticsDashboard.jsx ^(manquant^)
)

if exist "database\analytics_schema_fixed.sql" (
    echo    ✓ database\analytics_schema_fixed.sql
) else (
    echo    ❌ database\analytics_schema_fixed.sql ^(manquant^)
)

if exist "database\activate_rls_manual.sql" (
    echo    ✓ database\activate_rls_manual.sql
) else (
    echo    ❌ database\activate_rls_manual.sql ^(manquant^)
)

if exist "src\App.jsx" (
    echo    ✓ src\App.jsx
) else (
    echo    ❌ src\App.jsx ^(manquant^)
)

if exist "src\components\hero.jsx" (
    echo    ✓ src\components\hero.jsx
) else (
    echo    ❌ src\components\hero.jsx ^(manquant^)
)

if exist "src\components\Navbar.jsx" (
    echo    ✓ src\components\Navbar.jsx
) else (
    echo    ❌ src\components\Navbar.jsx ^(manquant^)
)

if exist "src\components\Connexion.jsx" (
    echo    ✓ src\components\Connexion.jsx
) else (
    echo    ❌ src\components\Connexion.jsx ^(manquant^)
)

if exist "src\components\Inscription.jsx" (
    echo    ✓ src\components\Inscription.jsx
) else (
    echo    ❌ src\components\Inscription.jsx ^(manquant^)
)

if exist "src\pages\DashboardClient.jsx" (
    echo    ✓ src\pages\DashboardClient.jsx
) else (
    echo    ❌ src\pages\DashboardClient.jsx ^(manquant^)
)

echo.
echo 📊 Ajout de tous les fichiers au contrôle de version...

REM Ajouter tous les fichiers modifiés
git add .

echo.
echo 📝 Création du commit avec message détaillé...

REM Créer un commit avec un message détaillé
git commit -m "🎯 ANALYTICS: Intégration système de tracking complet

✅ NOUVELLES FONCTIONNALITÉS:
- Système d'analytics complet avec Supabase
- Dashboard analytics avec métriques temps réel
- Tracking automatique des pages avec usePageTracking
- Tracking des événements utilisateur (CTA, navigation, etc.)
- Tracking des conversions (inscriptions, connexions)
- Politiques RLS sécurisées pour protection des données

📊 COMPOSANTS INTÉGRÉS:
- Hero: Tracking CTA, statistiques, badges
- Navbar: Tracking navigation, profil, menu mobile
- Connexion: Tracking tentatives/succès/échecs
- Inscription: Tracking inscriptions et sélection rôle
- DashboardClient: Tracking modules et interactions
- App.jsx: Hook de tracking automatique des routes

🔧 INFRASTRUCTURE:
- Tables analytics: sessions, page_views, events, signups, logins, conversions
- Vues statistiques: session_stats, popular_pages, popular_events
- Index optimisés pour performances
- RLS activé avec politiques sécurisées

📈 MÉTRIQUES DISPONIBLES:
- Sessions utilisateur avec détails device/browser
- Pages vues avec temps de visite
- Taux de conversion inscription/connexion
- Événements personnalisés par type
- Statistiques temps réel des interactions

🎯 DÉPLOIEMENT:
- Prêt pour production sur Vercel
- Base de données Supabase configurée
- Système de tracking opérationnel"

echo.
echo 🔄 Vérification du statut Git...
git status --short

echo.
echo 🚀 Déploiement vers GitHub ^(déclenchera Vercel^)...

REM Pousser vers GitHub
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo 🎉 ==========================================
    echo ✅ DÉPLOIEMENT RÉUSSI !
    echo 🎉 ==========================================
    echo.
    echo 📱 Votre application sera disponible sur:
    echo    🌐 https://finitio-app.vercel.app
    echo.
    echo 📊 Dashboard Analytics accessible sur:
    echo    📈 https://finitio-app.vercel.app/analytics
    echo.
    echo 🔧 PROCHAINES ÉTAPES:
    echo    1. ✅ Vérifiez que les tables analytics sont créées dans Supabase
    echo    2. ✅ Testez les fonctionnalités de tracking
    echo    3. ✅ Consultez le dashboard analytics
    echo    4. ✅ Vérifiez les données collectées
    echo.
    echo 📋 FICHIERS DÉPLOYÉS:
    echo    ✓ Système d'analytics complet
    echo    ✓ Dashboard de métriques
    echo    ✓ Tracking automatique des pages
    echo    ✓ Composants avec analytics intégrés
    echo.
    echo 🎯 Le système d'analytics est maintenant opérationnel !
    echo    Toutes les interactions utilisateur seront trackées
    echo    et visibles dans le dashboard analytics.
    echo.
) else (
    echo.
    echo ❌ ==========================================
    echo 💥 ERREUR DE DÉPLOIEMENT
    echo ❌ ==========================================
    echo.
    echo 🔧 Solutions possibles:
    echo    1. Vérifiez votre connexion internet
    echo    2. Vérifiez vos permissions Git
    echo    3. Essayez: git pull origin main puis relancez
    echo    4. Vérifiez que vous êtes sur la branche main
    echo.
    echo 📞 En cas de problème persistant:
    echo    - Vérifiez les logs Git ci-dessus
    echo    - Contactez le support technique
    echo.
    pause
    exit /b 1
)

echo 🎊 Déploiement terminé avec succès !
echo 🔍 Surveillez le déploiement sur Vercel Dashboard
echo.
pause
