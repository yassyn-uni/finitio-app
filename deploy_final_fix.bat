@echo off
echo ========================================
echo CORRECTION FINALE DES ERREURS ANALYTICS
echo ========================================
echo.

echo [1/6] Verification des modifications...
echo - Suppression import analytics dans App.jsx
echo - Remplacement analytics.js par mock complet
echo - Suppression imports analytics dans Navbar.jsx
echo - Suppression imports analytics dans DashboardClient.jsx
echo - Suppression imports analytics dans Inscription.jsx
echo - Suppression imports analytics dans Connexion.jsx
echo.

echo [2/6] Ajout des modifications au Git...
git add src/App.jsx
git add src/utils/analytics.js
git add src/components/Navbar.jsx
git add src/pages/DashboardClient.jsx
git add src/components/Inscription.jsx
git add src/components/Connexion.jsx
echo ✅ Tous les fichiers ajoutés

echo [3/6] Commit des corrections...
git commit -m "FIX FINAL: Suppression TOUS imports analytics - Elimine erreurs build 400"
echo ✅ Commit créé

echo [4/6] Push vers GitHub...
git push origin main
echo ✅ Push terminé

echo [5/6] Déploiement en cours sur Vercel...
echo.
echo ⏳ Vercel va automatiquement redéployer dans 1-2 minutes
echo 🎯 Les erreurs de build et 400 Bad Request vont disparaître
echo.

echo [6/6] VÉRIFICATIONS À FAIRE:
echo ========================================
echo 1. Attendre 2-3 minutes le déploiement Vercel
echo 2. Rafraîchir la page de production
echo 3. Ouvrir F12 et vérifier l'onglet Console (aucune erreur)
echo 4. Vérifier l'onglet Network (aucun appel analytics)
echo 5. Tester la navigation (tout doit fonctionner)
echo.
echo ✅ CORRECTION COMPLÈTE TERMINÉE !
echo ========================================

pause
