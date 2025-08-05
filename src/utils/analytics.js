// 📊 ANALYTICS MOCK - AUCUN APPEL RÉSEAU
// =====================================
// Module mock pour éviter les erreurs 400 en production

// Mock complet - ne fait aucun appel réseau
class FinitioAnalytics {
  constructor() {
    this.sessionId = `mock_session_${Date.now()}`;
    this.userId = null;
    this.startTime = Date.now();
    this.pageViews = [];
    this.events = [];
    
    // Ne pas initialiser automatiquement
    console.log('📊 Analytics Mock initialisé (aucun appel réseau)');
  }

  // Toutes les méthodes sont des no-op
  async initTracking() {
    return Promise.resolve();
  }

  generateSessionId() {
    return `mock_session_${Date.now()}`;
  }

  async trackSession() {
    return Promise.resolve();
  }

  trackPageView(path) {
    return Promise.resolve();
  }

  setupPageTracking() {
    return Promise.resolve();
  }

  setupExitTracking() {
    return Promise.resolve();
  }

  async trackEvent(eventName, properties) {
    return Promise.resolve();
  }

  async trackSignup(method, metadata) {
    return Promise.resolve();
  }

  async trackLogin(success, method, failureReason) {
    return Promise.resolve();
  }

  async trackConversion(type, value, metadata) {
    return Promise.resolve();
  }

  async endSession() {
    return Promise.resolve();
  }
}

// Ne pas créer d'instance automatiquement
// const analytics = new FinitioAnalytics();

// Export mock
export default {
  track: () => Promise.resolve(),
  trackPageView: () => Promise.resolve(),
  trackEvent: () => Promise.resolve(),
  trackSession: () => Promise.resolve()
};
