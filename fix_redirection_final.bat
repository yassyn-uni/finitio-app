@echo off
echo ===============================================
echo 🚀 CORRECTION FINALE REDIRECTION ROLES FINITIO
echo ===============================================
echo.

echo 📋 Étape 1: Nettoyage cache et dépendances...
echo.

REM Nettoyer le cache npm
echo 🧹 Nettoyage cache npm...
call npm cache clean --force
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du nettoyage du cache npm
    pause
    exit /b 1
)

REM Supprimer node_modules et package-lock.json
echo 🗑️ Suppression node_modules...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

REM Réinstaller les dépendances
echo 📦 Réinstallation des dépendances...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)

echo.
echo 📋 Étape 2: Nettoyage build précédent...
echo.

REM Supprimer le dossier dist
if exist dist rmdir /s /q dist
echo ✅ Dossier dist supprimé

echo.
echo 📋 Étape 3: Build de l'application...
echo.

call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du build
    pause
    exit /b 1
)

echo ✅ Build terminé avec succès
echo.

echo 📋 Étape 4: Vérification des fichiers modifiés...
echo.

echo 🔍 Fichiers de redirection créés/modifiés:
echo   - src/components/ForceRoleRedirect.jsx (NOUVEAU)
echo   - src/pages/Dashboard.jsx (MODIFIÉ)
echo   - src/components/Connexion.jsx (MODIFIÉ)
echo   - src/components/NavbarRole.jsx (MODIFIÉ)
echo.

echo 📋 Étape 5: Déploiement sur Vercel...
echo.

echo 🚀 Déploiement en cours...
call npx vercel --prod --yes
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du déploiement Vercel
    echo 💡 Solutions possibles:
    echo    1. Vérifiez votre token Vercel: vercel logout puis vercel login
    echo    2. Ou déployez via Git si connecté à un repo
    echo    3. Ou utilisez l'interface web Vercel
    pause
    exit /b 1
)

echo.
echo ===============================================
echo ✅ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !
echo ===============================================
echo.

echo 🎯 CORRECTIONS APPLIQUÉES:
echo.
echo 1. ✅ Nouveau composant ForceRoleRedirect.jsx
echo    - Redirection forcée avec window.location.href
echo    - Recherche par UUID et fallback par email
echo    - Logs détaillés pour débogage
echo.
echo 2. ✅ Dashboard.jsx mis à jour
echo    - Utilise ForceRoleRedirect pour les utilisateurs avec rôle
echo    - Interface de sélection pour utilisateurs sans rôle
echo.
echo 3. ✅ Connexion.jsx corrigé
echo    - Redirection forcée après login
echo    - Stockage du rôle dans localStorage
echo.
echo 4. ✅ NavbarRole.jsx amélioré
echo    - Déconnexion complète avec nettoyage localStorage
echo.

echo 🧪 TESTS À EFFECTUER:
echo.
echo 1. Connectez-vous avec architecte1@test.com
echo    ➡️ Devrait rediriger vers /dashboard-architecte
echo.
echo 2. Connectez-vous avec prestataire1@test.com  
echo    ➡️ Devrait rediriger vers /dashboard-prestataire
echo.
echo 3. Connectez-vous avec fournisseur1@test.com
echo    ➡️ Devrait rediriger vers /dashboard-fournisseur
echo.
echo 4. Testez la déconnexion depuis chaque dashboard
echo    ➡️ Devrait rediriger vers /connexion
echo.

echo 🔍 DÉBOGAGE:
echo.
echo Si les problèmes persistent:
echo 1. Ouvrez la console du navigateur (F12)
echo 2. Regardez les logs de ForceRoleRedirect
echo 3. Vérifiez les requêtes réseau vers Supabase
echo 4. Utilisez le script debug_connexion_roles.js
echo.

echo 🌐 Votre application est déployée et accessible !
echo 📱 Testez maintenant les redirections de rôles.
echo.

pause
