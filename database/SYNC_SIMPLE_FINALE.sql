-- 🔄 SYNCHRONISATION SIMPLE - FINITIO MAROC
-- ==========================================
-- Supprime et recrée les données avec les bons UUID

-- ====================================
-- 1. SUPPRIMER LES DONNÉES LIÉES
-- ====================================
DELETE FROM public.messages;
DELETE FROM public.etapes_projet;
DELETE FROM public.projets;
DELETE FROM public.architectes;
DELETE FROM public.prestataires;
DELETE FROM public.fournisseurs;
DELETE FROM public.users;

-- ====================================
-- 2. RECRÉER USERS AVEC UUID RÉELS CORRECTS
-- ====================================
INSERT INTO public.users (id, nom, email, role, telephone, ville, adresse) VALUES
-- Admin
('21f21e16-e621-4b7e-9e63-464102eec16c', 'Admin Finitio', 'admin@finitio.ma', 'admin', '0661234567', 'Casablanca', 'Boulevard Hassan II'),
-- Architectes
('c2b891d1-13e1-4ce4-b66c-3db1d364df40', 'Youssef Bennani', 'y.bennani@architecte.ma', 'architecte', '0662345678', 'Rabat', 'Avenue Mohammed V'),
('1f1c8d40-90c9-4200-93ea-2c0d9f840fc3', 'Fatima Alaoui', 'f.alaoui@design.ma', 'architecte', '0663456789', 'Marrakech', 'Quartier Gueliz'),
-- Fournisseurs
('338a406-b905-4b60-9f9b-b2a86081d719', 'Hassan Matériaux', 'h.materiaux@fournisseur.ma', 'fournisseur', '0664567890', 'Casablanca', 'Zone Industrielle Ain Sebaa'),
('cf9cf7f1-0744-4bb1-a51e-c5c9f98fa9e0', 'Brico Maroc SARL', 'contact@bricomaroc.ma', 'fournisseur', '0665678901', 'Fès', 'Route de Sefrou'),
-- Prestataires
('53a30367-87c7-4465-8b75-df35b8afe137', 'Ahmed Maçonnerie', 'a.maconnerie@prestataire.ma', 'prestataire', '0666789012', 'Casablanca', 'Sidi Bernoussi'),
('1ad88999-0a93-4507-ba2e-415dddd2ee5b', 'Électro Plus', 'electro.plus@prestataire.ma', 'prestataire', '0667890123', 'Rabat', 'Hay Riad'),
('1c8b0ef4-b231-4129-bcb4-d818dc15dd2c', 'Plomberie Moderne', 'plomberie.moderne@prestataire.ma', 'prestataire', '0668901234', 'Tanger', 'Boulevard Pasteur'),
-- Clients
('8f5d1ae6-7f53-4361-a42a-7731f7f1bb54', 'Mohamed Client', 'm.client1@gmail.com', 'client', '0669012345', 'Casablanca', 'Maarif'),
('8b2b9e1b-9ff1-4a9a-b1aa-4c9ae5a7bb5b', 'Aicha Benali', 'a.benali@gmail.com', 'client', '0660123456', 'Rabat', 'Agdal'),
('c7949ec9-359a-40cd-bc5b-968cc16ba370', 'Omar Tazi', 'o.tazi@gmail.com', 'client', '0661234567', 'Marrakech', 'Hivernage'),
('044ba282-3798-4fac-8e87-f1dcf3465775', 'Khadija Fassi', 'k.fassi@gmail.com', 'client', '0662345678', 'Fès', 'Ville Nouvelle'),
('e53374eb-86c9-4a5a-aa32-523c483609439', 'Rachid Amrani', 'r.amrani@gmail.com', 'client', '0663456789', 'Agadir', 'Secteur Touristique');

-- ====================================
-- 3. RECRÉER ARCHITECTES
-- ====================================
INSERT INTO public.architectes (user_id, nom_cabinet, numero_ordre, specialites, annees_experience, projets_realises, tarif_horaire) VALUES
('c2b891d1-13e1-4ce4-b66c-3db1d364df40', 'Cabinet Bennani Architecture', 'OA-2018-001', ARRAY['Résidentiel', 'Commercial'], 8, 45, 500.00),
('1f1c8d40-90c9-4200-93ea-2c0d9f840fc3', 'Alaoui Design Studio', 'OA-2020-087', ARRAY['Résidentiel de luxe', 'Hôtellerie'], 6, 32, 650.00);

-- ====================================
-- 4. RECRÉER PRESTATAIRES
-- ====================================
INSERT INTO public.prestataires (user_id, nom_entreprise, type_prestation, specialites, zone_intervention, tarif_horaire) VALUES
('53a30367-87c7-4465-8b75-df35b8afe137', 'Ahmed Maçonnerie SARL', 'Maçonnerie', ARRAY['Gros œuvre', 'Fondations'], ARRAY['Casablanca', 'Mohammedia'], 180.00),
('1ad88999-0a93-4507-ba2e-415dddd2ee5b', 'Électro Plus', 'Électricité', ARRAY['Installation électrique', 'Domotique'], ARRAY['Rabat', 'Salé'], 220.00),
('1c8b0ef4-b231-4129-bcb4-d818dc15dd2c', 'Plomberie Moderne', 'Plomberie', ARRAY['Plomberie sanitaire', 'Chauffage'], ARRAY['Tanger', 'Tétouan'], 200.00);

-- ====================================
-- 5. RECRÉER FOURNISSEURS
-- ====================================
INSERT INTO public.fournisseurs (user_id, nom_entreprise, description, specialites, zone_livraison, delai_livraison_moyen) VALUES
('338a406-b905-4b60-9f9b-b2a86081d719', 'Hassan Matériaux', 'Fournisseur matériaux construction depuis 1995', ARRAY['Ciment', 'Acier', 'Béton'], ARRAY['Casablanca', 'Rabat'], 3),
('cf9cf7f1-0744-4bb1-a51e-c5c9f98fa9e0', 'Brico Maroc SARL', 'Distributeur outillage et matériaux finition', ARRAY['Carrelage', 'Peinture', 'Outillage'], ARRAY['Fès', 'Meknès'], 5);

-- ====================================
-- 6. RECRÉER PROJETS
-- ====================================
INSERT INTO public.projets (client_id, architecte_id, nom_projet, description, ville_projet, budget_estime, statut) VALUES
('8f5d1ae6-7f53-4361-a42a-7731f7f1bb54', 'c2b891d1-13e1-4ce4-b66c-3db1d364df40', 'Villa Moderne Casablanca', 'Construction villa R+1 avec piscine', 'Casablanca', 2500000.00, 'en_cours'),
('8b2b9e1b-9ff1-4a9a-b1aa-4c9ae5a7bb5b', '1f1c8d40-90c9-4200-93ea-2c0d9f840fc3', 'Rénovation Riad Marrakech', 'Rénovation complète riad traditionnel', 'Marrakech', 800000.00, 'en_cours'),
('c7949ec9-359a-40cd-bc5b-968cc16ba370', 'c2b891d1-13e1-4ce4-b66c-3db1d364df40', 'Appartement Agdal', 'Aménagement appartement 120m2', 'Rabat', 350000.00, 'planification');

-- ====================================
-- 7. RECRÉER ÉTAPES PROJET
-- ====================================
INSERT INTO public.etapes_projet (projet_id, nom_etape, description, ordre_etape, statut, responsable_id, pourcentage_completion) VALUES
-- Villa Moderne Casablanca
((SELECT id FROM public.projets WHERE nom_projet = 'Villa Moderne Casablanca'), 'Études et permis', 'Étude de sol et dépôt permis', 1, 'termine', 'c2b891d1-13e1-4ce4-b66c-3db1d364df40', 100),
((SELECT id FROM public.projets WHERE nom_projet = 'Villa Moderne Casablanca'), 'Terrassement', 'Préparation terrain et fondations', 2, 'termine', '53a30367-87c7-4465-8b75-df35b8afe137', 100),
((SELECT id FROM public.projets WHERE nom_projet = 'Villa Moderne Casablanca'), 'Gros œuvre', 'Construction structure principale', 3, 'en_cours', '53a30367-87c7-4465-8b75-df35b8afe137', 65),
((SELECT id FROM public.projets WHERE nom_projet = 'Villa Moderne Casablanca'), 'Électricité', 'Installation électrique complète', 4, 'a_faire', '1ad88999-0a93-4507-ba2e-415dddd2ee5b', 0),
((SELECT id FROM public.projets WHERE nom_projet = 'Villa Moderne Casablanca'), 'Plomberie', 'Installation sanitaire et chauffage', 5, 'a_faire', '1c8b0ef4-b231-4129-bcb4-d818dc15dd2c', 0),
((SELECT id FROM public.projets WHERE nom_projet = 'Villa Moderne Casablanca'), 'Finitions', 'Peinture, carrelage, menuiserie', 6, 'a_faire', NULL, 0),

-- Riad Marrakech
((SELECT id FROM public.projets WHERE nom_projet = 'Rénovation Riad Marrakech'), 'Diagnostic', 'État des lieux et diagnostic structure', 1, 'termine', '1f1c8d40-90c9-4200-93ea-2c0d9f840fc3', 100),
((SELECT id FROM public.projets WHERE nom_projet = 'Rénovation Riad Marrakech'), 'Démolition', 'Démolition parties à rénover', 2, 'en_cours', '53a30367-87c7-4465-8b75-df35b8afe137', 40),
((SELECT id FROM public.projets WHERE nom_projet = 'Rénovation Riad Marrakech'), 'Restauration', 'Restauration éléments traditionnels', 3, 'a_faire', NULL, 0),

-- Appartement Agdal
((SELECT id FROM public.projets WHERE nom_projet = 'Appartement Agdal'), 'Conception', 'Plans d''aménagement intérieur', 1, 'en_cours', 'c2b891d1-13e1-4ce4-b66c-3db1d364df40', 80),
((SELECT id FROM public.projets WHERE nom_projet = 'Appartement Agdal'), 'Devis', 'Établissement devis détaillés', 2, 'a_faire', NULL, 0);

-- ====================================
-- 8. RECRÉER MESSAGES
-- ====================================
INSERT INTO public.messages (expediteur_id, destinataire_id, projet_id, sujet, contenu, type_message) VALUES
('8f5d1ae6-7f53-4361-a42a-7731f7f1bb54', 'c2b891d1-13e1-4ce4-b66c-3db1d364df40', 
 (SELECT id FROM public.projets WHERE nom_projet = 'Villa Moderne Casablanca'), 
 'Avancement travaux gros œuvre', 
 'Bonjour, pouvez-vous me donner un point sur l''avancement des travaux de gros œuvre ? Merci.', 'projet'),

('c2b891d1-13e1-4ce4-b66c-3db1d364df40', '53a30367-87c7-4465-8b75-df35b8afe137',
 (SELECT id FROM public.projets WHERE nom_projet = 'Villa Moderne Casablanca'),
 'Planning électricité',
 'Ahmed, quand pouvez-vous commencer l''installation électrique ? Le gros œuvre sera terminé fin de semaine.', 'projet'),

('8b2b9e1b-9ff1-4a9a-b1aa-4c9ae5a7bb5b', '1f1c8d40-90c9-4200-93ea-2c0d9f840fc3',
 (SELECT id FROM public.projets WHERE nom_projet = 'Rénovation Riad Marrakech'),
 'Choix matériaux traditionnels',
 'Fatima, j''aimerais discuter du choix des matériaux pour la restauration du patio central.', 'projet');

-- ====================================
-- 9. VÉRIFICATION FINALE
-- ====================================
SELECT 'SYNCHRONISATION SIMPLE TERMINÉE ✅' as status;

-- Vérifier les utilisateurs
SELECT '=== UTILISATEURS SYNCHRONISÉS ===' as section;
SELECT email, id, role FROM public.users ORDER BY role, email;

-- Vérifier les architectes
SELECT '=== ARCHITECTES ===' as section;
SELECT a.nom_cabinet, u.email, a.user_id 
FROM public.architectes a 
JOIN public.users u ON a.user_id = u.id;

-- Vérifier les projets
SELECT '=== PROJETS ===' as section;
SELECT p.nom_projet, 
       uc.email as client_email, 
       ua.email as architecte_email
FROM public.projets p
JOIN public.users uc ON p.client_id = uc.id
LEFT JOIN public.users ua ON p.architecte_id = ua.id;

-- Test de connexion
SELECT '=== TEST CONNEXION ===' as section;
SELECT 
    u.email,
    u.role,
    CASE u.role
        WHEN 'client' THEN '/dashboard-client'
        WHEN 'architecte' THEN '/dashboard-architecte'
        WHEN 'prestataire' THEN '/dashboard-prestataire'
        WHEN 'fournisseur' THEN '/dashboard-fournisseur'
        WHEN 'admin' THEN '/dashboard-admin'
    END as redirection_attendue
FROM public.users u
WHERE u.email = 'y.bennani@architecte.ma';

SELECT 'PRÊT POUR TEST CONNEXION ✅' as final_status;
