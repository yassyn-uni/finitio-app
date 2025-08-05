@echo off
chcp 65001 >nul
echo.
echo ==========================================
echo DEPLOIEMENT HERO MATERIO - FINITIO
echo ==========================================
echo.

:: Vérifier que nous sommes dans le bon répertoire
if not exist "package.json" (
    echo ERREUR: package.json non trouve
    echo Assurez-vous d'etre dans le repertoire finitio-frontend
    pause
    exit /b 1
)

echo Verification des fichiers modifies...
echo.

:: Vérifier les fichiers critiques
if not exist "src\components\hero.jsx" (
    echo ERREUR: hero.jsx non trouve
    pause
    exit /b 1
)

if not exist "src\styles\materioTheme.css" (
    echo ERREUR: materioTheme.css non trouve
    pause
    exit /b 1
)

echo ✅ Fichiers Hero et Theme Materio detectes
echo.

:: Ajouter tous les fichiers modifiés
echo Ajout des fichiers au repository Git...
git add .
if %errorlevel% neq 0 (
    echo ERREUR lors de l'ajout des fichiers
    pause
    exit /b 1
)

echo ✅ Fichiers ajoutes au staging
echo.

:: Commit avec message descriptif
echo Creation du commit...
git commit -m "feat: Refonte complete Hero section avec theme Materio MUI

- Nouveau design Hero avec slides dynamiques et animations
- Theme Materio CSS etendu avec 500+ lignes de styles
- Composants visuels modernes: badges, gradients, progress bars
- Preview dashboard interactif avec equipe projet
- Cartes flottantes avec notifications temps reel
- Responsive design optimise mobile/tablet/desktop
- Accessibility avec prefers-reduced-motion
- Analytics tracking integre avec OptimizedAnalytics
- Animations avancees: float, gradient-shift, pulse-glow

Ready for production deployment"

if %errorlevel% neq 0 (
    echo ERREUR lors du commit
    pause
    exit /b 1
)

echo ✅ Commit cree avec succes
echo.

:: Push vers GitHub
echo Push vers GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ERREUR lors du push
    echo Verifiez votre connexion et vos droits GitHub
    pause
    exit /b 1
)

echo ✅ Push reussi vers GitHub
echo.

echo ==========================================
echo DEPLOIEMENT HERO MATERIO REUSSI !
echo ==========================================
echo.
echo 🎨 NOUVELLES FONCTIONNALITES DEPLOYEES:
echo.
echo ✅ Hero Section Materio MUI
echo    - 3 slides avec rotation automatique
echo    - Animations fluides et modernes
echo    - Preview dashboard interactif
echo    - Responsive design optimise
echo.
echo ✅ Theme CSS Etendu
echo    - 500+ lignes de styles Materio
echo    - Composants specialises
echo    - Animations avancees
echo    - Accessibility support
echo.
echo 🚀 VERIFICATION EN PRODUCTION:
echo.
echo 1. Ouvrir: https://finitio-app.vercel.app
echo 2. Verifier le nouveau Hero section
echo 3. Tester les animations et slides
echo 4. Confirmer le responsive design
echo 5. Valider l'experience utilisateur
echo.
echo 📊 PROCHAINES ETAPES:
echo.
echo 1. Tester toutes les fonctionnalites
echo 2. Continuer la refonte des autres sections
echo 3. Optimiser les performances
echo 4. Collecter les retours utilisateurs
echo.
echo L'application Finitio est maintenant ULTRA-MODERNE !
echo.
pause
