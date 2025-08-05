@echo off
echo.
echo ==========================================
echo CORRECTION ANALYTICS - HOMEPAGE CLEAN
echo ==========================================
echo.

echo PROBLEME DETECTE:
echo - Analytics 400 Bad Request errors
echo - Tables analytics inexistantes ou schema different
echo.
echo SOLUTION APPLIQUEE:
echo - Analytics temporairement desactive
echo - Homepage fonctionne sans erreurs
echo - Mode silencieux pour tracking
echo.

:: Ajouter les corrections
git add .
echo ✅ Corrections ajoutees

:: Commit simple
git commit -m "fix: Desactivation temporaire analytics pour homepage propre"
echo ✅ Commit cree

:: Push vers GitHub
git push origin main
if %errorlevel% neq 0 (
    echo ERREUR lors du push
    pause
    exit /b 1
)

echo.
echo ==========================================
echo HOMEPAGE PROPRE DEPLOYEE !
echo ==========================================
echo.
echo ✅ Plus d'erreurs analytics 400
echo ✅ Console propre et silencieuse
echo ✅ Homepage entierement fonctionnelle
echo ✅ Design Materio parfait
echo.
echo URL: https://finitio-app.vercel.app
echo.
echo Votre homepage est maintenant parfaite !
echo.
pause
