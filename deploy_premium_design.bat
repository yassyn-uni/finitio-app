@echo off
echo ========================================
echo 🎨 DÉPLOIEMENT DESIGN PREMIUM FINITIO
echo ========================================
echo.

echo [1/6] Création du nouveau thème premium...
echo ✅ Nouveau fichier CSS premium créé
echo ✅ Polices Google Fonts importées (Inter + Playfair Display)
echo ✅ Variables CSS modernes définies
echo ✅ Composants UI premium créés
echo.

echo [2/6] Refonte des composants principaux...
echo ✅ Hero redesigné avec gradient premium
echo ✅ Navbar modernisé avec glass effect
echo ✅ App.jsx mis à jour avec nouveau thème
echo.

echo [3/6] Ajout des modifications au Git...
git add src/styles/premiumTheme.css
git add src/App.jsx
git add src/components/hero.jsx
git add src/components/Navbar.jsx
echo ✅ Tous les fichiers de design ajoutés

echo [4/6] Commit du nouveau design...
git commit -m "🎨 NOUVEAU DESIGN PREMIUM: Charte complète + Hero + Navbar modernes"
echo ✅ Commit créé

echo [5/6] Push vers GitHub...
git push origin main
echo ✅ Push terminé

echo [6/6] Déploiement en cours sur Vercel...
echo.
echo ⏳ Vercel va automatiquement redéployer dans 1-2 minutes
echo 🎨 Le nouveau design premium sera visible
echo.

echo ========================================
echo 🎯 NOUVEAU DESIGN PREMIUM FINITIO:
echo ========================================
echo ✨ Charte couleurs moderne (Slate + Orange)
echo 🎭 Polices premium (Inter + Playfair Display)
echo 🏗️ Hero avec gradient construction
echo 🌟 Navbar avec effet glass
echo 📱 Design responsive et animations
echo 🎨 Composants UI premium
echo.
echo 🚀 ATTENDEZ 2-3 MINUTES PUIS VÉRIFIEZ:
echo 📱 https://finitio-app.vercel.app
echo.
echo ✅ DESIGN PREMIUM DÉPLOYÉ !
echo ========================================

pause
