-- 🇲🇦 FINITIO MAROC - SCRIPT COMPLET FINAL
-- ==========================================
-- 12 utilisateurs Maroc + Tables spécialisées + Messagerie + Étapes fictives

-- ====================================
-- 0. SUPPRESSION TABLES EXISTANTES
-- ====================================
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.evaluations CASCADE;
DROP TABLE IF EXISTS public.publicites CASCADE;
DROP TABLE IF EXISTS public.lignes_commande CASCADE;
DROP TABLE IF EXISTS public.commandes CASCADE;
DROP TABLE IF EXISTS public.etapes_projet CASCADE;
DROP TABLE IF EXISTS public.projets CASCADE;
DROP TABLE IF EXISTS public.produits CASCADE;
DROP TABLE IF EXISTS public.prestataires CASCADE;
DROP TABLE IF EXISTS public.architectes CASCADE;
DROP TABLE IF EXISTS public.fournisseurs CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Supprimer les fonctions existantes
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_dashboard_url(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.diagnostic_complet() CASCADE;

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
-- 2. TABLE ARCHITECTES
-- ====================================
CREATE TABLE public.architectes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    nom_cabinet VARCHAR(255) NOT NULL,
    numero_ordre VARCHAR(50),
    specialites TEXT[],
    annees_experience INTEGER,
    projets_realises INTEGER DEFAULT 0,
    note_moyenne DECIMAL(3,2) DEFAULT 0,
    tarif_horaire DECIMAL(8,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 3. TABLE PRESTATAIRES
-- ====================================
CREATE TABLE public.prestataires (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    nom_entreprise VARCHAR(255) NOT NULL,
    type_prestation VARCHAR(100),
    specialites TEXT[],
    zone_intervention TEXT[],
    certifications TEXT[],
    assurance_professionnelle BOOLEAN DEFAULT false,
    note_moyenne DECIMAL(3,2) DEFAULT 0,
    tarif_horaire DECIMAL(8,2),
    disponible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 4. TABLE FOURNISSEURS
-- ====================================
CREATE TABLE public.fournisseurs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    nom_entreprise VARCHAR(255) NOT NULL,
    description TEXT,
    specialites TEXT[],
    zone_livraison TEXT[],
    delai_livraison_moyen INTEGER,
    note_moyenne DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 5. TABLE PRODUITS
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
    statut VARCHAR(20) DEFAULT 'actif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 6. TABLE PROJETS
-- ====================================
CREATE TABLE public.projets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    architecte_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    nom_projet VARCHAR(255) NOT NULL,
    description TEXT,
    adresse_projet TEXT,
    ville_projet VARCHAR(100),
    budget_estime DECIMAL(12,2),
    date_debut_prevue DATE,
    date_fin_prevue DATE,
    statut VARCHAR(30) DEFAULT 'planification',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 7. TABLE ÉTAPES PROJET (Kanban)
-- ====================================
CREATE TABLE public.etapes_projet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    projet_id UUID REFERENCES public.projets(id) ON DELETE CASCADE,
    nom_etape VARCHAR(255) NOT NULL,
    description TEXT,
    ordre_etape INTEGER NOT NULL,
    statut VARCHAR(30) DEFAULT 'a_faire',
    responsable_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    date_debut DATE,
    date_fin_prevue DATE,
    pourcentage_completion INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 8. TABLE MESSAGERIE
-- ====================================
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expediteur_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    destinataire_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    projet_id UUID REFERENCES public.projets(id) ON DELETE SET NULL,
    sujet VARCHAR(255) NOT NULL,
    contenu TEXT NOT NULL,
    lu BOOLEAN DEFAULT false,
    important BOOLEAN DEFAULT false,
    type_message VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 9. TABLE COMMANDES
-- ====================================
CREATE TABLE public.commandes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_commande VARCHAR(50) UNIQUE NOT NULL,
    projet_id UUID REFERENCES public.projets(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    fournisseur_id UUID REFERENCES public.fournisseurs(id) ON DELETE CASCADE,
    statut VARCHAR(30) DEFAULT 'en_attente',
    total_ht DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_ttc DECIMAL(10,2) NOT NULL DEFAULT 0,
    adresse_livraison TEXT NOT NULL,
    date_livraison_prevue DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 10. TABLE PUBLICITÉS
-- ====================================
CREATE TABLE public.publicites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fournisseur_id UUID REFERENCES public.fournisseurs(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    budget DECIMAL(10,2) NOT NULL,
    cible_geographique TEXT[],
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    statut VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 11. INDEXES
-- ====================================
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_architectes_user_id ON public.architectes(user_id);
CREATE INDEX idx_prestataires_user_id ON public.prestataires(user_id);
CREATE INDEX idx_fournisseurs_user_id ON public.fournisseurs(user_id);
CREATE INDEX idx_projets_client ON public.projets(client_id);
CREATE INDEX idx_etapes_projet ON public.etapes_projet(projet_id);
CREATE INDEX idx_messages_expediteur ON public.messages(expediteur_id);
CREATE INDEX idx_messages_destinataire ON public.messages(destinataire_id);

-- ====================================
-- 12. TRIGGERS
-- ====================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projets_updated_at BEFORE UPDATE ON public.projets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- 13. RLS POLICIES
-- ====================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.architectes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestataires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fournisseurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Everyone can view architectes" ON public.architectes FOR SELECT USING (true);
CREATE POLICY "Everyone can view prestataires" ON public.prestataires FOR SELECT USING (true);
CREATE POLICY "Everyone can view fournisseurs" ON public.fournisseurs FOR SELECT USING (true);
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (expediteur_id = auth.uid() OR destinataire_id = auth.uid());

-- ====================================
-- 14. DONNÉES TEST - 12 UTILISATEURS MAROC
-- ====================================
INSERT INTO public.users (id, nom, email, role, telephone, ville, adresse) VALUES
-- 1 Admin
('11111111-1111-1111-1111-111111111111', 'Admin Finitio', 'admin@finitio.ma', 'admin', '0661234567', 'Casablanca', 'Boulevard Hassan II'),
-- 2 Architectes
('22222222-2222-2222-2222-222222222222', 'Youssef Bennani', 'y.bennani@architecte.ma', 'architecte', '0662345678', 'Rabat', 'Avenue Mohammed V'),
('33333333-3333-3333-3333-333333333333', 'Fatima Alaoui', 'f.alaoui@design.ma', 'architecte', '0663456789', 'Marrakech', 'Quartier Gueliz'),
-- 2 Fournisseurs
('44444444-4444-4444-4444-444444444444', 'Hassan Matériaux', 'h.materiaux@fournisseur.ma', 'fournisseur', '0664567890', 'Casablanca', 'Zone Industrielle Ain Sebaa'),
('55555555-5555-5555-5555-555555555555', 'Brico Maroc SARL', 'contact@bricomaroc.ma', 'fournisseur', '0665678901', 'Fès', 'Route de Sefrou'),
-- 3 Prestataires
('66666666-6666-6666-6666-666666666666', 'Ahmed Maçonnerie', 'a.maconnerie@prestataire.ma', 'prestataire', '0666789012', 'Casablanca', 'Sidi Bernoussi'),
('77777777-7777-7777-7777-777777777777', 'Électro Plus', 'electro.plus@prestataire.ma', 'prestataire', '0667890123', 'Rabat', 'Hay Riad'),
('88888888-8888-8888-8888-888888888888', 'Plomberie Moderne', 'plomberie.moderne@prestataire.ma', 'prestataire', '0668901234', 'Tanger', 'Boulevard Pasteur'),
-- 5 Clients
('99999999-9999-9999-9999-999999999999', 'Mohamed Client', 'm.client1@gmail.com', 'client', '0669012345', 'Casablanca', 'Maarif'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Aicha Benali', 'a.benali@gmail.com', 'client', '0660123456', 'Rabat', 'Agdal'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Omar Tazi', 'o.tazi@gmail.com', 'client', '0661234567', 'Marrakech', 'Hivernage'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Khadija Fassi', 'k.fassi@gmail.com', 'client', '0662345678', 'Fès', 'Ville Nouvelle'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Rachid Amrani', 'r.amrani@gmail.com', 'client', '0663456789', 'Agadir', 'Secteur Touristique');

-- ====================================
-- 15. DONNÉES ARCHITECTES
-- ====================================
INSERT INTO public.architectes (user_id, nom_cabinet, numero_ordre, specialites, annees_experience, projets_realises, tarif_horaire) VALUES
('22222222-2222-2222-2222-222222222222', 'Cabinet Bennani Architecture', 'OA-2018-001', ARRAY['Résidentiel', 'Commercial'], 8, 45, 500.00),
('33333333-3333-3333-3333-333333333333', 'Alaoui Design Studio', 'OA-2020-087', ARRAY['Résidentiel de luxe', 'Hôtellerie'], 6, 32, 650.00);

-- ====================================
-- 16. DONNÉES PRESTATAIRES
-- ====================================
INSERT INTO public.prestataires (user_id, nom_entreprise, type_prestation, specialites, zone_intervention, tarif_horaire) VALUES
('66666666-6666-6666-6666-666666666666', 'Ahmed Maçonnerie SARL', 'Maçonnerie', ARRAY['Gros œuvre', 'Fondations'], ARRAY['Casablanca', 'Mohammedia'], 180.00),
('77777777-7777-7777-7777-777777777777', 'Électro Plus', 'Électricité', ARRAY['Installation électrique', 'Domotique'], ARRAY['Rabat', 'Salé'], 220.00),
('88888888-8888-8888-8888-888888888888', 'Plomberie Moderne', 'Plomberie', ARRAY['Plomberie sanitaire', 'Chauffage'], ARRAY['Tanger', 'Tétouan'], 200.00);

-- ====================================
-- 17. DONNÉES FOURNISSEURS
-- ====================================
INSERT INTO public.fournisseurs (user_id, nom_entreprise, description, specialites, zone_livraison, delai_livraison_moyen) VALUES
('44444444-4444-4444-4444-444444444444', 'Hassan Matériaux', 'Fournisseur matériaux construction depuis 1995', ARRAY['Ciment', 'Acier', 'Béton'], ARRAY['Casablanca', 'Rabat'], 3),
('55555555-5555-5555-5555-555555555555', 'Brico Maroc SARL', 'Distributeur outillage et matériaux finition', ARRAY['Carrelage', 'Peinture', 'Outillage'], ARRAY['Fès', 'Meknès'], 5);

-- ====================================
-- 18. PROJETS DE TEST
-- ====================================
INSERT INTO public.projets (client_id, architecte_id, nom_projet, description, ville_projet, budget_estime, statut) VALUES
('99999999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222', 'Villa Moderne Casablanca', 'Construction villa R+1 avec piscine', 'Casablanca', 2500000.00, 'en_cours'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'Rénovation Riad Marrakech', 'Rénovation complète riad traditionnel', 'Marrakech', 800000.00, 'en_cours'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Appartement Agdal', 'Aménagement appartement 120m2', 'Rabat', 350000.00, 'planification');

-- ====================================
-- 19. ÉTAPES FICTIVES POUR TESTS
-- ====================================
INSERT INTO public.etapes_projet (projet_id, nom_etape, description, ordre_etape, statut, responsable_id, pourcentage_completion) VALUES
-- Villa Moderne Casablanca
((SELECT id FROM public.projets WHERE nom_projet = 'Villa Moderne Casablanca'), 'Études et permis', 'Étude de sol et dépôt permis', 1, 'termine', '22222222-2222-2222-2222-222222222222', 100),
((SELECT id FROM public.projets WHERE nom_projet = 'Villa Moderne Casablanca'), 'Terrassement', 'Préparation terrain et fondations', 2, 'termine', '66666666-6666-6666-6666-666666666666', 100),
((SELECT id FROM public.projets WHERE nom_projet = 'Villa Moderne Casablanca'), 'Gros œuvre', 'Construction structure principale', 3, 'en_cours', '66666666-6666-6666-6666-666666666666', 65),
((SELECT id FROM public.projets WHERE nom_projet = 'Villa Moderne Casablanca'), 'Électricité', 'Installation électrique complète', 4, 'a_faire', '77777777-7777-7777-7777-777777777777', 0),
((SELECT id FROM public.projets WHERE nom_projet = 'Villa Moderne Casablanca'), 'Plomberie', 'Installation sanitaire et chauffage', 5, 'a_faire', '88888888-8888-8888-8888-888888888888', 0),
((SELECT id FROM public.projets WHERE nom_projet = 'Villa Moderne Casablanca'), 'Finitions', 'Peinture, carrelage, menuiserie', 6, 'a_faire', NULL, 0),

-- Riad Marrakech
((SELECT id FROM public.projets WHERE nom_projet = 'Rénovation Riad Marrakech'), 'Diagnostic', 'État des lieux et diagnostic structure', 1, 'termine', '33333333-3333-3333-3333-333333333333', 100),
((SELECT id FROM public.projets WHERE nom_projet = 'Rénovation Riad Marrakech'), 'Démolition', 'Démolition parties à rénover', 2, 'en_cours', '66666666-6666-6666-6666-666666666666', 40),
((SELECT id FROM public.projets WHERE nom_projet = 'Rénovation Riad Marrakech'), 'Restauration', 'Restauration éléments traditionnels', 3, 'a_faire', NULL, 0),

-- Appartement Agdal
((SELECT id FROM public.projets WHERE nom_projet = 'Appartement Agdal'), 'Conception', 'Plans d''aménagement intérieur', 1, 'en_cours', '22222222-2222-2222-2222-222222222222', 80),
((SELECT id FROM public.projets WHERE nom_projet = 'Appartement Agdal'), 'Devis', 'Établissement devis détaillés', 2, 'a_faire', NULL, 0);

-- ====================================
-- 20. MESSAGES DE TEST
-- ====================================
INSERT INTO public.messages (expediteur_id, destinataire_id, projet_id, sujet, contenu, type_message) VALUES
('99999999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222', 
 (SELECT id FROM public.projets WHERE nom_projet = 'Villa Moderne Casablanca'), 
 'Avancement travaux gros œuvre', 
 'Bonjour, pouvez-vous me donner un point sur l''avancement des travaux de gros œuvre ? Merci.', 'projet'),

('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666',
 (SELECT id FROM public.projets WHERE nom_projet = 'Villa Moderne Casablanca'),
 'Planning électricité',
 'Ahmed, quand pouvez-vous commencer l''installation électrique ? Le gros œuvre sera terminé fin de semaine.', 'projet'),

('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333',
 (SELECT id FROM public.projets WHERE nom_projet = 'Rénovation Riad Marrakech'),
 'Choix matériaux traditionnels',
 'Fatima, j''aimerais discuter du choix des matériaux pour la restauration du patio central.', 'projet');

-- ====================================
-- 21. FONCTIONS UTILITAIRES
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

-- ====================================
-- 22. DIAGNOSTIC COMPLET
-- ====================================
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
    SELECT 'architectes'::TEXT, COUNT(*)::BIGINT, 'OK'::TEXT FROM public.architectes
    UNION ALL
    SELECT 'prestataires'::TEXT, COUNT(*)::BIGINT, 'OK'::TEXT FROM public.prestataires
    UNION ALL
    SELECT 'fournisseurs'::TEXT, COUNT(*)::BIGINT, 'OK'::TEXT FROM public.fournisseurs
    UNION ALL
    SELECT 'projets'::TEXT, COUNT(*)::BIGINT, 'OK'::TEXT FROM public.projets
    UNION ALL
    SELECT 'etapes_projet'::TEXT, COUNT(*)::BIGINT, 'OK'::TEXT FROM public.etapes_projet
    UNION ALL
    SELECT 'messages'::TEXT, COUNT(*)::BIGINT, 'OK'::TEXT FROM public.messages;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- 23. CONFIRMATION
-- ====================================
SELECT 'BASE DE DONNÉES FINITIO MAROC CRÉÉE AVEC SUCCÈS ✅' as status;
SELECT * FROM diagnostic_complet();

/*
🇲🇦 FINITIO MAROC - INSTRUCTIONS FINALES:

1. CRÉER LES 12 UTILISATEURS AUTH:
   - admin@finitio.ma (admin)
   - y.bennani@architecte.ma, f.alaoui@design.ma (architectes)
   - h.materiaux@fournisseur.ma, contact@bricomaroc.ma (fournisseurs)
   - a.maconnerie@prestataire.ma, electro.plus@prestataire.ma, plomberie.moderne@prestataire.ma (prestataires)
   - m.client1@gmail.com, a.benali@gmail.com, o.tazi@gmail.com, k.fassi@gmail.com, r.amrani@gmail.com (clients)

2. METTRE À JOUR LES UUID:
   UPDATE public.users SET id = 'VRAI_UUID_AUTH' WHERE email = 'admin@finitio.ma';

3. TESTER:
   - Connexion avec chaque rôle
   - Redirection vers dashboards
   - Système de messagerie
   - Projets avec étapes Kanban

✅ INCLUS:
- 12 utilisateurs Maroc (2 architectes, 2 fournisseurs, 3 prestataires, 5 clients)
- Tables spécialisées architectes/prestataires
- 3 projets avec étapes fictives
- Système messagerie
- Fonctions diagnostic
*/
