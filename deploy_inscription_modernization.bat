@echo off
echo ========================================
echo   DEPLOIEMENT - MODERNISATION INSCRIPTION
echo ========================================
echo.

echo Ajout des fichiers modifies au staging...
git add .

echo.
echo Statut des modifications:
git status --porcelain

echo.
echo Commit des ameliorations...
git commit -m "Modernisation complete page inscription: formulaire multi-etapes, validation temps reel, design glassmorphism, securite renforcee"

if %ERRORLEVEL% neq 0 (
    echo Erreur lors du commit
    pause
    exit /b 1
)

echo.
echo Push vers le repository distant...
git push origin main

if %ERRORLEVEL% neq 0 (
    echo Erreur lors du push
    pause
    exit /b 1
)

echo.
echo DEPLOIEMENT REUSSI!
echo.
echo RECAPITULATIF DES AMELIORATIONS:
echo - Formulaire multi-etapes avec validation temps reel
echo - Design glassmorphism avec particules animees  
echo - Indicateur force mot de passe et securite renforcee
echo - Selection role interactive avec cartes visuelles
echo - Champs etendus: prenom, telephone, ville
echo - Navigation fluide entre etapes avec progression
echo - UX moderne avec animations et etats visuels
echo.
echo La page inscription modernisee sera disponible sur:
echo https://finitio-app.vercel.app/inscription
echo.
echo Vercel va automatiquement redeployer l'application...
echo Temps estime: 2-3 minutes
echo.

pause
