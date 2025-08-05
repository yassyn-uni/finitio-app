import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useParams } from 'react-router-dom';

export default function MessagerieProjet() {
  const { id: projetId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Scroll automatique vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  // Initialiser ou récupérer la conversation
  useEffect(() => {
    const initConversation = async () => {
      if (!currentUser || !projetId) return;

      try {
        setIsLoading(true);
        
        // Chercher conversation existante pour ce projet
        let { data: existingConv } = await supabase
          .from('conversations')
          .select('*')
          .eq('projet_id', projetId)
          .eq('type', 'projet')
          .single();

        if (!existingConv) {
          // Créer nouvelle conversation
          const { data: newConv, error } = await supabase
            .from('conversations')
            .insert({
              projet_id: projetId,
              nom: `Discussion Projet`,
              type: 'projet'
            })
            .select()
            .single();

          if (error) throw error;
          existingConv = newConv;

          // Ajouter l'utilisateur actuel comme participant
          await supabase
            .from('conversation_participants')
            .insert({
              conversation_id: existingConv.id,
              user_id: currentUser.id,
              role: 'admin'
            });
        }

        setConversation(existingConv);
        await loadMessages(existingConv.id);
        
      } catch (error) {
        console.error('Erreur init conversation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initConversation();
  }, [currentUser, projetId]);

  // Charger les messages
  const loadMessages = async (conversationId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users(nom, email, role)
        `)
        .eq('conversation_id', conversationId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    }
  };

  // Envoyer un message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation || !currentUser) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: currentUser.id,
          content: newMessage.trim(),
          type: 'text'
        })
        .select(`
          *,
          sender:users(nom, email, role)
        `)
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      setNewMessage('');

      // Créer notification pour les autres participants
      await createNotification(data);

    } catch (error) {
      console.error('Erreur envoi message:', error);
    }
  };

  // Créer notification
  const createNotification = async (message) => {
    try {
      // Récupérer tous les participants sauf l'expéditeur
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conversation.id)
        .neq('user_id', currentUser.id);

      if (participants?.length > 0) {
        const notifications = participants.map(p => ({
          user_id: p.user_id,
          type: 'message',
          title: 'Nouveau message',
          message: `${currentUser.nom}: ${message.content.substring(0, 50)}...`,
          data: {
            conversation_id: conversation.id,
            message_id: message.id,
            projet_id: projetId
          }
        }));

        await supabase
          .from('notifications')
          .insert(notifications);
      }
    } catch (error) {
      console.error('Erreur création notification:', error);
    }
  };

  // Écouter les nouveaux messages en temps réel
  useEffect(() => {
    if (!conversation) return;

    const channel = supabase
      .channel(`messages-${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversation.id}`
        },
        async (payload) => {
          // Récupérer les détails du message avec l'expéditeur
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              sender:users(nom, email, role)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data && data.sender_id !== currentUser?.id) {
            setMessages(prev => [...prev, data]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation, currentUser]);

  // Formater l'heure
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        <span className="ml-2 text-gray-600">Chargement de la messagerie...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md h-96 flex flex-col">
      {/* Header */}
      <div className="bg-teal-500 text-white p-4 rounded-t-lg">
        <h3 className="font-semibold flex items-center">
          💬 Discussion du projet
          <span className="ml-2 bg-teal-600 px-2 py-1 rounded-full text-xs">
            {messages.length} messages
          </span>
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>💬 Aucun message pour le moment</p>
            <p className="text-sm">Commencez la discussion !</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender_id === currentUser?.id
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.sender_id !== currentUser?.id && (
                  <div className="text-xs font-semibold mb-1 opacity-75">
                    {message.sender?.nom}
                    <span className="ml-1 bg-gray-200 text-gray-600 px-1 rounded text-xs">
                      {message.sender?.role}
                    </span>
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
                <div className="text-xs opacity-75 mt-1">
                  {formatTime(message.created_at)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tapez votre message..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            📤
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {newMessage.length}/500 caractères
        </div>
      </form>
    </div>
  );
}
