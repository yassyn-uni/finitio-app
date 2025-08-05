// ✅ TOUS LES IMPORTS EN PREMIER
import Navbar from './components/Navbar';
import Hero from './components/hero';
import Pourquoi from './components/Pourquoi';
import Fonctionnalites from './components/Fonctionnalites';
import Etapes from './components/Etapes';
import Cta from './components/Cta';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inscription from './components/Inscription';
import Connexion from './components/Connexion';

import Dashboard from './pages/Dashboard';
import DashboardClient from './pages/DashboardClient';
import DashboardPrestataire from './pages/DashboardPrestataire';
import DashboardArchitecte from './pages/DashboardArchitecte';

import NouveauProjet from './pages/NouveauProjet';
import ListeProjets from './pages/ListeProjets';
import DetailProjet from './pages/DetailProjet';
import AjouterEtape from './pages/AjouterEtape';
import AjouterDevis from './pages/AjouterDevis';
import SelectionProjetDevis from './pages/SelectionProjetDevis';
import SuiviDevis from './pages/SuiviDevis';
import AnnuairePrestataires from './pages/AnnuairePrestataires';
import EtapesProjet from './pages/EtapesProjet';
import EtapesKanban from './pages/EtapesKanban';
import Messages from './pages/Messages';
import ResetPassword from './pages/ResetPassword';

// ✅ FONCTION PRINCIPALE (AVEC TOUTES LES ROUTES)
function App() {
  return (
    <Router>
      <Routes>
        {/* Page d’accueil */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <Pourquoi />
              <Fonctionnalites />
              <Etapes />
              <Cta />
              <Footer />
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

        {/* Messages */}
        <Route path="/messages" element={<Messages />} />

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
      </Routes>
    </Router>
  );
}

// ✅ UN SEUL EXPORT À LA FIN
export default App;
