@echo off
echo 🧹 NETTOYAGE COMPLET DES SCRIPTS SQL FINITIO
echo ============================================

:: Créer dossier archive
if not exist "_archive" mkdir "_archive"

:: Archiver tous les anciens scripts (sauf le master)
echo 📦 Archivage des anciens scripts...
move "activate_rls_manual.sql" "_archive\" 2>nul
move "analytics_schema.sql" "_archive\" 2>nul
move "analytics_schema_fixed.sql" "_archive\" 2>nul
move "fix_user_profiles.sql" "_archive\" 2>nul
move "fix_user_profiles_simple.sql" "_archive\" 2>nul
move "generate_analytics_simple.sql" "_archive\" 2>nul
move "generate_analytics_test_data.sql" "_archive\" 2>nul
move "generate_analytics_test_data_final.sql" "_archive\" 2>nul
move "generate_analytics_test_data_final_corrected.sql" "_archive\" 2>nul
move "generate_analytics_test_data_fixed.sql" "_archive\" 2>nul
move "generate_analytics_test_data_perfect.sql" "_archive\" 2>nul
move "generate_analytics_test_data_ultimate.sql" "_archive\" 2>nul
move "generate_analytics_test_data_working.sql" "_archive\" 2>nul
move "generate_kanban_test_data.sql" "_archive\" 2>nul

:: Renommer le script master pour plus de clarté
echo 🎯 Renommage du script master...
ren "generate_kanban_test_data_fixed.sql" "FINITIO_MASTER_DATABASE_RESET.sql"

:: Créer un README explicatif
echo 📝 Création README...
echo # 🎯 FINITIO DATABASE SCRIPTS > README.md
echo. >> README.md
echo ## 📁 SCRIPT PRINCIPAL >> README.md
echo - **FINITIO_MASTER_DATABASE_RESET.sql** : SCRIPT UNIQUE pour reset complet de la base >> README.md
echo. >> README.md
echo ## 🗂️ ARCHIVE >> README.md
echo - **_archive/** : Anciens scripts obsolètes (sauvegardés) >> README.md
echo. >> README.md
echo ## 🚀 UTILISATION >> README.md
echo 1. Copiez le contenu de FINITIO_MASTER_DATABASE_RESET.sql >> README.md
echo 2. Collez dans Supabase SQL Editor >> README.md
echo 3. Exécutez pour reset complet >> README.md

echo ✅ NETTOYAGE TERMINÉ !
echo 📁 1 script principal : FINITIO_MASTER_DATABASE_RESET.sql
echo 📦 14 scripts archivés dans _archive/
echo 📝 README.md créé
pause
