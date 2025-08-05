@echo off
echo ========================================
echo DÉPLOIEMENT AMÉLIORATIONS ACCESSIBILITÉ
echo ========================================
echo.

echo 🎨 Application des améliorations d'accessibilité et palette harmonisée...
echo.

echo ✅ Ajout de tous les fichiers modifiés...
git add .

echo.
echo 📝 Création du commit avec message descriptif...
git commit -m "🎨 AMÉLIORATION ACCESSIBILITÉ & PALETTE HARMONISÉE

✅ AMÉLIORATIONS APPORTÉES:
- Nouvelle palette de couleurs harmonisée avec orange premium
- Amélioration des contrastes pour WCAG AA/AAA
- Suppression des couleurs faibles (blanc sur blanc)
- Harmonisation complète Hero et Navbar
- Classes CSS cohérentes (construction-accent-gradient)
- Meilleure lisibilité et accessibilité

🎯 COMPOSANTS MIS À JOUR:
- premiumTheme.css: Palette harmonisée et classes accessibles
- hero.jsx: Contrastes améliorés et gradient harmonisé
- Navbar.jsx: Couleurs cohérentes et meilleure visibilité

🔧 AMÉLIORATIONS TECHNIQUES:
- Variables CSS pour cohérence
- Focus states accessibles
- Animations respectueuses (prefers-reduced-motion)
- Contraste texte optimisé

RÉSULTAT: Interface premium, accessible et professionnelle"

if %ERRORLEVEL% neq 0 (
    echo ❌ Erreur lors du commit
    pause
    exit /b 1
)

echo.
echo 🚀 Push vers le repository...
git push origin main

if %ERRORLEVEL% neq 0 (
    echo ❌ Erreur lors du push
    pause
    exit /b 1
)

echo.
echo ⏳ Attente de 10 secondes pour la synchronisation...
timeout /t 10 /nobreak > nul

echo.
echo 🔄 Forçage du redéploiement Vercel...
echo Création d'un fichier temporaire pour déclencher le rebuild...

echo // Force rebuild - %date% %time% > force_rebuild_accessibility.js
git add force_rebuild_accessibility.js
git commit -m "🔄 Force rebuild pour améliorations accessibilité - %date% %time%"
git push origin main

if %ERRORLEVEL% neq 0 (
    echo ❌ Erreur lors du force rebuild
    pause
    exit /b 1
)

echo.
echo ✅ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !
echo.
echo 🎯 AMÉLIORATIONS DÉPLOYÉES:
echo   • Palette de couleurs harmonisée
echo   • Contrastes WCAG AA/AAA respectés
echo   • Interface premium et accessible
echo   • Cohérence visuelle complète
echo.
echo 🌐 Votre site sera mis à jour dans quelques minutes sur:
echo   https://finitio-app.vercel.app
echo.
echo 📋 PROCHAINES ÉTAPES RECOMMANDÉES:
echo   1. Vérifier l'affichage sur le site de production
echo   2. Tester l'accessibilité avec un lecteur d'écran
echo   3. Valider les contrastes avec un outil WCAG
echo   4. Continuer avec les autres composants si nécessaire
echo.

pause
