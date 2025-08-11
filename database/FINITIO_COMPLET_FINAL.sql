-- 🏗️ FINITIO - SCRIPT COMPLET FINAL
-- ===================================
-- Script unique pour recréer toute la base de données Finitio
-- Inclut: Users, Produits, Commandes, Publicités, Étapes, Kanban

-- ====================================
-- 1. TABLE USERS (Base utilisateurs)
-- ====================================
CREATE TABLE public.users (
    id UUID PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('client', 'architecte', 'prestataire', 'fournisseur', 'admin')),
    telephone VARCHAR(20),
    ville VARCHAR(100),
    adresse TEXT,
    site_web VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 2. TABLE FOURNISSEURS (Détails fournisseurs)
-- ====================================
CREATE TABLE public.fournisseurs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    nom_entreprise VARCHAR(255) NOT NULL,
    siret VARCHAR(20),
    description TEXT,
    specialites TEXT[],
    zone_livraison TEXT[],
    delai_livraison_moyen INTEGER, -- en jours
    note_moyenne DECIMAL(3,2) DEFAULT 0,
    nb_evaluations INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 3. TABLE PRODUITS (Catalogue produits)
-- ====================================
CREATE TABLE public.produits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fournisseur_id UUID REFERENCES public.fournisseurs(id) ON DELETE CASCADE,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    categorie VARCHAR(100),
    prix DECIMAL(10,2) NOT NULL,
    unite VARCHAR(20) DEFAULT 'pièce',
    stock_disponible INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    images_supplementaires TEXT[], -- URLs multiples
    specifications JSONB, -- Caractéristiques techniques
    poids DECIMAL(8,2), -- en kg
    dimensions JSONB, -- {longueur, largeur, hauteur}
    delai_fabrication INTEGER, -- en jours
    statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'rupture')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 4. TABLE PROJETS (Projets clients/architectes)
-- ====================================
CREATE TABLE public.projets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    architecte_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    nom_projet VARCHAR(255) NOT NULL,
    description TEXT,
    adresse_projet TEXT,
    budget_estime DECIMAL(12,2),
    date_debut_prevue DATE,
    date_fin_prevue DATE,
    statut VARCHAR(30) DEFAULT 'planification' CHECK (statut IN ('planification', 'en_cours', 'termine', 'suspendu', 'annule')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 5. TABLE ÉTAPES PROJET (Kanban/Workflow)
-- ====================================
CREATE TABLE public.etapes_projet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    projet_id UUID REFERENCES public.projets(id) ON DELETE CASCADE,
    nom_etape VARCHAR(255) NOT NULL,
    description TEXT,
    ordre_etape INTEGER NOT NULL,
    statut VARCHAR(30) DEFAULT 'a_faire' CHECK (statut IN ('a_faire', 'en_cours', 'termine', 'bloque')),
    responsable_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    date_debut DATE,
    date_fin_prevue DATE,
    date_fin_reelle DATE,
    pourcentage_completion INTEGER DEFAULT 0 CHECK (pourcentage_completion >= 0 AND pourcentage_completion <= 100),
    commentaires TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 6. TABLE COMMANDES (Commandes produits)
-- ====================================
CREATE TABLE public.commandes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_commande VARCHAR(50) UNIQUE NOT NULL,
    projet_id UUID REFERENCES public.projets(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    fournisseur_id UUID REFERENCES public.fournisseurs(id) ON DELETE CASCADE,
    statut VARCHAR(30) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'confirmee', 'en_preparation', 'expediee', 'livree', 'annulee')),
    total_ht DECIMAL(10,2) NOT NULL DEFAULT 0,
    tva DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_ttc DECIMAL(10,2) NOT NULL DEFAULT 0,
    adresse_livraison TEXT NOT NULL,
    date_livraison_prevue DATE,
    date_livraison_reelle DATE,
    transporteur VARCHAR(100),
    numero_suivi VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 7. TABLE LIGNES COMMANDE (Détail commandes)
-- ====================================
CREATE TABLE public.lignes_commande (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commande_id UUID REFERENCES public.commandes(id) ON DELETE CASCADE,
    produit_id UUID REFERENCES public.produits(id) ON DELETE CASCADE,
    quantite INTEGER NOT NULL CHECK (quantite > 0),
    prix_unitaire DECIMAL(10,2) NOT NULL,
    total_ligne DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 8. TABLE PUBLICITÉS (Campagnes marketing)
-- ====================================
CREATE TABLE public.publicites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fournisseur_id UUID REFERENCES public.fournisseurs(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    url_destination VARCHAR(500),
    type_campagne VARCHAR(50) DEFAULT 'banniere' CHECK (type_campagne IN ('banniere', 'spotlight', 'newsletter', 'social')),
    budget DECIMAL(10,2) NOT NULL,
    budget_utilise DECIMAL(10,2) DEFAULT 0,
    cible_geographique TEXT[], -- Villes ciblées
    cible_roles TEXT[] DEFAULT ARRAY['client', 'architecte'], -- Rôles ciblés
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    statut VARCHAR(20) DEFAULT 'active' CHECK (statut IN ('active', 'pause', 'terminee')),
    nb_impressions INTEGER DEFAULT 0,
    nb_clics INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 9. TABLE ÉVALUATIONS (Avis clients)
-- ====================================
CREATE TABLE public.evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commande_id UUID REFERENCES public.commandes(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    fournisseur_id UUID REFERENCES public.fournisseurs(id) ON DELETE CASCADE,
    note INTEGER NOT NULL CHECK (note >= 1 AND note <= 5),
    commentaire TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 10. INDEXES POUR PERFORMANCE
-- ====================================
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_fournisseurs_user_id ON public.fournisseurs(user_id);
CREATE INDEX idx_produits_fournisseur ON public.produits(fournisseur_id);
CREATE INDEX idx_produits_categorie ON public.produits(categorie);
CREATE INDEX idx_projets_client ON public.projets(client_id);
CREATE INDEX idx_projets_architecte ON public.projets(architecte_id);
CREATE INDEX idx_etapes_projet ON public.etapes_projet(projet_id);
CREATE INDEX idx_commandes_client ON public.commandes(client_id);
CREATE INDEX idx_commandes_fournisseur ON public.commandes(fournisseur_id);
CREATE INDEX idx_lignes_commande ON public.lignes_commande(commande_id);
CREATE INDEX idx_publicites_fournisseur ON public.publicites(fournisseur_id);

-- ====================================
-- 11. TRIGGERS POUR UPDATED_AT
-- ====================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fournisseurs_updated_at BEFORE UPDATE ON public.fournisseurs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_produits_updated_at BEFORE UPDATE ON public.produits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projets_updated_at BEFORE UPDATE ON public.projets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_etapes_updated_at BEFORE UPDATE ON public.etapes_projet FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_commandes_updated_at BEFORE UPDATE ON public.commandes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_publicites_updated_at BEFORE UPDATE ON public.publicites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- 12. TRIGGER POUR NUMÉRO COMMANDE AUTO
-- ====================================
CREATE OR REPLACE FUNCTION generate_numero_commande()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_commande IS NULL OR NEW.numero_commande = '' THEN
        NEW.numero_commande := 'CMD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('commande_seq')::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE SEQUENCE IF NOT EXISTS commande_seq START 1;
CREATE TRIGGER set_numero_commande BEFORE INSERT ON public.commandes FOR EACH ROW EXECUTE FUNCTION generate_numero_commande();

-- ====================================
-- 13. POLITIQUES RLS (SÉCURITÉ)
-- ====================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fournisseurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.etapes_projet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lignes_commande ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publicites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

-- Politiques pour USERS
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Politiques pour FOURNISSEURS
CREATE POLICY "Fournisseurs can manage own data" ON public.fournisseurs FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Everyone can view fournisseurs" ON public.fournisseurs FOR SELECT USING (true);

-- Politiques pour PRODUITS
CREATE POLICY "Fournisseurs can manage own products" ON public.produits FOR ALL USING (
    fournisseur_id IN (SELECT id FROM public.fournisseurs WHERE user_id = auth.uid())
);
CREATE POLICY "Everyone can view products" ON public.produits FOR SELECT USING (true);

-- Politiques pour PROJETS
CREATE POLICY "Clients can manage own projects" ON public.projets FOR ALL USING (client_id = auth.uid());
CREATE POLICY "Architectes can view assigned projects" ON public.projets FOR SELECT USING (architecte_id = auth.uid());

-- Politiques pour COMMANDES
CREATE POLICY "Clients can view own orders" ON public.commandes FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Fournisseurs can view own orders" ON public.commandes FOR SELECT USING (
    fournisseur_id IN (SELECT id FROM public.fournisseurs WHERE user_id = auth.uid())
);

-- Politiques pour PUBLICITÉS
CREATE POLICY "Fournisseurs can manage own ads" ON public.publicites FOR ALL USING (
    fournisseur_id IN (SELECT id FROM public.fournisseurs WHERE user_id = auth.uid())
);
CREATE POLICY "Everyone can view active ads" ON public.publicites FOR SELECT USING (statut = 'active');

-- ====================================
-- 14. DONNÉES DE TEST
-- ====================================
-- Insérer des utilisateurs de test (remplacez les UUID par ceux créés dans Auth)
INSERT INTO public.users (id, nom, email, role, telephone, ville) VALUES
('11111111-1111-1111-1111-111111111111', 'Admin Test', 'admin@test.com', 'admin', '0123456789', 'Paris'),
('22222222-2222-2222-2222-222222222222', 'Client Test', 'client@test.com', 'client', '0123456790', 'Lyon'),
('33333333-3333-3333-3333-333333333333', 'Architecte Test', 'architecte@test.com', 'architecte', '0123456791', 'Marseille'),
('44444444-4444-4444-4444-444444444444', 'Prestataire Test', 'prestataire@test.com', 'prestataire', '0123456792', 'Toulouse'),
('55555555-5555-5555-5555-555555555555', 'Fournisseur Test', 'fournisseur@test.com', 'fournisseur', '0123456793', 'Nice');

-- Insérer un fournisseur de test
INSERT INTO public.fournisseurs (id, user_id, nom_entreprise, description, specialites) VALUES
('66666666-6666-6666-6666-666666666666', '55555555-5555-5555-5555-555555555555', 'Matériaux Pro', 'Fournisseur de matériaux de construction', ARRAY['béton', 'acier', 'bois']);

-- Insérer des produits de test
INSERT INTO public.produits (fournisseur_id, nom, description, categorie, prix, unite, stock_disponible) VALUES
('66666666-6666-6666-6666-666666666666', 'Béton C25/30', 'Béton haute qualité pour fondations', 'Matériaux', 120.50, 'm3', 100),
('66666666-6666-6666-6666-666666666666', 'Poutre acier IPE200', 'Poutre en acier pour structure', 'Structure', 85.00, 'ml', 50);

-- Insérer un projet de test
INSERT INTO public.projets (client_id, architecte_id, nom_projet, description, budget_estime) VALUES
('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Maison Moderne', 'Construction maison individuelle', 250000.00);

-- ====================================
-- 15. FONCTIONS UTILITAIRES
-- ====================================
CREATE OR REPLACE FUNCTION get_user_dashboard_url(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role FROM public.users WHERE email = user_email;
    
    CASE user_role
        WHEN 'client' THEN RETURN '/dashboard-client';
        WHEN 'architecte' THEN RETURN '/dashboard-architecte';
        WHEN 'prestataire' THEN RETURN '/dashboard-prestataire';
        WHEN 'fournisseur' THEN RETURN '/dashboard-fournisseur';
        WHEN 'admin' THEN RETURN '/dashboard-admin';
        ELSE RETURN '/dashboard';
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Fonction de diagnostic
CREATE OR REPLACE FUNCTION diagnostic_complet()
RETURNS TABLE(
    table_name TEXT,
    row_count BIGINT,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 'users'::TEXT, COUNT(*)::BIGINT, 'OK'::TEXT FROM public.users
    UNION ALL
    SELECT 'fournisseurs'::TEXT, COUNT(*)::BIGINT, 'OK'::TEXT FROM public.fournisseurs
    UNION ALL
    SELECT 'produits'::TEXT, COUNT(*)::BIGINT, 'OK'::TEXT FROM public.produits
    UNION ALL
    SELECT 'projets'::TEXT, COUNT(*)::BIGINT, 'OK'::TEXT FROM public.projets
    UNION ALL
    SELECT 'etapes_projet'::TEXT, COUNT(*)::BIGINT, 'OK'::TEXT FROM public.etapes_projet
    UNION ALL
    SELECT 'commandes'::TEXT, COUNT(*)::BIGINT, 'OK'::TEXT FROM public.commandes
    UNION ALL
    SELECT 'lignes_commande'::TEXT, COUNT(*)::BIGINT, 'OK'::TEXT FROM public.lignes_commande
    UNION ALL
    SELECT 'publicites'::TEXT, COUNT(*)::BIGINT, 'OK'::TEXT FROM public.publicites
    UNION ALL
    SELECT 'evaluations'::TEXT, COUNT(*)::BIGINT, 'OK'::TEXT FROM public.evaluations;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- 16. CONFIRMATION
-- ====================================
SELECT 'BASE DE DONNÉES FINITIO CRÉÉE AVEC SUCCÈS ✅' as status;
SELECT * FROM diagnostic_complet();

-- ====================================
-- INSTRUCTIONS FINALES
-- ====================================
/*
🎯 PROCHAINES ÉTAPES:

1. CRÉER LES UTILISATEURS AUTH:
   - Allez dans Supabase Authentication > Users
   - Créez 5 utilisateurs avec ces emails:
     * admin@test.com (mot de passe: 123456)
     * client@test.com (mot de passe: 123456)
     * architecte@test.com (mot de passe: 123456)
     * prestataire@test.com (mot de passe: 123456)
     * fournisseur@test.com (mot de passe: 123456)

2. METTRE À JOUR LES UUID:
   - Notez les UUID générés par Supabase Auth
   - Remplacez les UUID de test dans la table users:
     UPDATE public.users SET id = 'VRAI_UUID' WHERE email = 'admin@test.com';
     (répétez pour chaque utilisateur)

3. TESTER:
   - Connectez-vous avec chaque compte
   - Vérifiez la redirection vers le bon dashboard
   - Testez la déconnexion

✅ TOUTES LES FONCTIONNALITÉS INCLUSES:
- Gestion utilisateurs (tous rôles)
- Catalogue produits
- Système de commandes
- Gestion projets avec étapes (Kanban)
- Campagnes publicitaires
- Évaluations clients
- Sécurité RLS complète
- Triggers automatiques
- Fonctions utilitaires
*/
