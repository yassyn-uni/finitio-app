// 🧪 SCRIPT DE TEST DÉCONNEXION SIMPLIFIÉ
// Copiez-collez ce code dans la console (F12) de votre navigateur

console.log('🧪 TEST DÉCONNEXION FINITIO - VERSION SIMPLIFIÉE');
console.log('================================================');

// Test immédiat de la fonction de déconnexion globale
if (window.forceLogout) {
  console.log('✅ Fonction forceLogout détectée !');
  console.log('💡 Tapez: window.forceLogout() pour tester');
} else {
  console.log('❌ Fonction forceLogout non trouvée');
}

// Fonction de test des boutons
const testBoutons = () => {
  console.log('🔍 Recherche des boutons de déconnexion...');
  
  // Chercher tous les boutons
  const tousLesBoutons = document.querySelectorAll('button');
  console.log(`📊 ${tousLesBoutons.length} boutons trouvés au total`);
  
  // Filtrer les boutons de déconnexion
  const boutonsDeconnexion = Array.from(tousLesBoutons).filter(btn => {
    const texte = btn.textContent.toLowerCase();
    return texte.includes('déconnecter') || 
           texte.includes('déconnexion') || 
           texte.includes('🚪') ||
           btn.title?.toLowerCase().includes('déconnecter');
  });
  
  console.log(`🚪 ${boutonsDeconnexion.length} bouton(s) de déconnexion trouvé(s):`);
  
  boutonsDeconnexion.forEach((btn, index) => {
    console.log(`  ${index + 1}. "${btn.textContent.trim()}" - Classes: ${btn.className}`);
    
    // Tester si le bouton est cliquable
    if (btn.disabled) {
      console.log(`     ⚠️ Bouton désactivé`);
    } else {
      console.log(`     ✅ Bouton actif`);
    }
    
    // Ajouter un écouteur de test
    btn.addEventListener('click', () => {
      console.log(`🖱️ CLIC DÉTECTÉ sur bouton ${index + 1}`);
    }, { once: true });
  });
  
  return boutonsDeconnexion;
};

// Fonction de diagnostic de l'état
const diagnosticEtat = () => {
  console.log('📊 DIAGNOSTIC DE L\'ÉTAT ACTUEL:');
  console.log('================================');
  
  // Vérifier le localStorage
  const localStorageKeys = Object.keys(localStorage);
  console.log('💾 localStorage:', localStorageKeys.length > 0 ? localStorageKeys : 'Vide');
  
  // Vérifier le sessionStorage
  const sessionStorageKeys = Object.keys(sessionStorage);
  console.log('💾 sessionStorage:', sessionStorageKeys.length > 0 ? sessionStorageKeys : 'Vide');
  
  // Vérifier les cookies
  console.log('🍪 Cookies:', document.cookie || 'Aucun');
  
  // Vérifier l'URL
  console.log('🌐 URL actuelle:', window.location.href);
  
  // Vérifier si on est sur une page de dashboard
  const isDashboard = window.location.pathname.includes('dashboard');
  console.log('📍 Sur dashboard:', isDashboard ? 'OUI' : 'NON');
  
  return {
    localStorage: localStorageKeys,
    sessionStorage: sessionStorageKeys,
    cookies: document.cookie,
    url: window.location.href,
    isDashboard
  };
};

// Fonction de test de déconnexion manuelle
const testDeconnexionManuelle = () => {
  console.log('🚪 TEST DE DÉCONNEXION MANUELLE...');
  
  // Nettoyer le stockage
  localStorage.clear();
  sessionStorage.clear();
  console.log('✅ Stockage nettoyé');
  
  // Supprimer les cookies
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
  console.log('✅ Cookies supprimés');
  
  // Redirection forcée
  console.log('🔄 Redirection vers /connexion...');
  setTimeout(() => {
    window.location.replace('/connexion');
  }, 1000);
};

// Fonction pour forcer un clic sur le bouton de déconnexion
const forcerClicDeconnexion = () => {
  const boutons = testBoutons();
  if (boutons.length > 0) {
    console.log('🖱️ Simulation clic sur le premier bouton de déconnexion...');
    boutons[0].click();
  } else {
    console.log('❌ Aucun bouton de déconnexion trouvé pour cliquer');
  }
};

// Exécution automatique du diagnostic
console.log('🚀 Exécution du diagnostic automatique...');
diagnosticEtat();
testBoutons();

// Rendre les fonctions disponibles globalement
window.testBoutons = testBoutons;
window.diagnosticEtat = diagnosticEtat;
window.testDeconnexionManuelle = testDeconnexionManuelle;
window.forcerClicDeconnexion = forcerClicDeconnexion;

console.log('');
console.log('📋 COMMANDES DISPONIBLES:');
console.log('========================');
console.log('• testBoutons() - Analyser les boutons de déconnexion');
console.log('• diagnosticEtat() - Vérifier l\'état actuel');
console.log('• testDeconnexionManuelle() - Déconnexion manuelle forcée');
console.log('• forcerClicDeconnexion() - Simuler un clic sur le bouton');
console.log('• window.forceLogout() - Utiliser la fonction globale (si disponible)');
console.log('');
console.log('💡 SOLUTION RAPIDE: Tapez testDeconnexionManuelle() pour forcer la déconnexion');
