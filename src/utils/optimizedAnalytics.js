// 📊 Système Analytics Optimisé - TEMPORAIREMENT DÉSACTIVÉ
import { supabase } from '../supabaseClient';
import ErrorHandler from './errorHandler';

class OptimizedAnalytics {
  static isInitialized = false;
  static sessionId = null;
  static userId = null;
  static eventQueue = [];
  static isProcessingQueue = false;
  static lastPageView = null;
  static debounceTimers = new Map();

  // Configuration - ANALYTICS COMPLÈTEMENT DÉSACTIVÉ
  static config = {
    batchSize: 10,
    batchInterval: 5000,
    debounceDelay: 1000,
    maxQueueSize: 100,
    enableInDev: true,
    enabled: false // DÉSACTIVÉ COMPLÈTEMENT
  };

  static async init() {
    if (this.isInitialized) return;

    try {
      this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const { data: { user } } = await supabase.auth.getUser();
      this.userId = user?.id || null;
      this.isInitialized = true;
      
      if (import.meta.env.DEV) {
        console.log('📊 Analytics Finitio initialisé (mode silencieux):', this.sessionId);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('📊 Analytics init failed (silenced):', error.message);
      }
    }
  }

  // Toutes les méthodes de tracking retournent immédiatement sans faire d'appels
  static async trackSession() {
    if (import.meta.env.DEV) {
      console.log('📊 Session tracking désactivé (mode silencieux)');
    }
    return;
  }

  static async trackPageView(path = window.location.pathname, title = document.title) {
    if (import.meta.env.DEV) {
      console.log('📄 Page view tracking désactivé (mode silencieux):', path);
    }
    return;
  }

  static async trackEvent(eventName, properties = {}) {
    if (!this.isInitialized) {
      await this.init();
    }
    if (import.meta.env.DEV) {
      console.log(`🎯 Event tracking désactivé (mode silencieux): ${eventName}`, properties);
    }
    return;
  }

  static async trackSignup(method = 'email', metadata = {}) {
    if (import.meta.env.DEV) {
      console.log('📝 Signup tracking désactivé (mode silencieux):', method);
    }
    return;
  }

  static async trackLogin(success = true, method = 'email', failureReason = null) {
    if (import.meta.env.DEV) {
      console.log('🔐 Login tracking désactivé (mode silencieux):', { success, method });
    }
    return;
  }

  static async trackConversion(type, value = null, metadata = {}) {
    if (import.meta.env.DEV) {
      console.log('💰 Conversion tracking désactivé (mode silencieux):', type);
    }
    return;
  }

  // Méthodes utilitaires (gardées pour compatibilité)
  static getDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/tablet|ipad|playbook|silk/.test(userAgent)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/.test(userAgent)) return 'mobile';
    return 'desktop';
  }

  static getBrowser() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  }

  static getOS() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Other';
  }

  static isMobile() {
    return this.getDeviceType() === 'mobile';
  }

  // Méthodes vides pour compatibilité
  static debounce() { return; }
  static queueEvent() { return; }
  static processBatch() { return; }
  static startBatchProcessing() { return; }
  static cleanup() { return; }
}

// Auto-initialisation DÉSACTIVÉE
// if (typeof window !== 'undefined') {
//   OptimizedAnalytics.init();
// }

export default OptimizedAnalytics;
