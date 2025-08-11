// 🔍 DIAGNOSTIC COMPLET SUPABASE - PROBLÈME RÔLES & DÉCONNEXION
// Copiez ce code dans la console (F12) pour diagnostiquer les problèmes

console.log('🔍 DIAGNOSTIC COMPLET SUPABASE FINITIO');
console.log('=====================================');

// Fonction de diagnostic Supabase Auth
const diagnosticSupabaseAuth = async () => {
  console.log('🔐 DIAGNOSTIC SUPABASE AUTH:');
  console.log('============================');
  
  try {
    // Vérifier la connexion Supabase
    if (!window.supabase) {
      console.log('❌ Supabase client non trouvé dans window.supabase');
      return null;
    }
    
    const supabase = window.supabase;
    console.log('✅ Client Supabase trouvé');
    
    // Vérifier l'utilisateur connecté
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Erreur Auth:', authError.message);
      return null;
    }
    
    if (!authData?.user) {
      console.log('❌ Aucun utilisateur connecté dans Supabase Auth');
      return null;
    }
    
    const user = authData.user;
    console.log('✅ Utilisateur Auth connecté:');
    console.log('  📧 Email:', user.email);
    console.log('  🆔 UUID:', user.id);
    console.log('  📅 Créé le:', new Date(user.created_at).toLocaleString());
    console.log('  🔑 Provider:', user.app_metadata?.provider || 'email');
    
    return user;
    
  } catch (error) {
    console.log('❌ Erreur diagnostic Auth:', error.message);
    return null;
  }
};

// Fonction de diagnostic table users
const diagnosticTableUsers = async (userAuth) => {
  console.log('');
  console.log('👥 DIAGNOSTIC TABLE USERS:');
  console.log('===========================');
  
  if (!userAuth) {
    console.log('❌ Pas d\'utilisateur Auth - impossible de vérifier la table');
    return null;
  }
  
  try {
    const supabase = window.supabase;
    
    // Recherche par UUID
    console.log('🔍 Recherche par UUID:', userAuth.id);
    const { data: profileUUID, error: errorUUID } = await supabase
      .from('users')
      .select('*')
      .eq('id', userAuth.id)
      .single();
    
    if (profileUUID && !errorUUID) {
      console.log('✅ Profil trouvé par UUID:');
      console.log('  📧 Email:', profileUUID.email);
      console.log('  👤 Nom:', profileUUID.nom);
      console.log('  🎭 Rôle:', profileUUID.role);
      console.log('  🆔 UUID:', profileUUID.id);
      return profileUUID;
    }
    
    console.log('⚠️ Profil non trouvé par UUID, erreur:', errorUUID?.message);
    
    // Recherche par email (fallback)
    console.log('🔍 Recherche par email:', userAuth.email);
    const { data: profileEmail, error: errorEmail } = await supabase
      .from('users')
      .select('*')
      .eq('email', userAuth.email)
      .single();
    
    if (profileEmail && !errorEmail) {
      console.log('✅ Profil trouvé par EMAIL:');
      console.log('  📧 Email:', profileEmail.email);
      console.log('  👤 Nom:', profileEmail.nom);
      console.log('  🎭 Rôle:', profileEmail.role);
      console.log('  🆔 UUID:', profileEmail.id);
      console.log('  ⚠️ PROBLÈME: UUID différent entre Auth et table !');
      console.log('    Auth UUID:', userAuth.id);
      console.log('    Table UUID:', profileEmail.id);
      return profileEmail;
    }
    
    console.log('❌ Profil non trouvé par email, erreur:', errorEmail?.message);
    
    // Lister tous les utilisateurs pour debug
    console.log('🔍 Liste de TOUS les utilisateurs dans la table:');
    const { data: allUsers, error: allError } = await supabase
      .from('users')
      .select('id, email, nom, role')
      .limit(10);
    
    if (allUsers && !allError) {
      console.log(`📊 ${allUsers.length} utilisateur(s) trouvé(s):`);
      allUsers.forEach((u, index) => {
        console.log(`  ${index + 1}. ${u.email} - ${u.role} (UUID: ${u.id})`);
      });
    } else {
      console.log('❌ Impossible de lister les utilisateurs:', allError?.message);
    }
    
    return null;
    
  } catch (error) {
    console.log('❌ Erreur diagnostic table users:', error.message);
    return null;
  }
};

// Fonction de test de redirection par rôle
const testRedirectionRole = (profile) => {
  console.log('');
  console.log('🎯 TEST REDIRECTION RÔLE:');
  console.log('==========================');
  
  if (!profile?.role) {
    console.log('❌ Aucun rôle trouvé - impossible de tester la redirection');
    return;
  }
  
  const role = profile.role.toLowerCase();
  console.log('🎭 Rôle détecté:', role);
  
  const redirections = {
    'client': '/dashboard-client',
    'architecte': '/dashboard-architecte',
    'prestataire': '/dashboard-prestataire',
    'fournisseur': '/dashboard-fournisseur'
  };
  
  const targetUrl = redirections[role];
  
  if (targetUrl) {
    console.log('✅ Redirection attendue:', targetUrl);
    console.log('🌐 URL actuelle:', window.location.pathname);
    
    if (window.location.pathname === targetUrl) {
      console.log('✅ Utilisateur sur la bonne page !');
    } else {
      console.log('⚠️ Utilisateur sur la mauvaise page !');
      console.log('💡 Devrait être redirigé vers:', targetUrl);
    }
  } else {
    console.log('❌ Rôle non reconnu pour redirection:', role);
    console.log('💡 Rôles valides:', Object.keys(redirections));
  }
};

// Fonction de correction automatique
const correctionAutomatique = async (userAuth, profile) => {
  console.log('');
  console.log('🔧 CORRECTION AUTOMATIQUE:');
  console.log('===========================');
  
  if (!userAuth) {
    console.log('❌ Pas d\'utilisateur Auth - correction impossible');
    return;
  }
  
  const supabase = window.supabase;
  
  try {
    if (!profile) {
      console.log('🔧 Création du profil utilisateur manquant...');
      
      // Créer le profil avec l'UUID de Auth
      const { data: newProfile, error: createError } = await supabase
        .from('users')
        .insert([{
          id: userAuth.id,
          email: userAuth.email,
          nom: userAuth.email.split('@')[0],
          role: 'client' // Rôle par défaut
        }])
        .select()
        .single();
      
      if (newProfile && !createError) {
        console.log('✅ Profil créé avec succès:', newProfile);
        return newProfile;
      } else {
        console.log('❌ Erreur création profil:', createError?.message);
      }
    } else if (profile.id !== userAuth.id) {
      console.log('🔧 Correction UUID du profil...');
      
      // Mettre à jour l'UUID du profil pour correspondre à Auth
      const { data: updatedProfile, error: updateError } = await supabase
        .from('users')
        .update({ id: userAuth.id })
        .eq('email', userAuth.email)
        .select()
        .single();
      
      if (updatedProfile && !updateError) {
        console.log('✅ UUID corrigé avec succès:', updatedProfile);
        return updatedProfile;
      } else {
        console.log('❌ Erreur correction UUID:', updateError?.message);
      }
    } else {
      console.log('✅ Profil déjà correct - aucune correction nécessaire');
      return profile;
    }
  } catch (error) {
    console.log('❌ Erreur correction automatique:', error.message);
  }
  
  return null;
};

// Fonction principale de diagnostic
const diagnosticComplet = async () => {
  console.log('🚀 DÉBUT DU DIAGNOSTIC COMPLET...');
  console.log('');
  
  // 1. Diagnostic Auth
  const userAuth = await diagnosticSupabaseAuth();
  
  // 2. Diagnostic table users
  const profile = await diagnosticTableUsers(userAuth);
  
  // 3. Test redirection
  testRedirectionRole(profile);
  
  // 4. Correction automatique si nécessaire
  const profileCorrige = await correctionAutomatique(userAuth, profile);
  
  console.log('');
  console.log('📋 RÉSUMÉ DU DIAGNOSTIC:');
  console.log('========================');
  console.log('🔐 Auth Supabase:', userAuth ? '✅ OK' : '❌ PROBLÈME');
  console.log('👥 Profil table:', profile ? '✅ OK' : '❌ MANQUANT');
  console.log('🔗 Synchronisation:', (profile && userAuth && profile.id === userAuth.id) ? '✅ OK' : '❌ DÉSYNCHRONISÉ');
  console.log('🎭 Rôle défini:', profile?.role ? `✅ ${profile.role}` : '❌ MANQUANT');
  
  return {
    userAuth,
    profile: profileCorrige || profile,
    isSync: profile && userAuth && profile.id === userAuth.id,
    hasRole: !!profile?.role
  };
};

// Fonction de déconnexion forcée corrigée
const deconnexionForceeCorrigee = async () => {
  console.log('🚪 DÉCONNEXION FORCÉE CORRIGÉE...');
  
  try {
    const supabase = window.supabase;
    
    // Nettoyage complet
    localStorage.clear();
    sessionStorage.clear();
    
    // Déconnexion Supabase avec gestion d'erreur
    try {
      await supabase.auth.signOut();
      console.log('✅ Déconnexion Supabase réussie');
    } catch (error) {
      console.log('⚠️ Erreur déconnexion Supabase:', error.message);
    }
    
    // Redirection forcée
    console.log('🔄 Redirection vers /connexion...');
    window.location.replace('/connexion');
    
  } catch (error) {
    console.log('❌ Erreur déconnexion forcée:', error.message);
    window.location.replace('/connexion');
  }
};

// Rendre les fonctions disponibles globalement
window.diagnosticComplet = diagnosticComplet;
window.deconnexionForceeCorrigee = deconnexionForceeCorrigee;
window.diagnosticSupabaseAuth = diagnosticSupabaseAuth;
window.diagnosticTableUsers = diagnosticTableUsers;

// Exécution automatique
console.log('🎯 COMMANDES DISPONIBLES:');
console.log('• diagnosticComplet() - Diagnostic complet');
console.log('• deconnexionForceeCorrigee() - Déconnexion forcée');
console.log('');
console.log('🚀 Exécution automatique du diagnostic...');
diagnosticComplet();
