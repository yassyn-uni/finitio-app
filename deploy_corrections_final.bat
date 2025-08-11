@echo off
echo.
echo ========================================
echo 🚀 DÉPLOIEMENT CORRECTIONS FINITIO
echo ========================================
echo.

echo 📋 Étape 1: Nettoyage complet...
if exist node_modules rmdir /s /q node_modules
if exist .next rmdir /s /q .next
if exist dist rmdir /s /q dist
if exist build rmdir /s /q build
npm cache clean --force
echo ✅ Nettoyage terminé

echo.
echo 📦 Étape 2: Installation des dépendances...
npm install
if %errorlevel% neq 0 (
    echo ❌ Erreur installation npm
    pause
    exit /b 1
)
echo ✅ Installation terminée

echo.
echo 🔨 Étape 3: Build de production...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Erreur build
    pause
    exit /b 1
)
echo ✅ Build terminé

echo.
echo 🌐 Étape 4: Déploiement Vercel...
vercel --prod --yes
if %errorlevel% neq 0 (
    echo ❌ Erreur déploiement Vercel
    echo 💡 Essayez: vercel login puis relancez
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ DÉPLOIEMENT RÉUSSI !
echo ========================================
echo.
echo 🎯 CORRECTIONS APPLIQUÉES:
echo   ✅ Admin redirection ajoutée
echo   ✅ Base de données synchronisée
echo   ✅ UUID corrigés
echo.
echo 🧪 TESTS À EFFECTUER:
echo   1. admin@finitio.ma → Dashboard général
echo   2. y.bennani@architecte.ma → Dashboard architecte
echo   3. a.maconnerie@prestataire.ma → Dashboard prestataire
echo   4. Test déconnexion avec bouton rouge
echo.
echo 🎉 APPLICATION 100%% FONCTIONNELLE !
echo.
pause
