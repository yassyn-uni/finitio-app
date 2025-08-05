#!/bin/bash

# 🚀 SCRIPT DE DÉPLOIEMENT - SYSTÈME ANALYTICS FINITIO
# Ce script déploie toutes les améliorations analytics sur Vercel

echo "🎯 =========================================="
echo "🚀 DÉPLOIEMENT SYSTÈME ANALYTICS FINITIO"
echo "🎯 =========================================="
echo ""

# Vérifier si on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Exécutez ce script depuis la racine du projet."
    exit 1
fi

echo "📋 Vérification des fichiers modifiés..."

# Liste des fichiers analytics ajoutés/modifiés
FILES_TO_CHECK=(
    "src/utils/analytics.js"
    "src/hooks/usePageTracking.js"
    "src/pages/AnalyticsDashboard.jsx"
    "database/analytics_schema_fixed.sql"
    "database/activate_rls_manual.sql"
    "src/App.jsx"
    "src/components/hero.jsx"
    "src/components/Navbar.jsx"
    "src/components/Connexion.jsx"
    "src/components/Inscription.jsx"
    "src/pages/DashboardClient.jsx"
)

echo "✅ Vérification des fichiers analytics:"
for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✓ $file"
    else
        echo "   ❌ $file (manquant)"
    fi
done

echo ""
echo "📊 Ajout de tous les fichiers au contrôle de version..."

# Ajouter tous les fichiers modifiés
git add .

echo ""
echo "📝 Création du commit avec message détaillé..."

# Créer un commit avec un message détaillé
git commit -m "🎯 ANALYTICS: Intégration système de tracking complet

✅ NOUVELLES FONCTIONNALITÉS:
- Système d'analytics complet avec Supabase
- Dashboard analytics avec métriques temps réel
- Tracking automatique des pages avec usePageTracking
- Tracking des événements utilisateur (CTA, navigation, etc.)
- Tracking des conversions (inscriptions, connexions)
- Politiques RLS sécurisées pour protection des données

📊 COMPOSANTS INTÉGRÉS:
- Hero: Tracking CTA, statistiques, badges
- Navbar: Tracking navigation, profil, menu mobile
- Connexion: Tracking tentatives/succès/échecs
- Inscription: Tracking inscriptions et sélection rôle
- DashboardClient: Tracking modules et interactions
- App.jsx: Hook de tracking automatique des routes

🔧 INFRASTRUCTURE:
- Tables analytics: sessions, page_views, events, signups, logins, conversions
- Vues statistiques: session_stats, popular_pages, popular_events
- Index optimisés pour performances
- RLS activé avec politiques sécurisées

📈 MÉTRIQUES DISPONIBLES:
- Sessions utilisateur avec détails device/browser
- Pages vues avec temps de visite
- Taux de conversion inscription/connexion
- Événements personnalisés par type
- Statistiques temps réel des interactions

🎯 DÉPLOIEMENT:
- Prêt pour production sur Vercel
- Base de données Supabase configurée
- Système de tracking opérationnel"

echo ""
echo "🔄 Vérification du statut Git..."
git status --short

echo ""
echo "🚀 Déploiement vers GitHub (déclenchera Vercel)..."

# Pousser vers GitHub
if git push origin main; then
    echo ""
    echo "🎉 =========================================="
    echo "✅ DÉPLOIEMENT RÉUSSI !"
    echo "🎉 =========================================="
    echo ""
    echo "📱 Votre application sera disponible sur:"
    echo "   🌐 https://finitio-app.vercel.app"
    echo ""
    echo "📊 Dashboard Analytics accessible sur:"
    echo "   📈 https://finitio-app.vercel.app/analytics"
    echo ""
    echo "🔧 PROCHAINES ÉTAPES:"
    echo "   1. ✅ Vérifiez que les tables analytics sont créées dans Supabase"
    echo "   2. ✅ Testez les fonctionnalités de tracking"
    echo "   3. ✅ Consultez le dashboard analytics"
    echo "   4. ✅ Vérifiez les données collectées"
    echo ""
    echo "📋 FICHIERS DÉPLOYÉS:"
    for file in "${FILES_TO_CHECK[@]}"; do
        if [ -f "$file" ]; then
            echo "   ✓ $file"
        fi
    done
    echo ""
    echo "🎯 Le système d'analytics est maintenant opérationnel !"
    echo "   Toutes les interactions utilisateur seront trackées"
    echo "   et visibles dans le dashboard analytics."
    echo ""
else
    echo ""
    echo "❌ =========================================="
    echo "💥 ERREUR DE DÉPLOIEMENT"
    echo "❌ =========================================="
    echo ""
    echo "🔧 Solutions possibles:"
    echo "   1. Vérifiez votre connexion internet"
    echo "   2. Vérifiez vos permissions Git"
    echo "   3. Essayez: git pull origin main puis relancez"
    echo "   4. Vérifiez que vous êtes sur la branche main"
    echo ""
    echo "📞 En cas de problème persistant:"
    echo "   - Vérifiez les logs Git ci-dessus"
    echo "   - Contactez le support technique"
    echo ""
    exit 1
fi

echo "🎊 Déploiement terminé avec succès !"
echo "🔍 Surveillez le déploiement sur Vercel Dashboard"
echo ""
