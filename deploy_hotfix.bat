@echo off
chcp 65001 >nul
echo.
echo ==========================================
echo HOTFIX DEPLOIEMENT - CORRECTION ERREURS
echo ==========================================
echo.

:: Vérifier que nous sommes dans le bon répertoire
if not exist "package.json" (
    echo ERREUR: package.json non trouve
    pause
    exit /b 1
)

echo 🔧 CORRECTION DES ERREURS DE BUILD:
echo.
echo ✅ CSS: Import fonts avant Tailwind
echo ✅ App.jsx: Suppression UserContext inexistant
echo.

:: Ajouter tous les fichiers modifiés
echo Ajout des corrections...
git add .
if %errorlevel% neq 0 (
    echo ERREUR lors de l'ajout des fichiers
    pause
    exit /b 1
)

:: Commit hotfix
echo Creation du commit hotfix...
git commit -m "hotfix: Correction erreurs build CSS et imports

- Fix: Import fonts avant directives Tailwind dans index.css
- Fix: Suppression import UserContext inexistant dans App.jsx
- Ready for production deployment"

if %errorlevel% neq 0 (
    echo ERREUR lors du commit
    pause
    exit /b 1
)

:: Push vers GitHub
echo Push hotfix vers GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ERREUR lors du push
    pause
    exit /b 1
)

echo.
echo ==========================================
echo HOTFIX DEPLOYE AVEC SUCCES !
echo ==========================================
echo.
echo 🚀 CORRECTIONS APPLIQUEES:
echo ✅ Erreur CSS PostCSS resolue
echo ✅ Erreur module UserContext resolue
echo ✅ Build Vercel devrait maintenant reussir
echo.
echo 🔍 VERIFICATION:
echo 1. Attendre le deploiement Vercel (2-3 min)
echo 2. Verifier https://finitio-app.vercel.app
echo 3. Confirmer que le Hero Materio s'affiche
echo.
pause
