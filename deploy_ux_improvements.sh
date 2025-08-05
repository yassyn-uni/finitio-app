#!/bin/bash

# 🚀 SCRIPT DE DÉPLOIEMENT - TRANSFORMATION UX/UI FINITIO COMPLÈTE
# ================================================================

echo "🎨 Déploiement de la transformation UX/UI Finitio..."
echo "=================================================="

# Vérification du répertoire
if [ ! -d ".git" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis la racine du projet Git"
    exit 1
fi

# Ajout de tous les fichiers modifiés
echo "📁 Ajout des fichiers modifiés..."
git add .

# Vérification des changements
if git diff --staged --quiet; then
    echo "ℹ️  Aucun changement à committer"
    exit 0
fi

# Commit avec message détaillé
echo "💾 Création du commit..."
git commit -m "🎨 TRANSFORMATION UX/UI COMPLÈTE - Version Premium

✨ NOUVEAUTÉS MAJEURES:
• Thème premium 'Construction Elite' avec glassmorphism
• Système d'assets SVG intégré (logos, icônes, illustrations)
• Animations avancées et transitions fluides

🔄 COMPOSANTS MODERNISÉS:
• Navbar: Glassmorphism, avatars métier, dropdown premium
• Hero: Design plein écran avec illustrations et statistiques
• Pourquoi: Grille d'avantages par rôle + témoignages
• Fonctionnalités: 6 fonctionnalités détaillées + processus 3 étapes
• Footer: Footer complet avec newsletter et réseaux sociaux

🎯 PAGES SPÉCIALISÉES CRÉÉES:
• GestionEtapes (/gestion-etapes): Page architecte complète
• ProjetsDisponibles (/projets-disponibles): Marketplace prestataire

🎨 AMÉLIORATIONS DESIGN:
• Palette de couleurs moderne et cohérente
• Responsive design optimisé mobile/tablet/desktop
• Accessibilité et contraste améliorés
• Performance des animations optimisée

🔗 NAVIGATION MISE À JOUR:
• Dashboards liés aux nouvelles pages spécialisées
• Routes ajoutées dans App.jsx
• Cohérence visuelle entre tous les composants

📱 RESPONSIVE & PERFORMANCE:
• Design adaptatif pour tous les écrans
• Animations GPU-accélérées
• Chargement optimisé des assets

🚀 PRÊT POUR PRODUCTION"

# Push vers GitHub
echo "🚀 Push vers GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ DÉPLOIEMENT RÉUSSI!"
    echo "===================="
    echo ""
    echo "🎯 Changements déployés:"
    echo "• Thème premium 'Construction Elite'"
    echo "• Système d'assets SVG complet"
    echo "• 5 composants modernisés (Navbar, Hero, Pourquoi, Fonctionnalités, Footer)"
    echo "• 2 nouvelles pages spécialisées (GestionEtapes, ProjetsDisponibles)"
    echo "• Navigation et routing mis à jour"
    echo ""
    echo "🔗 Le déploiement automatique sur Vercel va commencer..."
    echo "📱 Vérifiez le statut sur: https://vercel.com/dashboard"
    echo ""
    echo "⏱️  Temps estimé de déploiement: 2-3 minutes"
    echo ""
    echo "🎉 Votre application Finitio est maintenant avec un design premium!"
else
    echo ""
    echo "❌ ERREUR LORS DU PUSH"
    echo "===================="
    echo "Vérifiez votre connexion internet et vos permissions GitHub"
    exit 1
fi
