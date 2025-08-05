@echo off
chcp 65001 >nul
echo.
echo ==========================================
echo PUSH CHANGEMENTS HOMEPAGE VERS GITHUB
echo ==========================================
echo.

:: Vérifier que nous sommes dans le bon répertoire
if not exist "package.json" (
    echo ERREUR: package.json non trouve
    pause
    exit /b 1
)

echo Les changements homepage sont deja commites localement
echo Branch: main (1 commit en avance sur origin/main)
echo.

:: Vérifier le statut Git
echo Verification du statut Git...
git status --porcelain
if %errorlevel% neq 0 (
    echo ERREUR lors de la verification Git
    pause
    exit /b 1
)

echo.
echo Push vers GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ERREUR lors du push
    echo Verifiez votre connexion et vos droits GitHub
    pause
    exit /b 1
)

echo.
echo ==========================================
echo PUSH REUSSI VERS GITHUB !
echo ==========================================
echo.
echo HOMEPAGE MATERIO DEPLOYEE:
echo.
echo - Hero Section avec slides dynamiques
echo - Section Pourquoi avec tabs interactifs
echo - Section Fonctionnalites modernisee
echo - Theme Materio CSS etendu
echo - Analytics tracking integre
echo.
echo VERIFICATION EN COURS:
echo 1. Vercel detecte automatiquement le push
echo 2. Build en cours (2-3 minutes)
echo 3. Deploiement automatique
echo.
echo URL: https://finitio-app.vercel.app
echo.
echo Votre nouvelle homepage sera bientot live !
echo.
pause
