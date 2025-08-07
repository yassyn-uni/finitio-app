// ✅ TOUS LES IMPORTS EN PREMIER
import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/hero';
import Pourquoi from './components/Pourquoi';
import Fonctionnalites from './components/Fonctionnalites';
import Footer from './components/Footer';
import Connexion from './components/Connexion';
import Inscription from './components/Inscription';
import OnboardingGuide from './components/OnboardingGuide';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
// SUPPRIMÉ: import './utils/analytics'; - Causait les erreurs 400
import NotificationContainer from './components/NotificationContainer';

// Import du nouveau thème premium
import './styles/premiumTheme.css';
// Import de l'harmonisation complète des couleurs
import './styles/colorHarmonization.css';
// Import du design system simplifié
import './styles/simple-design-system.css';

import Dashboard from './pages/Dashboard';
import DashboardClient from './pages/DashboardClient';
import DashboardPrestataire from './pages/DashboardPrestataire';
import DashboardArchitecte from './pages/DashboardArchitecte';
import DashboardFournisseur from './pages/DashboardFournisseur';
import ListeProjets from './pages/ListeProjets';
import DetailProjet from './pages/DetailProjet';
import NouveauProjet from './pages/NouveauProjet';
import EtapesProjet from './pages/EtapesProjet';
import EtapesKanban from './pages/EtapesKanban';
import AjouterEtape from './pages/AjouterEtape';
import Messages from './pages/Messages';
import MessagerieProjet from './components/MessagerieProjet';
import Devis from './pages/Devis';
import AjouterDevis from './pages/AjouterDevis';
import SelectionProjetDevis from './pages/SelectionProjetDevis';
import SuiviDevis from './pages/SuiviDevis';
import ValidationDevis from './pages/ValidationDevis';
import ListeAchats from './pages/ListeAchats';
import Paiements from './pages/Paiements';
import AnnuairePrestataires from './pages/AnnuairePrestataires';
import ResetPassword from './pages/ResetPassword';
import GestionEtapes from './pages/GestionEtapes';
import ProjetsDisponibles from './pages/ProjetsDisponibles';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import CatalogueProduits from './pages/CatalogueProduits';

// 🎯 Composant wrapper pour tracker les routes avec système optimisé
function AppWithTracking() {
  // Tracker automatiquement tous les changements de route avec le système optimisé
  // usePageTracking(OptimizedAnalytics);

  return (
    <>
      {/* 🧭 NAVBAR GLOBALE - PRÉSENTE SUR TOUTES LES PAGES */}
      <Navbar />
      
      {/* 📄 CONTENU DES PAGES */}
      <Routes>
        {/* Page d'accueil */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Pourquoi />
              <Fonctionnalites />
            </>
          }
        />

        {/* Auth */}
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Dashboards */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard-client" element={<DashboardClient />} />
        <Route path="/dashboard-prestataire" element={<DashboardPrestataire />} />
        <Route path="/dashboard-architecte" element={<DashboardArchitecte />} />
        <Route path="/dashboard-fournisseur" element={<DashboardFournisseur />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />

        {/* Messages */}
        <Route path="/messages" element={<Messages />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/paiements" element={<Paiements />} />
        <Route path="/devis" element={<Devis />} />
        <Route path="/liste-achats" element={<ListeAchats />} />
        <Route path="/validation-devis" element={<ValidationDevis />} />
        <Route path="/gestion-etapes" element={<GestionEtapes />} />
        <Route path="/projets-disponibles" element={<ProjetsDisponibles />} />

        {/* Projets */}
        <Route path="/nouveau-projet" element={<NouveauProjet />} />
        <Route path="/projets" element={<ListeProjets />} />
        
        {/* Routes spécifiques pour éviter les conflits */}
        <Route path="/projets/disponibles" element={<ListeProjets />} />
        <Route path="/projets/suivi" element={<ListeProjets />} />
        <Route path="/projets/paiements" element={<ListeProjets />} />
        <Route path="/projets/liste-achats" element={<ListeProjets />} />
        <Route path="/projets/coordination" element={<ListeProjets />} />
        <Route path="/projets/etapes" element={<ListeProjets />} />
        
        {/* Routes avec paramètres ID */}
        <Route path="/projets/:id" element={<DetailProjet />} />
        <Route path="/projets/:id/ajouter-etape" element={<AjouterEtape />} />
        <Route path="/projets/:id/etapes" element={<EtapesProjet />} />
        <Route path="/projets/:id/kanban" element={<EtapesKanban />} />
        <Route path="/projets/:id/ajouter-devis" element={<AjouterDevis />} />
        
        {/* Redirection pour ancienne route /projet/ */}
        <Route path="/projet/:id" element={<DetailProjet />} />
        <Route path="/projet/:id/ajouter-etape" element={<AjouterEtape />} />
        <Route path="/projet/:id/etapes" element={<EtapesProjet />} />
        <Route path="/projet/:id/kanban" element={<EtapesKanban />} />
        <Route path="/projet/:id/ajouter-devis" element={<AjouterDevis />} />
        
        {/* Routes devis */}
        <Route path="/projets/:id/ajouter-devis" element={<AjouterDevis />} />
        <Route path="/devis/nouveau" element={<AjouterDevis />} />
        <Route path="/devis/:id" element={<AjouterDevis />} />
        <Route path="/devis/mes" element={<ListeProjets />} />
        <Route path="/devis/validation" element={<ListeProjets />} />
        <Route path="/devis/suivi" element={<SuiviDevis />} />
        
        {/* Routes temporaires pour éviter les 404 */}
        <Route path="/annuaire-prestataires" element={<AnnuairePrestataires />} />
        <Route path="/onboarding-guide" element={<OnboardingGuide />} />
        
        {/* Pages Fournisseur */}
        <Route path="/catalogue-produits" element={<CatalogueProduits />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <AppWithTracking />
        <Footer />
        <NotificationContainer />
      </div>
    </Router>
  );
}

// ✅ UN SEUL EXPORT À LA FIN
export default App;
