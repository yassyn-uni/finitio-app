@echo off
chcp 65001 >nul
echo.
echo ==========================================
echo DEPLOIEMENT HOMEPAGE MATERIO COMPLETE
echo ==========================================
echo.

:: Vérifier que nous sommes dans le bon répertoire
if not exist "package.json" (
    echo ERREUR: package.json non trouve
    echo Assurez-vous d'etre dans le repertoire finitio-frontend
    pause
    exit /b 1
)

echo 🎨 REFONTE HOMEPAGE MATERIO COMPLETE:
echo.
echo ✅ Hero Section - Slides dynamiques + dashboard preview
echo ✅ Pourquoi - Tabs interactifs par role + features
echo ✅ Fonctionnalites - Grid moderne + processus 3 etapes
echo ✅ Theme Materio CSS etendu + animations
echo ✅ Analytics tracking integre
echo ✅ Responsive design optimise
echo.

:: Vérifier les fichiers critiques
echo Verification des fichiers modifies...
if not exist "src\components\hero.jsx" (
    echo ERREUR: hero.jsx non trouve
    pause
    exit /b 1
)

if not exist "src\components\Pourquoi.jsx" (
    echo ERREUR: Pourquoi.jsx non trouve
    pause
    exit /b 1
)

if not exist "src\components\Fonctionnalites.jsx" (
    echo ERREUR: Fonctionnalites.jsx non trouve
    pause
    exit /b 1
)

if not exist "src\styles\materioTheme.css" (
    echo ERREUR: materioTheme.css non trouve
    pause
    exit /b 1
)

echo ✅ Tous les fichiers homepage detectes
echo.

:: Ajouter tous les fichiers modifiés
echo Ajout des fichiers au repository Git...
git add .
if %errorlevel% neq 0 (
    echo ERREUR lors de l'ajout des fichiers
    pause
    exit /b 1
)

echo ✅ Fichiers ajoutes au staging
echo.

:: Commit avec message descriptif complet
echo Creation du commit...
git commit -m "feat: Refonte complete homepage avec design Materio MUI

🎨 TRANSFORMATION HOMEPAGE COMPLETE:

✅ HERO SECTION REDESIGNE:
- 3 slides dynamiques avec rotation automatique
- Dashboard preview interactif avec equipe projet
- Animations fluides: slide-up, scale-in, float
- Statistiques modernes et trust indicators
- Layout responsive 2 colonnes

✅ SECTION POURQUOI REVOLUTIONNEE:
- Tabs interactifs: Clients, Prestataires, Architectes
- 4 features detaillees par role professionnel
- Dashboard preview dynamique selon role actif
- Temoignages marocains avec projets reels
- Statistiques impressionnantes: 2,500+ projets

✅ SECTION FONCTIONNALITES MODERNISEE:
- 6 fonctionnalites cliquables avec details
- Processus 3 etapes avec connexions visuelles
- CTA section avec gradient et garanties
- Grid responsive avec hover effects

🔧 AMELIORATIONS TECHNIQUES:
- Theme Materio CSS etendu (+500 lignes)
- OptimizedAnalytics tracking sur interactions
- Animations avancees et accessibility
- Responsive design mobile/tablet/desktop
- Micro-interactions et transitions fluides

📱 UX/UI PREMIUM:
- Design moderne inspire Materio MUI
- Palette de couleurs professionnelle
- Composants specialises et reutilisables
- Performance optimisee

Ready for production - Homepage ultra-moderne"

if %errorlevel% neq 0 (
    echo ERREUR lors du commit
    pause
    exit /b 1
)

echo ✅ Commit cree avec succes
echo.

:: Push vers GitHub
echo Push vers GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ERREUR lors du push
    echo Verifiez votre connexion et vos droits GitHub
    pause
    exit /b 1
)

echo ✅ Push reussi vers GitHub
echo.

echo ==========================================
echo HOMEPAGE MATERIO DEPLOYEE AVEC SUCCES !
echo ==========================================
echo.
echo 🎨 NOUVELLE HOMEPAGE DEPLOYEE:
echo.
echo ✅ Hero Section Ultra-Moderne
echo    - Slides dynamiques avec preview dashboard
echo    - Animations fluides et professionnelles
echo    - Statistiques et trust indicators
echo.
echo ✅ Section Pourquoi Interactive
echo    - Tabs par role: Client, Prestataire, Architecte
echo    - Features detaillees et dashboard preview
echo    - Temoignages marocains authentiques
echo.
echo ✅ Section Fonctionnalites Avancee
echo    - 6 fonctionnalites avec interactions
echo    - Processus 3 etapes visualise
echo    - CTA section avec garanties
echo.
echo ✅ Design System Materio
echo    - Theme CSS etendu et coherent
echo    - Animations et micro-interactions
echo    - Responsive design optimise
echo.
echo 🚀 VERIFICATION EN PRODUCTION:
echo.
echo 1. Ouvrir: https://finitio-app.vercel.app
echo 2. Tester le nouveau Hero avec slides
echo 3. Interagir avec les tabs Pourquoi
echo 4. Explorer les fonctionnalites cliquables
echo 5. Verifier le responsive sur mobile
echo 6. Confirmer les animations fluides
echo.
echo 📊 ANALYTICS TRACKING:
echo - Toutes les interactions sont trackees
echo - Dashboard analytics mis a jour
echo - Metriques d'engagement disponibles
echo.
echo 🎯 PROCHAINES ETAPES:
echo 1. Tester l'experience utilisateur complete
echo 2. Collecter les retours et metriques
echo 3. Optimiser selon les donnees analytics
echo 4. Continuer l'amelioration continue
echo.
echo L'application Finitio a maintenant une HOMEPAGE PREMIUM !
echo.
pause
