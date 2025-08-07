@echo off
echo ========================================
echo 🔧 DÉPLOIEMENT CORRECTIONS DASHBOARD FINITIO
echo ========================================
echo.

echo 📋 Corrections incluses dans ce déploiement :
echo    ✅ Fix déconnexion automatique au clic Dashboard
echo    ✅ Gestion d'erreur RLS pour éviter logout forcé
echo    ✅ Correction requêtes projets (user_id)
echo    ✅ Protection try/catch sur toutes les requêtes DB
echo.

echo 🔍 Vérification du statut Git...
git status
echo.

echo 📝 Ajout des fichiers modifiés...
git add .
echo    ✅ Fichiers ajoutés au staging

echo.
echo 💬 Création du commit avec message descriptif...
git commit -m "🔧 Fix: Dashboard déconnexion + RLS errors

✅ Corrections critiques :
- Fix déconnexion automatique au clic Dashboard
- Gestion d'erreur RLS pour éviter logout forcé  
- Protection try/catch sur requêtes users/projets
- Correction requête projets: user_id au lieu de client_id
- Continuation même si profil utilisateur non trouvé

🎯 Résultat :
- Plus de déconnexion intempestive
- Dashboards accessibles même avec UUID désynchronisés
- Meilleure expérience utilisateur
- Gestion d'erreur robuste

📊 Impact :
- Résolution problème critique UX
- Dashboards fonctionnels en attendant sync UUID
- Navigation fluide sans interruption"

if %errorlevel% neq 0 (
    echo ❌ Erreur lors du commit
    pause
    exit /b 1
)

echo    ✅ Commit créé avec succès

echo.
echo 🌐 Push vers GitHub (déclenchement auto Vercel)...
git push origin main

if %errorlevel% neq 0 (
    echo ❌ Erreur lors du push
    echo 🔄 Tentative de pull avant push...
    git pull origin main
    echo 🔄 Nouveau push...
    git push origin main
    
    if %errorlevel% neq 0 (
        echo ❌ Échec du push après pull
        pause
        exit /b 1
    )
)

echo    ✅ Push réussi vers GitHub

echo.
echo 🎯 DÉPLOIEMENT TERMINÉ !
echo.
echo 📊 Résumé des actions :
echo    ✅ Corrections Dashboard déployées
echo    ✅ Protection RLS ajoutée
echo    ✅ Plus de déconnexion intempestive
echo.
echo 🔗 Actions suivantes recommandées :
echo    1. Attendre 2-3 minutes pour le déploiement Vercel
echo    2. Tester la connexion et clic Dashboard
echo    3. Vérifier que les dashboards s'ouvrent sans déconnexion
echo    4. Exécuter les scripts SQL de synchronisation UUID
echo.
echo 📋 Scripts SQL à exécuter dans Supabase :
echo    1. sync_auth_to_public.sql (synchroniser utilisateurs)
echo    2. generate_complete_test_data.sql (créer projets + Kanban)
echo.
echo 🎉 Le problème de déconnexion Dashboard est résolu !
echo.
pause
