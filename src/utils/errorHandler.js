// 🔧 Utilitaire de gestion d'erreurs centralisé
class ErrorHandler {
  static isDevelopment = import.meta.env.DEV;

  static log(error, context = '') {
    if (this.isDevelopment) {
      console.error(`❌ [${context}]:`, error);
    }
    
    // En production, envoyer à un service de monitoring
    if (!this.isDevelopment) {
      this.sendToMonitoring(error, context);
    }
  }

  static sendToMonitoring(error, context) {
    // Intégration future avec Sentry, LogRocket, etc.
    // Pour l'instant, on stocke localement
    const errorLog = {
      error: error.message,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
    
    // Stocker dans localStorage pour debug
    const logs = JSON.parse(localStorage.getItem('error_logs') || '[]');
    logs.push(errorLog);
    localStorage.setItem('error_logs', JSON.stringify(logs.slice(-50))); // Garder 50 dernières erreurs
  }

  static showUserError(message) {
    // Utiliser le système de notifications moderne
    import('../utils/notifications').then(({ default: NotificationSystem }) => {
      NotificationSystem.error(message);
    });
  }

  static showUserSuccess(message) {
    import('../utils/notifications').then(({ default: NotificationSystem }) => {
      NotificationSystem.success(message);
    });
  }

  static showUserWarning(message) {
    import('../utils/notifications').then(({ default: NotificationSystem }) => {
      NotificationSystem.warning(message);
    });
  }

  static showUserInfo(message) {
    import('../utils/notifications').then(({ default: NotificationSystem }) => {
      NotificationSystem.info(message);
    });
  }
}

export default ErrorHandler;
