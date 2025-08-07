-- ✅ SCRIPT GÉNÉRATION DONNÉES FICTIVES KANBAN
-- Génère des projets, étapes et données de test pour Finitio

-- 🏗️ PROJETS DE TEST
INSERT INTO projets (id, user_id, titre, description, localisation, budget, statut, date_creation) VALUES
('proj-001', 'user-test-client-1', 'Villa Moderne Rabat', 'Construction d''une villa contemporaine de 250m² avec piscine et jardin paysager', 'Rabat, Maroc', 850000.00, 'en_cours', '2024-01-15T10:00:00Z'),
('proj-002', 'user-test-client-2', 'Rénovation Appartement Casablanca', 'Rénovation complète d''un appartement haussmannien de 120m² avec cuisine ouverte', 'Casablanca, Maroc', 180000.00, 'en_cours', '2024-02-01T14:30:00Z'),
('proj-003', 'user-test-client-3', 'Extension Maison Marrakech', 'Extension de 80m² avec terrasse couverte et suite parentale', 'Marrakech, Maroc', 320000.00, 'planifie', '2024-02-20T09:15:00Z'),
('proj-004', 'user-test-client-1', 'Loft Industriel Tanger', 'Transformation d''un ancien entrepôt en loft moderne de 180m²', 'Tanger, Maroc', 450000.00, 'en_cours', '2024-01-30T16:45:00Z'),
('proj-005', 'user-test-client-4', 'Maison Écologique Fès', 'Construction d''une maison bioclimatique avec panneaux solaires', 'Fès, Maroc', 680000.00, 'planifie', '2024-03-01T11:20:00Z');

-- 📋 ÉTAPES KANBAN DÉTAILLÉES
INSERT INTO etapes (id, projet_id, nom, description, statut, ordre, date_debut, date_fin_prevue, budget_prevu, responsable, progression) VALUES

-- PROJET 1: Villa Moderne Rabat
('etape-001', 'proj-001', 'Étude de faisabilité', 'Analyse du terrain, étude géotechnique et faisabilité architecturale', 'termine', 1, '2024-01-15', '2024-01-25', 15000.00, 'Bureau d''études ATLAS', 100),
('etape-002', 'proj-001', 'Plans architecturaux', 'Conception des plans détaillés et dossier de permis de construire', 'termine', 2, '2024-01-26', '2024-02-15', 25000.00, 'Architecte Youssef BENALI', 100),
('etape-003', 'proj-001', 'Permis de construire', 'Dépôt et obtention du permis de construire municipal', 'en_cours', 3, '2024-02-16', '2024-03-15', 5000.00, 'Cabinet juridique SARL', 75),
('etape-004', 'proj-001', 'Terrassement', 'Préparation du terrain et fondations', 'en_attente', 4, '2024-03-16', '2024-04-05', 45000.00, 'Entreprise TRAVAUX PLUS', 0),
('etape-005', 'proj-001', 'Gros œuvre', 'Structure béton, murs porteurs et charpente', 'planifie', 5, '2024-04-06', '2024-06-30', 280000.00, 'BTP CONSTRUCTION', 0),
('etape-006', 'proj-001', 'Second œuvre', 'Électricité, plomberie, cloisons et isolation', 'planifie', 6, '2024-07-01', '2024-09-15', 150000.00, 'MULTI-SERVICES PRO', 0),
('etape-007', 'proj-001', 'Finitions', 'Carrelage, peinture, menuiserie et aménagements', 'planifie', 7, '2024-09-16', '2024-11-30', 120000.00, 'FINITION PREMIUM', 0),
('etape-008', 'proj-001', 'Aménagement extérieur', 'Piscine, jardin paysager et terrasses', 'planifie', 8, '2024-12-01', '2024-12-31', 85000.00, 'JARDINS & PISCINES', 0),

-- PROJET 2: Rénovation Appartement Casablanca
('etape-009', 'proj-002', 'Diagnostic technique', 'État des lieux et diagnostic des installations existantes', 'termine', 1, '2024-02-01', '2024-02-05', 3000.00, 'Expert bâtiment DIAG+', 100),
('etape-010', 'proj-002', 'Démolition', 'Démolition des cloisons et ancienne cuisine', 'termine', 2, '2024-02-06', '2024-02-12', 8000.00, 'DEMO RAPIDE SARL', 100),
('etape-011', 'proj-002', 'Électricité', 'Mise aux normes électriques et nouveaux circuits', 'en_cours', 3, '2024-02-13', '2024-02-25', 15000.00, 'ELEC MODERNE', 60),
('etape-012', 'proj-002', 'Plomberie', 'Rénovation complète plomberie et sanitaires', 'en_attente', 4, '2024-02-26', '2024-03-10', 12000.00, 'PLOMBERIE EXPRESS', 0),
('etape-013', 'proj-002', 'Cloisons', 'Nouvelles cloisons et ouverture cuisine', 'planifie', 5, '2024-03-11', '2024-03-20', 18000.00, 'CLOISONS PRO', 0),
('etape-014', 'proj-002', 'Cuisine équipée', 'Installation cuisine moderne avec îlot central', 'planifie', 6, '2024-03-21', '2024-04-05', 35000.00, 'CUISINES DESIGN', 0),
('etape-015', 'proj-002', 'Sols et peinture', 'Parquet, carrelage et peinture complète', 'planifie', 7, '2024-04-06', '2024-04-25', 25000.00, 'RÉNOVATION TOTALE', 0),

-- PROJET 3: Extension Maison Marrakech
('etape-016', 'proj-003', 'Plans d''extension', 'Conception architecturale de l''extension 80m²', 'en_cours', 1, '2024-02-20', '2024-03-15', 18000.00, 'Architecte Fatima ALAOUI', 40),
('etape-017', 'proj-003', 'Autorisation travaux', 'Déclaration préalable de travaux en mairie', 'en_attente', 2, '2024-03-16', '2024-04-15', 2000.00, 'Cabinet URBANISME+', 0),
('etape-018', 'proj-003', 'Fondations extension', 'Fondations pour la nouvelle partie', 'planifie', 3, '2024-04-16', '2024-05-05', 25000.00, 'FONDATIONS EXPERT', 0),
('etape-019', 'proj-003', 'Structure extension', 'Murs, charpente et couverture extension', 'planifie', 4, '2024-05-06', '2024-06-30', 85000.00, 'CONSTRUCTION ATLAS', 0),
('etape-020', 'proj-003', 'Raccordements', 'Raccordement électricité, plomberie, chauffage', 'planifie', 5, '2024-07-01', '2024-07-20', 15000.00, 'RACCORD SERVICES', 0),
('etape-021', 'proj-003', 'Aménagement suite', 'Suite parentale avec salle de bain et dressing', 'planifie', 6, '2024-07-21', '2024-08-31', 45000.00, 'AMÉNAGEMENT LUXE', 0),

-- PROJET 4: Loft Industriel Tanger
('etape-022', 'proj-004', 'Étude structure', 'Analyse de la structure existante de l''entrepôt', 'termine', 1, '2024-01-30', '2024-02-08', 8000.00, 'Bureau études STRUCTURE', 100),
('etape-023', 'proj-004', 'Désamiantage', 'Désamiantage et déplombage de l''ancien bâtiment', 'termine', 2, '2024-02-09', '2024-02-20', 25000.00, 'DÉSAMIANTAGE PRO', 100),
('etape-024', 'proj-004', 'Renforcement structure', 'Renforcement poutres et création mezzanine', 'en_cours', 3, '2024-02-21', '2024-03-25', 65000.00, 'MÉTALLERIE MODERNE', 45),
('etape-025', 'proj-004', 'Isolation thermique', 'Isolation complète murs et toiture', 'en_attente', 4, '2024-03-26', '2024-04-15', 35000.00, 'ISOLATION EXPERT', 0),
('etape-026', 'proj-004', 'Verrières industrielles', 'Installation grandes verrières style industriel', 'planifie', 5, '2024-04-16', '2024-05-10', 55000.00, 'VERRIÈRES DESIGN', 0),
('etape-027', 'proj-004', 'Loft aménagement', 'Aménagement espaces de vie style loft', 'planifie', 6, '2024-05-11', '2024-07-31', 180000.00, 'LOFT CRÉATION', 0),

-- PROJET 5: Maison Écologique Fès
('etape-028', 'proj-005', 'Étude bioclimatique', 'Analyse orientation, vents et conception bioclimatique', 'planifie', 1, '2024-03-01', '2024-03-20', 12000.00, 'ECO CONCEPTION', 0),
('etape-029', 'proj-005', 'Matériaux écologiques', 'Sélection matériaux biosourcés et locaux', 'planifie', 2, '2024-03-21', '2024-04-05', 8000.00, 'MATÉRIAUX VERTS', 0),
('etape-030', 'proj-005', 'Fondations écologiques', 'Fondations avec isolation naturelle', 'planifie', 3, '2024-04-06', '2024-04-30', 45000.00, 'ECO CONSTRUCTION', 0);

-- 👥 UTILISATEURS DE TEST (si pas déjà existants)
INSERT INTO users (id, email, nom, prenom, role, telephone, ville, created_at) VALUES
('user-test-client-1', 'client1@test.com', 'BENNANI', 'Ahmed', 'client', '+212661234567', 'Rabat', '2024-01-10T08:00:00Z'),
('user-test-client-2', 'client2@test.com', 'ALAMI', 'Fatima', 'client', '+212662345678', 'Casablanca', '2024-01-12T10:30:00Z'),
('user-test-client-3', 'client3@test.com', 'TAZI', 'Youssef', 'client', '+212663456789', 'Marrakech', '2024-01-15T14:15:00Z'),
('user-test-client-4', 'client4@test.com', 'FASSI', 'Aicha', 'client', '+212664567890', 'Fès', '2024-01-18T16:45:00Z'),
('user-test-architecte-1', 'architecte1@test.com', 'BENALI', 'Youssef', 'architecte', '+212665678901', 'Rabat', '2024-01-08T09:00:00Z'),
('user-test-architecte-2', 'architecte2@test.com', 'ALAOUI', 'Fatima', 'architecte', '+212666789012', 'Marrakech', '2024-01-09T11:30:00Z')
ON CONFLICT (id) DO NOTHING;

-- 💰 DEVIS DE TEST
INSERT INTO devis (id, projet_id, fournisseur_id, montant, description, statut, date_creation, fichier_url) VALUES
('devis-001', 'proj-001', 'user-test-architecte-1', 25000.00, 'Plans architecturaux complets avec 3D et dossier permis', 'accepte', '2024-01-20T10:00:00Z', 'https://exemple.com/devis-plans-villa.pdf'),
('devis-002', 'proj-001', 'user-test-architecte-1', 280000.00, 'Gros œuvre complet - structure béton armé', 'en_attente', '2024-02-15T14:30:00Z', 'https://exemple.com/devis-gros-oeuvre.pdf'),
('devis-003', 'proj-002', 'user-test-architecte-2', 15000.00, 'Mise aux normes électriques complète', 'accepte', '2024-02-10T09:15:00Z', 'https://exemple.com/devis-electricite.pdf'),
('devis-004', 'proj-002', 'user-test-architecte-2', 35000.00, 'Cuisine équipée haut de gamme avec îlot', 'en_cours', '2024-02-25T16:45:00Z', 'https://exemple.com/devis-cuisine.pdf'),
('devis-005', 'proj-003', 'user-test-architecte-2', 18000.00, 'Plans d''extension avec étude thermique', 'en_attente', '2024-02-22T11:20:00Z', 'https://exemple.com/devis-extension.pdf');

-- 📊 STATISTIQUES POUR ANALYTICS
INSERT INTO analytics_page_views (session_id, page_name, user_id, view_duration, scroll_depth, created_at) VALUES
('session-test-1', 'Dashboard Client', 'user-test-client-1', 180, 85, '2024-02-28T10:15:00Z'),
('session-test-2', 'Kanban Étapes', 'user-test-client-1', 240, 95, '2024-02-28T10:20:00Z'),
('session-test-3', 'Nouveau Projet', 'user-test-client-2', 320, 100, '2024-02-28T11:30:00Z'),
('session-test-4', 'Gestion Étapes', 'user-test-architecte-1', 450, 90, '2024-02-28T14:45:00Z'),
('session-test-5', 'Validation Devis', 'user-test-architecte-1', 280, 75, '2024-02-28T15:30:00Z');

-- 💬 MESSAGES DE TEST (si table existe)
INSERT INTO conversations (id, nom, type, projet_id, created_at, updated_at) VALUES
('conv-001', 'Villa Moderne Rabat - Équipe', 'projet', 'proj-001', '2024-01-15T10:00:00Z', '2024-02-28T16:30:00Z'),
('conv-002', 'Rénovation Casablanca - Suivi', 'projet', 'proj-002', '2024-02-01T14:30:00Z', '2024-02-28T17:15:00Z'),
('conv-003', 'Extension Marrakech - Planning', 'projet', 'proj-003', '2024-02-20T09:15:00Z', '2024-02-28T18:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ✅ CONFIRMATION
SELECT 'Données de test générées avec succès!' as message,
       COUNT(*) as projets_crees FROM projets WHERE id LIKE 'proj-%';

SELECT 'Étapes Kanban créées:' as message,
       COUNT(*) as etapes_total,
       COUNT(CASE WHEN statut = 'termine' THEN 1 END) as terminees,
       COUNT(CASE WHEN statut = 'en_cours' THEN 1 END) as en_cours,
       COUNT(CASE WHEN statut = 'en_attente' THEN 1 END) as en_attente,
       COUNT(CASE WHEN statut = 'planifie' THEN 1 END) as planifiees
FROM etapes WHERE id LIKE 'etape-%';

-- 🎯 RÉSUMÉ DES DONNÉES CRÉÉES:
-- - 5 projets de test variés (villa, rénovation, extension, loft, écologique)
-- - 30 étapes Kanban avec statuts réalistes et progression
-- - 6 utilisateurs de test (4 clients + 2 architectes)
-- - 5 devis avec différents statuts
-- - Données analytics pour tableaux de bord
-- - Conversations de test pour messagerie

-- Les données sont prêtes pour tester:
-- ✅ Kanban avec étapes en cours, terminées, planifiées
-- ✅ Dashboards avec statistiques réelles
-- ✅ Workflows complets de création/gestion projets
-- ✅ Système de devis fonctionnel
