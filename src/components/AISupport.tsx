import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Phone, User, Clock, Bot, UserCheck, RefreshCw } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface Message {
  id: number;
  sender: 'client' | 'ai' | 'lawyer';
  message: string;
  timestamp: string;
  date: string;
}

interface ChatMessage {
  id: number;
  session_id: string;
  nome_usuario?: string;
  message: {
    type: 'human' | 'ai';
    content: string;
    additional_kwargs?: any;
    response_metadata?: any;
  };
  created_at?: string;
}

interface Conversation {
  id: string;
  clientName: string;
  clientPhone: string;
  status: 'online' | 'away' | 'offline';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export default function AISupport() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAIActive, setIsAIActive] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const realtimeChannelRef = useRef<any>(null);
  // Controle de polling e último ID visto para evitar duplicações
  const lastMessageIdRef = useRef<number>(0);
  const pollingIntervalRef = useRef<any>(null);
  // IDs de mensagens já processadas (evita duplicação entre realtime e polling)
  const processedMessageIdsRef = useRef<Set<number>>(new Set());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Função para limpar partes específicas das mensagens
  const cleanMessageContent = (messages: Message[]) => {
    const isSystemNoise = (text: string) => /^workflow(\swas)?\sstarted$/i.test(text.trim());
    return messages
      .filter(message => !isSystemNoise(message.message || ''))
      .map(message => ({
        ...message,
        message: message.message
          .replace(/TIPO_CLIENTE=EXISTENTE/gi, '')
          .replace(/TIPO_CLIENTE=NOVO/gi, '')
          .replace(/\s+/g, ' ')
          .trim()
      }));
  };

  useEffect(() => {
    if (selectedConversation) {
      scrollToBottom();
    }
  }, [selectedConversation?.messages, isTyping]);

  // Função para buscar mensagens do Supabase
  const fetchChatMessages = async () => {
    try {
      setLoading(true);
      console.log('🔍 Buscando mensagens do Supabase...');
      const { data: chatData, error } = await supabase
        .from('chat')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('❌ Erro ao buscar mensagens:', error);
        return [];
      }

      console.log('📊 Dados brutos do Supabase:', chatData);
      console.log('📈 Total de mensagens encontradas:', chatData?.length || 0);

      if (!chatData || chatData.length === 0) {
        console.log('⚠️ Nenhum dado encontrado no Supabase');
        setConversations([]);
        return [];
      }

      // Agrupar mensagens por session_id
      const conversationsMap = new Map<string, Conversation>();

      chatData.forEach((chatMessage: ChatMessage) => {
        console.log('🔄 Processando mensagem:', chatMessage);
        const sessionId = chatMessage.session_id;
        const phoneNumber = sessionId.replace('@s.whatsapp.net', '');
        
        if (!conversationsMap.has(sessionId)) {
          conversationsMap.set(sessionId, {
            id: sessionId,
            clientName: chatMessage.nome_usuario || `Cliente ${phoneNumber.slice(-4)}`,
            clientPhone: phoneNumber,
            status: 'online',
            lastMessage: '',
            lastMessageTime: '',
            unreadCount: 0,
            messages: []
          });
        }

        const conversation = conversationsMap.get(sessionId)!;
        // Se houver nome_usuario nesta mensagem, atualiza o nome da conversa
        if (chatMessage.nome_usuario && chatMessage.nome_usuario.trim().length > 0) {
          conversation.clientName = chatMessage.nome_usuario;
        }
        const senderType: 'client' | 'ai' | 'lawyer' =
          chatMessage.message.type === 'ai'
            ? 'ai'
            : chatMessage.message.additional_kwargs?.sender === 'lawyer'
              ? 'lawyer'
              : 'client';
        const message: Message = {
          id: chatMessage.id,
          sender: senderType,
          message: chatMessage.message.content,
          timestamp: chatMessage.created_at 
            ? new Date(chatMessage.created_at).toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })
            : new Date().toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
          date: chatMessage.created_at 
            ? new Date(chatMessage.created_at).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
        };

        conversation.messages.push(message);
        conversation.lastMessage = message.message;
        conversation.lastMessageTime = message.timestamp;
      });

      const conversationsList = Array.from(conversationsMap.values());
      console.log('💬 Conversações processadas:', conversationsList);
      console.log('📱 Total de conversações:', conversationsList.length);
      
      setConversations(conversationsList);
      
      if (conversationsList.length > 0 && !selectedConversation) {
        console.log('🎯 Selecionando primeira conversa:', conversationsList[0]);
        setSelectedConversation(conversationsList[0]);
      }
      
      return conversationsList;
    } catch (error) {
      console.error('❌ Erro ao carregar conversas:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const refreshAndSelectLatest = async () => {
    console.log('🔄 Atualizando mensagens após envio...');
    try {
      const updatedConversations = await fetchChatMessages();
      
      // Seleciona automaticamente a conversa mais recente após atualizar
      if (updatedConversations && updatedConversations.length > 0) {
        console.log('🎯 Selecionando conversa mais recente:', updatedConversations[0]);
        setSelectedConversation(updatedConversations[0]);
      }
      
      console.log('✅ Mensagens atualizadas com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao atualizar mensagens:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    console.log('🔄 Atualizando mensagens...');
    try {
      await refreshAndSelectLatest();
    } catch (error) {
      console.error('❌ Erro ao atualizar mensagens:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Função para chamar o webhook quando a IA for desativada
  const handleAIToggle = async () => {
    const newAIStatus = !isAIActive;
    
    // Se a IA está sendo desativada e há uma conversa selecionada
    if (!newAIStatus && selectedConversation) {
      try {
        console.log('🔄 Enviando webhook para pausar IA...');
        const webhookResponse = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook-test/advoga-msg-pausar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: selectedConversation.id,
            whatsapp_number: selectedConversation.id,
            ai_status: 'desativada',
            client_name: selectedConversation.clientName,
            client_phone: selectedConversation.clientPhone,
            timestamp: new Date().toISOString()
          })
        });

        if (webhookResponse.ok) {
          console.log('✅ Webhook enviado com sucesso');
        } else {
          console.error('❌ Erro na resposta do webhook:', webhookResponse.status);
        }
      } catch (error) {
        console.error('❌ Erro ao enviar webhook:', error);
      }
    }
    
    // Atualizar o estado da IA
    setIsAIActive(newAIStatus);
  };

  useEffect(() => {
    console.log('🚀 Componente montado, carregando mensagens...');
    fetchChatMessages();
  }, []);

  useEffect(() => {
    // Assina inserts na tabela chat para atualizar em tempo real
    const channel = supabase
      .channel('realtime-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat' }, (payload) => {
        const chatMessage: any = payload.new;
        if (!chatMessage) return;

        const sessionId: string = chatMessage.session_id;
        const createdAt: string = chatMessage.created_at || new Date().toISOString();

        const senderType: 'client' | 'ai' | 'lawyer' =
          chatMessage?.message?.type === 'ai'
            ? 'ai'
            : chatMessage?.message?.additional_kwargs?.sender === 'lawyer'
              ? 'lawyer'
              : 'client';

        const msg: Message = {
          id: chatMessage.id,
          sender: senderType,
          message: chatMessage?.message?.content ?? '',
          timestamp: new Date(createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          date: new Date(createdAt).toISOString().split('T')[0],
        };

        // Evita duplicar se já processado por polling ou outro evento
        if (processedMessageIdsRef.current.has(msg.id)) {
          lastMessageIdRef.current = Math.max(lastMessageIdRef.current, msg.id);
          return;
        }

        // Atualiza lista de conversas (com anti-duplicação por id e substituição da temporária)
        setConversations((prev) => {
          const idx = prev.findIndex((c) => c.id === sessionId);
          if (idx === -1) {
            const phoneNumber = (sessionId || '').replace('@s.whatsapp.net', '');
            const newConv: Conversation = {
              id: sessionId,
              clientName: chatMessage?.nome_usuario || `Cliente ${phoneNumber.slice(-4)}`,
              clientPhone: phoneNumber,
              status: 'online',
              lastMessage: msg.message,
              lastMessageTime: msg.timestamp,
              unreadCount: 0,
              messages: [msg],
            };
            return [newConv, ...prev];
          }

          const updated = [...prev];
          const conv = updated[idx];
          // Se já existe mensagem com o mesmo id, não adiciona novamente
          const alreadyExists = conv.messages.some((m) => m.id === msg.id);
          if (alreadyExists) {
            // Ainda assim atualiza clientName se houver nome válido
            updated[idx] = {
              ...conv,
              clientName: chatMessage?.nome_usuario && chatMessage?.nome_usuario.trim().length > 0 ? chatMessage.nome_usuario : conv.clientName,
              lastMessage: msg.message,
              lastMessageTime: msg.timestamp,
            };
            return updated;
          }
          // Remove qualquer placeholder temporário com o mesmo conteúdo/remetente antes de adicionar a oficial
          const withoutTempDup = conv.messages.filter((m) => !(typeof m.id === 'number' && m.id > 1e11 && m.sender === msg.sender && m.message === msg.message));
          const existingLast = conv.messages[conv.messages.length - 1];
          const isTempDuplicate = existingLast && existingLast.sender === msg.sender && existingLast.message === msg.message && typeof existingLast.id === 'number' && existingLast.id > 1e11; // Date.now()
          const newMessages = isTempDuplicate
            ? [...conv.messages.slice(0, -1), msg]
            : [...withoutTempDup, msg];

          updated[idx] = {
            ...conv,
            // Atualiza clientName se vier nome_usuario válido
            clientName: chatMessage?.nome_usuario && chatMessage?.nome_usuario.trim().length > 0 ? chatMessage.nome_usuario : conv.clientName,
            messages: newMessages,
            lastMessage: msg.message,
            lastMessageTime: msg.timestamp,
          };
          return updated;
        });

        // Atualiza conversa selecionada se o evento for da mesma sessão (com anti-duplicação por id)
        setSelectedConversation((prev) => {
          if (!prev || prev.id !== sessionId) return prev;
          // Não adiciona se já existir uma mensagem com o mesmo id
          const idExists = prev.messages.some((m) => m.id === msg.id);
          if (idExists) {
            return {
              ...prev,
              clientName: chatMessage?.nome_usuario && chatMessage?.nome_usuario.trim().length > 0 ? chatMessage.nome_usuario : prev.clientName,
              lastMessage: msg.message,
              lastMessageTime: msg.timestamp,
            };
          }
          // Remove placeholder temporário correspondente na conversa selecionada
          const withoutTempDup = prev.messages.filter((m) => !(typeof m.id === 'number' && m.id > 1e11 && m.sender === msg.sender && m.message === msg.message));
          const existingLast = prev.messages[prev.messages.length - 1];
          const isTempDuplicate = existingLast && existingLast.sender === msg.sender && existingLast.message === msg.message && typeof existingLast.id === 'number' && existingLast.id > 1e11;
          const newMessages = isTempDuplicate
            ? [...prev.messages.slice(0, -1), msg]
            : [...withoutTempDup, msg];

          return {
            ...prev,
            clientName: chatMessage?.nome_usuario && chatMessage?.nome_usuario.trim().length > 0 ? chatMessage.nome_usuario : prev.clientName,
            messages: newMessages,
            lastMessage: msg.message,
            lastMessageTime: msg.timestamp,
          };
        });

        // Marca este id como processado e atualiza último ID visto
        processedMessageIdsRef.current.add(msg.id);
        lastMessageIdRef.current = Math.max(lastMessageIdRef.current, msg.id);
      })
      .subscribe();

    realtimeChannelRef.current = channel;

    return () => {
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
        realtimeChannelRef.current = null;
      }
    };
  }, []);

  // Polling de novos registros na tabela chat a cada 1s
  useEffect(() => {
    let isMounted = true;

    const initLastId = async () => {
      try {
        const { data, error } = await supabase
          .from('chat')
          .select('id')
          .order('id', { ascending: false })
          .limit(1);
        if (!error && data && data[0]?.id) {
          lastMessageIdRef.current = data[0].id as number;
        }
      } catch (e) {
        console.warn('Polling: falha ao inicializar último ID', e);
      }
    };

    initLastId();

    pollingIntervalRef.current = setInterval(async () => {
      if (!isMounted) return;
      try {
        const { data: newRows, error } = await supabase
          .from('chat')
          .select('*')
          .gt('id', lastMessageIdRef.current)
          .order('id', { ascending: true });

        if (error) {
          console.warn('Polling: erro ao consultar novos registros', error);
          return;
        }

        if (!newRows || newRows.length === 0) return;

        newRows.forEach((chatMessage: any) => {
          const sessionId: string = chatMessage.session_id;
          const createdAt: string = chatMessage.created_at || new Date().toISOString();

          const senderType: 'client' | 'ai' | 'lawyer' =
            chatMessage?.message?.type === 'ai'
              ? 'ai'
              : chatMessage?.message?.additional_kwargs?.sender === 'lawyer'
                ? 'lawyer'
                : 'client';

          const msg: Message = {
            id: chatMessage.id,
            sender: senderType,
            message: chatMessage?.message?.content ?? '',
            timestamp: new Date(createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            date: new Date(createdAt).toISOString().split('T')[0],
          };

          // Evita duplicação se o realtime já processou esta mensagem
          if (processedMessageIdsRef.current.has(msg.id)) {
            lastMessageIdRef.current = Math.max(lastMessageIdRef.current, msg.id);
            return;
          }

          // Atualiza lista de conversas com anti-duplicação por ID
          setConversations((prev) => {
            const idx = prev.findIndex((c) => c.id === sessionId);
            if (idx === -1) {
              const phoneNumber = (sessionId || '').replace('@s.whatsapp.net', '');
              const newConv: Conversation = {
                id: sessionId,
                clientName: chatMessage?.nome_usuario || `Cliente ${phoneNumber.slice(-4)}`,
                clientPhone: phoneNumber,
                status: 'online',
                lastMessage: msg.message,
                lastMessageTime: msg.timestamp,
                unreadCount: 0,
                messages: [msg],
              };
              return [newConv, ...prev];
            }

            const updated = [...prev];
            const conv = updated[idx];
            const alreadyExists = conv.messages.some((m) => m.id === msg.id);
            // Remove placeholder temporário com mesmo conteúdo/remetente antes de adicionar
            const withoutTempDup = conv.messages.filter((m) => !(typeof m.id === 'number' && m.id > 1e11 && m.sender === msg.sender && m.message === msg.message));
            const newMessages = alreadyExists ? conv.messages : [...withoutTempDup, msg];

            updated[idx] = {
              ...conv,
              // Se houver nome_usuario válido, atualiza o nome exibido da conversa
              clientName: chatMessage?.nome_usuario && chatMessage?.nome_usuario.trim().length > 0 ? chatMessage.nome_usuario : conv.clientName,
              messages: newMessages,
              lastMessage: msg.message,
              lastMessageTime: msg.timestamp,
            };
            return updated;
          });

          // Atualiza conversa selecionada se for a mesma sessão
          setSelectedConversation((prev) => {
            if (!prev || prev.id !== sessionId) return prev;
            const alreadyExists = prev.messages.some((m) => m.id === msg.id);
            const withoutTempDup = prev.messages.filter((m) => !(typeof m.id === 'number' && m.id > 1e11 && m.sender === msg.sender && m.message === msg.message));
            const newMessages = alreadyExists ? prev.messages : [...withoutTempDup, msg];
            return {
              ...prev,
              // Atualiza clientName na conversa selecionada, se disponível
              clientName: chatMessage?.nome_usuario && chatMessage?.nome_usuario.trim().length > 0 ? chatMessage.nome_usuario : prev.clientName,
              messages: newMessages,
              lastMessage: msg.message,
              lastMessageTime: msg.timestamp,
            };
          });

          // Marca este id como processado
          processedMessageIdsRef.current.add(msg.id);
        });

        lastMessageIdRef.current = Math.max(lastMessageIdRef.current, newRows[newRows.length - 1].id as number);
      } catch (e) {
        console.warn('Polling: exceção ao consultar novos registros', e);
      }
    }, 1000);

    return () => {
      isMounted = false;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, []);

  // Persistir status da IA por conversa
  useEffect(() => {
    if (selectedConversation?.id) {
      const saved = localStorage.getItem(`aiStatus:${selectedConversation.id}`);
      if (saved) {
        setIsAIActive(saved === 'on');
      }
    }
  }, [selectedConversation?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getAIResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('status') || lowerMessage.includes('processo')) {
      return 'Vou verificar o status do seu processo. Por favor, aguarde um momento enquanto consulto as informações mais recentes.';
    } else if (lowerMessage.includes('agendar') || lowerMessage.includes('reunião') || lowerMessage.includes('consulta')) {
      return 'Posso ajudá-lo a agendar uma consulta. Vou transferir você para um de nossos advogados que poderá verificar a agenda disponível.';
    } else if (lowerMessage.includes('valor') || lowerMessage.includes('honorário') || lowerMessage.includes('preço') || lowerMessage.includes('custo')) {
      return 'Para informações sobre honorários e custos, vou conectá-lo com um de nossos advogados que poderá fornecer um orçamento personalizado.';
    } else {
      return 'Olá! Sou a assistente virtual do escritório. Como posso ajudá-lo hoje? Posso fornecer informações sobre processos, agendar consultas ou conectá-lo com um advogado.';
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const messageText = newMessage;
    setIsTyping(true);

    try {
      // Salvar mensagem do cliente no Supabase
      const { error: clientError } = await supabase
        .from('chat')
        .insert({
          session_id: selectedConversation.id,
          message: {
            type: 'human',
            content: messageText,
            additional_kwargs: { sender: 'lawyer' },
            response_metadata: {}
          },
          created_at: new Date().toISOString()
        });

      if (clientError) {
        console.error('Erro ao salvar mensagem do advogado:', clientError);
        setIsTyping(false);
        return;
      }

      // Limpar o campo apenas após sucesso do salvamento
      setNewMessage('');

      // Atualizar estado local para manter a mensagem do advogado visível
      const tempLawyerMessage: Message = {
        id: Date.now(),
        sender: 'lawyer',
        message: messageText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0]
      };
      setConversations((prev) => prev.map((conv) => (
        conv.id === selectedConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, tempLawyerMessage],
              lastMessage: tempLawyerMessage.message,
              lastMessageTime: tempLawyerMessage.timestamp
            }
          : conv
      )));
      setSelectedConversation((prev) => prev ? {
        ...prev,
        messages: [...prev.messages, tempLawyerMessage],
        lastMessage: tempLawyerMessage.message,
        lastMessageTime: tempLawyerMessage.timestamp
      } : prev);

      // Dispara webhook informando mensagem enviada pelo advogado
      try {
        const advWebhookUrl = 'https://n8n-n8n.04qisd.easypanel.host/webhook/advoga-msg-adv';
        const payload = {
          message: messageText,
          whatsapp_number: selectedConversation.id,
          session_id: selectedConversation.id,
          client_name: selectedConversation.clientName,
          client_phone: selectedConversation.clientPhone,
          timestamp: new Date().toISOString()
        };

        const resp = await fetch(advWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!resp.ok) {
          const respText = await resp.text();
          console.error('Falha ao chamar webhook advoga-msg-adv:', resp.status, respText);
        } else {
          console.log('✅ Webhook advoga-msg-adv enviado com sucesso');
        }
      } catch (err) {
        console.error('Erro ao chamar webhook advoga-msg-adv:', err);
      }

      // Desativar IA automaticamente ao advogado enviar mensagem
      try {
        setIsAIActive(false);
        localStorage.setItem(`aiStatus:${selectedConversation.id}`, 'off');
        await notifyAIStatusChange(false, selectedConversation.id);
      } catch (err) {
        console.warn('Aviso: falha ao notificar/persistir desativação da IA', err);
      }

      // Não gerar resposta automática da IA após mensagem do advogado
      setIsTyping(false);
      return;

      // Verificar se a IA está ativa antes de processar resposta
      if (!isAIActive) {
        setIsTyping(false);
        return;
      }

      // Enviar mensagem para o webhook do n8n
      try {
        const webhookResponse = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/advoga-mensagem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: messageText,
            session_id: selectedConversation.id,
            client_name: selectedConversation.clientName,
            client_phone: selectedConversation.clientPhone,
            timestamp: new Date().toISOString()
          })
        });

        let aiResponse = '';
        
        if (webhookResponse.ok) {
          const webhookData = await webhookResponse.json();
          // Assumindo que o webhook retorna a resposta da IA no campo 'response' ou 'message'
          aiResponse = webhookData.response || webhookData.message || webhookData.reply || '';
        } else {
          console.error('Erro na resposta do webhook:', webhookResponse.status);
          // Fallback para resposta local se o webhook falhar
          aiResponse = getAIResponse(messageText);
        }

        // Salvar resposta da IA no Supabase (evitar mensagens de sistema)
        const aiText = (aiResponse || '').trim();
        const skipAI = /^workflow(\swas)?\sstarted$/i.test(aiText) || aiText.length === 0;
        if (!skipAI) {
          const { error: aiError } = await supabase
            .from('chat')
            .insert({
              session_id: selectedConversation.id,
              message: {
                type: 'ai',
                content: aiText,
                additional_kwargs: {},
                response_metadata: {}
              },
              created_at: new Date().toISOString()
            });

          if (aiError) {
            console.error('Erro ao salvar resposta da IA:', aiError);
          }
        } else {
          console.log('IA: resposta de sistema ignorada:', aiText);
        }

      } catch (webhookError) {
        console.error('Erro ao conectar com webhook:', webhookError);
        // Fallback para resposta local se o webhook falhar
        const aiResponse = getAIResponse(messageText);
        const aiText = (aiResponse || '').trim();
        const skipAI = /^workflow(\swas)?\sstarted$/i.test(aiText) || aiText.length === 0;
        if (!skipAI) {
          const { error: aiError } = await supabase
            .from('chat')
            .insert({
              session_id: selectedConversation.id,
              message: {
                type: 'ai',
                content: aiText,
                additional_kwargs: {},
                response_metadata: {}
              },
              created_at: new Date().toISOString()
            });

          if (aiError) {
            console.error('Erro ao salvar resposta da IA:', aiError);
          }
        } else {
          console.log('IA: resposta de sistema ignorada (fallback):', aiText);
        }
      }

      setIsTyping(false);
      
      // Recarregar mensagens e selecionar conversa mais recente
      await handleRefresh();
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setIsTyping(false);
      // Restaurar a mensagem no campo em caso de erro
      setNewMessage(messageText);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const transferToLawyer = async () => {
    if (!selectedConversation) return;

    try {
      // Salvar mensagem de transferência no Supabase
      const { error } = await supabase
        .from('chat')
        .insert({
          session_id: selectedConversation.id,
          message: {
            type: 'ai',
            content: 'Transferindo você para um de nossos advogados. Dr. Roberto Almeida entrará em contato em breve.',
            additional_kwargs: {},
            response_metadata: {}
          }
        });

      if (error) {
        console.error('Erro ao salvar mensagem de transferência:', error);
        return;
      }

      // Recarregar mensagens para mostrar a nova
      await fetchChatMessages();
      
    } catch (error) {
      console.error('Erro ao transferir para advogado:', error);
    }
  };

  // Função para notificar mudança de status da IA via webhook
  const notifyAIStatusChange = async (isActive: boolean, sessionId: string) => {
    try {
      console.log(`🤖 Notificando mudança de status da IA: ${isActive ? 'ATIVADA' : 'DESATIVADA'} para sessão ${sessionId}`);
      
      const payload = {
        session_id: sessionId,
        ai_status: isActive ? 'ativa' : 'inativa',
        action: isActive ? 'ativar_ia' : 'desativar_ia',
        timestamp: new Date().toISOString()
      };
      
      console.log('📤 Enviando payload para webhook:', payload);
      
      const response = await fetch('https://n8n-n8n.04qisd.easypanel.host/webhook/advoga-msg-pausar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('📡 Resposta do webhook - Status:', response.status, 'StatusText:', response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Webhook de status da IA enviado com sucesso:', result);
      } else {
        const errorText = await response.text();
        console.error('❌ Erro na resposta do webhook de status da IA:', response.status, response.statusText, errorText);
      }
    } catch (error) {
      console.error('❌ Erro ao enviar webhook de status da IA:', error);
    }
  };

  // Função para alternar status da IA
  const toggleAIStatus = async () => {
    console.log('🔄 toggleAIStatus chamada - selectedConversation:', selectedConversation?.id);
    
    if (!selectedConversation) {
      console.warn('⚠️ Nenhuma conversa selecionada, não é possível alterar status da IA');
      return;
    }
    
    const newStatus = !isAIActive;
    console.log(`🔄 Alterando status da IA de ${isAIActive} para ${newStatus}`);
    setIsAIActive(newStatus);
    localStorage.setItem(`aiStatus:${selectedConversation.id}`, newStatus ? 'on' : 'off');
    
    // Notificar mudança via webhook
    console.log('📞 Chamando notifyAIStatusChange...');
    await notifyAIStatusChange(newStatus, selectedConversation.id);
    console.log('✅ notifyAIStatusChange concluída');
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando conversas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-black dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-white flex items-center">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-black" />
                </div>
                <span className="truncate">Atendimento IA</span>
              </h2>
              <p className="text-gray-300 text-sm mt-1 ml-11 truncate">
                Suporte inteligente 24/7
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg p-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Atualizar mensagens"
              >
                <RefreshCw className={`h-4 w-4 text-white ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <div className="bg-white bg-opacity-10 rounded-lg px-3 py-1">
                <span className="text-white font-semibold text-sm">
                  {conversations.reduce((total, conv) => total + conv.unreadCount, 0)}
                </span>
                <p className="text-gray-300 text-xs">não lidas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-gray-800">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Nenhuma conversa</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">As conversas aparecerão aqui quando iniciadas</p>
            </div>
          ) : (
            conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`mx-3 my-2 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedConversation?.id === conversation.id 
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' 
                  : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between min-w-0">
                <div className="flex items-center flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedConversation?.id === conversation.id 
                        ? 'bg-white bg-opacity-20' 
                        : 'bg-gray-100 dark:bg-gray-600'
                    }`}>
                      <User className={`h-6 w-6 ${
                        selectedConversation?.id === conversation.id 
                          ? 'text-white dark:text-black' 
                          : 'text-gray-600 dark:text-gray-300'
                      }`} />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
                      selectedConversation?.id === conversation.id 
                        ? 'border-black dark:border-white' 
                        : 'border-white dark:border-gray-700'
                    } ${getStatusColor(conversation.status)}`}></div>
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 min-w-0">
                      <h4 className={`font-semibold truncate flex-1 min-w-0 ${
                        selectedConversation?.id === conversation.id 
                          ? 'text-white dark:text-black' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {conversation.clientName}
                      </h4>
                      <span className={`text-xs ml-2 flex-shrink-0 ${
                        selectedConversation?.id === conversation.id 
                          ? 'text-gray-300 dark:text-gray-600' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {conversation.lastMessageTime}
                      </span>
                    </div>
                    <p className={`text-xs mb-2 truncate ${
                      selectedConversation?.id === conversation.id 
                        ? 'text-gray-300 dark:text-gray-600' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {conversation.clientPhone}
                    </p>
                    <p className={`text-sm truncate ${
                      selectedConversation?.id === conversation.id 
                        ? 'text-gray-200 dark:text-gray-700' 
                        : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {conversation.lastMessage || 'Nenhuma mensagem ainda'}
                    </p>
                  </div>
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="ml-2 flex-shrink-0">
                    <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full ${
                      selectedConversation?.id === conversation.id 
                        ? 'bg-white text-black dark:bg-black dark:text-white' 
                        : 'bg-black text-white dark:bg-white dark:text-black'
                    }`}>
                      {conversation.unreadCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {!selectedConversation ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Selecione uma conversa para começar</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between min-w-0">
                <div className="flex items-center min-w-0 flex-1">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center">
                      <User className="h-6 w-6 text-white dark:text-black" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-3 border-white dark:border-gray-800 ${getStatusColor(selectedConversation.status)}`}></div>
                  </div>
                  <div className="ml-4 min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{selectedConversation.clientName}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 min-w-0">
                      <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="font-medium truncate">{selectedConversation.clientPhone}</span>
                      <span className="mx-2 flex-shrink-0">•</span>
                      <span className="capitalize truncate">{selectedConversation.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Última atividade</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{selectedConversation.lastMessageTime}</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200 dark:bg-gray-600"></div>
                  <button
                    onClick={toggleAIStatus}
                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                      isAIActive 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                    }`}
                    title={isAIActive ? 'Clique para desativar a IA' : 'Clique para ativar a IA'}
                  >
                    <Bot className={`h-5 w-5 mr-2 flex-shrink-0 ${isAIActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                    <span className="text-sm font-medium">
                      {isAIActive ? 'IA Ativa' : 'IA Desativada'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
          {cleanMessageContent(selectedConversation.messages).map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${message.sender === 'lawyer' || message.sender === 'ai' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-sm break-words ${
                message.sender === 'client'
                  ? 'bg-black text-white rounded-bl-md'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-br-md'
              }`}>
                {message.sender === 'ai' && (
                  <div className="flex items-center mb-2 min-w-0">
                    <div className="w-5 h-5 bg-black dark:bg-white rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                      <Bot className="h-3 w-3 text-white dark:text-black" />
                    </div>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide truncate">IA AgilizaDireito</span>
                  </div>
                )}
                {message.sender === 'lawyer' && (
                  <div className="flex items-center mb-2 min-w-0">
                    <div className="w-5 h-5 bg-black dark:bg-white rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                      <UserCheck className="h-3 w-3 text-white dark:text-black" />
                    </div>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide truncate">Advogado</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed font-medium break-words overflow-hidden">{message.message}</p>
                <div className={`flex items-center mt-2 min-w-0 ${message.sender === 'lawyer' || message.sender === 'ai' ? 'justify-end' : 'justify-start'}`}>
                  <Clock className="h-3 w-3 mr-1 opacity-60 flex-shrink-0" />
                  <span className="text-xs opacity-60 font-medium truncate">{message.timestamp}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-end mb-4">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white max-w-xs lg:max-w-md px-5 py-3 rounded-2xl rounded-br-md shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-2">
                  <div className="w-5 h-5 bg-black dark:bg-white rounded-full flex items-center justify-center mr-2">
                    <Bot className="h-3 w-3 text-white dark:text-black" />
                  </div>
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">IA AgilizaDireito</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-xs text-gray-600 dark:text-gray-300 ml-2">IA está digitando...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-end space-x-3 min-w-0">
            <div className="flex-1 relative min-w-0">
              <div className="relative bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 focus-within:border-black dark:focus-within:border-white transition-all duration-200">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  rows={1}
                  className="w-full px-5 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-2xl focus:outline-none resize-none text-sm leading-relaxed overflow-hidden"
                />
                <div className="absolute bottom-2 right-3 text-xs text-gray-400 dark:text-gray-500">
                  {newMessage.length > 0 && (
                    <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
                      {newMessage.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || isTyping}
              className="p-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 flex-shrink-0"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 min-w-0">
            <span className="flex items-center min-w-0">
              <Bot className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">IA está pronta para ajudar</span>
            </span>
            <span className="flex-shrink-0">Pressione Enter para enviar</span>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
    );
  }