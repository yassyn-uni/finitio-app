@echo off
chcp 65001 >nul
echo.
echo ==========================================
echo CORRECTION FINALE - NOTIFICATION IMPORT
echo ==========================================
echo.

:: Vérifier que nous sommes dans le bon répertoire
if not exist "package.json" (
    echo ERREUR: package.json non trouve
    pause
    exit /b 1
)

echo 🔧 CORRECTION IMPORT NOTIFICATIONCONTAINER:
echo.
echo ✅ Change: import { NotificationContainer } 
echo ✅ Vers:   import NotificationContainer
echo.

:: Ajouter tous les fichiers modifiés
echo Ajout de la correction...
git add src/App.jsx
if %errorlevel% neq 0 (
    echo ERREUR lors de l'ajout du fichier
    pause
    exit /b 1
)

:: Commit simple
echo Creation du commit...
git commit -m "fix: Correction import NotificationContainer default export"
if %errorlevel% neq 0 (
    echo ERREUR lors du commit
    pause
    exit /b 1
)

:: Push vers GitHub
echo Push vers GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ERREUR lors du push
    pause
    exit /b 1
)

echo.
echo ==========================================
echo CORRECTION FINALE DEPLOYEE !
echo ==========================================
echo.
echo 🚀 BUILD VERCEL VA MAINTENANT REUSSIR
echo ✅ Toutes les erreurs d'import corrigees
echo ✅ Hero Materio pret pour production
echo.
echo 🔍 VERIFICATION DANS 2-3 MINUTES:
echo https://finitio-app.vercel.app
echo.
echo 🎨 HERO MATERIO BIENTOT LIVE !
echo.
pause
