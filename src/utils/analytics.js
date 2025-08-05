// 📊 SYSTÈME D'ANALYTICS FINITIO
// ================================

import { supabase } from '../supabaseClient';

class FinitioAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = null;
    this.startTime = Date.now();
    this.pageViews = [];
    this.events = [];
    
    // Initialiser le tracking
    this.initTracking();
  }

  // 🔑 Génération d'ID de session unique
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // 🚀 Initialisation du tracking
  async initTracking() {
    try {
      // Détecter l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      this.userId = user?.id || null;

      // Tracker la session
      await this.trackSession();
      
      // Tracker la page initiale
      this.trackPageView(window.location.pathname);
      
      // Écouter les changements de page
      this.setupPageTracking();
      
      // Écouter les événements de sortie
      this.setupExitTracking();
      
      console.log('📊 Analytics Finitio initialisé:', this.sessionId);
    } catch (error) {
      console.error('❌ Erreur initialisation analytics:', error);
    }
  }

  // 📈 Tracker une nouvelle session
  async trackSession() {
    try {
      const sessionData = {
        session_id: this.sessionId,
        user_id: this.userId,
        start_time: new Date().toISOString(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer || 'direct',
        landing_page: window.location.pathname,
        device_type: this.getDeviceType(),
        browser: this.getBrowser(),
        os: this.getOS(),
        is_mobile: this.isMobile(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language
      };

      await supabase.from('analytics_sessions').insert([sessionData]);
    } catch (error) {
      console.error('❌ Erreur tracking session:', error);
    }
  }

  // 📄 Tracker une vue de page
  async trackPageView(path, title = document.title) {
    try {
      const pageViewData = {
        session_id: this.sessionId,
        user_id: this.userId,
        page_path: path,
        page_title: title,
        timestamp: new Date().toISOString(),
        time_on_previous_page: this.getTimeOnCurrentPage()
      };

      this.pageViews.push(pageViewData);
      await supabase.from('analytics_page_views').insert([pageViewData]);
      
      // Réinitialiser le timer de page
      this.pageStartTime = Date.now();
      
      console.log('📄 Page vue trackée:', path);
    } catch (error) {
      console.error('❌ Erreur tracking page view:', error);
    }
  }

  // 🎯 Tracker un événement personnalisé
  async trackEvent(eventName, eventData = {}) {
    try {
      const event = {
        session_id: this.sessionId,
        user_id: this.userId,
        event_name: eventName,
        event_data: eventData,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString()
      };

      this.events.push(event);
      await supabase.from('analytics_events').insert([event]);
      
      console.log('🎯 Événement tracké:', eventName, eventData);
    } catch (error) {
      console.error('❌ Erreur tracking événement:', error);
    }
  }

  // 👤 Tracker une inscription
  async trackSignup(userData) {
    try {
      const signupData = {
        session_id: this.sessionId,
        user_id: userData.id,
        email: userData.email,
        role: userData.role,
        signup_method: userData.signup_method || 'email',
        referrer: document.referrer || 'direct',
        landing_page: this.pageViews[0]?.page_path || '/',
        pages_visited: this.pageViews.length,
        time_to_signup: Date.now() - this.startTime,
        timestamp: new Date().toISOString()
      };

      await supabase.from('analytics_signups').insert([signupData]);
      await this.trackEvent('signup_completed', signupData);
      
      console.log('👤 Inscription trackée:', userData.email);
    } catch (error) {
      console.error('❌ Erreur tracking inscription:', error);
    }
  }

  // 🔐 Tracker une connexion
  async trackLogin(userData) {
    try {
      this.userId = userData.id;
      
      const loginData = {
        session_id: this.sessionId,
        user_id: userData.id,
        email: userData.email,
        login_method: userData.login_method || 'email',
        timestamp: new Date().toISOString()
      };

      await supabase.from('analytics_logins').insert([loginData]);
      await this.trackEvent('login_completed', loginData);
      
      console.log('🔐 Connexion trackée:', userData.email);
    } catch (error) {
      console.error('❌ Erreur tracking connexion:', error);
    }
  }

  // 💼 Tracker les conversions business
  async trackConversion(conversionType, conversionData = {}) {
    try {
      const conversion = {
        session_id: this.sessionId,
        user_id: this.userId,
        conversion_type: conversionType,
        conversion_data: conversionData,
        page_path: window.location.pathname,
        time_to_conversion: Date.now() - this.startTime,
        timestamp: new Date().toISOString()
      };

      await supabase.from('analytics_conversions').insert([conversion]);
      await this.trackEvent('conversion', conversion);
      
      console.log('💼 Conversion trackée:', conversionType);
    } catch (error) {
      console.error('❌ Erreur tracking conversion:', error);
    }
  }

  // 🖱️ Tracker les clics sur les CTA
  async trackCTAClick(ctaName, ctaLocation) {
    await this.trackEvent('cta_click', {
      cta_name: ctaName,
      cta_location: ctaLocation,
      page_path: window.location.pathname
    });
  }

  // 📱 Tracker les interactions mobiles
  async trackMobileInteraction(interactionType, details = {}) {
    if (this.isMobile()) {
      await this.trackEvent('mobile_interaction', {
        interaction_type: interactionType,
        ...details
      });
    }
  }

  // ⏱️ Configuration du tracking des pages
  setupPageTracking() {
    // Écouter les changements d'URL (SPA)
    let currentPath = window.location.pathname;
    
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        this.trackPageView(currentPath);
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Écouter les événements popstate
    window.addEventListener('popstate', () => {
      this.trackPageView(window.location.pathname);
    });
  }

  // 🚪 Configuration du tracking de sortie
  setupExitTracking() {
    window.addEventListener('beforeunload', () => {
      this.trackSessionEnd();
    });
    
    // Tracker l'inactivité
    let inactivityTimer;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        this.trackEvent('user_inactive', { duration: 300000 }); // 5 minutes
      }, 300000);
    };
    
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });
  }

  // 🏁 Tracker la fin de session
  async trackSessionEnd() {
    try {
      const sessionEndData = {
        session_id: this.sessionId,
        end_time: new Date().toISOString(),
        total_duration: Date.now() - this.startTime,
        pages_visited: this.pageViews.length,
        events_triggered: this.events.length,
        last_page: window.location.pathname
      };

      await supabase.from('analytics_sessions')
        .update(sessionEndData)
        .eq('session_id', this.sessionId);
        
      console.log('🏁 Fin de session trackée');
    } catch (error) {
      console.error('❌ Erreur tracking fin session:', error);
    }
  }

  // 🕐 Calculer le temps sur la page actuelle
  getTimeOnCurrentPage() {
    return this.pageStartTime ? Date.now() - this.pageStartTime : 0;
  }

  // 📱 Détecter le type d'appareil
  getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  // 🌐 Détecter le navigateur
  getBrowser() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  }

  // 💻 Détecter l'OS
  getOS() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Other';
  }

  // 📱 Vérifier si mobile
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // 📊 Obtenir les statistiques de session
  getSessionStats() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      duration: Date.now() - this.startTime,
      pageViews: this.pageViews.length,
      events: this.events.length,
      deviceType: this.getDeviceType(),
      browser: this.getBrowser()
    };
  }
}

// 🚀 Instance globale
const analytics = new FinitioAnalytics();

// 📤 Fonctions d'export pour utilisation dans les composants
export const trackPageView = (path, title) => analytics.trackPageView(path, title);
export const trackEvent = (eventName, eventData) => analytics.trackEvent(eventName, eventData);
export const trackSignup = (userData) => analytics.trackSignup(userData);
export const trackLogin = (userData) => analytics.trackLogin(userData);
export const trackConversion = (type, data) => analytics.trackConversion(type, data);
export const trackCTAClick = (name, location) => analytics.trackCTAClick(name, location);
export const trackMobileInteraction = (type, details) => analytics.trackMobileInteraction(type, details);
export const getSessionStats = () => analytics.getSessionStats();

export default analytics;
