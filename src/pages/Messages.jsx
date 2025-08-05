import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      // Récupérer les conversations où l'utilisateur participe
      const { data, error } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          conversations (
            id,
            nom,
            type,
            last_message_at,
            updated_at,
            projet_id,
            projets (
              titre,
              description
            )
          )
        `)
        .eq('user_id', currentUser.id);

      if (error) {
        console.error('Erreur récupération conversations:', error);
        return;
      }

      // Récupérer le dernier message de chaque conversation
      const conversationsWithMessages = await Promise.all(
        data.map(async (item) => {
          const conversation = item.conversations;
          
          // Récupérer le dernier message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select(`
              content,
              created_at,
              sender_id,
              users!messages_sender_id_fkey (nom)
            `)
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: false })
            .limit(1);

          // Compter les messages non lus
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conversation.id)
            .eq('lus', false)
            .neq('sender_id', currentUser.id);

          return {
            ...conversation,
            lastMessage: lastMessage?.[0] || null,
            unreadCount: unreadCount || 0
          };
        })
      );

      // Trier par dernière activité
      conversationsWithMessages.sort((a, b) => 
        new Date(b.last_message_at) - new Date(a.last_message_at)
      );

      setConversations(conversationsWithMessages);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'À l\'instant';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="container-responsive section-padding">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Chargement des conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive section-padding">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-[#03045E]">💬 Mes Messages</h1>
          <p className="text-gray-600 mt-1">
            Toutes vos conversations de projets
          </p>
        </div>

        {/* Liste des conversations */}
        <div className="divide-y divide-gray-200">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune conversation
              </h3>
              <p className="text-gray-500 mb-4">
                Vos conversations de projets apparaîtront ici
              </p>
              <Link
                to="/projets"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                📋 Voir mes projets
              </Link>
            </div>
          ) : (
            conversations.map((conversation) => (
              <Link
                key={conversation.id}
                to={`/projets/${conversation.projet_id}`}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                        {conversation.projets?.titre?.charAt(0) || 'P'}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900 truncate">
                            {conversation.projets?.titre || conversation.nom}
                          </h3>
                          {conversation.unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage ? (
                            <>
                              <span className="font-medium">
                                {conversation.lastMessage.users?.nom || 'Utilisateur'}:
                              </span>
                              {' '}
                              {conversation.lastMessage.content}
                            </>
                          ) : (
                            'Aucun message encore'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <p className="text-xs text-gray-400">
                      {formatTime(conversation.last_message_at)}
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      {conversation.type === 'projet' ? '📋 Projet' : '💬 Direct'}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
