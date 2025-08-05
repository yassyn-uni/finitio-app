// 📊 Analytics Mock - AUCUN APPEL RÉSEAU
// Module mock pour éviter les erreurs 400 en production

class OptimizedAnalytics {
  static isInitialized = true;
  static sessionId = `mock_session_${Date.now()}`;
  static userId = null;

  // Toutes les méthodes sont des no-op (ne font rien)
  static async init() {
    // Ne fait rien - pas d'appel réseau
    return Promise.resolve();
  }

  static async trackSession() {
    // Ne fait rien - pas d'appel réseau
    return Promise.resolve();
  }

  static async trackPageView(path, title) {
    // Ne fait rien - pas d'appel réseau
    return Promise.resolve();
  }

  static async trackEvent(eventName, properties) {
    // Ne fait rien - pas d'appel réseau
    return Promise.resolve();
  }

  static async trackSignup(method, metadata) {
    // Ne fait rien - pas d'appel réseau
    return Promise.resolve();
  }

  static async trackLogin(success, method, failureReason) {
    // Ne fait rien - pas d'appel réseau
    return Promise.resolve();
  }

  static async trackConversion(type, value, metadata) {
    // Ne fait rien - pas d'appel réseau
    return Promise.resolve();
  }

  // Méthodes utilitaires mock
  static getDeviceType() {
    return 'desktop';
  }

  static getBrowser() {
    return 'Chrome';
  }

  static getOS() {
    return 'Windows';
  }

  static isMobile() {
    return false;
  }

  // Méthodes vides pour compatibilité
  static debounce() {}
  static queueEvent() {}
  static processBatch() {}
  static startBatchProcessing() {}
  static cleanup() {}
}

export default OptimizedAnalytics;
