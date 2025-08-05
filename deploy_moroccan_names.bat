@echo off
chcp 65001 >nul
cls

echo 🇲🇦 ==========================================
echo 🚀 DÉPLOIEMENT TÉMOIGNAGES MAROCAINS
echo 🇲🇦 ==========================================
echo.

REM Vérifier si on est dans le bon répertoire
if not exist "package.json" (
    echo ❌ Erreur: package.json non trouvé. Exécutez ce script depuis la racine du projet.
    pause
    exit /b 1
)

echo 📋 Vérification des fichiers modifiés...
echo.

REM Vérifier les fichiers modifiés
echo ✅ Pourquoi.jsx - Témoignages mis à jour
if exist "src\components\Pourquoi.jsx" (
    echo    📄 src\components\Pourquoi.jsx
) else (
    echo ❌ Fichier manquant: src\components\Pourquoi.jsx
)

echo ✅ ValidationDevis.jsx - Nom client mis à jour
if exist "src\pages\ValidationDevis.jsx" (
    echo    📄 src\pages\ValidationDevis.jsx
) else (
    echo ❌ Fichier manquant: src\pages\ValidationDevis.jsx
)

echo.
echo 📝 Modifications apportées:
echo    🔄 Marie Dubois → Aicha Benali
echo    🔄 Pierre Martin → Youssef Alami  
echo    🔄 Sophie Leroy → Fatima Zahra Tazi
echo.

echo 🔄 Ajout des fichiers au staging Git...
git add src/components/Pourquoi.jsx
git add src/pages/ValidationDevis.jsx

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors de l'ajout des fichiers
    pause
    exit /b 1
)

echo ✅ Fichiers ajoutés au staging
echo.

echo 💾 Création du commit...
git commit -m "🇲🇦 Mise à jour témoignages avec noms marocains

✨ Modifications:
- Aicha Benali (Cliente) 
- Youssef Alami (Prestataire)
- Fatima Zahra Tazi (Architecte)

🎯 Améliore la localisation pour le marché marocain"

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors du commit
    pause
    exit /b 1
)

echo ✅ Commit créé avec succès
echo.

echo 🚀 Push vers GitHub...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo 🎉 ==========================================
    echo ✅ DÉPLOIEMENT RÉUSSI !
    echo 🎉 ==========================================
    echo.
    echo 🌐 L'application sera mise à jour automatiquement sur Vercel
    echo 📱 URL: https://finitio-app.vercel.app
    echo.
    echo 🇲🇦 Témoignages maintenant avec noms marocains:
    echo    👤 Aicha Benali - Cliente
    echo    👷 Youssef Alami - Prestataire  
    echo    👩‍💼 Fatima Zahra Tazi - Architecte
    echo.
    echo 🕐 Délai de déploiement Vercel: ~2-3 minutes
    echo.
) else (
    echo ❌ ==========================================
    echo ❌ ERREUR DE DÉPLOIEMENT
    echo ❌ ==========================================
    echo.
    echo 🔍 Vérifiez votre connexion internet
    echo 🔍 Vérifiez vos permissions GitHub
    echo.
)

echo 📋 Statut Git final:
git status --short

echo.
echo 🏁 Script terminé. Appuyez sur une touche pour fermer...
pause >nul
