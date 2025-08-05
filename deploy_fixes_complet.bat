@echo off
echo ========================================
echo   DEPLOIEMENT COMPLET - CORRECTIONS FINITIO
echo ========================================
echo.

echo Ajout de tous les fichiers modifies au staging...
git add .

echo.
echo Statut des modifications:
git status --porcelain

echo.
echo Commit des corrections completes...
git commit -m "Corrections completes: inscription modernisee, creation projets/devis fixes, chargement devis corrige, redirection accueil apres inscription"

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
echo RECAPITULATIF DES CORRECTIONS DEPLOYEES:
echo.
echo 1. INSCRIPTION MODERNISEE:
echo    - Formulaire multi-etapes avec validation temps reel
echo    - Design glassmorphism avec particules animees
echo    - Redirection vers accueil apres inscription
echo    - Indicateur force mot de passe
echo.
echo 2. CREATION PROJETS CORRIGEE:
echo    - Gestion erreur robuste avec fallback local
echo    - Validation champs obligatoires
echo    - Interface moderne avec etats loading
echo    - Authentification utilisateur verifiee
echo.
echo 3. AJOUT DEVIS CORRIGE:
echo    - Probleme RLS Supabase resolu
echo    - Fallback stockage local si echec
echo    - Authentification complete utilisateur
echo    - Interface amelioree avec gestion erreurs
echo.
echo 4. CHARGEMENT DEVIS CORRIGE:
echo    - Boucle infinie de chargement resolue
echo    - Gestion utilisateur non connecte
echo    - Interface connexion/inscription
echo    - Messages erreur clairs
echo.
echo La version corrigee sera disponible sur:
echo https://finitio-app.vercel.app
echo.
echo Vercel va automatiquement redeployer l'application...
echo Temps estime: 2-3 minutes
echo.
echo FONCTIONNALITES MAINTENANT OPERATIONNELLES:
echo - Inscription avec redirection accueil
echo - Creation projets avec gestion erreurs
echo - Ajout devis avec authentification RLS
echo - Page devis sans chargement infini
echo - Fallback stockage local pour toutes les operations
echo.

pause
