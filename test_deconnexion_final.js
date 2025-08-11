// 🧪 TEST DÉCONNEXION FINAL - FINITIO
// ====================================
// Script de test et diagnostic pour la déconnexion

console.log('🧪 DÉMARRAGE TEST DÉCONNEXION FINITIO');

// 1. DIAGNOSTIC ÉTAT ACTUEL
function diagnosticEtat() {
    console.log('📊 DIAGNOSTIC ÉTAT ACTUEL:');
    console.log('- localStorage:', Object.keys(localStorage));
    console.log('- sessionStorage:', Object.keys(sessionStorage));
    console.log('- URL actuelle:', window.location.href);
    
    // Vérifier Supabase
    if (window.supabase) {
        console.log('✅ Supabase disponible');
        window.supabase.auth.getUser().then(({data}) => {
            console.log('- Utilisateur Supabase:', data.user?.email || 'Aucun');
        });
    } else {
        console.log('❌ Supabase non disponible');
    }
}

// 2. DÉCONNEXION MANUELLE FORCÉE
async function deconnexionManuelle() {
    console.log('🚪 DÉCONNEXION MANUELLE FORCÉE...');
    
    try {
        // Nettoyage complet
        localStorage.clear();
        sessionStorage.clear();
        console.log('✅ Stockage nettoyé');
        
        // Déconnexion Supabase si disponible
        if (window.supabase) {
            await window.supabase.auth.signOut();
            console.log('✅ Supabase déconnecté');
        }
        
        // Redirection immédiate
        console.log('🔄 Redirection vers /connexion...');
        window.location.replace('/connexion');
        
    } catch (error) {
        console.error('❌ Erreur:', error);
        // Redirection de secours
        window.location.href = '/connexion';
    }
}

// 3. TEST BOUTONS EXISTANTS
function testBoutons() {
    console.log('🔍 RECHERCHE BOUTONS DÉCONNEXION...');
    
    // Chercher tous les boutons possibles
    const selectors = [
        'button[onclick*="logout"]',
        'button[onclick*="déconnexion"]',
        'button:contains("Déconnecter")',
        'button:contains("Déconnexion")',
        '[class*="logout"]',
        '[class*="deconnexion"]'
    ];
    
    let boutonsFound = 0;
    selectors.forEach(selector => {
        try {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                console.log(`✅ Trouvé ${elements.length} élément(s) avec: ${selector}`);
                elements.forEach((el, i) => {
                    console.log(`  - Bouton ${i+1}:`, el.outerHTML.substring(0, 100) + '...');
                });
                boutonsFound += elements.length;
            }
        } catch (e) {
            // Ignorer les sélecteurs CSS invalides
        }
    });
    
    if (boutonsFound === 0) {
        console.log('❌ Aucun bouton de déconnexion trouvé');
    }
    
    // Chercher la fonction globale
    if (window.forceLogout) {
        console.log('✅ Fonction window.forceLogout disponible');
    } else {
        console.log('❌ Fonction window.forceLogout non disponible');
    }
}

// 4. EXÉCUTION AUTOMATIQUE
console.log('🚀 EXÉCUTION TESTS...');
diagnosticEtat();
testBoutons();

// 5. FONCTIONS DISPONIBLES GLOBALEMENT
window.testDeconnexion = {
    diagnostic: diagnosticEtat,
    deconnexion: deconnexionManuelle,
    testBoutons: testBoutons
};

console.log('✅ TESTS TERMINÉS - Fonctions disponibles:');
console.log('- testDeconnexion.diagnostic()');
console.log('- testDeconnexion.deconnexion()');
console.log('- testDeconnexion.testBoutons()');
console.log('');
console.log('💡 SOLUTION RAPIDE: testDeconnexion.deconnexion()');
