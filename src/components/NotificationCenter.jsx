import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Récupérer l'utilisateur actuel
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        setCurrentUser(userData);
      }
    };
    getUser();
  }, []);

  // Charger les notifications
  useEffect(() => {
    if (!currentUser) return;

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        setNotifications(data || []);
        
        // Compter les non lues - compatible avec différents noms de colonnes
        const unreadCount = data?.filter(n => {
          // Essayer différents noms de colonnes
          return !(n.lus || n.is_read || n.read || n.read_at);
        }).length || 0;
        
        setUnreadCount(unreadCount);
      } catch (error) {
        console.error('Erreur chargement notifications:', error);
      }
    };

    fetchNotifications();

    // Écouter les nouvelles notifications en temps réel
    const channel = supabase
      .channel(`notifications-${currentUser.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUser.id}`
        },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev.slice(0, 19)]);
          setUnreadCount(prev => prev + 1);
          
          // Notification browser (si autorisé)
          if (Notification.permission === 'granted') {
            new Notification(payload.new.title, {
              body: payload.new.message,
              icon: '/favicon.ico'
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  // Demander permission pour notifications browser
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Marquer comme lu
  const markAsRead = async (notificationId) => {
    try {
      await supabase
        .from('notifications')
        .update({ lus: true })
        .eq('id', notificationId);

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? { ...n, lus: true }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur marquage lu:', error);
    }
  };

  // Marquer toutes comme lues
  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(n => !n.lus)
        .map(n => n.id);

      if (unreadIds.length === 0) return;

      await supabase
        .from('notifications')
        .update({ lus: true })
        .in('id', unreadIds);

      setNotifications(prev =>
        prev.map(n => ({ ...n, lus: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur marquage toutes lues:', error);
    }
  };

  // Formater la date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  // Icône selon le type
  const getTypeIcon = (type) => {
    switch (type) {
      case 'message': return '💬';
      case 'devis': return '💰';
      case 'etape': return '📋';
      case 'projet': return '🏗️';
      default: return '🔔';
    }
  };

  return (
    <div className="relative">
      {/* Bouton notifications */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-blue-700 rounded-md transition-colors"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown notifications */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">
              🔔 Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                  {unreadCount} non lues
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-teal-600 hover:text-teal-800"
              >
                Tout marquer lu
              </button>
            )}
          </div>

          {/* Liste notifications */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>🔕 Aucune notification</p>
                <p className="text-sm">Vous êtes à jour !</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !(notification.lus || notification.is_read || notification.read || notification.read_at) ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => !(notification.lus || notification.is_read || notification.read || notification.read_at) && markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-medium ${!(notification.lus || notification.is_read || notification.read || notification.read_at) ? 'text-blue-900' : 'text-gray-900'}`}>
                          {notification.title}
                        </h4>
                        {!(notification.lus || notification.is_read || notification.read || notification.read_at) && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overlay pour fermer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
