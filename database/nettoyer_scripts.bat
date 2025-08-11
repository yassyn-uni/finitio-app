@echo off
echo 🧹 NETTOYAGE AUTOMATIQUE DES SCRIPTS FINITIO
echo =============================================

cd /d "%~dp0"

echo.
echo 📂 Répertoire actuel: %CD%
echo.

echo 🗑️ Suppression des anciens scripts problématiques...

REM Supprimer les anciens scripts qui causent des erreurs
if exist "cleanup_existing_data.sql" (
    del "cleanup_existing_data.sql"
    echo ✅ cleanup_existing_data.sql supprimé
) else (
    echo ⚠️ cleanup_existing_data.sql introuvable
)

if exist "maintenance_and_monitoring.sql" (
    del "maintenance_and_monitoring.sql"
    echo ✅ maintenance_and_monitoring.sql supprimé
) else (
    echo ⚠️ maintenance_and_monitoring.sql introuvable
)

if exist "optimize_database_for_website.sql" (
    del "optimize_database_for_website.sql"
    echo ✅ optimize_database_for_website.sql supprimé
) else (
    echo ⚠️ optimize_database_for_website.sql introuvable
)

if exist "README_optimisations.md" (
    del "README_optimisations.md"
    echo ✅ README_optimisations.md supprimé
) else (
    echo ⚠️ README_optimisations.md introuvable
)

if exist "test_optimizations.sql" (
    del "test_optimizations.sql"
    echo ✅ test_optimizations.sql supprimé
) else (
    echo ⚠️ test_optimizations.sql introuvable
)

if exist "add_indexes_only.sql" (
    del "add_indexes_only.sql"
    echo ✅ add_indexes_only.sql supprimé
) else (
    echo ⚠️ add_indexes_only.sql introuvable
)

if exist "add_constraints_and_indexes.sql" (
    del "add_constraints_and_indexes.sql"
    echo ✅ add_constraints_and_indexes.sql supprimé
) else (
    echo ⚠️ add_constraints_and_indexes.sql introuvable
)

if exist "add_indexes_corrected.sql" (
    del "add_indexes_corrected.sql"
    echo ✅ add_indexes_corrected.sql supprimé
) else (
    echo ⚠️ add_indexes_corrected.sql introuvable
)

echo.
echo ✅ NETTOYAGE TERMINÉ !
echo.
echo 📁 Fichiers conservés (scripts fonctionnels):
if exist "optimisation_simple.sql" echo   ✅ optimisation_simple.sql
if exist "test_simple.sql" echo   ✅ test_simple.sql  
if exist "guide_simple.md" echo   ✅ guide_simple.md
if exist "diagnostic_all_tables.sql" echo   ✅ diagnostic_all_tables.sql

echo.
echo 🚀 PROCHAINES ÉTAPES:
echo   1. Exécuter: psql -d finitio -f optimisation_simple.sql
echo   2. Tester: psql -d finitio -f test_simple.sql
echo.

pause
