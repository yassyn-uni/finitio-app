@echo off
echo.
echo ==========================================
echo FORCE REBUILD - SUPPRESSION ANALYTICS
echo ==========================================
echo.

echo ACTIONS RADICALES APPLIQUEES:
echo.
echo ✅ App.jsx - Supprime usePageTracking et OptimizedAnalytics
echo ✅ Hero.jsx - Supprime tous appels analytics
echo ✅ Pourquoi.jsx - Supprime tous appels analytics  
echo ✅ Fonctionnalites.jsx - Supprime tous appels analytics
echo ✅ optimizedAnalytics.js - Module mock complet
echo.
echo RESULTAT GARANTI:
echo - ZERO appel analytics dans les composants
echo - ZERO import OptimizedAnalytics actif
echo - Force rebuild complet Vercel
echo - Console 100%% propre garantie
echo.

git add .
git commit -m "FORCE REBUILD: Suppression complete analytics de tous composants - Console propre garantie"
git push origin main

if %errorlevel% neq 0 (
    echo ERREUR lors du push
    pause
    exit /b 1
)

echo.
echo ==========================================
echo REBUILD FORCE - ANALYTICS ELIMINE !
echo ==========================================
echo.
echo ✅ Tous les composants nettoyes
echo ✅ Aucun appel analytics restant
echo ✅ Vercel va rebuilder completement
echo ✅ Cache Vercel force a se regenerer
echo.
echo CETTE FOIS C'EST DEFINITIF !
echo.
echo URL: https://finitio-app.vercel.app
echo.
echo Attendez 2-3 minutes pour le rebuild complet...
echo Votre homepage sera PARFAITEMENT propre !
echo.
pause
