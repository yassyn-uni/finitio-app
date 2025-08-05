@echo off
echo ========================================
echo DEPLOIEMENT COULEURS HARMONISEES
echo ========================================
echo.

echo Ajout de tous les fichiers modifies...
git add .

echo.
echo Creation du commit...
git commit -m "Harmonisation complete de la palette de couleurs - CTA et Fonctionnalites mis a jour avec orange premium"

echo.
echo Push vers GitHub...
git push origin main

echo.
echo DEPLOIEMENT TERMINE !
echo Votre site sera mis a jour dans quelques minutes sur:
echo https://finitio-app.vercel.app
echo.

pause
