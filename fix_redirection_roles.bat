@echo off
echo ========================================
echo 🔧 CORRECTION REDIRECTION ROLES FINITIO
echo ========================================
echo.

echo 📋 Problèmes identifiés:
echo - Architecte redirigé vers dashboard client
echo - Prestataire redirigé vers dashboard client  
echo - Fournisseur redirigé vers dashboard général
echo - Utilisation de navigate() au lieu de window.location.href
echo.

echo 🚀 Application des corrections critiques...
echo.

echo 📦 Installation des dépendances...
call npm install
if errorlevel 1 (
    echo ❌ Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)

echo 🔨 Construction du projet avec corrections...
call npm run build
if errorlevel 1 (
    echo ❌ Erreur lors de la construction
    pause
    exit /b 1
)

echo 🚀 Déploiement sur Vercel...
call npx vercel --prod --yes
if errorlevel 1 (
    echo ❌ Erreur lors du déploiement
    echo 💡 Essayez: vercel login puis relancez ce script
    pause
    exit /b 1
)

echo.
echo ✅ CORRECTIONS REDIRECTION APPLIQUÉES!
echo.
echo 📋 Corrections effectuées:
echo - ✅ Redirection forcée avec window.location.href dans Connexion.jsx
echo - ✅ Logs de débogage pour identifier les problèmes de rôle
echo - ✅ Gestion d'erreurs améliorée pour récupération profil
echo - ✅ Redirection correcte selon le rôle utilisateur
echo - ✅ Nettoyage localStorage lors déconnexion
echo.
echo 🔗 Testez maintenant sur: https://finitio-app.vercel.app
echo.
echo 📝 Tests à effectuer:
echo 1. Connexion architecte1@test.com → doit aller sur /dashboard-architecte
echo 2. Connexion prestataire1@test.com → doit aller sur /dashboard-prestataire  
echo 3. Connexion fournisseur2@test.com → doit aller sur /dashboard-fournisseur
echo 4. Test bouton déconnexion → doit aller sur /connexion
echo.
echo 🔍 Vérifiez les logs dans la console du navigateur pour déboguer
echo.
pause
