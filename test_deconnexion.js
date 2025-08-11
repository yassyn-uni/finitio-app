// 🧪 SCRIPT DE TEST DÉCONNEXION FINITIO
// Copiez ce code dans la console du navigateur (F12) pour tester la déconnexion

console.log('🧪 DÉBUT TEST DÉCONNEXION FINITIO');
console.log('=====================================');

// 1. Vérifier l'état avant déconnexion
console.log('📊 ÉTAT AVANT DÉCONNEXION:');
console.log('- localStorage:', Object.keys(localStorage));
console.log('- sessionStorage:', Object.keys(sessionStorage));

// 2. Vérifier l'utilisateur Supabase
import { supabase } from './src/supabaseClient.js';

const testDeconnexion = async () => {
  try {
    // Vérifier l'utilisateur connecté
    const { data: user } = await supabase.auth.getUser();
    console.log('👤 Utilisateur connecté:', user?.user?.email || 'Aucun');
    
    if (!user?.user) {
      console.log('❌ Aucun utilisateur connecté - Test impossible');
      return;
    }
    
    console.log('🚪 SIMULATION DÉCONNEXION...');
    
    // Nettoyer le stockage
    localStorage.clear();
    sessionStorage.clear();
    console.log('✅ Stockage nettoyé');
    
    // Déconnexion Supabase
    await supabase.auth.signOut();
    console.log('✅ Déconnexion Supabase effectuée');
    
    // Vérifier l'état après déconnexion
    const { data: userAfter } = await supabase.auth.getUser();
    console.log('👤 Utilisateur après déconnexion:', userAfter?.user?.email || 'Aucun');
    
    if (!userAfter?.user) {
      console.log('✅ DÉCONNEXION RÉUSSIE !');
      console.log('🔄 Redirection vers /connexion dans 2 secondes...');
      
      setTimeout(() => {
        window.location.replace('/connexion');
      }, 2000);
    } else {
      console.log('❌ ÉCHEC DE LA DÉCONNEXION');
      console.log('💡 Essayez de vider le cache du navigateur');
    }
    
  } catch (error) {
    console.error('❌ Erreur pendant le test:', error);
    console.log('🔄 Redirection forcée vers /connexion...');
    window.location.replace('/connexion');
  }
};

// 3. Fonction de test rapide des boutons de déconnexion
const testBoutonDeconnexion = () => {
  console.log('🔍 RECHERCHE BOUTONS DÉCONNEXION...');
  
  // Chercher tous les boutons contenant "déconnecter"
  const boutons = Array.from(document.querySelectorAll('button')).filter(btn => 
    btn.textContent.toLowerCase().includes('déconnecter') || 
    btn.textContent.includes('🚪')
  );
  
  console.log(`🔘 ${boutons.length} bouton(s) de déconnexion trouvé(s)`);
  
  boutons.forEach((btn, index) => {
    console.log(`Bouton ${index + 1}:`, btn.textContent.trim());
    
    // Ajouter un écouteur de test
    btn.addEventListener('click', (e) => {
      console.log('🖱️ Clic sur bouton déconnexion détecté');
      console.log('📍 Élément cliqué:', e.target);
    });
  });
  
  if (boutons.length > 0) {
    console.log('💡 Cliquez sur un bouton de déconnexion pour voir les logs');
  }
};

// 4. Fonction de diagnostic complet
const diagnosticComplet = async () => {
  console.log('🔍 DIAGNOSTIC COMPLET DÉCONNEXION');
  console.log('==================================');
  
  // Vérifier Supabase
  try {
    const { data } = await supabase.auth.getUser();
    console.log('🔐 État Supabase:', data?.user ? 'Connecté' : 'Déconnecté');
    console.log('📧 Email:', data?.user?.email || 'N/A');
  } catch (error) {
    console.log('❌ Erreur Supabase:', error.message);
  }
  
  // Vérifier le stockage
  console.log('💾 localStorage keys:', Object.keys(localStorage));
  console.log('💾 sessionStorage keys:', Object.keys(sessionStorage));
  
  // Vérifier les cookies
  console.log('🍪 Cookies:', document.cookie || 'Aucun');
  
  // Vérifier l'URL actuelle
  console.log('🌐 URL actuelle:', window.location.href);
  
  // Tester les boutons
  testBoutonDeconnexion();
};

// Exécuter le diagnostic
console.log('🚀 Exécution du diagnostic...');
diagnosticComplet();

// Commandes disponibles
console.log('');
console.log('📋 COMMANDES DISPONIBLES:');
console.log('- testDeconnexion() : Tester la déconnexion complète');
console.log('- testBoutonDeconnexion() : Analyser les boutons de déconnexion');
console.log('- diagnosticComplet() : Diagnostic complet de l\'état');
console.log('');
console.log('💡 Tapez une de ces commandes pour l\'exécuter');

// Rendre les fonctions disponibles globalement
window.testDeconnexion = testDeconnexion;
window.testBoutonDeconnexion = testBoutonDeconnexion;
window.diagnosticComplet = diagnosticComplet;
