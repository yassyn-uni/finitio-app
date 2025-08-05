// 🔔 Système de notifications utilisateur
class NotificationSystem {
  static notifications = [];
  static listeners = [];

  static show(message, type = 'info', duration = 5000) {
    const notification = {
      id: Date.now() + Math.random(),
      message,
      type, // success, error, warning, info
      timestamp: new Date(),
      duration
    };

    this.notifications.push(notification);
    this.notifyListeners();

    // Auto-remove après la durée spécifiée
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, duration);
    }

    return notification.id;
  }

  static success(message, duration = 4000) {
    return this.show(message, 'success', duration);
  }

  static error(message, duration = 6000) {
    return this.show(message, 'error', duration);
  }

  static warning(message, duration = 5000) {
    return this.show(message, 'warning', duration);
  }

  static info(message, duration = 4000) {
    return this.show(message, 'info', duration);
  }

  static remove(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  static clear() {
    this.notifications = [];
    this.notifyListeners();
  }

  static subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  static notifyListeners() {
    this.listeners.forEach(callback => callback(this.notifications));
  }

  static getAll() {
    return this.notifications;
  }
}

export default NotificationSystem;
