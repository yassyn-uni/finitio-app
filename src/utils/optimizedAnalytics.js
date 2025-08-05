// 📊 Système Analytics Optimisé avec Debounce et Cache
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

  // Configuration
  static config = {
    batchSize: 10,
    batchInterval: 5000, // 5 secondes
    debounceDelay: 1000, // 1 seconde
    maxQueueSize: 100,
    enableInDev: true
  };

  static async init() {
    if (this.isInitialized) return;

    try {
      // Générer un ID de session unique
      this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Récupérer l'utilisateur si connecté
      const { data: { user } } = await supabase.auth.getUser();
      this.userId = user?.id || null;

      // Démarrer le traitement par batch
      this.startBatchProcessing();
      
      // Tracker la session initiale
      await this.trackSession();
      
      this.isInitialized = true;
      
      if (import.meta.env.DEV) {
        console.log('🎯 Analytics optimisé initialisé:', this.sessionId);
      }

    } catch (error) {
      ErrorHandler.log(error, 'OptimizedAnalytics.init');
    }
  }

  // Debounce générique pour éviter les événements trop fréquents
  static debounce(key, func, delay = this.config.debounceDelay) {
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }

    const timer = setTimeout(() => {
      func();
      this.debounceTimers.delete(key);
    }, delay);

    this.debounceTimers.set(key, timer);
  }

  // Ajouter un événement à la queue
  static queueEvent(table, data) {
    if (this.eventQueue.length >= this.config.maxQueueSize) {
      // Supprimer les anciens événements si la queue est pleine
      this.eventQueue.shift();
    }

    this.eventQueue.push({
      table,
      data: {
        ...data,
        session_id: this.sessionId,
        user_id: this.userId,
        created_at: new Date().toISOString()
      },
      timestamp: Date.now()
    });
  }

  // Traitement par batch des événements
  static startBatchProcessing() {
    setInterval(async () => {
      if (this.eventQueue.length > 0 && !this.isProcessingQueue) {
        await this.processBatch();
      }
    }, this.config.batchInterval);
  }

  static async processBatch() {
    if (this.isProcessingQueue || this.eventQueue.length === 0) return;

    this.isProcessingQueue = true;

    try {
      const batch = this.eventQueue.splice(0, this.config.batchSize);
      
      // Grouper par table pour optimiser les insertions
      const groupedByTable = batch.reduce((acc, event) => {
        if (!acc[event.table]) acc[event.table] = [];
        acc[event.table].push(event.data);
        return acc;
      }, {});

      // Insérer par table
      for (const [table, events] of Object.entries(groupedByTable)) {
        const { error } = await supabase.from(table).insert(events);
        
        if (error) {
          ErrorHandler.log(error, `OptimizedAnalytics.processBatch.${table}`);
          // Remettre les événements en queue en cas d'erreur
          events.forEach(data => this.queueEvent(table, data));
        }
      }

      if (import.meta.env.DEV) {
        console.log(`📊 Batch traité: ${batch.length} événements`);
      }

    } catch (error) {
      ErrorHandler.log(error, 'OptimizedAnalytics.processBatch');
    } finally {
      this.isProcessingQueue = false;
    }
  }

  // Session tracking optimisé
  static async trackSession() {
    try {
      const sessionData = {
        session_id: this.sessionId,
        user_id: this.userId,
        start_time: new Date().toISOString(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer || null,
        landing_page: window.location.pathname,
        device_type: this.getDeviceType(),
        browser: this.getBrowser(),
        os: this.getOS(),
        is_mobile: this.isMobile(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        device_info: {
          platform: navigator.platform,
          cookieEnabled: navigator.cookieEnabled,
          onLine: navigator.onLine
        },
        utm_source: new URLSearchParams(window.location.search).get('utm_source'),
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
        utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign')
      };

      // Tentative d'insertion avec gestion d'erreur silencieuse
      const { error } = await supabase
        .from('analytics_sessions')
        .insert([sessionData]);

      if (error && error.code !== 'PGRST301') { // Ignorer les erreurs RLS
        if (import.meta.env.DEV) {
          console.warn('📊 Analytics session tracking skipped (unauthorized)');
        }
      } else if (import.meta.env.DEV) {
        console.log('📊 Analytics Finitio initialisé:', this.sessionId);
      }

    } catch (error) {
      // Gestion silencieuse des erreurs analytics
      if (import.meta.env.DEV) {
        console.warn('📊 Analytics session tracking failed:', error.message);
      }
    }
  }

  // Page view tracking avec debounce
  static async trackPageView(path = window.location.pathname, title = document.title) {
    try {
      const pageViewData = {
        session_id: this.sessionId,
        user_id: this.userId,
        page_path: path,
        page_name: title, // Ajout du champ obligatoire page_name
        page_title: title,
        timestamp: new Date().toISOString(),
        time_on_previous_page: this.lastPageView ? 
          Math.round((Date.now() - this.lastPageView) / 1000) : null
      };

      // Tentative d'insertion avec gestion d'erreur silencieuse
      const { error } = await supabase
        .from('analytics_page_views')
        .insert([pageViewData]);

      if (error && error.code !== 'PGRST301') { // Ignorer les erreurs RLS
        if (import.meta.env.DEV) {
          console.warn('📊 Analytics page view tracking skipped (unauthorized)');
        }
      } else if (import.meta.env.DEV) {
        console.log('📄 Page vue trackée:', path);
      }

      this.lastPageView = Date.now();

    } catch (error) {
      // Gestion silencieuse des erreurs analytics
      if (import.meta.env.DEV) {
        console.warn('📄 Page view tracking failed:', error.message);
      }
    }
  }

  // Event tracking avec debounce
  static async trackEvent(eventName, properties = {}) {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      const eventData = {
        session_id: this.sessionId,
        user_id: this.userId,
        event_name: eventName,
        properties: properties, // Utiliser 'properties' au lieu de 'event_data'
        timestamp: new Date().toISOString(),
        page_path: window.location.pathname
      };

      // Tentative d'insertion avec gestion d'erreur silencieuse
      const { error } = await supabase
        .from('analytics_events')
        .insert([eventData]);

      if (error && error.code !== 'PGRST301') { // Ignorer les erreurs RLS
        if (import.meta.env.DEV) {
          console.warn(`📊 Event '${eventName}' tracking skipped (unauthorized)`);
        }
      } else if (import.meta.env.DEV) {
        console.log(`🎯 Événement tracké: ${eventName}`, properties);
      }

    } catch (error) {
      // Gestion silencieuse des erreurs analytics
      if (import.meta.env.DEV) {
        console.warn(`🎯 Event '${eventName}' tracking failed:`, error.message);
      }
    }
  }

  // Signup tracking
  static async trackSignup(email, role, signupMethod = 'email_password', metadata = {}) {
    // Pas de debounce pour les événements critiques
    this.queueEvent('analytics_signups', {
      email,
      role,
      signup_method: signupMethod,
      metadata: this.sanitizeProperties(metadata)
    });

    // Forcer le traitement immédiat pour les événements importants
    setTimeout(() => this.processBatch(), 100);
  }

  // Login tracking
  static async trackLogin(email, success, loginMethod = 'email_password', failureReason = null) {
    this.queueEvent('analytics_logins', {
      email,
      success,
      login_method: loginMethod,
      failure_reason: failureReason
    });

    // Forcer le traitement immédiat
    setTimeout(() => this.processBatch(), 100);
  }

  // Conversion tracking
  static async trackConversion(conversionType, value = null, metadata = {}) {
    this.queueEvent('analytics_conversions', {
      conversion_type: conversionType,
      value,
      metadata: this.sanitizeProperties(metadata)
    });

    // Forcer le traitement immédiat
    setTimeout(() => this.processBatch(), 100);
  }

  // Utilitaires
  static getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  static getUtmSource() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('utm_source') || 'direct';
  }

  static getUtmMedium() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('utm_medium') || null;
  }

  static getUtmCampaign() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('utm_campaign') || null;
  }

  static calculateVisitDuration() {
    const sessionStart = localStorage.getItem('session_start');
    if (!sessionStart) return null;
    return Math.round((Date.now() - parseInt(sessionStart)) / 1000);
  }

  static getScrollDepth() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    return documentHeight > 0 ? Math.round((scrollTop / documentHeight) * 100) : 0;
  }

  static sanitizeProperties(properties) {
    // Limiter la taille des propriétés et nettoyer
    const sanitized = {};
    for (const [key, value] of Object.entries(properties)) {
      if (typeof value === 'string' && value.length > 500) {
        sanitized[key] = value.substring(0, 500) + '...';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = JSON.stringify(value).substring(0, 1000);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  // Nettoyage à la fermeture de la page
  static async cleanup() {
    // Traiter tous les événements restants
    while (this.eventQueue.length > 0) {
      await this.processBatch();
    }

    // Tracker la fin de session
    this.queueEvent('analytics_sessions', {
      session_end: new Date().toISOString(),
      session_duration: this.calculateVisitDuration()
    });

    await this.processBatch();
  }
}

// Auto-initialisation
if (typeof window !== 'undefined') {
  OptimizedAnalytics.init();

  // Cleanup à la fermeture
  window.addEventListener('beforeunload', () => {
    OptimizedAnalytics.cleanup();
  });
}

export default OptimizedAnalytics;
