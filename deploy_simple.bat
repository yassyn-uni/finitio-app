@echo off
chcp 65001 >nul
echo.
echo ========================================
echo DEPLOIEMENT FINAL FINITIO - CORRECTIONS
echo ========================================
echo.

:: Vérifier que nous sommes dans le bon répertoire
if not exist "package.json" (
    echo ERREUR: package.json non trouve
    echo Assurez-vous d'etre dans le repertoire finitio-frontend
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
echo ========================================
echo DEPLOIEMENT REUSSI !
echo ========================================
echo.
echo PROCHAINES ETAPES:
echo.
echo 1. EXECUTER LE SCRIPT ANALYTICS:
echo    - Ouvrir Supabase Dashboard
echo    - Aller dans SQL Editor
echo    - Copier-coller database\generate_analytics_simple.sql
echo    - Cliquer sur Run
echo.
echo 2. VERIFIER LE DEPLOIEMENT:
echo    - Aller sur https://finitio-app.vercel.app
echo    - Tester les nouvelles fonctionnalites
echo    - Verifier le dashboard analytics
echo.
echo 3. TESTS A EFFECTUER:
echo    - Inscription/Connexion avec notifications
echo    - Pages GestionEtapes et ProjetsDisponibles
echo    - Systeme de validation des formulaires
echo    - Dashboard analytics avec donnees
echo.
echo L'application Finitio est maintenant ULTRA-ROBUSTE !
echo.
pause
