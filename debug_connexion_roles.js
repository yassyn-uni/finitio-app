// 🔍 SCRIPT DE DÉBOGAGE CONNEXION ROLES - FINITIO
// À exécuter dans la console du navigateur pour diagnostiquer les problèmes

console.log('🔍 DÉBUT DIAGNOSTIC CONNEXION ROLES FINITIO');

// 1. Vérifier l'utilisateur connecté
const checkCurrentUser = async () => {
  console.log('📋 1. Vérification utilisateur connecté...');
  
  // Importer Supabase (à adapter selon votre configuration)
  const { createClient } = window.supabase || {};
  if (!createClient) {
    console.error('❌ Supabase non disponible dans window.supabase');
    return;
  }
  
  const supabase = createClient(
    'YOUR_SUPABASE_URL', // Remplacer par votre URL
    'YOUR_SUPABASE_ANON_KEY' // Remplacer par votre clé
  );
  
  try {
    // Récupérer l'utilisateur Auth
    const { data: authData, error: authError } = await supabase.auth.getUser();
    console.log('🔐 Utilisateur Auth:', authData);
    console.log('❌ Erreur Auth:', authError);
    
    if (authData?.user) {
      const user = authData.user;
      console.log('✅ Utilisateur connecté:', user.email);
      console.log('🆔 UUID Auth:', user.id);
      
      // Récupérer le profil dans public.users
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      console.log('👤 Profil public.users:', profile);
      console.log('❌ Erreur profil:', profileError);
      
      if (profile) {
        console.log('✅ Rôle trouvé:', profile.role);
        console.log('📧 Email profil:', profile.email);
        
        // Tester la redirection selon le rôle
        const role = profile.role?.toLowerCase();
        console.log('🎯 Rôle normalisé:', role);
        
        switch (role) {
          case 'client':
            console.log('➡️ Devrait rediriger vers: /dashboard-client');
            break;
          case 'architecte':
            console.log('➡️ Devrait rediriger vers: /dashboard-architecte');
            break;
          case 'prestataire':
            console.log('➡️ Devrait rediriger vers: /dashboard-prestataire');
            break;
          case 'fournisseur':
            console.log('➡️ Devrait rediriger vers: /dashboard-fournisseur');
            break;
          default:
            console.log('❌ Rôle non reconnu:', role);
            console.log('➡️ Redirection par défaut: /dashboard');
        }
      } else {
        console.error('❌ Aucun profil trouvé pour UUID:', user.id);
        
        // Chercher par email
        const { data: profileByEmail, error: emailError } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single();
          
        console.log('🔍 Recherche par email:', profileByEmail);
        console.log('❌ Erreur recherche email:', emailError);
      }
    } else {
      console.error('❌ Aucun utilisateur connecté');
    }
  } catch (error) {
    console.error('💥 Erreur générale:', error);
  }
};

// 2. Vérifier le localStorage
const checkLocalStorage = () => {
  console.log('📋 2. Vérification localStorage...');
  console.log('🔑 user_role:', localStorage.getItem('user_role'));
  console.log('📧 finitio_saved_email:', localStorage.getItem('finitio_saved_email'));
  console.log('💾 finitio_remember_me:', localStorage.getItem('finitio_remember_me'));
  console.log('⏰ session_start:', localStorage.getItem('session_start'));
};

// 3. Vérifier l'URL actuelle
const checkCurrentURL = () => {
  console.log('📋 3. Vérification URL actuelle...');
  console.log('🌐 URL complète:', window.location.href);
  console.log('📍 Pathname:', window.location.pathname);
  console.log('🔗 Hash:', window.location.hash);
  console.log('❓ Search:', window.location.search);
};

// 4. Simuler une redirection de test
const testRedirection = (role) => {
  console.log(`📋 4. Test redirection pour rôle: ${role}`);
  
  const redirections = {
    'client': '/dashboard-client',
    'architecte': '/dashboard-architecte', 
    'prestataire': '/dashboard-prestataire',
    'fournisseur': '/dashboard-fournisseur'
  };
  
  const targetURL = redirections[role] || '/dashboard';
  console.log(`➡️ URL cible: ${targetURL}`);
  
  // Test avec navigate (React Router)
  console.log('🧪 Test avec window.location.href...');
  // window.location.href = targetURL; // Décommentez pour tester
  
  return targetURL;
};

// 5. Exécuter tous les diagnostics
const runFullDiagnostic = async () => {
  console.log('🚀 DIAGNOSTIC COMPLET DÉMARRÉ');
  console.log('================================');
  
  checkLocalStorage();
  console.log('');
  
  checkCurrentURL();
  console.log('');
  
  await checkCurrentUser();
  console.log('');
  
  console.log('🎯 Tests de redirection:');
  testRedirection('architecte');
  testRedirection('prestataire');
  testRedirection('fournisseur');
  testRedirection('client');
  
  console.log('');
  console.log('✅ DIAGNOSTIC TERMINÉ');
  console.log('================================');
};

// Exporter les fonctions pour utilisation manuelle
window.finitioDebug = {
  checkCurrentUser,
  checkLocalStorage,
  checkCurrentURL,
  testRedirection,
  runFullDiagnostic
};

console.log('🎯 Fonctions disponibles:');
console.log('- window.finitioDebug.runFullDiagnostic()');
console.log('- window.finitioDebug.checkCurrentUser()');
console.log('- window.finitioDebug.checkLocalStorage()');
console.log('- window.finitioDebug.testRedirection("architecte")');

// Lancer le diagnostic automatiquement
runFullDiagnostic();
